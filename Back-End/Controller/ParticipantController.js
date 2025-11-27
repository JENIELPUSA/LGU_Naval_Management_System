const AsyncErrorHandler = require("../Utils/AsyncErrorHandler");
const ParticipantModel = require("./../Models/Participant");
const sendEmail = require("./../Utils/email");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const mongoose = require("mongoose");
const Types = mongoose.Types;
const path = require("path");
const fs = require('fs');


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

  if (!participant) {
    return res.status(404).json({
      status: "error",
      message: "Participant created but could not be retrieved.",
    });
  }

  res.status(201).json({
    status: "success",
    message: "Participant registered successfully.",
    data: {
      participant: {
        id: participant._id,
        name: `${participant.first_name} ${participant.middle_name || ""} ${participant.last_name}`.trim(),
        email: participant.email,
        event: participant.event?.event_name || "N/A",
        venue: participant.event?.venue || "N/A",
        registrationDate: participant.created_at,
      },
    },
  });
});


exports.ParticipantDisplay = AsyncErrorHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const {
      event_id,
      first_name,
      middle_name,
      last_name,
      extention,
      dateFrom,
      dateTo,
    } = req.query;

    const matchStage = {};

    // Only show NOT archived participants
    matchStage.archived = false;

    // Mandatory event_id filter
    if (event_id) {
      if (mongoose.Types.ObjectId.isValid(event_id)) {
        matchStage.event_id = new mongoose.Types.ObjectId(event_id);
      }
    }

    // Optional filters
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
      { $match: matchStage },
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
                status: 1,
                created_at: 1,
                full_name: 1,
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
  } catch (error) {
    console.error("Error in ParticipantDisplay:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch participants",
      error: error.message,
    });
  }
});

exports.ParticipantArchived = AsyncErrorHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const { event_id, first_name, middle_name, last_name, extention, dateFrom, dateTo } = req.query;

    const matchStage = {
      archived: true // show only archived participants
    };

    if (event_id && mongoose.Types.ObjectId.isValid(event_id)) {
      matchStage.event_id = new mongoose.Types.ObjectId(event_id);
    }

    if (first_name) matchStage.first_name = { $regex: first_name, $options: "i" };
    if (middle_name) matchStage.middle_name = { $regex: middle_name, $options: "i" };
    if (last_name) matchStage.last_name = { $regex: last_name, $options: "i" };

    if (extention && extention.trim() !== "") {
      matchStage.extention = { $regex: extention, $options: "i" };
    } else if (extention === "") {
      matchStage.extention = { $in: [null, ""] };
    }

    if (dateFrom || dateTo) {
      matchStage.created_at = {};
      if (dateFrom) matchStage.created_at.$gte = new Date(dateFrom);
      if (dateTo) {
        const endOfDay = new Date(dateTo);
        endOfDay.setHours(23, 59, 59, 999);
        matchStage.created_at.$lte = endOfDay;
      }
    }

    const result = await ParticipantModel.aggregate([
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
      { $match: matchStage },
      {
        $lookup: {
          from: "events",
          localField: "event_id",
          foreignField: "_id",
          as: "event",
        },
      },
      { $unwind: { path: "$event", preserveNullAndEmptyArrays: true } },
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
                status: 1,
                created_at: 1,
                full_name: 1,
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
      data: participants,
    });
  } catch (error) {
    console.error("Error in ParticipantArchived:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch archived participants",
      error: error.message,
    });
  }
});

exports.UpdateParticipantStatus = AsyncErrorHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Input validation
    if (!["Pending", "Accept", "Reject"].includes(status)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid status value. Allowed: Pending, Accept, Reject",
      });
    }

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid participant ID format",
      });
    }

    // Fetch participant data
    const participant = await ParticipantModel.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
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
          _id: 1, avatar: 1, first_name: 1, middle_name: 1, last_name: 1,
          gender: 1, contact_number: 1, extention: 1, created_at: 1, email: 1,
          "event._id": 1, "event.event_name": 1, "event.venue": 1, 
          "event.description": 1, "event.status": 1, "proposalInfo.title": 1,
        },
      },
    ]);

    if (!participant || participant.length === 0) {
      return res.status(404).json({ status: "fail", message: "Participant not found" });
    }

    const participantData = participant[0];
    await ParticipantModel.findByIdAndUpdate(id, { status });

    // Generate PDF and send email only for accepted participants
    if (status === "Accept") {
      const qrData = `${participantData._id}`;
      const qrImage = await QRCode.toDataURL(qrData, {
        errorCorrectionLevel: "M", type: "image/png", quality: 0.92, margin: 1,
        color: { dark: "#2563eb", light: "#ffffff" }, width: 200,
      });

      const qrBuffer = Buffer.from(qrImage.split(",")[1], "base64");
      if (!qrBuffer || qrBuffer.length === 0) {
        throw new Error("Failed to generate valid QR code buffer");
      }

      // Generate PDF
      const pdfBuffer = await generateRegistrationPDF(participantData, qrBuffer);
      console.log("✅ PDF generated. Size:", pdfBuffer.length, "bytes");

      // Send email with PDF attachment
      await sendEmail({
        email: participantData.email,
        subject: "Event Registration Confirmation",
        text: `Dear ${participantData.first_name},\n\nYour registration for "${participantData.proposalInfo?.title || "Unnamed Event"}" has been ACCEPTED!\n\nPlease find your official registration pass attached.\n\nVenue: ${participantData.event?.venue || "TBA"}\n\nBest regards,\nLGU Event Management Team`,
        attachments: [{
          filename: `Event_Pass_${participantData._id}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        }],
      });
      console.log("✅ PDF generated and email sent for accepted participant");
    }

    res.status(200).json({
      status: "success",
      message: `Participant status updated to ${status}`,
      data: participantData,
    });

  } catch (error) {
    console.error("❌ Error updating participant:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while updating the status",
      error: error.message,
    });
  }
});

async function generateRegistrationPDF(participantData, qrBuffer) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
      });

      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;

      // Modern gradient header
      const gradient = doc.linearGradient(0, 0, pageWidth, 200);
      gradient.stop(0, "#3b82f6").stop(1, "#1d4ed8");
      doc.rect(0, 0, pageWidth, 220).fill(gradient);

      // Decorative wave pattern
      doc.save();
      doc.opacity(0.15);
      doc.moveTo(0, 180)
         .bezierCurveTo(pageWidth / 4, 160, pageWidth / 2, 200, pageWidth, 180)
         .lineTo(pageWidth, 220)
         .lineTo(0, 220)
         .fill("#ffffff");
      doc.restore();

      // Event title section
      doc.fontSize(28)
         .fillColor("#ffffff")
         .font("Helvetica-Bold")
         .text("EVENT REGISTRATION", 50, 60, { align: "left" });

      doc.fontSize(32)
         .fillColor("#fbbf24")
         .font("Helvetica-Bold")
         .text("CONFIRMED", 50, 95, { align: "left" });

      // Event name with modern styling
      const eventTitle = participantData.proposalInfo?.title || "Unnamed Event";
      doc.fontSize(14)
         .fillColor("#e0e7ff")
         .font("Helvetica")
         .text(eventTitle.toUpperCase(), 50, 145, {
           width: pageWidth - 100,
           align: "left",
         });

      // Main content area with card design
      const cardY = 260;
      const cardPadding = 40;

      // Participant info card
      doc.roundedRect(40, cardY, pageWidth - 80, 200, 12)
         .fillAndStroke("#f8fafc", "#e2e8f0");

      // Participant name - prominent
      const fullName = `${participantData.first_name} ${
        participantData.middle_name || ""
      } ${participantData.last_name}${participantData.extention || ""}`.trim();

      doc.fontSize(26)
         .fillColor("#1e293b")
         .font("Helvetica-Bold")
         .text(fullName, cardPadding + 40, cardY + 30, {
           width: pageWidth - 160,
           align: "left",
         });

      // Participant details in modern layout
      let detailY = cardY + 80;

      const details = [
        { icon: "📧", label: "Email", value: participantData.email },
        { icon: "📱", label: "Contact", value: participantData.contact_number },
        { icon: "⚧", label: "Gender", value: participantData.gender },
      ];

      details.forEach((detail, index) => {
        const xPos = cardPadding + 40;
        const yPos = detailY + index * 35;

        doc.fontSize(11)
           .fillColor("#64748b")
           .font("Helvetica")
           .text(detail.label, xPos, yPos);

        doc.fontSize(13)
           .fillColor("#334155")
           .font("Helvetica-Bold")
           .text(detail.value, xPos + 80, yPos);
      });

      // Event details card
      const eventCardY = 500;
      doc.roundedRect(40, eventCardY, pageWidth - 280, 140, 12)
         .fillAndStroke("#fef3c7", "#fbbf24");

      doc.fontSize(12)
         .fillColor("#92400e")
         .font("Helvetica-Bold")
         .text("EVENT DETAILS", 60, eventCardY + 20);

      doc.fontSize(10)
         .fillColor("#78350f")
         .font("Helvetica")
         .text("Venue:", 60, eventCardY + 50);

      doc.fontSize(11)
         .fillColor("#451a03")
         .font("Helvetica-Bold")
         .text(
           participantData.event?.venue || "To be announced",
           60,
           eventCardY + 70,
           { width: pageWidth - 340, align: "left" }
         );

      // QR Code card with modern styling
      const qrCardX = pageWidth - 220;
      doc.roundedRect(qrCardX, eventCardY, 180, 180, 12)
         .fillAndStroke("#ffffff", "#cbd5e1");

      // QR code shadow effect
      doc.save();
      doc.opacity(0.1);
      doc.roundedRect(qrCardX + 3, eventCardY + 3, 180, 180, 12).fill("#000000");
      doc.restore();

      // QR code placement
      doc.image(qrBuffer, qrCardX + 15, eventCardY + 15, {
        width: 150,
        height: 150,
      });

      doc.fontSize(9)
         .fillColor("#64748b")
         .font("Helvetica")
         .text("SCAN TO VERIFY", qrCardX, eventCardY + 175, {
           width: 180,
           align: "center",
         });

      // Instructions section
      const instructY = 670;
      doc.fontSize(11)
         .fillColor("#475569")
         .font("Helvetica-Bold")
         .text("IMPORTANT INSTRUCTIONS", 40, instructY);

      const instructions = [
        "Present this pass at the event venue entrance",
        "QR code must be clearly visible for scanning",
        "Keep this document safe until event completion",
        "Arrive 15 minutes before the scheduled time",
      ];

      doc.fontSize(9)
         .fillColor("#64748b")
         .font("Helvetica");

      instructions.forEach((instruction, index) => {
        doc.circle(50, instructY + 35 + index * 20, 2.5).fill("#3b82f6");
        doc.text(instruction, 65, instructY + 30 + index * 20, {
          width: pageWidth - 100,
        });
      });

      // Modern footer
      doc.rect(0, pageHeight - 60, pageWidth, 60).fill("#1e293b");

      doc.fontSize(8)
         .fillColor("#94a3b8")
         .font("Helvetica")
         .text(
           "LGU Event Management System | Generated on " +
             new Date().toLocaleDateString("en-US", {
               year: "numeric",
               month: "long",
               day: "numeric",
             }),
           0,
           pageHeight - 35,
           { width: pageWidth, align: "center" }
         );

      // Decorative corner elements
      doc.save();
      doc.opacity(0.6);
      doc.circle(pageWidth - 30, pageHeight - 30, 20).fill("#3b82f6");
      doc.circle(30, pageHeight - 30, 15).fill("#fbbf24");
      doc.restore();

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

exports.UpdateParticipant = AsyncErrorHandler(async (req, res) => {
  console.log(req.body);
  try {
    const participant = await ParticipantModel.findById(req.params.id);

    if (!participant) {
      return res
        .status(404)
        .json({ status: "fail", message: "Participant not found" });
    }

    participant.attendance_status = req.body.attendance_status;

    await participant.save();

    const newAttendance = {
      participantId: participant._id,
      name: `${participant.first_name} ${participant.last_name}`,
      action: participant.attendance_status
    };
    const io = req.app.get("io");
    io.emit("newAttendance", newAttendance);

    res.status(200).json({
      status: "success",
      message: `Participant ${participant.attendance_status}`,
      data: participant,
    });
  } catch (error) {
    console.error("❌ Error updating participant:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while updating the participant",
      error: error.message,
    });
  }
});

exports.UpdateParticipantArchive = AsyncErrorHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { archived } = req.body;
    // Validate boolean input
    if (typeof archived !== "boolean") {
      return res.status(400).json({
        status: "fail",
        message: "Invalid archived value. Must be true or false.",
      });
    }

    // Find participant
    const participant = await ParticipantModel.findById(id);

    if (!participant) {
      return res.status(404).json({
        status: "fail",
        message: "Participant not found",
      });
    }

    // Update archived field
    participant.archived = archived;
    await participant.save();

    res.status(200).json({
      status: "success",
      message: `Participant archive status updated to ${archived}`,
      data: participant,
    });
  } catch (error) {
    console.error("❌ Error updating archive:", error.message);
    res.status(500).json({
      status: "error",
      message: "An error occurred while updating archive status",
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

    // Optional filter para sa organizer
    let createdByFilter = {};
    if (role === "organizer" && mongoose.Types.ObjectId.isValid(userId)) {
      createdByFilter["eventDetails.created_by"] = new mongoose.Types.ObjectId(userId);
    }

    const pipeline = [
      // Group participants by event_id
      {
        $group: {
          _id: "$event_id",
          totalParticipants: { $sum: 1 },
        },
      },
      // Join with events
      {
        $lookup: {
          from: "events",
          localField: "_id",
          foreignField: "_id",
          as: "eventDetails",
        },
      },
      {
        $unwind: { path: "$eventDetails", preserveNullAndEmptyArrays: true },
      },

      // Apply organizer filter if needed
      ...(Object.keys(createdByFilter).length > 0 ? [{ $match: createdByFilter }] : []),

      // Join with proposals
      {
        $lookup: {
          from: "proposals",
          localField: "eventDetails.proposalId",
          foreignField: "_id",
          as: "proposalInfo",
        },
      },
      { $unwind: { path: "$proposalInfo", preserveNullAndEmptyArrays: true } },

      // Only approved proposals
      {
        $match: {
          "proposalInfo.status": "approved",
        },
      },

      // Project final fields
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
          isUpcoming: { $gt: ["$eventDetails.eventDate", currentDate] },
        },
      },

      { $sort: { eventDate: -1 } },
    ];

    const result = await ParticipantModel.aggregate(pipeline);
    const totalUpcoming = result.filter((event) => event.isUpcoming).length;

    res.status(200).json({
      status: "success",
      totalUpcoming,
      data: result.length > 0 ? result : [],
    });
  } catch (error) {
    console.error("Error getting participants count per event:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
