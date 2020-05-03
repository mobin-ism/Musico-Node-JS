class HomeController {
    // FOR RENDERING HOMEPAGE
    index(req, res) {
        res.render('frontend/index', {
            pageName: "home",
            pageTitle: "Home"
        });
    }

    // FOR RENDERING ARTISTS
    artists(req, res) {
        res.render('frontend/index', {
            pageName: "artists",
            pageTitle: "Artists"
        });
    }

    // FOR RENDERING ALBUMS
    albums(req, res) {
        res.render('frontend/index', {
            pageName: "albums",
            pageTitle: "Albums"
        });
    }

    // FOR RENDERING ABOUT
    about(req, res) {
        res.render('frontend/index', {
            pageName: "about",
            pageTitle: "About"
        });
    }

    // FOR RENDERING LOGIN
    login(req, res) {
        res.render('backend/pages/common/index', {
            pageName: "login",
            pageTitle: "Login"
        });
    }

    // FOR RENDERING REGISTRATION
    registration(req, res) {
        res.render('backend/pages/common/index', {
            pageName: "registration",
            pageTitle: "Registration"
        });
    }
}

module.exports = HomeController;