const express = require('express');
const router = express.Router();//express router
const ContactInfoController=require('./../Controller/ContactInfoController')
const authController = require('./../Controller/authController')

router.route('/')
    .post(authController.protect,ContactInfoController.addContactInfo)
    .get(ContactInfoController.getContactInfo)


module.exports=router