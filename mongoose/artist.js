const mongoose = require('mongoose');
// MONGOOSE USER SCHEMA
const mongooseArtistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique : false
    },
    about: {
        type: String,
        required: true,
        unique : true
    },
    image: {
        type: String,
        required: true,
        unique : true
    }
});

// MONGOOSE USER MODEL
module.exports = mongoose.model( 'Artist', mongooseArtistSchema );