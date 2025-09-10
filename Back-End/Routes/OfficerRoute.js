const express = require("express");
const router = express.Router();//express router
const OfficerController=require('../Controller/OfficerController')
const authController = require('../Controller/authController')
const upload = require("../middleware/imageUploader");
router.route('/')
    .get(authController.protect,OfficerController.DisplayOfficer)
router.route('/:id')
    .delete(authController.protect,OfficerController.deleteOfficer)
    .patch(authController.protect,upload.single("avatar"),OfficerController.updateOfficer)

router.route('/GetAssignEventSummary')
    .get(authController.protect,OfficerController.GetAssignEventSummary)

router.route('/BroadcastControllerEmail')
    .get(authController.protect,OfficerController.BroadcastControllerEmail)

module.exports = router;