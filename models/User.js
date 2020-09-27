const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    email:{type:String,required:true,unique:true},
    password: {type: String, required: true},
    admin:{type:Boolean},
    lastAccess:{type:Date},
    lastLogin:{type:Date},
    lastLoginAttempt:{type:Date},
    level:{ type: mongoose.Schema.Types.ObjectId, ref: 'Level', unique: false, required: [false, 'No students found']},
    firstName:{type:String,required:true},
    lastName:{type:String,required:true}
});

userSchema.methods.serialize = function(){
	return{
		username: this.email || '',
        id:this._id,
        level:this.level,
        firstName:this.firstName,
        lastName:this.lastName,
        fullName:this.fullName
	};
}

userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`
  });

userSchema.methods.validatePassword = function(password){
	return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password) {
 	 return bcrypt.hash(password, 10);
};

const User = mongoose.model('User',userSchema);

module.exports = {User};