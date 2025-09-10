const express = require("express");
const router = express.Router();//express router
const LguResponseController=require('../Controller/LGUResponseController')
const authController = require('../Controller/authController')
const upload = require("../middleware/imageUploader");
router.route('/')
    .get(authController.protect,LguResponseController.DisplayResponse)

router.route('/:id')
    .patch(authController.protect,LguResponseController.UpdateResponse)
    .delete(authController.protect,LguResponseController.deleteResponse)

module.exports = router;