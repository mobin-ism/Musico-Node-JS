const User = require('../../models/User');
var validation = {};
class Login {

    // FOR REGISTERING USER
    async postRegistration(req, res) {
        const userModel = new User(req, res);
        const inputValidationResult = userModel.validateOnRegistration(req.body);

        if (inputValidationResult.error != null) {
            validation.inputValidation = inputValidationResult;
            validation.response = null;
            res.redirect('/registration');
        } else {
            console.log("Route Handler: ", req.body);
            const result = await userModel.addUser(req.body);
            validation.response = result;
            validation.inputValidation = null;
            res.redirect('/registration');
        }
    }

    // FOR RENDERING REGISTRATION
    getRegistration(req, res) {
        res.render('backend/pages/common/index', {
            pageName: "registration",
            pageTitle: "Registration",
            validate: validation
        });
    }

    // FOR LOGIN
    async postLogin(req, res) {
        const inputValidationResult = user.validateOnLogin(req.body);

        const result = await user.authenticate(req.body);
        validation.response = result;
        validation.inputValidation = inputValidationResult;

        
        res.redirect('/login');
    }

    // FOR RENDERING LOGIN
    getLogin(req, res) {
        console.log(req.session);
        res.render('backend/pages/common/index', {
            pageName: "login",
            pageTitle: "Login",
            validate: validation
        });
    }

    // FOR REFRESHING FORM
    refresh(req, res) {
        validation = {};
        res.redirect('back');
    }
}

module.exports = new Login();