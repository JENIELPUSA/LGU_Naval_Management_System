const express = require('express');
const router = express.Router();//express router
const Proposal=require('./../Controller/ProposalController')
const authController = require('./../Controller/authController')
const upload = require("../middleware/fileUploader");
router.route('/')
    .post(authController.protect,upload.single("file"),Proposal.createProposal)
    .get(authController.protect,Proposal.DisplayProposal)

router.route('/:id')
    .patch(authController.protect,Proposal.UpdateProposal)
    .delete(authController.protect,Proposal.deleteProposal)
    .get(authController.protect,Proposal.getFileById);

router.route('UpdateStatus/:id')
    .patch(authController.protect,Proposal.UpdateProposal)
router.get("/stream/:id",authController.protect,Proposal.getFileCloud);

router.route('/MetaData/:id')
    .patch(authController.protect,Proposal.UpdateMetaDataProposal)
router
  .route("/UpdateCloudinary")
  .post(
    authController.protect,
    upload.single("file"),
    Proposal.UpdateCloudinaryFile
  );

router.route('/DisplayDropdownProposal')
    .post(authController.protect,Proposal.DisplayDropdownProposal)



module.exports=router