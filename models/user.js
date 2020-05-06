const Joi = require('joi');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('../helpers/jwt');

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
            password: Joi.string().required().min(6).max(30),
            email: Joi.array().items(Joi.string().email().max(256).required()).single().required()
        });

        return Joi.validate(user, schema);
    }

    // REGISTER A NEW USER
    async addUser(data) {
        try {
            const Model = this.getModel();
            const checkUser = await Model.findOne({
                email: data.email
            });
            if (!checkUser) {

                const user = new Model(data);
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(data.password, salt);
                console.log(jwt.generate);
                const result = await user.save();
                console.log(data.name + " Added successfully.");

                console.log("Model Handler: ", this.request.body.email);

                return {
                    isSucceed: true,
                    message: data.name + " Added successfully."
                };
            } else {
                console.log(data.email + " already registered.");
                return {
                    isSucceed: false,
                    message: data.email + " already registered"
                };
            }
        } catch (error) {
            console.log("Error occured: ", error.message);
        }
    }

    // AUTHENTICATE USER FOR LOGIN
    async authenticateUser(data) {
        try {
            const Model = this.getModel();
            const checkUser = await Model.findOne({
                email: data.email
            });
            if (checkUser) {

                const validPassword = await bcrypt.compare(data.password, checkUser.password);
                if (validPassword) {
                    console.log("Valid Email and Password.");

                    console.log(jwt.generate({
                        id: checkUser.id,
                        isAdmin: checkUser.isAdmin
                    }));

                    return {
                        isSucceed: true,
                        message: "Welcome " + checkUser.name
                    };
                } else {
                    console.log("Invalid Email or Password.");
                    return {
                        isSucceed: false,
                        message: "Invalid Email or Password."
                    };
                }
            } else {
                console.log("Invalid Email or Password.");
                return {
                    isSucceed: false,
                    message: "Invalid Email or Password."
                };
            }
        } catch (error) {
            console.log("Error occured: ", error.message);
        }
    }

    // MONGOOSE USER SCHEMA
    getSchema() {
        return new mongoose.Schema({
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true,
                unique: true
            },
            password: {
                type: String,
                required: true
            },
            isAdmin: {
                type: Boolean,
                default: false
            }
        });
    }


    // MONGOOSE USER MODEL
    getModel() {
        console.log("I am called");
        return mongoose.model('User', this.getSchema());
    }
}

module.exports = User;

// module.exports.validateOnRegistration = validateOnRegistration;
// module.exports.validateOnLogin = validateOnLogin;
// module.exports.add = addUser;
// module.exports.authenticate = authenticateUser;