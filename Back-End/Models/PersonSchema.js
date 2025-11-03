const mongoose = require("mongoose");
const SocialLinksSchema = new mongoose.Schema({
  gmail: { type: String, trim: true },
  facebook: { type: String, trim: true },
});

const ContactInfoSchema = new mongoose.Schema({
  landline: { type: String, trim: true },
  mobile: { type: String, trim: true },
});

const UserProfileSchema = new mongoose.Schema(
  {
    avatar: {
      url: String,
      public_id: String,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      trim: true,
    },
    biography: {
      type: String,
      trim: true,
    },
    termFrom: {
      type: Number,
      required: true,
    },
    termTo: {
      type: Number,
      required: true,
    },
    colortheme: {
      type: String,
      default: "bg-gradient-to-r from-blue-800 to-pink-600",
    },
    fontColor: {
      type: String,
      default: "bg-gradient-to-r from-blue-800 to-pink-600",
    },
    socialLinks: SocialLinksSchema,
    contactInfo: ContactInfoSchema,
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserProfile", UserProfileSchema);
