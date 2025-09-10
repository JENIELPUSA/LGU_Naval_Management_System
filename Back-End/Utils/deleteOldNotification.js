const Event = require("../Models/Event");
const Participant = require("../Models/Participant");
const sendEmail = require("./email");

const getEmailsOfPastEventParticipants = async () => {
  try {
    const now = new Date();

    // 1. Get all past events na hindi pa na-sesend
    const pastEvents = await Event.find({ 
      eventDate: { $lt: now },
      alreadysend: false
    }).select("_id event_name");

    if (pastEvents.length === 0) {
      console.log("⚠️ No past events found that need emails.");
      return [];
    }

    const pastEventIds = pastEvents.map(event => event._id);

    // 2. Get participants for past events
    const participantsWithEvent = await Participant.aggregate([
      { $match: { event_id: { $in: pastEventIds } } },
      {
        $lookup: {
          from: "events",
          localField: "event_id",
          foreignField: "_id",
          as: "event"
        }
      },
      { $unwind: "$event" },
      { 
        $project: { 
          email: 1, 
          "event.event_name": 1,
          "event._id": 1
        } 
      }
    ]);

    if (participantsWithEvent.length === 0) {
      console.log("⚠️ No participants found for past events.");
      return [];
    }

    // 3. Send emails
    for (const participant of participantsWithEvent) {
      if (!participant.email) continue;

      const pageUrl = `${process.env.FRONTEND_URL}/review/${participant.event._id}`;

      await sendEmail({
        email: participant.email,
        subject: `Event Registration Confirmation - ${participant.event.event_name}`,
        text: `Mag-iwan ng Review patungkol sa aming Event na Ginanap kahapon: ${pageUrl}`
      });
    }

    console.log(`✅ Sent emails to ${participantsWithEvent.length} participants.`);

    await Event.updateMany(
      { _id: { $in: pastEventIds } },
      { $set: { alreadysend: true } }
    );

    console.log(`🔄 Updated ${pastEventIds.length} events to alreadysend: true`);

    // 5. Return info
    return participantsWithEvent.map(p => ({
      email: p.email,
      eventId: p.event._id,
      eventName: p.event.event_name
    }));

  } catch (error) {
    console.error("Error fetching emails for past events:", error);
    return [];
  }
};

module.exports = getEmailsOfPastEventParticipants;
