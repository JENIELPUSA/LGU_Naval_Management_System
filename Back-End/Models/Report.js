const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  userName: {
    type: String,
    unique: true,
    default: function () {
      // Auto generate username gaya ng USER_xxxxx
      return "USER_" + Math.random().toString(36).substring(2, 8).toUpperCase();
    }
  },
  feedback: String,
  rating: { type: Number, min: 1, max: 5 },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Report", reportSchema);
