const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false });
const {Level} = require('../models/level');
const {getAllLevels} = require('./interfaces/level-interface');

router.use(jwtAuth);

router.post('/',async (req,res,next) => {
    const {name,rank} = req.body;
    try{
        let level = await Level.create({
            name,
            rank
        });
        return res.json({
            code:200,
            level:level.serialize(),
            message:'Level Created'
        });
    }
    catch(e){
        res.err = e;
        next();
    }
});

router.get('/',async (req,res,next) => {
    try{
        let levels = await getAllLevels();
        return res.json({
            code:200,
            levels:levels.map(level => level.serialize())
        });
    }
    catch(e){
        res.err = e;
        next();
    }
});


module.exports = {router};