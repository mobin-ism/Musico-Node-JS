const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const _ = require('lodash');
const MongooseTrackModel = require('../mongoose/track');
const ValidationHandler = require('../helpers/ValidationHandler');
const mongoose = require('mongoose');
const MongooseArtistModel = require('../mongoose/artist');
class Track {
    // CONSTRUCTOR IS TAKING TWO PARAMETERS: REQUEST AND RESPONSE. WHICH WILL BE USED FOR SESSION AND OTHER STUFFS.
    constructor(request, response) {
        this.request = request;
        this.response = response;
    }

    // USER INPUT VALIDATION FOR REGISTERING A TRACK
    validate(data) {
        const schema = Joi.object().keys({
            title: Joi.string().min(3).max(30).required(),
            album: Joi.objectId(),
            track: Joi.string(),
            is_featured: Joi.boolean()
        });

        return Joi.validate(data, schema);
    }

    //ADD TRACK
    async addTrack(data) {
        if (data.is_featured) {
            await MongooseTrackModel.updateMany({}, {
                $set: {
                    is_featured: false
                }
            });
        }
        const validationHandler = new ValidationHandler(this.request, this.response);
        try {
            const mongooseTrackModel = new MongooseTrackModel(data);
            await mongooseTrackModel.save();
            return validationHandler.setBasicValidation(false, data.title + " Added successfully.");
        } catch (error) {
            return validationHandler.setDatabaseValidation(true, error.message);
        }
    }

    // GET ALL THE TRACKS
    async getTracks() {
        //const tracks = await MongooseTrackModel.find().populate('album');
        const tracks = await MongooseTrackModel.find().populate({
            path: 'album',
            populate: {
                path: 'artist',
                model: MongooseArtistModel
            }
        });
        return _.map(tracks, _.partialRight(_.pick, ['_id', 'title', 'album', 'track', 'is_featured']));
    }

    // GET ALL THE ALBUMS
    async getTrackById(id) {
        const track = await MongooseTrackModel.findOne({
            _id: id
        });
        return track;
    }

    // UPDATING AN ALBUM
    async updateTrack(id) {
        const validationHandler = new ValidationHandler(this.request, this.response);
        var is_featured = false;
        if (this.request.body.is_featured) {
            is_featured = true;
            await MongooseTrackModel.updateMany({}, {
                $set: {
                    is_featured: false
                }
            });
        }
        try {
            await MongooseTrackModel.update({
                _id: mongoose.Types.ObjectId(id)
            }, {
                $set: {
                    title: this.request.body.title,
                    album: this.request.body.album,
                    is_featured: is_featured
                }
            });
            return validationHandler.setBasicValidation(false, this.request.body.title + " Updated successfully.");
        } catch (error) {
            return validationHandler.setDatabaseValidation(true, error.message);
        }
    }

    //DELETE ALBUM
    async deleteTrack(id) {
        await MongooseTrackModel.findOneAndRemove({
            _id: mongoose.Types.ObjectId(id)
        });
    }

    // GET FEATURED TRACK
    async getFeaturedTrack() {
        const track = await MongooseTrackModel.findOne({
            is_featured: true
        }).populate({
            path: 'album',
            populate: {
                path: 'artist',
                model: MongooseArtistModel
            }
        });
        return track;
    }

    // GET LATEST 3 TRACKS
    async getLatestTracks() {
        const tracks = await MongooseTrackModel.find().sort('-created_at').limit(3).populate({
            path: 'album',
            populate: {
                path: 'artist',
                model: MongooseArtistModel
            }
        });
        return tracks;
    }
}

module.exports = Track;