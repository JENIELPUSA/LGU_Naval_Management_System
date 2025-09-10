const AsyncErrorHandler = require("../Utils/AsyncErrorHandler");
const ProposalModel = require("./../Models/Proposal");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const mongoose = require("mongoose");
const axios = require("axios");
const Notification = require("../Models/NotificationSchema");
const UserLoginSchema = require("../Models/LogInSchema");
const sendEmail = require("./../Utils/email");

exports.createProposal = AsyncErrorHandler(async (req, res) => {
  try {
    const { title, description, remarks, status = "pending" } = req.body;

    let fileData = {};
    if (req.file) {
      console.log("Processing uploaded file...");
      const ext = path.extname(req.file.originalname);
      const baseName = path.basename(req.file.originalname, ext);
      const uniqueFileName = `${Date.now()}_${baseName}${ext}`;
      const folderPath = "Event Proposals";

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: folderPath,
            resource_type: "raw",
            public_id: uniqueFileName.replace(ext, ""),
          },
          (err, res) => (err ? reject(err) : resolve(res))
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      fileData = {
        fileUrl: result.secure_url,
        fileName: req.file.originalname,
        publicId: result.public_id,
        fileType: req.file.mimetype,
      };
    }

    // --- Save proposal to DB ---
    const proposalData = {
      title,
      description,
      remarks,
      submitted_by: req.user.linkId,
      status,
      ...fileData,
    };

    const inserted = await ProposalModel.create(proposalData);

    // --- Prepare Socket.io ---
    const io = req.app.get("io");

    // Hanapin lahat ng admins
    const recipients = await UserLoginSchema.find({ role: "admin" }).lean();

    // I-build yung viewers array gamit ang linkedId
    const viewers = recipients
      .filter((admin) => admin.linkedId)
      .map((admin) => ({
        user: admin.linkedId,
        isRead: false,
      }));

    // Gumawa ng isang notification document na may lahat ng viewers
    const notificationDoc = await Notification.create({
      title: inserted.title,
      message: `New proposal submitted: ${inserted.title}`,
      category: "Proposal",
      priority: "high",
      viewers,
    });

    // Ihanda data para sa socket emit
    const SendMessage = {
      message: notificationDoc.message,
      proposal: inserted,
      notificationId: notificationDoc._id,
    };

    // I-loop lahat ng recipients para mag send ng socket + email
    for (const admin of recipients) {
      if (!admin.linkedId) continue;
      const adminIdStr = admin.linkedId.toString();

      // --- Socket notification kung online
      const targetUser = global.connectedUsers?.[adminIdStr];
      if (targetUser) {
        io.to(targetUser.socketId).emit("NewProposalNotification", SendMessage);
        console.log(
          `📨 Sent socket notification to ONLINE admin (${adminIdStr})`
        );
      } else {
        console.log(`📭 Admin (${adminIdStr}) is OFFLINE — saved in DB only.`);
      }

      // --- Email notification (assuming username is email)
      if (admin.username) {
        await sendEmail({
          email: admin.username,
          subject: "New Event Proposal Submitted",
          text: `Hello Admin,\n\nA new proposal has been submitted: "${
            inserted.title
          }".\n\nRemarks: ${
            inserted.remarks || "N/A"
          }\n\nPlease review it in the system.`,
        });
        console.log(`📧 Email sent to ${admin.username}`);
      }
    }

    res.status(201).json({ status: "success", data: inserted });
  } catch (err) {
    console.error("Unhandled error in createProposal:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

exports.DisplayProposal = AsyncErrorHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const { search, status, dateFrom, dateTo } = req.query;

  const role = req.user.role;
  const userId = req.user.linkId;

  const matchStage = {};

  if (role === "organizer") {
    matchStage.submitted_by = userId;
  }

  if (search) {
    matchStage.title = { $regex: search.trim(), $options: "i" };
  }

  if (status) {
    matchStage.status = status;
  }

  if (dateFrom || dateTo) {
    matchStage.created_at = {};
    if (dateFrom) {
      matchStage.created_at.$gte = new Date(dateFrom);
    }
    if (dateTo) {
      const endOfDay = new Date(dateTo);
      endOfDay.setHours(23, 59, 59, 999);
      matchStage.created_at.$lte = endOfDay;
    }
  }

  const result = await ProposalModel.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: "organizers",
        localField: "submitted_by",
        foreignField: "_id",
        as: "organizerInfo",
      },
    },
    {
      $unwind: {
        path: "$organizerInfo",
        preserveNullAndEmptyArrays: true,
      },
    },
    { $sort: { created_at: -1 } },
    {
      $facet: {
        data: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 1,
              title: 1,
              description: 1,
              status: 1,
              remarks: 1,
              created_at: 1,
              fileName: 1,
              fileUrl: 1,
              assigned: 1,
              submitted_by: 1,
              "organizerInfo._id": 1,
              "organizerInfo.first_name": 1,
              "organizerInfo.middle_name": 1,
              "organizerInfo.last_name": 1,
              "organizerInfo.gender": 1,
              "organizerInfo.contact_number": 1,
              "organizerInfo.email": 1,
              "organizerInfo.avatar": 1,
            },
          },
        ],
        totalCount: [{ $count: "count" }],

        statusCounts: [
          {
            $group: {
              _id: {
                month: { $dateToString: { format: "%B", date: "$created_at" } },
              },
              approved: {
                $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
              },
              rejected: {
                $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
              },
              pending: {
                $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
              },
            },
          },
          {
            $project: {
              _id: 0,
              month: "$_id.month",
              approved: 1,
              rejected: 1,
              pending: 1,
            },
          },
          { $sort: { month: 1 } },
        ],
      },
    },
  ]);

  const proposals = result[0].data || [];
  const totalCount = result[0].totalCount[0]?.count || 0;
  const statusCounts = result[0].statusCounts || [];
  const totalPages = Math.ceil(totalCount / limit);

  res.status(200).json({
    status: "success",
    currentPage: page,
    totalPages,
    totalCount,
    statusCounts,
    results: proposals.length,
    data: proposals,
  });
});

exports.UpdateProposal = async (req, res) => {
  try {
    const { status, submitted_by } = req.body;

    const updated = await ProposalModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        status: "fail",
        message: "Proposal not found",
      });
    }

    const io = req.app.get("io");

    const invitationMessage = {
      message: `A new Proposal ${status}`,
      data: updated,
    };

    // Emit socket notification kung online
    if (submitted_by) {
      const targetUser = global.connectedUsers?.[submitted_by.toString()];
      if (targetUser) {
        io.to(targetUser.socketId).emit("ApprovedProposal", invitationMessage);
        console.log(`📨 Sent Invitation to LGU (${submitted_by})`);
      } else {
        console.log(`LGU (${submitted_by}) is offline, saving notification...`);
      }

      await Notification.create({
        message: invitationMessage.message,
        title: "Approved Proposal",
        category: "Proposal",
        priority: "high",
        viewers: [
          {
            user: new mongoose.Types.ObjectId(submitted_by),
            isRead: false,
            viewedAt: null,
          },
        ],
        created_at: new Date(),
      });
    }

    res.status(200).json({
      status: "success",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating proposal:", error);
    res.status(500).json({
      status: "error",
      message:
        error.message || "Something went wrong while updating the proposal",
    });
  }
};

exports.deleteProposal = AsyncErrorHandler(async (req, res, next) => {
  const hasCategory = await ProposalModel.exists({ Category: req.params.id });

  if (hasCategory) {
    return res.status(400).json({
      status: "fail",
      message: "Cannot delete Category: there are existing related records.",
    });
  }
  await ProposalModel.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    data: null,
  });
});

exports.UpdateMetaDataProposal = AsyncErrorHandler(async (req, res, next) => {
  const updated = await ProposalModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  if (!updated) {
    return res.status(404).json({
      status: "fail",
      message: "Proposal not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: updated,
  });
});

exports.getFileCloud = AsyncErrorHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const file = await ProposalModel.findById(id);
    if (!file) return res.status(404).json({ message: "File not found." });

    const cloudinaryUrl = file.fileUrl;
    const response = await axios({
      method: "GET",
      url: cloudinaryUrl,
      responseType: "stream",
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${file.fileName}"`);
    return response.data.pipe(res);
  } catch (error) {
    console.error("Cloudinary streaming failed:", error.message);
    res.status(error.response?.status || 500).json({
      message: "Cloudinary streaming failed",
      error: error.message,
    });
  }
});

exports.getFileById = async (req, res) => {
  try {
    const { id } = req.params;

    // validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid file ID" });
    }

    const FilesData = await ProposalModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "admins",
          localField: "admin",
          foreignField: "_id",
          as: "adminInfo",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $lookup: {
          from: "organizers",
          localField: "submitted_by",
          foreignField: "_id",
          as: "organizerInfo",
        },
      },
      {
        $unwind: {
          path: "$organizerInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          status: 1,
          remarks: 1,
          created_at: 1,
          fileName: 1,
          fileUrl: 1,
          "organizerInfo._id": 1,
          "organizerInfo.first_name": 1,
          "organizerInfo.middle_name": 1,
          "organizerInfo.last_name": 1,
          "organizerInfo.gender": 1,
          "organizerInfo.contact_number": 1,
          "organizerInfo.email": 1,
          "organizerInfo.avatar": 1,
        },
      },
    ]);

    if (!FilesData || FilesData.length === 0) {
      return res.status(404).json({ message: "File not found." });
    }

    res.status(200).json({
      status: "success",
      data: FilesData[0],
    });
  } catch (error) {
    console.error("❌ Error in getFileById:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong while fetching file",
    });
  }
};

exports.UpdateCloudinaryFile = AsyncErrorHandler(async (req, res) => {
  const { file } = req;
  const { fileId, title, description, remarks, status, submitted_by } =
    req.body;

  if (!file) return res.status(400).json({ error: "No file uploaded" });
  if (!fileId || !mongoose.Types.ObjectId.isValid(fileId))
    return res.status(400).json({ error: "Invalid or missing file ID" });

  const oldFile = await ProposalModel.findById(fileId);
  if (!oldFile)
    return res.status(404).json({ error: "Original file not found" });

  // Generate unique file name
  const ext = path.extname(file.originalname || ".pdf");
  const baseName = path.basename(file.originalname || "document.pdf", ext);
  const uniqueFileName = `${Date.now()}_${baseName}`;
  const folderPath = "Event Proposals";

  // Upload new file to Cloudinary
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folderPath,
        resource_type: "raw",
        public_id: uniqueFileName.replace(ext, ""), // walang extension
      },
      (err, res) => (err ? reject(err) : resolve(res))
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });

  // Destroy old file from Cloudinary if it exists
  if (oldFile.fileName) {
    try {
      const oldPublicId = `${folderPath}/${path.basename(
        oldFile.fileName,
        path.extname(oldFile.fileName)
      )}`;
      await cloudinary.uploader.destroy(oldPublicId, { resource_type: "raw" });
    } catch (err) {
      console.error("⚠️ Failed to delete old file:", err.message);
    }
  }

  // Update the proposal with new file info and other fields
  oldFile.title = title || oldFile.title;
  oldFile.description = description || oldFile.description;
  oldFile.remarks = remarks || oldFile.remarks;
  oldFile.status = status || oldFile.status;
  oldFile.submitted_by = submitted_by || oldFile.submitted_by;
  oldFile.fileUrl = result?.secure_url;
  oldFile.fileName = uniqueFileName;

  await oldFile.save();

  const io = req.app.get("io");

  const invitationMessage = {
    message: `A new Proposal ${status}`,
    data: oldFile, // ✅ corrected from "updated"
  };

  // Emit socket notification kung online
  if (submitted_by) {
    const targetUser = global.connectedUsers?.[submitted_by.toString()];
    if (targetUser) {
      io.to(targetUser.socketId).emit("ApprovedProposal", invitationMessage);
      console.log(`📨 Sent Invitation to LGU (${submitted_by})`);
    } else {
      console.log(`LGU (${submitted_by}) is offline, saving notification...`);
    }

    await Notification.create({
      message: invitationMessage.message,
      title: "Approved Proposal",
      category: "Proposal",
      priority: "high",
      viewers: [
        {
          user: new mongoose.Types.ObjectId(submitted_by),
          isRead: false,
        },
      ],
      createdAt: new Date(), // ✅ align with schema field
    });
  }

  res.status(200).json({
    status: "success",
    message: "Proposal updated successfully with new file",
    data: oldFile,
  });
});

exports.DisplayDropdownProposal = AsyncErrorHandler(async (req, res) => {
  const role = req.user.role;
  const userId = req.user.linkId;

  console.log("role:", role);
  console.log("userId:", userId);

  const matchStage = { status: "approved" };

  if (role === "organizer") {
    matchStage.submitted_by = userId;
  }

  const result = await ProposalModel.aggregate([
    { $match: matchStage },
    { $sort: { createdAt: -1 } }, 
    {
      $lookup: {
        from: "organizers", 
        localField: "submitted_by",
        foreignField: "_id",
        as: "organizerInfo",
      },
    },
    { $unwind: { path: "$organizerInfo", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        status: 1,
        organizerName: "$organizerInfo.name",
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    results: result.length,
    data: result,
  });
});
