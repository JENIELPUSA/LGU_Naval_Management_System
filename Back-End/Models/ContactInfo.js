const mongoose = require("mongoose");

const OfficeHoursSchema = new mongoose.Schema({
  day: { type: String, required: true }, // e.g., "Mon-Thu"
  open: { type: String }, // e.g., "8:00 AM", optional kung closed
  close: { type: String }, // e.g., "5:00 PM", optional kung closed
});

const ContactInfoSchema = new mongoose.Schema(
  {
    officeName: {
      type: String,
    },
    city: { type: String, default: "Biliran" },
    postalCode: { type: String, default: "1234" },
    phones: [
      { type: String },
    ],
    hotlines: [
      { type: String },
    ],
    emails: [
      { type: String },
    ],
    officeHours: [OfficeHoursSchema],
  },
  { timestamps: true }
);

const ContactInfo = mongoose.model("ContactInfo", ContactInfoSchema);

module.exports = ContactInfo;
