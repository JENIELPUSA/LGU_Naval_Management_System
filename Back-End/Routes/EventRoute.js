const express = require('express');
const router = express.Router();//express router
const Event=require('./../Controller/EventController')
const authController = require('./../Controller/authController')

router.route('/')
    .post(authController.protect,Event.createEvent)
    .get(authController.protect,Event.DisplayEvent)

router.route('/:id')
    .patch(authController.protect,Event.UpdateEvent)
    .delete(authController.protect,Event.deleteEvent)

router.route('/EventDropdown')
    .get(authController.protect,Event.DisplayDropdownEvent)

router.route('/getEventsWithParticipants')
    .get(authController.protect,Event.DisplayDropdownEvent)

router.route('/DisplayUpcomingEvent')
    .get(Event.DisplayUpcomingEvent)


module.exports=router