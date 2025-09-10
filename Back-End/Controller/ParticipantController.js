const AsyncErrorHandler = require("../Utils/AsyncErrorHandler");
const ParticipantModel = require("./../Models/Participant");
const sendEmail = require("./../Utils/email");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");

exports.participantCreate = AsyncErrorHandler(async (req, res) => {
  const inserted = await ParticipantModel.create(req.body);

  const eventWithOrganizer = await ParticipantModel.aggregate([
    { $match: { _id: inserted._id } },
    {
      $lookup: {
        from: "events",
        localField: "event_id",
        foreignField: "_id",
        as: "event",
      },
    },
    { $unwind: { path: "$event", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "proposals",
        localField: "event.proposalId",
        foreignField: "_id",
        as: "proposalInfo",
      },
    },
    { $unwind: { path: "$proposalInfo", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        avatar: 1,
        first_name: 1,
        middle_name: 1,
        last_name: 1,
        gender: 1,
        contact_number: 1,
        extention: 1,
        created_at: 1,
        email: 1,
        "event._id": 1,
        "event.event_name": 1,
        "event.venue": 1,
        "event.description": 1,
        "event.status": 1,
        "proposalInfo.title": 1,
      },
    },
  ]);

  const participant = eventWithOrganizer[0];

  // 🔹 Generate QR Code
  const qrData = `${participant._id}`;
  const qrImage = await QRCode.toDataURL(qrData, {
    errorCorrectionLevel: "M",
    type: "image/png",
    quality: 0.92,
    margin: 1,
    color: {
      dark: "#2563eb", // Blue color for QR code
      light: "#ffffff",
    },
    width: 200,
  });

  // 🔹 Generate Professional PDF
  const pdfBuffer = await new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 60, bottom: 60, left: 60, right: 60 },
    });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    // Define colors
    const primaryColor = "#2563eb"; // Blue
    const secondaryColor = "#1e40af"; // Darker blue
    const textColor = "#374151"; // Dark gray
    const lightGray = "#f3f4f6"; // Light gray background

    // Header Section with Background
    doc.rect(0, 0, doc.page.width, 120).fill(primaryColor);

    // Company/Event Logo Area (placeholder)
    doc.circle(80, 60, 25).fill("#ffffff");

    doc.fontSize(12).fillColor("#2563eb").text("LOGO", 68, 55);

    // Main Title
    doc
      .fontSize(28)
      .fillColor("#ffffff")
      .font("Helvetica-Bold")
      .text("EVENT REGISTRATION PASS", 120, 40, { align: "left" });

    // Subtitle
    doc
      .fontSize(14)
      .fillColor("#e5e7eb")
      .font("Helvetica")
      .text("Official Participant Certificate", 120, 75);

    // Reset position after header
    doc.y = 160;

    // Event Information Section
    doc
      .fontSize(18)
      .fillColor(secondaryColor)
      .font("Helvetica-Bold")
      .text("EVENT DETAILS", { align: "left" });

    doc.moveDown(0.5);

    // Event details with better formatting
    doc.fontSize(12).fillColor(textColor).font("Helvetica");

    // Event name with styling
    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .fillColor(primaryColor)
      .text(`${participant.event.event_name || "Event Name Not Available"}`, {
        align: "left",
      });

    doc.moveDown(0.3);

    // Venue
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor(textColor)
      .text("Venue: ", { continued: true })
      .font("Helvetica")
      .text(`${participant.event.venue || "Venue TBA"}`);

    // Proposal/Program Title
    if (participant.proposalInfo?.title) {
      doc
        .font("Helvetica-Bold")
        .text("Program: ", { continued: true })
        .font("Helvetica")
        .text(`${participant.proposalInfo.title}`);
    }

    // Registration Date
    doc
      .font("Helvetica-Bold")
      .text("Registration Date: ", { continued: true })
      .font("Helvetica")
      .text(
        new Date(participant.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );

    doc.moveDown(1.5);

    // Participant Information Section
    doc
      .fontSize(18)
      .fillColor(secondaryColor)
      .font("Helvetica-Bold")
      .text("PARTICIPANT INFORMATION");

    doc.moveDown(0.5);

    // Create a box for participant info
    const infoBoxY = doc.y;
    doc
      .rect(50, infoBoxY - 10, doc.page.width - 120, 120)
      .fillAndStroke(lightGray, "#d1d5db");

    doc.y = infoBoxY;

    // Participant details with better spacing
    doc.fontSize(12).fillColor(textColor).font("Helvetica");

    const participantName = `${participant.first_name} ${
      participant.middle_name || ""
    } ${participant.last_name}`.trim();

    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .fillColor(primaryColor)
      .text(`${participantName}`, 70, doc.y + 10);

    doc
      .fontSize(12)
      .fillColor(textColor)
      .font("Helvetica-Bold")
      .text("Email: ", 70, doc.y + 35, { continued: true })
      .font("Helvetica")
      .text(`${participant.email}`);

    doc
      .font("Helvetica-Bold")
      .text("Contact: ", 70, doc.y + 15, { continued: true })
      .font("Helvetica")
      .text(
        `${participant.contact_number}${
          participant.extention ? ` ext. ${participant.extention}` : ""
        }`
      );

    doc
      .font("Helvetica-Bold")
      .text("Gender: ", 70, doc.y + 15, { continued: true })
      .font("Helvetica")
      .text(`${participant.gender || "Not specified"}`);

    doc
      .font("Helvetica-Bold")
      .text("Participant ID: ", 70, doc.y + 15, { continued: true })
      .font("Helvetica")
      .text(`${participant._id}`);

    // QR Code Section
    doc.y = infoBoxY + 140;
    doc
      .fontSize(16)
      .fillColor(secondaryColor)
      .font("Helvetica-Bold")
      .text("VERIFICATION QR CODE", { align: "center" });

    doc.moveDown(0.5);

    // QR Code with border
    const qrBuffer = Buffer.from(qrImage.split(",")[1], "base64");
    const qrX = (doc.page.width - 160) / 2;
    const qrY = doc.y;

    doc
      .rect(qrX - 10, qrY - 10, 180, 180)
      .fillAndStroke("#ffffff", primaryColor);

    doc.image(qrBuffer, qrX, qrY, { fit: [160, 160] });
    doc.y = qrY + 190;
    doc
      .fontSize(10)
      .fillColor(textColor)
      .font("Helvetica")
      .text("Scan this QR code for event check-in verification", {
        align: "center",
      });
    doc.y = doc.page.height - 120;

    doc
      .moveTo(50, doc.y)
      .lineTo(doc.page.width - 50, doc.y)
      .stroke(primaryColor);

    doc.moveDown(0.5);

    doc
      .fontSize(10)
      .fillColor("#6b7280")
      .font("Helvetica")
      .text(
        "This is an official event registration pass. Please present this document at the event entrance.",
        { align: "center" }
      );

    doc.text("For inquiries, please contact the event organizers.", {
      align: "center",
    });
    doc.fontSize(8).text(`Generated on: ${new Date().toLocaleString()}`, {
      align: "center",
    });

    doc.end();
  });

  try {
    const participantName = `${participant.first_name} ${
      participant.middle_name || ""
    } ${participant.last_name}`.trim();

    await sendEmail({
      email: participant.email,
      subject: `Event Registration Confirmation - ${participant.event.event_name}`,
      message: `Dear ${participant.first_name},

Thank you for registering for "${participant.event.event_name}".

Your registration has been confirmed and your official event pass is attached to this email. Please:

✓ Save this PDF to your device
✓ Print a copy or save it to your phone
✓ Present it at the event entrance for check-in

Event Details:
• Event: ${participant.event.event_name}
• Venue: ${participant.event.venue || "Venue TBA"}
• Registration ID: ${participant._id}

We look forward to seeing you at the event!

Best regards,
Event Management Team`,
      attachments: [
        {
          filename: `Event_Pass_${participantName.replace(/\s+/g, "_")}_${
            participant._id
          }.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });
    console.log("📩 Professional email sent with PDF attachment ✅");
  } catch (err) {
    console.error("❌ Error sending email:", err);
  }

  // 🔹 Respond to API
  res.status(201).json({
    status: "success",
    message:
      "Participant registered successfully. Registration pass sent via email.",
    data: {
      participant: {
        id: participant._id,
        name: `${participant.first_name} ${participant.middle_name || ""} ${
          participant.last_name
        }`.trim(),
        email: participant.email,
        event: participant.event.event_name,
        venue: participant.event.venue,
        registrationDate: participant.created_at,
      },
    },
  });
});

exports.ParticipantDisplay = AsyncErrorHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const { search, first_name, middle_name, last_name, extention, dateFrom, dateTo } = req.query;

  const matchStage = {};

  // Optional individual filters
  if (first_name) {
    matchStage.first_name = { $regex: first_name, $options: "i" };
  }

  if (middle_name) {
    matchStage.middle_name = { $regex: middle_name, $options: "i" };
  }

  if (last_name) {
    matchStage.last_name = { $regex: last_name, $options: "i" };
  }

  if (extention && extention.trim() !== "") {
    matchStage.extention = { $regex: extention, $options: "i" };
  } else if (extention === "") {
    matchStage.extention = { $in: [null, ""] };
  }

  if (dateFrom || dateTo) {
    matchStage.created_at = {};
    if (dateFrom) {
      matchStage.created_at.$gte = new Date(dateFrom);
    }
    if (dateTo) {
      const endOfDay = new Date(dateTo);
      endOfDay.setHours(23, 59, 59, 999);
      matchStage.created_at.$lte = endOfDay;
    }
  }

  const result = await ParticipantModel.aggregate([
    // ✅ Combine full_name for search
    {
      $addFields: {
        full_name: {
          $trim: {
            input: {
              $replaceAll: {
                input: {
                  $concat: [
                    { $ifNull: ["$first_name", ""] },
                    " ",
                    { $ifNull: ["$middle_name", ""] },
                    " ",
                    { $ifNull: ["$last_name", ""] },
                    " ",
                    { $ifNull: ["$extention", ""] },
                  ],
                },
                find: "  ",
                replacement: " ",
              },
            },
          },
        },
      },
    },
    {
      $match: {
        ...matchStage,
        ...(search?.trim()
          ? {
              full_name: { $regex: new RegExp(search.trim(), "i") },
            }
          : {}),
      },
    },
    {
      $lookup: {
        from: "events",
        localField: "event_id",
        foreignField: "_id",
        as: "event",
      },
    },
    {
      $unwind: {
        path: "$event",
        preserveNullAndEmptyArrays: true,
      },
    },
    { $sort: { created_at: -1 } },
    {
      $facet: {
        data: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 1,
              avatar: 1,
              title: 1,
              first_name: 1,
              middle_name: 1,
              last_name: 1,
              extention: 1,
              email: 1,
              address: 1,
              check_in: 1,
              check_out: 1,
              gender: 1,
              contact_number: 1,
              created_at: 1,
              full_name: 1, // ✅ para accessible sa frontend
              "event._id": 1,
              "event.event_name": 1,
              "event.venue": 1,
              "event.description": 1,
              "event.status": 1,
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  const participants = result[0].data || [];
  const totalCount = result[0].totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  res.status(200).json({
    status: "success",
    currentPage: page,
    totalPages,
    totalCount,
    results: participants.length,
    data: participants.length > 0 ? participants : [],
  });
});

exports.UpdateParticipant = AsyncErrorHandler(async (req, res, next) => {
  try {
    const participant = await ParticipantModel.findById(req.params.id);
    if (!participant) {
      return res.status(404).json({
        status: "fail",
        message: "Participant not found",
      });
    }

    const currentTimestamp = req.body.timestamp
      ? new Date(req.body.timestamp)
      : new Date();

    // Kung parehong check_in at check_out ay may laman
    if (participant.check_in && participant.check_out) {
      return res.status(400).json({
        status: "warning",
        message:
          "Participant already checked in and checked out. Cannot scan again.",
      });
    }

    // Kung may check_in pero walang check_out
    if (participant.check_in && !participant.check_out) {
      const checkInTime = new Date(participant.check_in);
      const diffInMs = currentTimestamp - checkInTime;
      const diffInHours = diffInMs / (1000 * 60 * 60);

      if (diffInHours >= 1) {
        // Lampas 1 hour → magiging check_out
        req.body.check_out = currentTimestamp;
        delete req.body.check_in;
      } else {
        // Wala pang 1 hour → manatili sa check_in
        req.body.check_in = participant.check_in;
        delete req.body.check_out;
      }
    } else if (!participant.check_in) {
      // Wala pang check_in → first check_in
      req.body.check_in = currentTimestamp;
    }

    const updated = await ParticipantModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // Return info kung check_in o check_out
    const statusMessage = updated.check_out ? "Checked out" : "Checked in";

    const newAttendance = {
      participantId: updated._id,
      name: updated.name, // kung may name field
      action: updated.check_out ? "check_out" : "check_in",
      timestamp: currentTimestamp,
    };
    const io = req.app.get("io");
    io.emit("newAttendance", newAttendance);

    res.status(200).json({
      status: "success",
      message: statusMessage,
      data: updated,
    });
  } catch (error) {
    console.error("Error updating participant:", error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong while updating the participant",
      error: error.message,
    });
  }
});

exports.deleteParticipant = AsyncErrorHandler(async (req, res, next) => {
  const hasCategory = await ParticipantModel.exists({
    Category: req.params.id,
  });
  if (hasCategory) {
    return res.status(400).json({
      status: "fail",
      message: "Cannot delete Category: there are existing related records.",
    });
  }
  await ParticipantModel.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    data: null,
  });
});

exports.getParticipantsCountPerEvent = async (req, res) => {
  const role = req.user.role;
  const userId = req.user.linkId; 

  try {
    const currentDate = new Date(); 

    const pipeline = [
      {
        $group: {
          _id: "$event_id", 
          totalParticipants: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "events",
          localField: "_id",
          foreignField: "_id",
          as: "eventDetails",
        },
      },
      { $unwind: { path: "$eventDetails", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "proposals",
          localField: "eventDetails.proposalId",
          foreignField: "_id",
          as: "proposalInfo",
        },
      },
      { $unwind: { path: "$proposalInfo", preserveNullAndEmptyArrays: true } },
      {
        $match: {
          "proposalInfo.status": "approved",
          "eventDetails.eventDate": { $lte: currentDate }, // <-- dito lang nag-filter
        },
      },
      ...(role === "organizer" ? [{ $match: { "eventDetails.created_by": userId } }] : []),
      {
        $project: {
          _id: 0,
          event_id: "$_id",
          totalParticipants: 1,
          eventName: "$proposalInfo.title",
          description: "$proposalInfo.description",
          status: "$proposalInfo.status",
          eventDate: "$eventDetails.eventDate",
          venue: "$eventDetails.venue",
          created_by: "$eventDetails.created_by",
        },
      },
      {
        $sort: { eventDate: 1 } // pinaka-latest muna
      }
    ];

    const result = await ParticipantModel.aggregate(pipeline);

    res.status(200).json({
      status: "success",
      data: result.length > 0 ? result : null,
    });

  } catch (error) {
    console.error("Error getting participants count per event:", error);
    res.status(500).json({ message: "Server Error" });
  }
};




