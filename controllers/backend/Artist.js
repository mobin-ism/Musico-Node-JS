const ArtistModel = require('../../models/Artist');
const ValidationHandler = require('../../helpers/ValidationHandler');
var validationResult = null;

class Artist {

    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        this.res.locals.userdata = this.req.user;
    }

    async index() {
        validationResult = null;
        try {
            const artistModel = new ArtistModel(this.req, this.res);
            const artists = await artistModel.getArtists();
            this.res.render('backend/index', {
                userType : this.req.user.type,
                pageName: "artist/index",
                pageTitle: "Artist",
                artists : artists
            });
        } catch (error) {
            console.error("Error Occured: ", error.message);
        }
    }

    create() {
        this.res.render('backend/index', {
            userType : this.req.user.type,
            pageName: "artist/create",
            pageTitle: "Add Artist",
            validate : validationResult
        });
    }

    async store() {
        const artistModel = new ArtistModel(this.req, this.res);
        const inputValidationResult = artistModel.validate(this.req.body);

        if (inputValidationResult.error != null) {
            console.log(inputValidationResult.error);
            const validationHandler = new ValidationHandler(this.req, this.res);
            validationResult = validationHandler.setInputValidation(inputValidationResult);
        } 
        else {
            try {
                validationResult = await artistModel.addArtist(this.req.body);
            } catch (error) {
                console.log("Artist Adding Denied: ", error.message);
            }
        }
        this.res.redirect('/artist/create');
    }
}

module.exports = Artist;