const user = require('../../models/user');

class LoginController {
    register(req, res) {
        const result = user.validate(req.body);
        if(result.error != null) {
           console.log(result.error.details[0].context.key);

            res.render('backend/pages/common/index', {
                pageName: "registration",
                pageTitle: "Registration",
                validate: result 
            });
        }
    }
}

module.exports = LoginController;