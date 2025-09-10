const mongoose = require("mongoose");
const LGUSchemaResponse = new mongoose.Schema({
  lguDataID: { type: mongoose.Schema.Types.ObjectId, ref: "Lgu" },
  eventID: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  note: String,
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LguResponse", LGUSchemaResponse);
