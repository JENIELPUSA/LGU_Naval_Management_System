const express = require('express');
const router = express.Router();
const PersonelController = require('./../Controller/UserProfileController');
const authController = require('./../Controller/authController');
const upload = require("../middleware/imageUploader");

router
  .route('/')
  .post(authController.protect,upload.single("avatar"),PersonelController.createUserProfile)
  .get(authController.protect, PersonelController.getAllUserProfiles);

router
  .route('/:id')
  .delete(authController.protect, PersonelController.deleteUserProfile)
  .patch(authController.protect,upload.single("avatar"),PersonelController.updateUserProfile)

router
  .route('/position/:position')
  .get(
    PersonelController.getUserProfileByPosition
  );
router
  .route('/getCurrentMayorProfile')
  .get(
    PersonelController.getCurrentMayorProfile
  );


module.exports = router;
