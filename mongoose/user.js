const mongoose = require('mongoose');
// MONGOOSE USER SCHEMA
const mongooseUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique : false
    },
    email: {
        type: String,
        required: true,
        unique : true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

// MONGOOSE USER MODEL
module.exports = mongoose.model( 'User', mongooseUserSchema );