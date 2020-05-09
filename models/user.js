const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('../helpers/jwt');
const MongooseUserModel = require('../mongoose/user');
const ValidationHandler = require('../helpers/ValidationHandler');

class User {

    // CONSTRUCTOR IS TAKING TWO PARAMETERS: REQUEST AND RESPONSE. WHICH WILL BE USED FOR SESSION AND OTHER STUFFS.
    constructor(request, response) {
        this.request = request;
        this.response = response;
    }

    // USER INPUT VALIDATION FOR REGISTERING A USER
    validateOnRegistration(data) {
        const schema = Joi.object().keys({
            name: Joi.string().min(3).max(30).required(),
            password: Joi.string().required().min(6).max(30),
            email: Joi.array().items(Joi.string().email().max(256).required()).single().required()
        });

        return Joi.validate(data, schema);
    }

    // USER INPUT VALIDATION FOR LOGIN
    validateOnLogin(user) {
        const schema = Joi.object().keys({
            password: Joi.string().required(),
            email: Joi.array().items(Joi.string().email().max(256).required()).single().required()
        });

        return Joi.validate(user, schema);
    }

    // REGISTER A NEW USER
    async addUser(data) {
        const validationHandler = new ValidationHandler(this.request, this.response);
        try {
            const previousData = await MongooseUserModel.findOne({
                email: data.email
            });
            if (!previousData) {
                const mongooseUserModel = new MongooseUserModel(data);
                const salt = await bcrypt.genSalt(10);
                mongooseUserModel.password = await bcrypt.hash(data.password, salt);
                await mongooseUserModel.save();
                return validationHandler.setBasicValidation(false, data.email + " Added successfully.");
            } else {
                return validationHandler.setBasicValidation(true, data.email + " already registered.");
            }
        } catch (error) {
            return validationHandler.setDatabaseValidation(true, error.message);
        }
    }

    // AUTHENTICATE USER FOR LOGIN
    async authenticate(data) {
        const validationHandler = new ValidationHandler(this.request, this.response);
        try {
            const checkUser = await MongooseUserModel.findOne({
                email: data.email
            });
            if (checkUser) {

                const validPassword = await bcrypt.compare(data.password, checkUser.password);
                console.log("Validating password: ", validPassword);
                if (validPassword) {
                    //  SETTING DATA TO SESSION OBJECT
                    this.request.session.token = jwt.generate({
                        id: checkUser.id,
                        name : checkUser.name,
                        email : checkUser.email,
                        isAdmin: checkUser.isAdmin
                    });
                    this.request.session.isLoggedIn = true;

                    return validationHandler.setBasicValidation(false, "Welcome, "+checkUser.name);
                } else {
                    return validationHandler.setBasicValidation(true, "Invalid Email or Password.");
                }
            } else {
                return validationHandler.setBasicValidation(true, "Invalid Email or Password.");
            }
        } catch (error) {
            console.log("Error occured: ", error.message);
        }
    }
}

module.exports = User;