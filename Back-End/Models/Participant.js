const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema(
  {
    event_id: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    address: { type: String },
    contact_number: String,
    email: String,
    status: {
      type: String,
      enum: ["Pending", "Accept", "Reject"],
      default: "Pending",
    },

    check_in: { type: Date, default: null },
    check_out: { type: Date, default: null },
    archived: {
      type: Boolean,
      default: false, 
    },
    attendance_status: {
      type: String,
      enum: ["Not Checked In", "Check-In", "Check-Out"],
      default: "Not Checked In",
    },
    attendance_log: [
      {
        action: { type: String, enum: ["Check-In", "Check-Out"] },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Middleware for Auto Check-In / Check-Out
participantSchema.pre("save", function (next) {
  try {
    console.log(
      "🔁 Participant Middleware Triggered | Status:",
      this.attendance_status
    );

    // Case 1: Check-In
    if (this.attendance_status === "Check-In" && !this.check_in) {
      this.check_in = new Date();
      this.attendance_log.push({ action: "Check-In" });
      console.log("🟢 Auto Check-In applied");
    }

    // Case 2: Check-Out
    if (this.attendance_status === "Check-Out") {
      if (!this.check_in) {
        this.check_in = new Date();
        this.attendance_log.push({ action: "Check-In" });
        console.log("⚠️ No Check-In found — Auto Check-In added");
      }

      if (!this.check_out) {
        this.check_out = new Date();
        this.attendance_log.push({ action: "Check-Out" });
        console.log("🔵 Check-Out recorded");
      }
    }

    next();
  } catch (error) {
    console.error("❌ Error in participantSchema pre-save middleware:", error);
    next(error);
  }
});

module.exports = mongoose.model("Participant", participantSchema);
