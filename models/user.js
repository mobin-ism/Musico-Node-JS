const Joi = require('joi');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('../helpers/jwt');

// USER INPUT VALIDATION FOR REGISTERING A USER
function validateOnRegistration(user) {
    const schema = Joi.object().keys({
        name: Joi.string().min(3).max(30).required(),
        password: Joi.string().required().min(6).max(30),
        email: Joi.array().items(Joi.string().email().max(256).required()).single().required()
    });
    
    return Joi.validate(user, schema);
}

// USER INPUT VALIDATION FOR LOGIN
function validateOnLogin(user) {
    const schema = Joi.object().keys({
        password: Joi.string().required().min(6).max(30),
        email: Joi.array().items(Joi.string().email().max(256).required()).single().required()
    });
    
    return Joi.validate(user, schema);
}

// MONGOOSE USER SCHEMA
const userSchema = new mongoose.Schema({
    name : {type : String, required : true},
    email : {type : String, required : true, unique : true},
    password : {type : String, required : true},
    isAdmin : {type : Boolean, default : false}
});

// MONGOOSE USER MODEL
const User = mongoose.model('User', userSchema );

// REGISTER A NEW USER
async function addUser(userData) {
    try {
        const checkUser = await User.findOne({email : userData.email});
        if(!checkUser){

            const user = new User(userData);
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(userData.password, salt);
            console.log(jwt.generate);
            const result = await user.save();
            console.log(userData.name+" Added successfully.");
            
            return {isSucceed : true, message : userData.name+" Added successfully."};
        }else{
            console.log(userData.email+" already registered.");
            return {isSucceed : false, message : userData.email+" already registered"};
        }
    } catch (error) {
        console.log("Error occured: ", error.message);
    }
}

// AUTHENTICATE USER FOR LOGIN
async function authenticateUser(userData) {
    try {
        const checkUser = await User.findOne({email : userData.email});
        if(checkUser){

            const validPassword = await bcrypt.compare(userData.password, checkUser.password);
            if(validPassword){
                console.log("Valid Email or Password.");
                
                console.log(jwt.generate({id : checkUser.id, isAdmin : checkUser.isAdmin}));

                return {isSucceed : true, message : "Welcome "+checkUser.name};
            }else{
                console.log("Invalid Email or Password.");
                return {isSucceed : false, message : "Invalid Email or Password."};
            }
        }else{
            console.log("Invalid Email or Password.");
            return {isSucceed : false, message : "Invalid Email or Password."};
        }
    } catch (error) {
        console.log("Error occured: ", error.message);
    }
}

module.exports.validateOnRegistration = validateOnRegistration;
module.exports.validateOnLogin = validateOnLogin;
module.exports.add = addUser;
module.exports.authenticate = authenticateUser;