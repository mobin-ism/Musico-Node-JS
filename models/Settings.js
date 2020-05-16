const Joi = require('joi');
const _ = require('lodash');
const MongooseSettingsModel = require('../mongoose/settings');
const ValidationHandler = require('../helpers/ValidationHandler');
const mongoose = require('mongoose');
class Settings {
    // CONSTRUCTOR IS TAKING TWO PARAMETERS: REQUEST AND RESPONSE. WHICH WILL BE USED FOR SESSION AND OTHER STUFFS.
    constructor(request, response) {
        this.request = request;
        this.response = response;
    }

    // USER INPUT VALIDATION FOR REGISTERING A USER
    validate(data) {
        const schema = Joi.object().keys({
            about: Joi.string().required().min(30).max(1000)
        });

        return Joi.validate(data, schema);
    }

    // GET ALL THE ARTISTS
    async getAbout() {
        const about = await MongooseSettingsModel.findOne({ type: 'about' });
        return about;
    }


    // UPDATING AN ARTIST
    async updateAbout() {
        const validationHandler = new ValidationHandler(this.request, this.response);
        try {
            await MongooseSettingsModel.update({type : "about"}, {
                $set : {
                    value : this.request.body.about 
                }
            });
            return validationHandler.setBasicValidation(false,"About Updated successfully.");
        } catch (error) {
            return validationHandler.setDatabaseValidation(true, error.message);
        }
    }
}

module.exports = Settings;