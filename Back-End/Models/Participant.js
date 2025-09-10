const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  address: { type: String },
  contact_number: String,
  email: String,
  check_in: { type: Date, default: null },
  check_out: { type: Date, default: null },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Participant", participantSchema);
