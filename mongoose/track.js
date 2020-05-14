const mongoose = require('mongoose');
const AlbumMongooseModel = require('./album');
// MONGOOSE USER SCHEMA
const mongooseTrackSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    album: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : AlbumMongooseModel
    },
    track: {
        type: String,
        required: true
    },
    is_featured : {
        type : Boolean,
        default : false
    }
});

// MONGOOSE USER MODEL
module.exports = mongoose.model( 'Track', mongooseTrackSchema );