const express = require('express');
const router = express.Router();//express router
const Participant=require('./../Controller/ParticipantController')
const authController = require('./../Controller/authController')
const CheckCountParticipant = require('./../middleware/checkEventCapacity')


router.route('/')
    .post(CheckCountParticipant,Participant.participantCreate)
    .get(authController.protect,Participant.ParticipantDisplay)
router.route('/Archived')
    .get(authController.protect,Participant.ParticipantArchived)

router.route('/:id')
    .delete(authController.protect,Participant.deleteParticipant)

router.route('/getParticipantsCountPerEvent')
    .get(authController.protect,Participant.getParticipantsCountPerEvent)
router.route('/UpdateParticipantStatus/:id')
    .patch(authController.protect,Participant.UpdateParticipantStatus)

router.route('/UpdateParticipantArchive/:id')
    .patch(authController.protect,Participant.UpdateParticipantArchive)

module.exports=router