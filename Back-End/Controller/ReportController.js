const AsyncErrorHandler = require("../Utils/AsyncErrorHandler");
const reportmodel = require("./../Models/Report");

exports.reportCreate = AsyncErrorHandler(async (req, res) => {
  const inserted = await reportmodel.create(req.body);
  const eventWithOrganizer = await reportmodel.aggregate([
    { $match: { _id: inserted._id } },
    {
      $lookup: {
        from: "events",
        localField: "event_id",
        foreignField: "_id",
        as: "event",
      },
    },
    {
      $unwind: {
        path: "$event",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        feedback: 1,
        rating: 1,
        "event._id": 1,
        "event.title": 1,
        "event.venue": 1,
        "event.description": 1,
        "event.status": 1,
      },
    },
  ]);

  res.status(201).json({
    status: "success",
    data: eventWithOrganizer[0],
  });
});

exports.reportdisplay = AsyncErrorHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const result = await reportmodel.aggregate([
      {
        $lookup: {
          from: "events",
          localField: "event_id",
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

      { $sort: { created_at: -1 } },

      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                _id: 1,
                feedback: 1,
                created_at: 1,
                rating: 1,
                userName: 1,
                proposalTitle: "$proposalInfo.title",
              },
            },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    const events = result[0].data || [];
    const totalCount = result[0].totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      status: "success",
      currentPage: page,
      totalPages,
      totalCount,
      results: events.length,
      data: events,
    });
  } catch (error) {
    console.error("❌ Error fetching report display:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while fetching reports",
      error: error.message,
    });
  }
});




exports.Updatereport = AsyncErrorHandler(async (req, res, next) => {
  const updated = await reportmodel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!updated) {
    return res.status(404).json({
      status: "fail",
      message: "Event not found",
    });
  }

  const updatedWithOrganizer = await reportmodel.aggregate([
    { $match: { _id: updated._id } },
    {
      $lookup: {
        from: "events",
        localField: "event_id",
        foreignField: "_id",
        as: "event",
      },
    },
    {
      $unwind: {
        path: "$event",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        feedback: 1,
        rating: 1,
        "event._id": 1,
        "event.event_name": 1,
        "event.venue": 1,
        "event.description": 1,
        "event.status": 1,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: updatedWithOrganizer[0],
  });
});

exports.deletereport = AsyncErrorHandler(async (req, res, next) => {
  const hasCategory = await reportmodel.exists({
    Category: req.params.id,
  });
  if (hasCategory) {
    return res.status(400).json({
      status: "fail",
      message: "Cannot delete Category: there are existing related records.",
    });
  }
  await reportmodel.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    data: null,
  });
});
