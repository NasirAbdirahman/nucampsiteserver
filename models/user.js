const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    admin: {
        type: Boolean,//By default when new user doc. is created, admin is set to false
        default: false
    }
});
userSchema.plugin(passportLocalMongoose);
//passport plugin handles adding username/pw fields to the schema + hashing and salting it & provides other authenticaiton methods

module.exports = mongoose.model('User', userSchema);//Done in one line
