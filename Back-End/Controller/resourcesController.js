const AsyncErrorHandler = require("../Utils/AsyncErrorHandler");
const Resources = require("./../Models/Resources");
const LogActionAudit = require("./../Models/LogActionAudit");

exports.createResources = AsyncErrorHandler(async (req, res) => {
  try {
    const userId = req.user?.linkId;

    if (!userId) {
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized user",
      });
    }
    const resource = await Resources.create(req.body);

    await LogActionAudit.create({
      action_type: "CREATE",
      performed_by: userId,
      module: "Resources",
      reference_id: resource._id,
      description: `Created a new resource titled "${
        resource.resource_name || "Unnamed Resource"
      }"`,
      new_data: resource,
      ip_address:
        req.headers["x-forwarded-for"]?.split(",").shift() ||
        req.socket?.remoteAddress,
    });

    res.status(201).json({
      status: "success",
      data: resource,
    });
  } catch (error) {
    console.error("Error creating resource:", error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong while creating the resource.",
    });
  }
});

exports.DisplayResources = AsyncErrorHandler(async (req, res) => {
  try {
    // Get query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";
    const status = req.query.status; // optional filter

    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};

    // Optional search by name (or any other field)
    if (search) {
      filter.resource_name = { $regex: search, $options: "i" }; // case-insensitive
    }

    // Optional status filter (example only if your schema has status)
    if (status) {
      filter.status = status;
    }

    // Query resources with pagination and filtering
    const resources = await Resources.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // optional sorting

    const total = await Resources.countDocuments(filter);

    res.status(200).json({
      status: "success",
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      data: resources,
    });
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({
      status: "fail",
      message: "Something went wrong while fetching resources",
      error: error.message,
    });
  }
});

exports.UpdateResources = AsyncErrorHandler(async (req, res, next) => {
  const userId = req.user?.linkId;
  if (!userId) {
    return res.status(401).json({
      status: "fail",
      message: "Unauthorized user",
    });
  }

  const oldResource = await Resources.findById(req.params.id);
  if (!oldResource) {
    return res.status(404).json({
      status: "fail",
      message: "Resource not found",
    });
  }

  // Update resource
  const updatedResource = await Resources.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  // --- Audit Log (after successful update) ---
  await LogActionAudit.create({
    action_type: "UPDATE",
    performed_by: userId,
    module: "Resources",
    reference_id: updatedResource._id,
    description: `Updated resource titled "${
      updatedResource.resource_name || "Unnamed Resource"
    }"`,
    old_data: oldResource,
    new_data: updatedResource,
    ip_address:
      req.headers["x-forwarded-for"]?.split(",").shift() ||
      req.socket?.remoteAddress,
  });

  res.status(200).json({
    status: "success",
    data: updatedResource,
  });
});

exports.deleteResources = AsyncErrorHandler(async (req, res, next) => {
  const userId = req.user?.linkId;
  if (!userId) {
    return res.status(401).json({
      status: "fail",
      message: "Unauthorized user",
    });
  }

  // Check if the resource has related records
  const hasRelated = await Resources.exists({ relatedField: req.params.id });
  // <-- replace 'relatedField' with actual field that references this resource
  if (hasRelated) {
    return res.status(400).json({
      status: "fail",
      message: "Cannot delete resource: there are existing related records.",
    });
  }

  // Get the resource before deleting (for audit log)
  const resource = await Resources.findById(req.params.id);
  if (!resource) {
    return res.status(404).json({
      status: "fail",
      message: "Resource not found",
    });
  }

  // Delete the resource
  await Resources.findByIdAndDelete(req.params.id);

  // --- Audit Log (after successful delete) ---
  await LogActionAudit.create({
    action_type: "DELETE",
    performed_by: userId,
    module: "Resources",
    reference_id: resource._id,
    description: `Deleted resource `,
    old_data: resource,
    ip_address:
      req.headers["x-forwarded-for"]?.split(",").shift() ||
      req.socket?.remoteAddress,
  });

  res.status(200).json({
    status: "success",
    message: "Resource deleted successfully.",
  });
});

exports.DisplayResourcesDropdown = AsyncErrorHandler(async (req, res) => {
  const { showAll } = req.query; // kunin ang query param

  const filter = { availability: true }; // only available resources

  let query = Resources.find(filter).sort({ createdAt: -1 });

  // --- Apply default limit 5 unless showAll=true ---
  const defaultLimit = 5;
  if (!showAll || showAll.toLowerCase() !== "true") {
    query = query.limit(defaultLimit);
  }

  const resources = await query;
  const total = await Resources.countDocuments(filter);

  res.status(200).json({
    status: "success",
    totalItems: total,
    data: resources,
  });
});
