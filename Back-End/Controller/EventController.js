const mongoose = require("mongoose");
const AsyncErrorHandler = require("../Utils/AsyncErrorHandler");
const EventModel = require("./../Models/Event");
const Resources = require("./../Models/Resources");
const Notification = require("./../Models/NotificationSchema");
const LGUResponse = require("./../Models/LGUResponse");
const Proposal = require("./../Models/Proposal");
const Participant = require("./../Models/Participant");

exports.createEvent = async (req, res) => {
  try {
    const lguId = req.body.lgu;
    const userId = req.user?.linkId;

    if (!userId) {
      return res.status(401).json({ status: "error", message: "Unauthorized" });
    }

    const { proposalId } = req.body;

    // Check if the proposalId is already used in another event
    if (proposalId) {
      const existingEvent = await EventModel.findOne({ proposalId });
      if (existingEvent) {
        return res.status(400).json({
          status: "error",
          message: `Proposal ${proposalId} is already assigned to another event.`,
        });
      }
    }

    const eventData = {
      ...req.body,
      created_at: new Date(),
      created_by: userId,
    };

    const inserted = await EventModel.create(eventData);

    const registerUrl = `${process.env.FRONTEND_URL}/registerEvent/${inserted._id}`;
    inserted.registerUrl = registerUrl;
    await inserted.save();

    // Mark the proposal as assigned
    if (proposalId) {
      await Proposal.findByIdAndUpdate(
        proposalId,
        { $set: { assigned: true } },
        { new: true }
      );
      console.log(`Proposal ${proposalId} marked as assigned`);
    }

    // Update resources if present
    if (Array.isArray(req.body.resources) && req.body.resources.length > 0) {
      await Resources.updateMany(
        { _id: { $in: req.body.resources } },
        { $set: { availability: false } }
      );
    }

    const io = req.app.get("io");

    if (lguId) {
      const invitationMessage = {
        message: "A new Invitation has been generated for you.",
        data: inserted,
      };

      // Emit socket notification if online
      const targetUser = global.connectedUsers?.[lguId.toString()];
      if (targetUser) {
        io.to(targetUser.socketId).emit("Invitation", invitationMessage);
        console.log(`📨 Sent Invitation to LGU (${lguId})`);
      } else {
        console.log(`LGU (${lguId}) is offline, saving notification...`);
      }

      await Notification.create({
        message: invitationMessage.message,
        title: "Invitation For Upcoming Event",
        category: "Proposal",
        priority: "high",
        viewers: [
          {
            user: new mongoose.Types.ObjectId(lguId),
            isRead: false,
            viewedAt: null,
          },
        ],
        created_at: new Date(),
      });

      await LGUResponse.create({ lguDataID: lguId, eventID: inserted._id });
    }

    res.status(201).json({
      status: "success",
      data: inserted,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong while creating the event",
    });
  }
};


exports.DisplayEvent = AsyncErrorHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;
  const role = req.user.role;
  const userId = req.user.linkId;

  const { search, status, dateFrom, dateTo } = req.query;

  const matchStage = {};

  // filter by Organizer role
  if (role === "organizer") {
    matchStage.created_by = userId;
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

  // Dates for upcoming this month
  const now = new Date();
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );

  const pipeline = [
    { $match: matchStage },

    // Lookup organizer
    {
      $lookup: {
        from: "organizers",
        localField: "created_by",
        foreignField: "_id",
        as: "organizerInfo",
      },
    },

    // Lookup proposal
    {
      $lookup: {
        from: "proposals",
        localField: "proposalId",
        foreignField: "_id",
        as: "proposal",
      },
    },

    // Lookup resources
    {
      $lookup: {
        from: "resources",
        localField: "resources",
        foreignField: "_id",
        as: "resourcesInfo",
      },
    },

    { $unwind: { path: "$proposal", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$organizerInfo", preserveNullAndEmptyArrays: true } },
  ];

  // ✅ Search condition (searching event_name OR proposal.title)
  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { event_name: { $regex: search, $options: "i" } },
          { "proposal.title": { $regex: search, $options: "i" } },
        ],
      },
    });
  }

  pipeline.push(
    { $sort: { created_at: -1 } },
    {
      $facet: {
        data: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 1,
              event_name: 1,
              eventDate: 1,
              venue: 1,
              description: 1,
              startTime: 1,
              status: 1,
              registerUrl: 1,
              created_at: 1,
              "organizer._id": "$organizerInfo._id",
              "organizer.first_name": "$organizerInfo.first_name",
              "organizer.middle_name": "$organizerInfo.middle_name",
              "organizer.last_name": "$organizerInfo.last_name",
              "organizer.gender": "$organizerInfo.gender",
              "organizer.contact_number": "$organizerInfo.contact_number",
              "organizer.email": "$organizerInfo.email",
              "organizer.avatar": "$organizerInfo.avatar",
              "proposal.title": "$proposal.title",
              "proposal._id": "$proposal._id",
              "proposal.description": "$proposal.description",
              resources: "$resourcesInfo",
            },
          },
        ],
        totalCount: [{ $count: "count" }],

        // Upcoming events this month (today onwards only)
        upcomingThisMonth: [
          {
            $match: {
              eventDate: { $gte: now, $lte: endOfMonth },
            },
          },
          { $count: "count" },
        ],
      },
    }
  );

  const result = await EventModel.aggregate(pipeline);

  const events = result[0]?.data || [];
  const totalCount = result[0]?.totalCount[0]?.count || 0;
  const upcomingThisMonth = result[0]?.upcomingThisMonth[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  res.status(200).json({
    status: "success",
    currentPage: page,
    totalPages,
    totalCount,
    upcomingThisMonth,
    results: events.length,
    data: events,
  });
});


exports.DisplayDropdownEvent = AsyncErrorHandler(async (req, res) => {
  const role = req.user.role;
  const userId = req.user.linkId;
  const { event_name, status, dateFrom, dateTo } = req.query;

  // fetch only upcoming events (eventDate >= now)
  const matchStage = {
    eventDate: { $gte: new Date() },
  };

  if (role === "organizer") {
    matchStage.created_by = userId;
  }

  if (event_name) {
    matchStage.event_name = { $regex: event_name, $options: "i" };
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

  let pipeline = [
    { $match: matchStage },
    {
      $lookup: {
        from: "proposals",
        localField: "proposalId",
        foreignField: "_id",
        as: "proposal",
      },
    },
    { $unwind: { path: "$proposal", preserveNullAndEmptyArrays: true } },
    { $sort: { eventDate: 1 } }, // pinakamalapit sa current date ang unahin
  ];

  if (role === "organizer") {
    pipeline.push({ $limit: 1 }); // kukunin lang yung pinaka-malapit
  }

  pipeline.push({
    $project: {
      _id: 1,
      eventDate: 1,
      title: "$proposal.title",
    },
  });

  const result = await EventModel.aggregate(pipeline);

  res.status(200).json({
    status: "success",
    data: role === "organizer" ? result[0] || null : result,
  });
});


exports.UpdateEvent = AsyncErrorHandler(async (req, res, next) => {
  console.log("Request body:", req.body);
  const updated = await EventModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!updated) {
    return res.status(404).json({
      status: "fail",
      message: "Event not found",
    });
  }

  const updatedWithOrganizer = await EventModel.aggregate([
    { $match: { _id: updated._id } },
    {
      $lookup: {
        from: "organizers",
        localField: "created_by",
        foreignField: "_id",
        as: "organizer",
      },
    },
    {
      $unwind: {
        path: "$organizer",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        event_name: 1,
        event_date: 1,
        venue: 1,
        description: 1,
        status: 1,
        created_at: 1,
        "organizer._id": 1,
        "organizer.first_name": 1,
        "organizer.middle_name": 1,
        "organizer.last_name": 1,
        "organizer.gender": 1,
        "organizer.contact_number": 1,
        "organizer.email": 1,
        "organizer.avatar": 1,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: updatedWithOrganizer[0],
  });
});

// Delete Event
exports.deleteEvent = AsyncErrorHandler(async (req, res, next) => {
  await EventModel.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    data: null,
  });
});

exports.DisplayUpcomingEvent = AsyncErrorHandler(async (req, res) => {
  try {
    const { search = "", page = 1 } = req.query;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    // 🔹 Sanitize and split search terms
    const words = search
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 0)
      .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")); // escape regex chars

    const pipeline = [
      {
        $lookup: {
          from: "organizers",
          localField: "created_by",
          foreignField: "_id",
          as: "organizerInfo",
        },
      },
      {
        $lookup: {
          from: "proposals",
          localField: "proposalId",
          foreignField: "_id",
          as: "proposal",
        },
      },
      {
        $lookup: {
          from: "resources",
          localField: "resources",
          foreignField: "_id",
          as: "resourcesInfo",
        },
      },
      { $unwind: { path: "$proposal", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$organizerInfo", preserveNullAndEmptyArrays: true } },
      { $match: { eventDate: { $gte: now } } },
    ];

    // 🔹 If search terms exist, create scoring logic
    if (words.length > 0) {
      const regexConditions = words.map((word) => ({
        "proposal.title": { $regex: word, $options: "i" },
      }));

      // include if any word matches (OR condition)
      pipeline.push({
        $match: { $or: regexConditions },
      });

      // compute how many words matched
      pipeline.push({
        $addFields: {
          matchCount: {
            $size: {
              $filter: {
                input: words,
                as: "word",
                cond: {
                  $regexMatch: {
                    input: { $ifNull: ["$proposal.title", ""] },
                    regex: "$$word",
                    options: "i",
                  },
                },
              },
            },
          },
        },
      });

      // sort by highest match count first, then event date
      pipeline.push({ $sort: { matchCount: -1, eventDate: 1 } });
    } else {
      pipeline.push({ $sort: { eventDate: 1 } });
    }

    // 🔹 Facet for pagination
    pipeline.push({
      $facet: {
        metadata: [
          { $count: "totalCount" },
          {
            $addFields: {
              totalPages: { $ceil: { $divide: ["$totalCount", limit] } },
            },
          },
        ],
        data: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 1,
              eventDate: 1,
              venue: 1,
              description: 1,
              startTime: 1,
              status: 1,
              registerUrl: 1,
              created_at: 1,
              "proposal.title": 1,
              "proposal._id": 1,
              "proposal.description": 1,
              "organizer._id": "$organizerInfo._id",
              "organizer.first_name": "$organizerInfo.first_name",
              "organizer.last_name": "$organizerInfo.last_name",
              "organizer.email": "$organizerInfo.email",
              resources: "$resourcesInfo",
              matchCount: 1,
            },
          },
        ],
        upcomingThisMonth: [
          { $match: { eventDate: { $gte: now, $lte: endOfMonth } } },
          { $count: "count" },
        ],
      },
    });

    const result = await EventModel.aggregate(pipeline);

    const events = result[0]?.data || [];
    const metadata = result[0]?.metadata[0] || { totalCount: 0, totalPages: 1 };
    const upcomingThisMonth = result[0]?.upcomingThisMonth[0]?.count || 0;

    res.status(200).json({
      status: "success",
      totalCount: metadata.totalCount || 0,
      totalPages: metadata.totalPages || 1,
      currentPage: parseInt(page),
      upcomingThisMonth,
      results: events.length,
      data: events,
    });
  } catch (err) {
    console.error("Error in DisplayUpcomingEvent:", err);
    res.status(500).json({
      status: "error",
      message: err.message || "Server error while fetching upcoming events.",
    });
  }
});






