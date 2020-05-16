const jwt = require('../helpers/jwt');

module.exports = function (req, res, next) {
    const sess_data = req.session;
    const token = sess_data.token;
    if (!token) {
        res.status(404).render('frontend/index', {
            pageName: "404",
            pageTitle: "Oopps!"
        });
    }

    const decodedToken = jwt.verify(token);
    if (decodedToken) {
        req.user = decodedToken;
        if(!decodedToken.isAdmin){
            // show 404 page if the user is not Admin
            res.status(404).render('frontend/index', {
                pageName: "404",
                pageTitle: "Oopps!"
            });
        }else{
            next();
        }
    }
}