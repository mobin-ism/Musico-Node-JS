const mongoose = require('mongoose');
const schemaOptions = {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
};

// MONGOOSE GALLERY SCHEMA
const mongooseGallerySchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    image: {
        type: String,
        required: true
    }
}, schemaOptions);

// MONGOOSE USER MODEL
module.exports = mongoose.model( 'Gallery', mongooseGallerySchema );