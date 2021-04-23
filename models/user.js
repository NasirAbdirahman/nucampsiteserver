const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {//By default when new user doc. is created, admin is set to false
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', userSchema);//Done in one line
