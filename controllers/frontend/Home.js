class Home {
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
}

module.exports = new Home();