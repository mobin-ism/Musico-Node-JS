const Joi = require('joi');
const _ = require('lodash');
const MongooseArtistModel = require('../mongoose/artist');
const ValidationHandler = require('../helpers/ValidationHandler');
const mongoose = require('mongoose');
class Artist {
    // CONSTRUCTOR IS TAKING TWO PARAMETERS: REQUEST AND RESPONSE. WHICH WILL BE USED FOR SESSION AND OTHER STUFFS.
    constructor(request, response) {
        this.request = request;
        this.response = response;
    }

    // USER INPUT VALIDATION FOR REGISTERING A USER
    validate(data) {
        const schema = Joi.object().keys({
            name: Joi.string().min(3).max(30).required(),
            about: Joi.string().required().min(30).max(1000),
            image: Joi.string(),
            is_featured : Joi.boolean()
        });

        return Joi.validate(data, schema);
    }

    //ADD ARTIST
    async addArtist(data) {
        if(data.is_featured){
            await MongooseArtistModel.updateMany({}, {
                $set : {
                    is_featured : false
                }
            });
        }
        const validationHandler = new ValidationHandler(this.request, this.response);
        try {
            const mongooseArtistModel = new MongooseArtistModel(data);
            await mongooseArtistModel.save();
            return validationHandler.setBasicValidation(false, data.name + " Added successfully.");
        } catch (error) {
            return validationHandler.setDatabaseValidation(true, error.message);
        }
    }

    // GET ALL THE ARTISTS
    async getArtists() {
        const artists = await MongooseArtistModel.find();
        return _.map(artists, _.partialRight(_.pick, ['_id', 'name', 'about', 'image', 'is_featured']));
    }

    // GET ALL THE ARTISTS
    async getArtistById(id) {
        const artist = await MongooseArtistModel.findOne({ _id: id });
        return artist;
    }

    // GET FEATURED ARTISTS
    async getFeaturedArtist() {
        const artist = await MongooseArtistModel.findOne({ is_featured : true });
        return artist;
    }


    // UPDATING AN ARTIST
    async updateArtist(id) {
        const validationHandler = new ValidationHandler(this.request, this.response);
        var is_featured = false;
        if(this.request.body.is_featured){
            is_featured = true;
            await MongooseArtistModel.updateMany({}, {
                $set : {
                    is_featured : false
                }
            });
        }
        try {
            await MongooseArtistModel.update({_id : mongoose.Types.ObjectId(id)}, {
                $set : {
                    name : this.request.body.name,
                    about : this.request.body.about,
                    is_featured : is_featured
                }
            });
            return validationHandler.setBasicValidation(false, this.request.body.name + " Updated successfully.");
        } catch (error) {
            return validationHandler.setDatabaseValidation(true, error.message);
        }
    }
    //DELETE ARTIST
    async deleteArtist(id) {
        await MongooseArtistModel.findOneAndRemove({_id : mongoose.Types.ObjectId(id)});
    }
}

module.exports = Artist;