const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  resource_name: String,
  resource_type: {
    type: String,
    enum: ['venue', 'equipment', 'personnel'],
  },
  description: String,
  availability: { type: Boolean, default: true },
});

module.exports = mongoose.model("Resource", resourceSchema);
