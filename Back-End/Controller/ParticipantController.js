const AsyncErrorHandler = require("../Utils/AsyncErrorHandler");
const ParticipantModel = require("./../Models/Participant");
const sendEmail = require("./../Utils/email");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const mongoose = require("mongoose");

exports.participantCreate = AsyncErrorHandler(async (req, res) => {
  try {
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

    const qrData = `${participant._id}`;
    const qrImage = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: "M",
      type: "image/png",
      quality: 0.92,
      margin: 1,
      color: { dark: "#2563eb", light: "#ffffff" },
      width: 200,
    });

    const pdfBuffer = await new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 60, bottom: 60, left: 60, right: 60 },
      });
      const buffers = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      const primaryColor = "#2563eb";
      const secondaryColor = "#1e40af";
      const textColor = "#374151";
      const lightGray = "#f3f4f6";

      // Header
      doc.rect(0, 0, doc.page.width, 120).fill(primaryColor);
      doc.circle(80, 60, 25).fill("#ffffff");
      doc.fontSize(12).fillColor(primaryColor).text("LOGO", 68, 55);
      doc
        .fontSize(28)
        .fillColor("#ffffff")
        .font("Helvetica-Bold")
        .text("EVENT REGISTRATION PASS", 120, 40);
      doc
        .fontSize(14)
        .fillColor("#e5e7eb")
        .text("Official Participant Certificate", 120, 75);

      doc.y = 160;

      // Event Info
      doc
        .fontSize(18)
        .fillColor(secondaryColor)
        .font("Helvetica-Bold")
        .text("EVENT DETAILS");
      doc.moveDown(0.5);
      doc.fontSize(12).fillColor(textColor);
      doc
        .font("Helvetica-Bold")
        .fontSize(16)
        .fillColor(primaryColor)
        .text(participant.event?.event_name || "Event Name Not Available");
      doc.moveDown(0.3);
      doc
        .font("Helvetica-Bold")
        .text("Venue: ", { continued: true })
        .font("Helvetica")
        .text(participant.event?.venue || "Venue TBA");
      if (participant.proposalInfo?.title) {
        doc.moveDown(0.3);
        doc
          .font("Helvetica-Bold")
          .text("Program: ", { continued: true })
          .font("Helvetica")
          .text(participant.proposalInfo.title);
      }
      doc.moveDown(0.3);
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

      // Participant Info
      doc
        .fontSize(18)
        .fillColor(secondaryColor)
        .font("Helvetica-Bold")
        .text("PARTICIPANT INFORMATION");
      doc.moveDown(0.5);

      const infoBoxY = doc.y;
      doc
        .rect(50, infoBoxY - 10, doc.page.width - 120, 120)
        .fillAndStroke(lightGray, "#d1d5db");

      doc.y = infoBoxY;

      const participantName = `${participant.first_name} ${
        participant.middle_name || ""
      } ${participant.last_name}`.trim();

      doc
        .font("Helvetica-Bold")
        .fontSize(16)
        .fillColor(primaryColor)
        .text(participantName, 70, doc.y + 10);
      doc.y += 25;
      doc
        .font("Helvetica-Bold")
        .text("Email: ", { continued: true })
        .font("Helvetica")
        .text(participant.email);
      doc.y += 15;
      doc
        .font("Helvetica-Bold")
        .text("Contact: ", { continued: true })
        .font("Helvetica")
        .text(
          `${participant.contact_number}${
            participant.extention ? ` ext. ${participant.extention}` : ""
          }`
        );
      doc.y += 15;
      doc
        .font("Helvetica-Bold")
        .text("Gender: ", { continued: true })
        .font("Helvetica")
        .text(participant.gender || "Not specified");
      doc.y += 15;
      doc
        .font("Helvetica-Bold")
        .text("Participant ID: ", { continued: true })
        .font("Helvetica")
        .text(participant._id.toString());

      // QR Code
      doc.y = infoBoxY + 140;
      doc
        .fontSize(16)
        .fillColor(secondaryColor)
        .font("Helvetica-Bold")
        .text("VERIFICATION QR CODE", { align: "center" });
      doc.moveDown(0.5);
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
        .text("Scan this QR code for event check-in verification", {
          align: "center",
        });

      // Footer
      doc.y = doc.page.height - 120;
      doc
        .moveTo(50, doc.y)
        .lineTo(doc.page.width - 50, doc.y)
        .stroke(primaryColor);
      doc.moveDown(0.5);
      doc
        .fontSize(10)
        .fillColor("#6b7280")
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

    console.log("participant", participant);

    await sendEmail({
      email: participant.email,
      subject: "Event Registration Confirmation",
      text: `
    Dear ${participant.first_name},

    Thank you for registering for the event "${
      participant.proposalInfo?.title || "Unnamed Event"
    }".
    Please find your official registration pass attached as a PDF file.
    
    We look forward to seeing you at the venue:
    ${participant.event?.venue || "TBA"}.

    Best regards,
    LGU Event Management Team
  `,
      attachments: [
        {
          filename: `Event_Pass_${participant._id}.pdf`,
          content: pdfBuffer, // <-- direct buffer from PDFDocument
          contentType: "application/pdf",
        },
      ],
    });

    res.status(201).json({
      status: "success",
      message: "Participant registered successfully.",
      data: {
        participant: {
          id: participant._id,
          name: `${participant.first_name} ${participant.middle_name || ""} ${
            participant.last_name
          }`.trim(),
          email: participant.email,
          event: participant.event?.event_name || "N/A",
          venue: participant.event?.venue || "N/A",
          registrationDate: participant.created_at,
        },
        pdfBase64: pdfBuffer.toString("base64"),
      },
    });
  } catch (err) {
    console.error("❌ Error creating participant:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to register participant. Please try again.",
      error: err.message,
    });
  }
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

    // Mandatory event_id filter
    if (event_id) {
      // Convert to ObjectId
      if (mongoose.Types.ObjectId.isValid(event_id)) {
        matchStage.event_id = new mongoose.Types.ObjectId(event_id);
      }
    }

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
      { $unwind: { path: "$eventDetails", preserveNullAndEmptyArrays: true } },

      // Optional: filter for organizer role
      ...(role === "organizer"
        ? [{ $match: { "eventDetails.created_by": mongoose.Types.ObjectId(userId) } }]
        : []),

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

      // Only include approved proposals and past/future events if needed
      {
        $match: {
          "proposalInfo.status": "approved",
          // If you want only past events, uncomment:
          // "eventDetails.eventDate": { $lte: currentDate }
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
        },
      },

      { $sort: { eventDate: -1 } }, // latest first
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
    res.status(500).json({ message: "Server Error" });
  }
};
