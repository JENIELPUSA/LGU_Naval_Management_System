const AsyncErrorHandler = require("../Utils/AsyncErrorHandler");
const ContactInfo = require("../Models/ContactInfo");

exports.addContactInfo = AsyncErrorHandler(async (req, res) => {
  try {
    const {
      officeName,
      city,
      postalCode,
      phones,
      hotlines,
      emails,
      officeHours,
    } = req.body;
    if (
      !officeName ||
      !city ||
      !emails ||
      !Array.isArray(emails) ||
      emails.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide at least office name, city, and one valid email address.",
      });
    }

    // Remove existing contact info before adding new one (if this is intended)
    await ContactInfo.deleteMany();

    // Create new contact entry
    const newContact = await ContactInfo.create({
      officeName,
      city,
      postalCode,
      phones,
      hotlines,
      emails,
      officeHours,
    });

    return res.status(201).json({
      success: "success",
      message: "Contact information added successfully.",
      data: newContact,
    });
  } catch (error) {
    console.error("Error adding contact info:", error.message);

    // Catch handled errors and send proper response
    return res.status(500).json({
      success: false,
      message: "Failed to add contact information.",
      error: error.message,
    });
  }
});

exports.getContactInfo = AsyncErrorHandler(async (req, res) => {
  try {
    const contact = await ContactInfo.findOne().sort({ createdAt: -1 });
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "No contact information found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error("Error fetching contact info:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch contact information.",
      error: error.message,
    });
  }
});
