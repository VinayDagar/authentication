const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    username: {
        type: String,
        default: null
    },
    age: {
        type: Number,
        default: null
    },
    mobile: {
        type: Number,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('User', userSchema);