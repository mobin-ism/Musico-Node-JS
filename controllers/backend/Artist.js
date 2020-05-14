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

    async edit() {
        const artist_id = this.req.params.id;
        try {
            const artistModel = new ArtistModel(this.req, this.res);
            const artist = await artistModel.getArtistById(artist_id);
            this.res.render('backend/index', {
                userType : this.req.user.type,
                pageName: "artist/edit",
                pageTitle: "Edit Artist",
                validate : validationResult,
                artist : artist
            });
        } catch (error) {
            console.log("An error occured: ", error.message);
        }
    }

    async update(){
        const artistModel = new ArtistModel(this.req, this.res);
        const inputValidationResult = artistModel.validate(this.req.body);

        if (inputValidationResult.error != null) {
            const validationHandler = new ValidationHandler(this.req, this.res);
            validationResult = validationHandler.setInputValidation(inputValidationResult);
        } 
        else {
            try {
                validationResult = await artistModel.updateArtist(this.req.params.id);
            } catch (error) {
                console.log("Artist Updating Denied: ", error.message);
            }
        }
        this.res.redirect('/artist/edit/'+this.req.params.id);
    }

    async delete() {
        const artistModel = new ArtistModel(this.req, this.res);
        try {
            await artistModel.deleteArtist(this.req.body.id);   
        } catch (error) {
            console.log("Artist Deleting Denied: ", error.message);
        }
        this.res.redirect('/artist');
    }
}

module.exports = Artist;