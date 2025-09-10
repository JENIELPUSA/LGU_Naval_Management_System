const mongoose = require("mongoose");

const proposalSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  fileUrl: {
    type: String,
    default: null,
  },
  fileName: {
    type: String,
    default: null,
  },
  remarks: String,
  submitted_by: { type: mongoose.Schema.Types.ObjectId, ref: "Organizer" },
  assigned: {
    type: Boolean,
    default: false,
  },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Proposal", proposalSchema);
