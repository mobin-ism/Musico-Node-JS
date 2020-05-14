const mongoose = require('mongoose');
const ArtistMongooseModel = require('../mongoose/artist');
// MONGOOSE USER SCHEMA
const mongooseAlbumSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : ArtistMongooseModel
    },
    image: {
        type: String,
        required: true
    }
});

// MONGOOSE USER MODEL
module.exports = mongoose.model( 'Album', mongooseAlbumSchema );