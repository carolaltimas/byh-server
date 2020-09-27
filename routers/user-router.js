const express = require('express');
const {User} = require('../models/user');
const router = express.Router();
const {checkSecret} = require('../tools/toolExports');
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false });
const {findLevel} = require('./interfaces/level-interface');

router.post('/admin',checkSecret,async (req,res,next) => {
    let {email,password,level,firstName,lastName,levelId} = req.body;
    
    try{
        if(!levelId){
            level = await findLevel(level);
            levelId = level.id
        }
        let hash = await User.hashPassword(password);
        let user = await User.create({
            email,
            password:hash,
            level:levelId,
            firstName,
            lastName
        });
        return res.json({
            code:200,
            message:'User created',
            user:user.serialize()
        });

    }
    catch(e){
        console.log('error ',e);
        if(e.message.includes('E11000')){
            return res.json({
                code:401,
                message:'User already exists'
            });
        }
        res.err = e;
        next()
    }
    
});

router.post('/user',jwtAuth,async (req,res) => {
    const {email,password,level,firstName,lastName} = req.body;
    try{
        let hash = await User.hashPassword(password);
        let user = User.create({
            email,
            password:hash,
            level,
            firstName,
            lastName
        });
        return res.json({
            code:200,
            message:'User created',
            user:user.serialize()
        });
    }

    catch(e){
        console.log('error ',err);
        if(err.message.includes('E11000')){
            return res.json({
                code:401,
                message:'User already exists'
            });
        }
        return res.json({
            code:500,
            message:'an error occured'
        });
    }
});


router.get('/',jwtAuth,async (req,res) => {

    try {
        const users = await User.find({});
        return res.json({
            code: 200,
            users: users.map(user => user.serialize())
        });
    } catch (err) {
        console.log('error ', err);
        return res.json({
            code: 500,
            message: 'an error occured'
        });
    }
    
});

router.put('/',async (req,res) => {
    const {email,password} = req.body;

    try {
        const users = await User.find({email});
        const user = users[0];
        
        if(user && !user.password){
            console.log(user);
            const hash = await User.hashPassword(password);
            const users = await User.findOneAndUpdate({ email }, {
                $set: { password: hash }
            });
            return res.json({
                code: 200,
                message:'updated password'
            });
        }
        else{
            return res.json({
                code: 400,
                message:'cannot update password'
            });
        }
        
    }
    catch (err) {
        console.log('error ', err);
        return res.json({
            code: 500,
            message: 'an error occured'
        });
    }
    
});


router.put('/reset',checkSecret,jwtAuth,async (req,res) => {
    const {email} = req.body;

    try {
        const users = await User.findOneAndUpdate({ email }, {
            $set: { password: null }
        });
        return res.json({
            code: 200,
            message:'reset password'
        });
    }
    catch (err) {
        console.log('error ', err);
        return res.json({
            code: 500,
            message: 'an error occured'
        });
    }
    
});

module.exports = {router};