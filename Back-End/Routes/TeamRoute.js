const express = require('express');
const router = express.Router();
const TeamController=require('./../Controller/TeamController')
const authController = require('./../Controller/authController')

router.route('/')
    .post(authController.protect,TeamController.createTeam)
    .get(authController.protect,TeamController.DisplayTeam)

router.route('/:id')
    .patch(authController.protect,TeamController.UpdateTeam)
    .delete(authController.protect,TeamController.deleteTeam)

module.exports=router