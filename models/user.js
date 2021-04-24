const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    admin: {//By default when new user doc. is created, admin is set to false
        type: Boolean,
        default: false
    }
});
userSchema.plugin(passportLocalMongoose);
//passport plugin handles adding username/pw fields to the schema + hashing and salting it & provides other authenticaiton methods

module.exports = mongoose.model('User', userSchema);//Done in one line
