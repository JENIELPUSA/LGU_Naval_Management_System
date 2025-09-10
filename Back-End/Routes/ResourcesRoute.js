const express = require('express');
const router = express.Router();//express router
const Resources=require('./../Controller/resourcesController')
const authController = require('./../Controller/authController')

router.route('/')
    .post(authController.protect,Resources.createResources)
    .get(authController.protect,Resources.DisplayResources)

router.route('/:id')
    .patch(authController.protect,Resources.UpdateResources)
    .delete(authController.protect,Resources.deleteResources)

router.route('/DisplayResourcesDropdown')
    .get(authController.protect,Resources.DisplayResourcesDropdown)


module.exports=router