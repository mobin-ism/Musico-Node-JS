const UserModel = require('../../models/User');
const ValidationHandler = require('../../helpers/ValidationHandler');
var validationResult = null;

class User {

    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        this.res.locals.userdata = this.req.user;
    }

    async index() {
        validationResult = null;
        try {
            const userModel = new UserModel(this.req, this.res);
            const users = await userModel.getUsers();

            this.res.render('backend/index', {
                userType : this.req.user.type,
                pageName: "user/index",
                pageTitle: "Users",
                users : users
            });
        } catch (error) {
            console.error("Error Occured: ", error.message);
        }
    }

    async create() {
        
        this.res.render('backend/index', {
            userType : this.req.user.type,
            pageName: "user/create",
            pageTitle: "Add New User",
            validate : validationResult
        });
    }

    async store() {
        console.log(this.req.body);
        const userModel = new UserModel(this.req, this.res);
        const inputValidationResult = userModel.validate(this.req.body);

        if (inputValidationResult.error != null) {
            const validationHandler = new ValidationHandler(this.req, this.res);
            validationResult = validationHandler.setInputValidation(inputValidationResult);
        } 
        else {
            try {
                validationResult = await userModel.addUser(this.req.body);
            } catch (error) {
                console.log("User Adding Denied: ", error.message);
            }
        }
        console.log("Validation result",validationResult);
        this.res.redirect('/user/create');
    }

    async edit() {
        const userId = this.req.params.id;

        try {
            const userModel = new UserModel(this.req, this.res);
            const user = await userModel.getUserById(userId);
            this.res.render('backend/index', {
                userType : this.req.user.type,
                pageName: "user/edit",
                pageTitle: "Edit User",
                validate : validationResult,
                user : user
            });
        } catch (error) {
            console.log("An error occured: ", error.message);
        }
    }

    async update(){
        const userModel = new UserModel(this.req, this.res);
        const inputValidationResult = userModel.validate(this.req.body);
        if (inputValidationResult.error != null) {
            const validationHandler = new ValidationHandler(this.req, this.res);
            validationResult = validationHandler.setInputValidation(inputValidationResult);
        } 
        else {
            try {
                validationResult = await userModel.updateUser(this.req.params.id);
            } catch (error) {
                console.log("User Updating Denied: ", error.message);
            }
        }
        this.res.redirect('/user/edit/'+this.req.params.id);
    }

    async delete() {
        const userModel = new UserModel(this.req, this.res);
        try {
            await userModel.deleteUser(this.req.body.id);   
        } catch (error) {
            console.log("User Deleting Denied: ", error.message);
        }
        this.res.redirect('/user');
    }
}

module.exports = User;