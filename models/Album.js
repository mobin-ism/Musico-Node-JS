const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const _ = require('lodash');
const MongooseAlbumModel = require('../mongoose/album');
const ValidationHandler = require('../helpers/ValidationHandler');
const mongoose = require('mongoose');
class Album {
    // CONSTRUCTOR IS TAKING TWO PARAMETERS: REQUEST AND RESPONSE. WHICH WILL BE USED FOR SESSION AND OTHER STUFFS.
    constructor(request, response) {
        this.request = request;
        this.response = response;
    }

    // USER INPUT VALIDATION FOR REGISTERING A USER
    validate(data) {
        const schema = Joi.object().keys({
            title: Joi.string().min(3).max(30).required(),
            artist : Joi.objectId(),
            image: Joi.string()
        });

        return Joi.validate(data, schema);
    }

    //ADD ALBUM
    async addAlbum(data) {
        const validationHandler = new ValidationHandler(this.request, this.response);
        try {
            const mongooseAlbumModel = new MongooseAlbumModel(data);
            await mongooseAlbumModel.save();
            return validationHandler.setBasicValidation(false, data.title + " Added successfully.");
        } catch (error) {
            return validationHandler.setDatabaseValidation(true, error.message);
        }
    }

    // GET ALL THE ALBUMS
    async getAlbums() {
        const albums = await MongooseAlbumModel.find().populate('artist');
        return _.map(albums, _.partialRight(_.pick, ['_id', 'title', 'artist', 'image']));
    }

    // GET ALL THE ALBUMS
    async getAlbumById(id) {
        const album = await MongooseAlbumModel.findOne({ _id: id });
        return album;
    }

    // UPDATING AN ALBUM
    async updateAlbum(id) {
        const validationHandler = new ValidationHandler(this.request, this.response);
        try {
            await MongooseAlbumModel.update({_id : mongoose.Types.ObjectId(id)}, {
                $set : {
                    title : this.request.body.title,
                    artist : this.request.body.artist 
                }
            });
            return validationHandler.setBasicValidation(false, this.request.body.title + " Updated successfully.");
        } catch (error) {
            return validationHandler.setDatabaseValidation(true, error.message);
        }
    }

    //DELETE ALBUM
    async deleteAlbum(id) {
        await MongooseAlbumModel.findOneAndRemove({_id : mongoose.Types.ObjectId(id)});
    }
}

module.exports = Album;