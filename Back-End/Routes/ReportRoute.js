const express = require('express');
const router = express.Router();//express router
const Report=require('./../Controller/ReportController')
const authController = require('./../Controller/authController')

router.route('/')
    .post(Report.reportCreate)
    .get(Report.reportdisplay)

router.route('/:id')
    .patch(authController.protect,Report.Updatereport)
    .delete(authController.protect,Report.deletereport)


module.exports=router