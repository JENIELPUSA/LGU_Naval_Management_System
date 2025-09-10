const AsyncErrorHandler = require("../Utils/AsyncErrorHandler");
const Officer = require("../Models/OfficerSchema");
const mongoose = require("mongoose");
const cloudinary = require("../Utils/cloudinary");
const sendEmail = require("../Utils/email");
const Team = require("../Models/TeamSchema");
const UserLoginSchema = require("../Models/LogInSchema");

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
    const officers = await Officer.find({ teamId: team_id });

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

      for (const task of officer.task) {
        const emailBody = `Hello ${officer.first_name},

Team:
- ${team.teamName}

Members of your team:
${memberListText}

Your assigned task:
- ${task}

Please complete it as scheduled.

Thank you.`;
        await sendEmail({
          email: officer.email,
          subject: `Task Assignment - ${team.teamName}`,
          text: emailBody,
        });

        console.log(`📧 Email sent to ${officer.email} for task: ${task}`);
      }
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

exports.deleteOfficer = AsyncErrorHandler(async (req, res, next) => {
  const OfficerID = req.params.id;

  const existingOfficer = await Officer.findById(OfficerID);
  if (!existingOfficer) {
    return res.status(404).json({
      status: "fail",
      message: "Officer not found.",
    });
  }

  if (existingOfficer.avatar && existingOfficer.avatar.public_id) {
    try {
      await cloudinary.uploader.destroy(existingOfficer.avatar.public_id);
    } catch (error) {
      console.error("Cloudinary deletion failed:", error);
      // optionally continue even if deletion fails
    }
  }

  // 🗑 Delete linked login
  const userLogin = await UserLoginSchema.findOne({ linkedId: OfficerID });
  if (userLogin) {
    await UserLoginSchema.findByIdAndDelete(userLogin._id);
  }

  // 🗑 Delete Officer record
  await Officer.findByIdAndDelete(OfficerID);

  res.status(200).json({
    status: "success",
    message: "Officer and related login deleted successfully.",
    data: null,
  });
});

exports.DisplayOfficer = AsyncErrorHandler(async (req, res) => {
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

    const results = await Officer.aggregate(pipeline);

    const data = results[0].data;
    const totalOfficer = results[0].totalCount[0]?.count || 0;

    res.status(200).json({
      status: "success",
      data,
      totalOfficer,
      currentPage: page,
      totalPages: Math.ceil(totalOfficer / limit),
    });
  } catch (error) {
    console.error("Error fetching Officer data:", error);
    res.status(500).json({
      status: "fail",
      message: "Something went wrong while fetching Officer data.",
      error: error.message,
    });
  }
});

exports.DisplayProfile = AsyncErrorHandler(async (req, res) => {
  const loggedInOfficerId = req.user.linkId;
  const Officer = await Officer.findById(loggedInOfficerId);
  if (!Officer) {
    return res.status(404).json({
      status: "fail",
      message: "Officer not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: Officer,
  });
});

exports.updateOfficer = async (req, res) => {
  const OfficerId = req.params.id;
  console.log(req.body);

  try {
    const existingOfficer = await Officer.findById(OfficerId);
    if (!existingOfficer) {
      return res.status(404).json({ error: "Officer not found" });
    }

    let avatar = existingOfficer.avatar; // Use existing avatar by default

    // Check if there's a new image uploaded
    if (req.file) {
      // Delete the old image if exists
      if (existingOfficer.avatar?.public_id) {
        try {
          await cloudinary.uploader.destroy(existingOfficer.avatar.public_id);
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
    const updatedOfficer = await Officer.findByIdAndUpdate(
      OfficerId,
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

    return res.status(200).json({ status: "success", data: updatedOfficer });
  } catch (error) {
    console.error("Update failed:", error);
    return res.status(500).json({ error: "Something went wrong." });
  }
};

exports.DisplayOfficer = AsyncErrorHandler(async (req, res) => {
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

    const results = await Officer.aggregate(pipeline);

    const data = results[0].data;
    const totalOfficer = results[0].totalCount[0]?.count || 0;

    res.status(200).json({
      status: "success",
      data,
      totalOfficer,
      currentPage: page,
      totalPages: Math.ceil(totalOfficer / limit),
    });
  } catch (error) {
    console.error("Error fetching Officer data:", error);
    res.status(500).json({
      status: "fail",
      message: "Something went wrong while fetching Officer data.",
      error: error.message,
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
          from: "officers", // join officers
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
