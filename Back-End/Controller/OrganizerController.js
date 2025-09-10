const AsyncErrorHandler = require("../Utils/AsyncErrorHandler");
const OrganizerData = require("../Models/OrganizerModel");
const UserLoginSchema = require("../Models/LogInSchema");
const cloudinary = require("../Utils/cloudinary");
exports.deleteOrganizer = AsyncErrorHandler(async (req, res, next) => {
  const OrganizerID = req.params.id;

  const existingOrganizer = await OrganizerData.findById(OrganizerID);
  if (!existingOrganizer) {
    return res.status(404).json({
      status: "fail",
      message: "Officer not found.",
    });
  }

  if (existingOrganizer.avatar && existingOrganizer.avatar.public_id) {
    try {
      await cloudinary.uploader.destroy(existingOrganizer.avatar.public_id);
    } catch (error) {
      console.error("Cloudinary deletion failed:", error);
      // optionally continue even if deletion fails
    }
  }

  // 🗑 Delete linked login
  const userLogin = await UserLoginSchema.findOne({ linkedId: OrganizerID });
  if (userLogin) {
    await UserLoginSchema.findByIdAndDelete(userLogin._id);
  }

  // 🗑 Delete Organizer record
  await OrganizerData.findByIdAndDelete(OrganizerID);

  res.status(200).json({
    status: "success",
    message: "Officer and related login deleted successfully.",
    data: null,
  });
});

exports.DisplayOrganizer = AsyncErrorHandler(async (req, res) => {
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

    const results = await OrganizerData.aggregate(pipeline);

    const data = results[0].data;
    const totalOrganizer = results[0].totalCount[0]?.count || 0;

    res.status(200).json({
      status: "success",
      data,
      totalOrganizer,
      currentPage: page,
      totalPages: Math.ceil(totalOrganizer / limit),
    });
  } catch (error) {
    console.error("Error fetching Organizer data:", error);
    res.status(500).json({
      status: "fail",
      message: "Something went wrong while fetching Organizer data.",
      error: error.message,
    });
  }
});



exports.DisplayProfile = AsyncErrorHandler(async (req, res) => {
  const loggedInOrganizerId = req.user.linkId;
  const Organizer = await OrganizerData.findById(loggedInOrganizerId);
  if (!Organizer) {
    return res.status(404).json({
      status: "fail",
      message: "Organizer not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: Organizer,
  });
});


exports.updateOrganizer = async (req, res) => {
  const OrganizerID = req.params.id;

  try {
    const organz = await OrganizerData.findById(OrganizerID);
    if (!organz) {
      return res.status(404).json({ error: "organz not found" });
    }

    let avatar = organz.avatar; // Default is the existing avatar object

    // If there's a new image uploaded
    if (req.file) {
      // Delete old image from Cloudinary if it has public_id
      if (organz.avatar?.public_id) {
        try {
          await cloudinary.uploader.destroy(organz.avatar.public_id);
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

    const updateOrganized = await OrganizerData.findByIdAndUpdate(
      OrganizerID,
      {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        middle_name: req.body.middle_name,
        email: req.body.email,
        gender: req.body.gender,
        contact_number: req.body.contact_number,
        avatar, 
      },
      { new: true }
    );

    res.json({ status: "success", data: updateOrganized });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};



