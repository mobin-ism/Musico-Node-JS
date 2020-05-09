const User = require('../../models/User');
const ValidationHandler = require('../../helpers/ValidationHandler');

var validationResult = null;

class AuthController {

    // FOR REGISTERING USER
    async postRegistration(req, res) {
        const userModel = new User(req, res);
        const inputValidationResult = userModel.validateOnRegistration(req.body);

        if (inputValidationResult.error != null) {
            const validationHandler = new ValidationHandler(req, res);
            validationResult = validationHandler.setInputValidation(inputValidationResult);
            res.redirect('/registration');
        } else {
            try {
                validationResult = await userModel.addUser(req.body);
            } catch (error) {
                console.log("Registration Denied: ", error.message);
            }
            res.redirect('/registration');
        }
    }

    // FOR RENDERING REGISTRATION
    getRegistration(req, res) {
        if (req.session.isLoggedIn) {
            validationResult = null;
            res.redirect('/dashboard');
        }

        res.render('backend/pages/auth/index', {
            pageName: "registration",
            pageTitle: "Registration",
            validate: validationResult
        });
    }

    // FOR LOGIN
    async postLogin(req, res) {
        const validationHandler = new ValidationHandler(req, res);

        const userModel = new User(req, res);
        const inputValidationResult = userModel.validateOnLogin(req.body);
        if (inputValidationResult.error != null) {
            validationResult = validationHandler.setInputValidation(inputValidationResult);
            res.redirect(302, '/login');
        } else {
            try {
                validationResult = await userModel.authenticate(req.body);
                if (validationResult.type === "basic" && !validationResult.isError) {
                    res.redirect('/dashboard');
                } else {
                    res.redirect(302, '/login');
                }
            } catch (error) {
                console.log("Login Denied: ", error.message);
                res.redirect(302, '/login');
            }
        }
    }

    // FOR RENDERING LOGIN
    getLogin(req, res) {
        if (req.session.isLoggedIn) {
            validationResult = null;
            res.redirect(302, '/dashboard');
        }
        res.render('backend/pages/auth/index', {
            pageName: "login",
            pageTitle: "Login",
            validate: validationResult
        });
    }

    // LOGGING OUT
    getLogout(req, res) {
        req.session.destroy();
        validationResult = null;
        res.redirect(302, '/login');
    }

    // FOR REFRESHING FORM
    refresh(req, res) {
        validationResult = null;
        res.redirect('back');
    }
}

module.exports = new AuthController();