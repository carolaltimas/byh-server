const {Level} = require('../../models/Level');

const findLevel = async (levelName) => {
    try{
        let level = await Level.find({name:levelName});
        return level[0].serialize();
    }
    catch(e){
        console.log(e);
        throw(e);
    }
}

const getAllLevels = async () => {
    try{
        let levels = await Level.find();
        return levels.map(level => level.serialize());
    }
    catch(e){
        console.log(e);
        throw(e);
    }
}


module.exports = {findLevel};