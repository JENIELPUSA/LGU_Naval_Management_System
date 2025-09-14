const express = require("express");
const router = express.Router(); //express router
const LguController = require("../Controller/LGUController");
const authController = require("../Controller/authController");
const upload = require("../middleware/imageUploader");
router.route("/").get(authController.protect, LguController.DisplayLGU);

router
  .route("/:id")
  .delete(authController.protect, LguController.deleteLGU)
  .patch(
    authController.protect,
    upload.single("avatar"),
    LguController.updateLGU
  );

router
  .route("/GetAssignEventSummary")
  .get(authController.protect, LguController.GetAssignEventSummary);

router
  .route("/BroadcastControllerEmail")
  .get(authController.protect, LguController.BroadcastControllerEmail);

module.exports = router;
