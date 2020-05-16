const mongoose = require('mongoose');
// MONGOOSE SETTINGS SCHEMA
const mongooseSettingsSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true
    }
});

// MONGOOSE USER MODEL
module.exports = mongoose.model( 'Settings', mongooseSettingsSchema );