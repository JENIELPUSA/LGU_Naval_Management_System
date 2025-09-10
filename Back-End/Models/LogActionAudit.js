const mongoose = require("mongoose");

const ActivityLogSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "CREATE",
        "UPDATE",
        "DELETE",
        "LOGIN",
        "LOGOUT",
        "REVIEW",
        "APPROVE",
        "REJECTED",
      ],
      required: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "performedByModel",
    },
    performedByModel: {
      type: String,
      required: true,
      enum: ["Admin", "Organizer","Staff"],
    },
    beforeChange: {
      type: Object,
    },
    afterChange: {
      type: Object,
    },
    level: {
      type: String,
      enum: ["info", "warning", "error"],
      default: "info",
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ActivityLog", ActivityLogSchema);
