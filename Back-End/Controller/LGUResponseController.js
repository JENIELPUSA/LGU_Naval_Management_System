const AsyncErrorHandler = require("../Utils/AsyncErrorHandler");
const LGUResponse = require("./../Models/LGUResponse");
const mongoose = require("mongoose");
const Notification = require("../Models/NotificationSchema");

exports.DisplayResponse = AsyncErrorHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;
  const lguId = req.user.linkId;
  const role = req.user.role;
  const { title, status, dateFrom, dateTo } = req.query;

  const matchStage = {};

  if (role === "lgu") {
    matchStage.lguDataID = new mongoose.Types.ObjectId(lguId);
  }

  if (title) {
    matchStage["proposalInfo.title"] = { $regex: title, $options: "i" };
  }

  if (status) {
    matchStage.status = status;
  }

  if (dateFrom || dateTo) {
    matchStage.created_at = {};
    if (dateFrom) matchStage.created_at.$gte = new Date(dateFrom);
    if (dateTo) {
      const endOfDay = new Date(dateTo);
      endOfDay.setHours(23, 59, 59, 999);
      matchStage.created_at.$lte = endOfDay;
    }
  }

  const result = await LGUResponse.aggregate([
    { $match: matchStage },

    {
      $lookup: {
        from: "lgus",
        localField: "lguDataID",
        foreignField: "_id",
        as: "LGUInfo",
      },
    },
    { $unwind: { path: "$LGUInfo", preserveNullAndEmptyArrays: true } },

    {
      $lookup: {
        from: "events",
        localField: "eventID",
        foreignField: "_id",
        as: "EventInfo",
      },
    },
    { $unwind: { path: "$EventInfo", preserveNullAndEmptyArrays: true } },

    {
      $lookup: {
        from: "proposals",
        localField: "EventInfo.proposalId",
        foreignField: "_id",
        as: "proposalInfo",
      },
    },
    { $unwind: { path: "$proposalInfo", preserveNullAndEmptyArrays: true } },

    {
      $lookup: {
        from: "organizers",
        localField: "EventInfo.created_by",
        foreignField: "_id",
        as: "organizerInfo",
      },
    },
    { $unwind: { path: "$organizerInfo", preserveNullAndEmptyArrays: true } },

    {
      $addFields: {
        monthName: {
          $arrayElemAt: [
            [
              "",
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ],
            { $month: "$created_at" },
          ],
        },
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
              status: 1,
              note: 1,
              created_at: 1,
              monthName: 1,
              "LGUInfo._id": 1,
              "LGUInfo.first_name": 1,
              "LGUInfo.middle_name": 1,
              "LGUInfo.last_name": 1,
              "proposalInfo.title": 1,
              "proposalInfo.description": 1,
              "EventInfo.eventDate": 1,
              "EventInfo.startTime": 1,
              "EventInfo.venue": 1,
              "EventInfo.created_by": 1,
              "organizerInfo.first_name": 1,
              "organizerInfo.middle_name": 1,
              "organizerInfo.last_name": 1,
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

  const events = result[0].data || [];
  const totalCount = result[0].totalCount[0]?.count || 0;
  const statusCounts = result[0].statusCounts || [];
  const totalPages = Math.ceil(totalCount / limit);

  res.status(200).json({
    status: "success",
    currentPage: page,
    totalPages,
    totalCount,
    statusCounts,
    results: events.length,
    data: events,
  });
});

exports.UpdateResponse = async (req, res) => {
  try {
    const { status, submitted_by, note } = req.body;
    const updated = await LGUResponse.findByIdAndUpdate(
      req.params.id,
      { status, note },
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
      message: `LGU Approved Your Inventation ${status}`,
      data: updated,
    };

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


exports.deleteResponse = AsyncErrorHandler(async (req, res, next) => {
  await LGUResponse.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    data: null,
  });
});
