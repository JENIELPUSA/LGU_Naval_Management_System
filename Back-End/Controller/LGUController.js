const AsyncErrorHandler = require("../Utils/AsyncErrorHandler");
const LGU = require("../Models/LGUSchema");
const mongoose = require("mongoose");
const cloudinary = require("../Utils/cloudinary");
const sendEmail = require("../Utils/email");
const Team = require("../Models/TeamSchema");
const UserLoginSchema = require("../Models/LogInSchema");
const Notification = require("./../Models/NotificationSchema");

exports.deleteLGU = AsyncErrorHandler(async (req, res, next) => {
  const LGUID = req.params.id;

  const existingLGU = await LGU.findById(LGUID);
  if (!existingLGU) {
    return res.status(404).json({
      status: "fail",
      message: "LGU not found.",
    });
  }

  if (existingLGU.avatar && existingLGU.avatar.public_id) {
    try {
      await cloudinary.uploader.destroy(existingLGU.avatar.public_id);
    } catch (error) {
      console.error("Cloudinary deletion failed:", error);
      // optionally continue even if deletion fails
    }
  }

  // 🗑 Delete linked login
  const userLogin = await UserLoginSchema.findOne({ linkedId: LGUID });
  if (userLogin) {
    await UserLoginSchema.findByIdAndDelete(userLogin._id);
  }

  // 🗑 Delete LGU record
  await LGU.findByIdAndDelete(LGUID);

  res.status(200).json({
    status: "success",
    message: "LGU and related login deleted successfully.",
    data: null,
  });
});

exports.DisplayLGU = AsyncErrorHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const { search = "", dateFrom, dateTo } = req.query;

    const matchStage = {};

    // Date Filtering
    const hasDateFrom = dateFrom && dateFrom.trim() !== "";
    const hasDateTo = dateTo && dateTo.trim() !== "";

    if (hasDateFrom || hasDateTo) {
      matchStage.created_at = {};

      if (hasDateFrom) {
        matchStage.created_at.$gte = new Date(dateFrom);
      }

      if (hasDateTo) {
        const endDate = new Date(dateTo);
        endDate.setDate(endDate.getDate() + 1); // include full day
        matchStage.created_at.$lt = endDate;
      }
    }

    // Aggregation Pipeline
    const pipeline = [
      {
        $addFields: {
          full_name: {
            $concat: [
              { $ifNull: ["$first_name", ""] },
              " ",
              { $ifNull: ["$middle_name", ""] },
              " ",
              { $ifNull: ["$last_name", ""] },
            ],
          },
        },
      },
      {
        $match: {
          ...matchStage,
          ...(search.trim()
            ? {
                full_name: {
                  $regex: new RegExp(search.trim(), "i"),
                },
              }
            : {}),
        },
      },
      {
        $sort: { created_at: -1 },
      },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const results = await LGU.aggregate(pipeline);

    const data = results[0].data;
    const totalLGU = results[0].totalCount[0]?.count || 0;

    res.status(200).json({
      status: "success",
      data,
      totalLGU,
      currentPage: page,
      totalPages: Math.ceil(totalLGU / limit),
    });
  } catch (error) {
    console.error("Error fetching LGU data:", error);
    res.status(500).json({
      status: "fail",
      message: "Something went wrong while fetching LGU data.",
      error: error.message,
    });
  }
});

exports.DisplayProfile = AsyncErrorHandler(async (req, res) => {
  const loggedInLGUId = req.user.linkId;
  const LGU = await LGU.findById(loggedInLGUId);
  if (!LGU) {
    return res.status(404).json({
      status: "fail",
      message: "LGU not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: LGU,
  });
});

exports.updateLGU = async (req, res) => {
  const LGUId = req.params.id;
  console.log(req.body);

  try {
    const existingLGU = await LGU.findById(LGUId);
    if (!existingLGU) {
      return res.status(404).json({ error: "LGU not found" });
    }

    let avatar = existingLGU.avatar; // Use existing avatar by default

    // Check if there's a new image uploaded
    if (req.file) {
      // Delete the old image if exists
      if (existingLGU.avatar?.public_id) {
        try {
          await cloudinary.uploader.destroy(existingLGU.avatar.public_id);
        } catch (err) {
          console.error("Failed to delete old image from Cloudinary", err);
        }
      }

      // Upload new image
      const base64Image = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;
      const uploadedResponse = await cloudinary.uploader.upload(base64Image, {
        folder: "LGU_EVENT_MANAGEMENT/Profile",
      });

      avatar = {
        public_id: uploadedResponse.public_id,
        url: uploadedResponse.secure_url,
      };
    }

    // Perform update
    const updatedLGU = await LGU.findByIdAndUpdate(
      LGUId,
      {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        middle_name: req.body.middle_name,
        email: req.body.email,
        gender: req.body.gender,
        contact_number: req.body.contact_number,
        task: req.body.task,
        teamId: req.body.teamId,
        avatar,
      },
      { new: true }
    );

    return res.status(200).json({ status: "success", data: updatedLGU });
  } catch (error) {
    console.error("Update failed:", error);
    return res.status(500).json({ error: "Something went wrong." });
  }
};

exports.DisplayLGU = AsyncErrorHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const { search = "", dateFrom, dateTo } = req.query;

    const matchStage = {};

    // Date Filtering
    const hasDateFrom = dateFrom && dateFrom.trim() !== "";
    const hasDateTo = dateTo && dateTo.trim() !== "";

    if (hasDateFrom || hasDateTo) {
      matchStage.created_at = {};

      if (hasDateFrom) {
        matchStage.created_at.$gte = new Date(dateFrom);
      }

      if (hasDateTo) {
        const endDate = new Date(dateTo);
        endDate.setDate(endDate.getDate() + 1); // include full day
        matchStage.created_at.$lt = endDate;
      }
    }

    // Aggregation Pipeline
    const pipeline = [
      {
        $addFields: {
          full_name: {
            $concat: [
              { $ifNull: ["$first_name", ""] },
              " ",
              { $ifNull: ["$middle_name", ""] },
              " ",
              { $ifNull: ["$last_name", ""] },
            ],
          },
        },
      },
      {
        $match: {
          ...matchStage,
          ...(search.trim()
            ? {
                full_name: {
                  $regex: new RegExp(search.trim(), "i"),
                },
              }
            : {}),
        },
      },
      {
        $sort: { created_at: -1 },
      },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const results = await LGU.aggregate(pipeline);

    const data = results[0].data;
    const totalLGU = results[0].totalCount[0]?.count || 0;

    res.status(200).json({
      status: "success",
      data,
      totalLGU,
      currentPage: page,
      totalPages: Math.ceil(totalLGU / limit),
    });
  } catch (error) {
    console.error("Error fetching LGU data:", error);
    res.status(500).json({
      status: "fail",
      message: "Something went wrong while fetching LGU data.",
      error: error.message,
    });
  }
});

exports.BroadcastControllerEmail = AsyncErrorHandler(async (req, res) => {
  try {
    const { team_id } = req.query;

    if (!team_id || !mongoose.Types.ObjectId.isValid(team_id)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid or missing team_id",
      });
    }

    // Step 1: Kunin ang team
    const team = await Team.findById(team_id);
    if (!team) {
      return res.status(404).json({
        status: "fail",
        message: "Team not found",
      });
    }

    // Step 2: Kunin lahat ng officers na kabilang sa team
    const officers = await LGU.find({ teamId: team_id });

    if (officers.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No officers found for this team",
      });
    }

    // Step 3: Format members list para sa email body
    const memberListText = officers
      .map((o) => `- ${o.first_name} ${o.last_name}`)
      .join("\n");

    // Step 4: I-loop bawat officer at bawat task
    for (const officer of officers) {
      if (!officer.task || officer.task.length === 0) continue;

      // Email sending logic
      const uniqueTasks = [...new Set(officer.task)];
      const tasksText = uniqueTasks.map((task) => `- ${task}`).join("\n");

      const emailBody = `Hello ${officer.first_name},

Team:
- ${team.teamName}

Members of your team:
${memberListText}

Your assigned tasks:
${tasksText}

Please complete them as scheduled.

Thank you.`;

      await sendEmail({
        email: officer.email,
        subject: `Task Assignment - ${team.teamName}`,
        text: emailBody,
      });

      console.log(
        `📧 Email sent to ${officer.email} for ${uniqueTasks.length} task(s)`
      );

      // 🔹 Notification logic
      const io = req.app.get("io");
      const invitationMessage = {
        message: "A new Task has Assigned for you.Please Check Your Gmail!",
      };

      // Emit socket notification if online
      const targetUser = global.connectedUsers?.[officer._id.toString()];
      if (targetUser) {
        io.to(targetUser.socketId).emit("Invitation", invitationMessage);
        console.log(`📨 Sent Invitation to LGU (${officer._id})`);
      } else {
        console.log(`LGU (${officer._id}) is offline, saving notification...`);
      }

      await Notification.create({
        message: invitationMessage.message,
        title: "Task For Upcoming Event",
        category: "Task",
        priority: "high",
        viewers: [
          {
            user: new mongoose.Types.ObjectId(officer._id),
            isRead: false,
            viewedAt: null,
          },
        ],
        created_at: new Date(),
      });
    }

    res.status(200).json({
      status: "success",
      message: "Broadcast emails sent successfully",
      teamName: team.teamName,
      totalOfficers: officers.length,
    });
  } catch (error) {
    console.error("Error in BroadcastControllerEmail:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

exports.GetAssignEventSummary = AsyncErrorHandler(async (req, res) => {
  try {
    const { search = "", dateFrom, dateTo, eventId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(eventId?.trim())) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid eventId",
      });
    }

    const matchStage = {};
    if (dateFrom || dateTo) {
      matchStage.createdAt = {};
      if (dateFrom) matchStage.createdAt.$gte = new Date(dateFrom);
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setDate(endDate.getDate() + 1);
        matchStage.createdAt.$lt = endDate;
      }
    }

    const pipeline = [
      {
        $match: {
          ...matchStage,
          ...(eventId
            ? { event_id: new mongoose.Types.ObjectId(eventId) }
            : {}),
        },
      },
      {
        $lookup: {
          from: "lgus", // join officers
          localField: "_id",
          foreignField: "teamId",
          as: "officers",
        },
      },
      {
        $lookup: {
          from: "events", // join events
          localField: "event_id",
          foreignField: "_id",
          as: "event",
        },
      },
      { $unwind: { path: "$event", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "proposals", // join proposals
          localField: "event.proposalId",
          foreignField: "_id",
          as: "proposal",
        },
      },
      { $unwind: { path: "$proposal", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          teamName: 1,
          createdAt: 1,
          "event._id": 1,
          "event.eventName": 1,
          "proposal._id": 1,
          "proposal.title": 1,
          officers: {
            _id: 1,
            first_name: 1,
            middle_name: 1,
            last_name: 1,
            gender: 1,
            task: 1,
            contact_number: 1,
            email: 1,
            created_at: 1,
          },
        },
      },
      { $sort: { createdAt: -1 } },
    ];

    const data = await Team.aggregate(pipeline);

    res.status(200).json({
      status: "success",
      data,
      totalTeams: data.length,
    });
  } catch (error) {
    console.error("Error fetching Team/Officer data:", error);
    res.status(500).json({
      status: "fail",
      message: "Something went wrong while fetching data.",
      error: error.message,
    });
  }
});
