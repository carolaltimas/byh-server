//to do add routers
const express = require('express');
const router = express.Router();
const {router: levelRouter} = require('./level-router');
const {router: userRouter} = require('./user-router');

router.use('/levels',levelRouter);
router.use('/users',userRouter);

module.exports = {router};