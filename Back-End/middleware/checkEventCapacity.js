const EventModel = require("../Models/Event");
const ParticipantModel = require("../Models/Participant");
const AsyncErrorHandler = require("../Utils/AsyncErrorHandler"); // siguraduhing tama ang path

const checkEventCapacity = AsyncErrorHandler(async (req, res, next) => {
    const { event_id } = req.body;

    if (!event_id) {
        return res.status(400).json({ status: "fail", message: "Event ID is required" });
    }

    // Hanapin ang event
    const event = await EventModel.findById(event_id);
    if (!event) {
        return res.status(404).json({ status: "fail", message: "Event not found" });
    }

    // Count current participants
    const currentCount = await ParticipantModel.countDocuments({ event_id });

    // Check capacity
    if (currentCount >= event.capacity) {
        return res.status(400).json({
            status: "fail",
            message: "Event is full. Cannot add more participants.",
        });
    }

    // Pass event info kung gusto mo gamitin sa controller
    req.event = event;

    next();
});

module.exports = checkEventCapacity;
