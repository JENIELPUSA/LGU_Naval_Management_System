const AsyncErrorHandler = require("../Utils/AsyncErrorHandler");
const LGU = require("../Models/LGUSchema");
const mongoose = require("mongoose");
const cloudinary = require("../Utils/cloudinary");
const sendEmail = require("../Utils/email");
const Team = require("../Models/TeamSchema");
const UserLoginSchema = require("../Models/LogInSchema");

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

