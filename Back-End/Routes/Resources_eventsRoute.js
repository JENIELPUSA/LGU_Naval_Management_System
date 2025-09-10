const express = require('express');
const router = express.Router();//express router
const ResourcesEvent=require('./../Controller/EventRosourcesController')
const authController = require('./../Controller/authController')

router.route('/')
    .post(authController.protect,ResourcesEvent.createResourcesEvent)
    .get(authController.protect,ResourcesEvent.DisplayResourcesEvent)

router.route('/:id')
    .patch(authController.protect,ResourcesEvent.UpdateResourcesEvent)
    .delete(authController.protect,ResourcesEvent.deleteResourcesEvent)


module.exports=router