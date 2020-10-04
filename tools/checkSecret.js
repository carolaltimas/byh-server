const {ADMIN_SECRET} = require('../config');

let checkSecret = function(req,res,next){
    let {secret} = req.query;
    if(secret === ADMIN_SECRET){
        next();
    }
    else{
        return res.status(422).json({
			code:400,
			message:"Unathorized"
		});
    }
}

module.exports = {checkSecret};