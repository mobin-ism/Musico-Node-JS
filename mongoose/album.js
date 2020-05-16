const mongoose = require('mongoose');
const ArtistMongooseModel = require('../mongoose/artist');

const schemaOptions = {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
};

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
}, schemaOptions);

// MONGOOSE USER MODEL
module.exports = mongoose.model( 'Album', mongooseAlbumSchema );