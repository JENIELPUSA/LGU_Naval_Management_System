const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema(
  {
    event_id: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    address: { type: String },
    contact_number: String,
    email: String,
    check_in: { type: Date, default: null },
    check_out: { type: Date, default: null },
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

// ✅ Middleware with try/catch + consistent logic
participantSchema.pre("save", function (next) {
  try {
    console.log("🔁 Participant Middleware Triggered | Status:", this.attendance_status);

    // Case 1: Check-In
    if (this.attendance_status === "Check-In" && !this.check_in) {
      this.check_in = new Date();
      this.attendance_log.push({ action: "Check-In" });
      console.log("🟢 Auto Check-In applied");
    }

    // Case 2: Check-Out
    if (this.attendance_status === "Check-Out") {
      // If no check-in yet, auto add one first
      if (!this.check_in) {
        this.check_in = new Date();
        this.attendance_log.push({ action: "Check-In" });
        console.log("⚠️ No Check-In found — Auto Check-In added");
      }

      // Then set Check-Out if not yet recorded
      if (!this.check_out) {
        this.check_out = new Date();
        this.attendance_log.push({ action: "Check-Out" });
        console.log("🔵 Check-Out recorded");
      }
    }

    next();
  } catch (error) {
    console.error("❌ Error in participantSchema pre-save middleware:", error);
    next(error); // Pass error to Mongoose error handler
  }
});

module.exports = mongoose.model("Participant", participantSchema);
