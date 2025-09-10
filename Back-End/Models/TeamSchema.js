const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  teamName: String,
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Team", teamSchema);
