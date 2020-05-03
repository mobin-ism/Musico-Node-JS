module.exports = function(req, res, next) {
    res.status(404).render('frontend/index', {
        pageName: "404",
        pageTitle: "Oopps!"
    });
}