const mongoose = require('mongoose');
const AlbumMongooseModel = require('./album');

const schemaOptions = {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
};


// MONGOOSE USER SCHEMA
const mongooseTrackSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    album: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: AlbumMongooseModel
    },
    track: {
        type: String,
        required: true
    },
    is_featured: {
        type: Boolean,
        default: false
    }
}, schemaOptions);

// MONGOOSE USER MODEL
module.exports = mongoose.model('Track', mongooseTrackSchema);