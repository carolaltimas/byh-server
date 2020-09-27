const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const {User} = require("../models/user");
const { JWT_SECRET } = require('../config');

const localStrategy = new LocalStrategy({usernameField:"email", passwordField:"password"},(email,password,callback) => {
	let user;
	//console.log(email);
	User.findOne({email:email})
	.then(_user => {
		user = _user;
		if(!user){
			//console.log("error");
			return Promise.reject({
				reason: 'LoginError',
				message: 'Incorrect username or password'
			});
		}
		return user.validatePassword(password);
	})
	.then(isValid => {
		
		if(!isValid){
			
			return Promise.reject({
				reason: "LoginError",
				message: 'Incorrect username or password'
			});
		}
		//console.log("valid user");
		return callback(null, user);
	})
	.catch(err => {
		//console.log(err.reason === "LoginError");
		if(err.reason === "LoginError"){
			return callback(null,false,err);
		}
		return callback(err, false);
	});
});

const jwtStrategy = new JwtStrategy({
	secretOrKey: JWT_SECRET,
	jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
	algorithms: ['HS256']
},
	(payload,done) => {
		done(null,payload.user);
	}
);

module.exports = { localStrategy, jwtStrategy };
