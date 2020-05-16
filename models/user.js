const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('../helpers/jwt');
const MongooseUserModel = require('../mongoose/user');
const ValidationHandler = require('../helpers/ValidationHandler');
const mongoose = require('mongoose');

class User {

    // CONSTRUCTOR IS TAKING TWO PARAMETERS: REQUEST AND RESPONSE. WHICH WILL BE USED FOR SESSION AND OTHER STUFFS.
    constructor(request, response) {
        this.request = request;
        this.response = response;
    }

    // USER INPUT VALIDATION FOR REGISTERING A USER
    validate(data) {
        const schema = Joi.object().keys({
            _id: Joi.string().optional(),
            name: Joi.string().min(3).max(30).required(),
            password: Joi.string().min(6).max(30).when('_id', {is: Joi.exist(), then: Joi.optional(), otherwise: Joi.required()}),
            email: Joi.array().items(Joi.string().email().max(256).required()).single().required(),
            image: Joi.string().when('_id', {is: Joi.exist(), then: Joi.optional(), otherwise: Joi.required().default("placeholder.png")})
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
                if (!data.image) {
                    mongooseUserModel.image = "placeholder.png";
                }
                await mongooseUserModel.save();
                return validationHandler.setBasicValidation(false, data.email + " Added successfully.");
            } else {
                return validationHandler.setBasicValidation(true, data.email + " already registered.");
            }
        } catch (error) {
            return validationHandler.setDatabaseValidation(true, error.message);
        }
    }

    // LIST OF USERS
    async getUsers() {
        const users = await MongooseUserModel.find({
            isAdmin: false
        });
        return users;
    }

    // GET USER BY ID
    async getUserById(id) {
        const user = await MongooseUserModel.findOne({
            _id: mongoose.Types.ObjectId(id)
        });
        return user;
    }

    // UPDATING A USER
    async updateUser(id) {
        const validationHandler = new ValidationHandler(this.request, this.response);
        let image = "placeholder.png";
        // IMAGE EXISTING CHECKER
        if (this.request.body.image) {
            image = this.request.body.image;   
        }
        try {
            await MongooseUserModel.update({
                _id: mongoose.Types.ObjectId(id)
            }, {
                $set: {
                    name: this.request.body.name,
                    email: this.request.body.email,
                    image : image
                }
            });
            return validationHandler.setBasicValidation(false, this.request.body.name + " Updated successfully.");
        } catch (error) {
            return validationHandler.setDatabaseValidation(true, error.message);
        }
    }

    //DELETE A USER
    async deleteUser(id) {
        await MongooseUserModel.findOneAndRemove({
            _id: mongoose.Types.ObjectId(id)
        });
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
                        name: checkUser.name,
                        email: checkUser.email,
                        isAdmin: checkUser.isAdmin
                    });
                    this.request.session.isLoggedIn = true;

                    return validationHandler.setBasicValidation(false, "Welcome, " + checkUser.name);
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