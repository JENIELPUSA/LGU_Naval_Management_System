const express = require('express');
const router = express.Router();//express router
const Participant=require('./../Controller/ParticipantController')
const authController = require('./../Controller/authController')

router.route('/')
    .post(Participant.participantCreate)
    .get(authController.protect,Participant.ParticipantDisplay)

router.route('/:id')
    .patch(Participant.UpdateParticipant)
    .delete(authController.protect,Participant.deleteParticipant)

router.route('/getParticipantsCountPerEvent')
    .get(authController.protect,Participant.getParticipantsCountPerEvent)

module.exports=router