const AlbumModel = require('../../models/Album');
const ArtistModel = require('../../models/Artist');
const ValidationHandler = require('../../helpers/ValidationHandler');
var validationResult = null;

class Album {

    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        this.res.locals.userdata = this.req.user;
    }

    async index() {
        validationResult = null;
        try {
            const albumModel = new AlbumModel(this.req, this.res);
            const albums = await albumModel.getAlbums();
            this.res.render('backend/index', {
                userType : this.req.user.type,
                pageName: "album/index",
                pageTitle: "Album",
                albums : albums
            });
        } catch (error) {
            console.error("Error Occured: ", error.message);
        }
    }

    async create() {
        const artistModel = new ArtistModel(this.req, this.res);
        const artists = await artistModel.getArtists();
        
        this.res.render('backend/index', {
            userType : this.req.user.type,
            pageName: "album/create",
            pageTitle: "Add Album",
            artists : artists,
            validate : validationResult
        });
    }

    async store() {
        const albumModel = new AlbumModel(this.req, this.res);
        const inputValidationResult = albumModel.validate(this.req.body);

        if (inputValidationResult.error != null) {
            const validationHandler = new ValidationHandler(this.req, this.res);
            validationResult = validationHandler.setInputValidation(inputValidationResult);
        } 
        else {
            try {
                validationResult = await albumModel.addAlbum(this.req.body);
            } catch (error) {
                console.log("Album Adding Denied: ", error.message);
            }
        }
        console.log("Validation result",validationResult);
        this.res.redirect('/album/create');
    }

    async edit() {
        const albumId = this.req.params.id;
        const artistModel = new ArtistModel(this.req, this.res);
        const artists = await artistModel.getArtists();
        try {
            const albumModel = new AlbumModel(this.req, this.res);
            const album = await albumModel.getAlbumById(albumId);
            this.res.render('backend/index', {
                userType : this.req.user.type,
                pageName: "album/edit",
                pageTitle: "Edit Album",
                validate : validationResult,
                album : album,
                artists : artists
            });
        } catch (error) {
            console.log("An error occured: ", error.message);
        }
    }

    async update(){
        const albumModel = new AlbumModel(this.req, this.res);
        const inputValidationResult = albumModel.validate(this.req.body);

        if (inputValidationResult.error != null) {
            const validationHandler = new ValidationHandler(this.req, this.res);
            validationResult = validationHandler.setInputValidation(inputValidationResult);
        } 
        else {
            try {
                validationResult = await albumModel.updateAlbum(this.req.params.id);
            } catch (error) {
                console.log("Album Updating Denied: ", error.message);
            }
        }
        this.res.redirect('/album/edit/'+this.req.params.id);
    }

    async delete() {
        const albumModel = new AlbumModel(this.req, this.res);
        try {
            await albumModel.deleteAlbum(this.req.body.id);   
        } catch (error) {
            console.log("Album Deleting Denied: ", error.message);
        }
        this.res.redirect('/album');
    }
}

module.exports = Album;