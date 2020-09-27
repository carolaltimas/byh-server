const mongoose = require('mongoose');

const levelSchema = mongoose.Schema({
    name:{type:String, requied:true,unique:true},
    rank:{type:Number, required:true, unique:true},
});

levelSchema.methods.serialize = function(){
	return{
		name: this.name,
        id:this._id,
        rank:this.rank
	};
};

const Level = mongoose.model('Level',levelSchema);

module.exports = {Level};