const SettingsModel = require('../../models/Settings');
const ValidationHandler = require('../../helpers/ValidationHandler');
var validationResult = null;

class Settings {

    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        this.res.locals.userdata = this.req.user;
    }

    async index() {
        validationResult = null;
        try {
            const settingsModel = new SettingsModel(this.req, this.res);
            const settingsData = await settingsModel.getAbout();
            this.res.render('backend/index', {
                userType : this.req.user.type,
                pageName: "settings/index",
                pageTitle: "About",
                validate : validationResult,
                settingsData : settingsData
            });
        } catch (error) {
            console.error("Error Occured: ", error.message);
        }
    }
    async update(){
        const settingsModel = new SettingsModel(this.req, this.res);
        const inputValidationResult = settingsModel.validate(this.req.body);

        if (inputValidationResult.error != null) {
            const validationHandler = new ValidationHandler(this.req, this.res);
            validationResult = validationHandler.setInputValidation(inputValidationResult);
        } 
        else {
            try {
                validationResult = await settingsModel.updateAbout();
            } catch (error) {
                console.log("About Updating Denied: ", error.message);
            }
        }
        console.log(validationResult);
        this.res.redirect('/settings');
    }
}

module.exports = Settings;