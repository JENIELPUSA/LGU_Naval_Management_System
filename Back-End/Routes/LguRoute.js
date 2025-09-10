const express = require("express");
const router = express.Router();//express router
const LguController=require('../Controller/LguController')
const authController = require('../Controller/authController')
const upload = require("../middleware/imageUploader");
router.route('/')
    .get(authController.protect,LguController.DisplayLGU)


router.route('/:id')
    .delete(authController.protect,LguController.deleteLGU)
    .patch(authController.protect,upload.single("avatar"),LguController.updateLGU)

module.exports = router;