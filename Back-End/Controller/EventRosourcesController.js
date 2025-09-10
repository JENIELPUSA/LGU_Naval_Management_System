const AsyncErrorHandler = require("../Utils/AsyncErrorHandler");
const EventResourcesModel = require("./../Models/EventResource");

exports.createResourcesEvent = AsyncErrorHandler(async (req, res) => {
  const inserted = await EventResourcesModel.create(req.body);

  const eventWithOrganizer = await EventResourcesModel.aggregate([
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
      $lookup: {
        from: "resources",
        localField: "resource_id",
        foreignField: "_id",
        as: "resource",
      },
    },
    {
      $unwind: {
        path: "$resource",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        "event._id": 1,
        "event.event_name": 1,
        "event.event_date": 1,
        "event.venue": 1,
        "event.status": 1,
        "resource.resource_name": 1,
        "resource.resource_type": 1,
        "resource.description": 1,
      },
    },
  ]);

  res.status(201).json({
    status: "success",
    data: eventWithOrganizer[0],
  });
});

exports.DisplayResourcesEvent = AsyncErrorHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const { title,dateFrom, dateTo } = req.query;

  const matchStage = {};

  if (title) {
    matchStage.title = { $regex: title, $options: "i" };
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

  const result = await EventResourcesModel.aggregate([
    { $match: matchStage },
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
      $lookup: {
        from: "resources",
        localField: "resource_id",
        foreignField: "_id",
        as: "resource",
      },
    },
    {
      $unwind: {
        path: "$resource",
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
              "event._id": 1,
              "event.event_name": 1,
              "event.event_date": 1,
              "event.venue": 1,
              "event.status": 1,
              "resource.resource_name": 1,
              "resource.resource_type": 1,
              "resource.description": 1,
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

  res.status(200).json({
    status: "success",
    currentPage: page,
    totalPages,
    totalCount,
    results: events.length,
    data: events,
  });
});

exports.UpdateResourcesEvent = AsyncErrorHandler(async (req, res, next) => {
  const updated = await EventResourcesModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  if (!updated) {
    return res.status(404).json({
      status: "fail",
      message: "Event not found",
    });
  }

  const updatedWithOrganizer = await EventResourcesModel.aggregate([
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
        title: 1,
        description: 1,
        date: 1,
        location: 1,
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
    data: updatedWithOrganizer[0], // return updated event with organizer
  });
});

exports.deleteResourcesEvent = AsyncErrorHandler(async (req, res, next) => {
  const hasCategory = await EventResourcesModel.exists({
    Category: req.params.id,
  });

  if (hasCategory) {
    return res.status(400).json({
      status: "fail",
      message: "Cannot delete Category: there are existing related records.",
    });
  }
  await EventResourcesModel.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    data: null,
  });
});
