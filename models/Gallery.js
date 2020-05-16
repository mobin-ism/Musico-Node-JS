const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const _ = require('lodash');
const MongooseGalleryModel = require('../mongoose/gallery');
const ValidationHandler = require('../helpers/ValidationHandler');
const mongoose = require('mongoose');
class Gallery {
    // CONSTRUCTOR IS TAKING TWO PARAMETERS: REQUEST AND RESPONSE. WHICH WILL BE USED FOR SESSION AND OTHER STUFFS.
    constructor(request, response) {
        this.request = request;
        this.response = response;
    }

    // USER INPUT VALIDATION FOR REGISTERING A USER
    validate(data) {
        const schema = Joi.object().keys({
            title: Joi.string().required(),
            image: Joi.string().required()
        });

        return Joi.validate(data, schema);
    }

    //ADD ALBUM
    async addGalleryImage(data) {
        const validationHandler = new ValidationHandler(this.request, this.response);
        try {
            const mongooseGalleryModel = new MongooseGalleryModel(data);
            await mongooseGalleryModel.save();
            return validationHandler.setBasicValidation(false,"Image Added successfully.");
        } catch (error) {
            return validationHandler.setDatabaseValidation(true, error.message);
        }
    }

    // GET ALL THE ALBUMS
    async getGalleryImages() {
        const galleryImages = await MongooseGalleryModel.find();
        return _.map(galleryImages, _.partialRight(_.pick, ['_id', 'title', 'image']));
    }

    //DELETE ALBUM
    async deleteGalleryImage(id) {
        await MongooseGalleryModel.findOneAndRemove({_id : mongoose.Types.ObjectId(id)});
    }
}

module.exports = Gallery;