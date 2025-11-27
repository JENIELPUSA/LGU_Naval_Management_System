const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventDate: { type: Date, required: true },
  startTime: { type: String },
  endTime: { type: String },
  registerUrl: { type: String },
  alreadysend: {
    type: Boolean,
    default: false,
  },
  venue: { type: String, required: true },
  capacity: { type: Number, required: true },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organizer",
    required: true,
  },
  proposalId: { type: mongoose.Schema.Types.ObjectId, ref: "Proposal" },
  resources: [{ type: mongoose.Schema.Types.ObjectId, ref: "Resource" }],
  lgu: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lgu" }],
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Event", eventSchema);
