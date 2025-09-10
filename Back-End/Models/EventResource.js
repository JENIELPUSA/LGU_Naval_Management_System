const mongoose = require("mongoose");

const eventResourceSchema = new mongoose.Schema({
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  resource_id: { type: mongoose.Schema.Types.ObjectId, ref: "Resource" },
});

module.exports = mongoose.model("EventResource", eventResourceSchema);
