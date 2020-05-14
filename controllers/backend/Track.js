const TrackModel = require('../../models/Track');
const ArtistModel = require('../../models/Artist');
const AlbumModel = require('../../models/Album');
const ValidationHandler = require('../../helpers/ValidationHandler');
var validationResult = null;

class Track {

    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        this.res.locals.userdata = this.req.user;
    }

    async index() {
        validationResult = null;
        try {
            const trackModel = new TrackModel(this.req, this.res);
            const tracks = await trackModel.getTracks();

            this.res.render('backend/index', {
                userType : this.req.user.type,
                pageName: "track/index",
                pageTitle: "Track",
                tracks : tracks
            });
        } catch (error) {
            console.error("Error Occured: ", error.message);
        }
    }

    async create() {
        const albumModel = new AlbumModel(this.req, this.res);
        const albums = await albumModel.getAlbums();
        
        this.res.render('backend/index', {
            userType : this.req.user.type,
            pageName: "track/create",
            pageTitle: "Add Track",
            albums : albums,
            validate : validationResult
        });
    }

    async store() {
        const trackModel = new TrackModel(this.req, this.res);
        const inputValidationResult = trackModel.validate(this.req.body);

        if (inputValidationResult.error != null) {
            const validationHandler = new ValidationHandler(this.req, this.res);
            validationResult = validationHandler.setInputValidation(inputValidationResult);
        } 
        else {
            try {
                validationResult = await trackModel.addTrack(this.req.body);
            } catch (error) {
                console.log("Track Adding Denied: ", error.message);
            }
        }
        console.log("Validation result",validationResult);
        this.res.redirect('/track/create');
    }

    async edit() {
        const trackId = this.req.params.id;
        const artistModel = new ArtistModel(this.req, this.res);
        const artists = await artistModel.getArtists();
        const albumModel = new AlbumModel(this.req, this.res);
        const albums = await albumModel.getalbums();

        try {
            const trackModel = new TrackModel(this.req, this.res);
            const track = await trackModel.getTrackById(trackId);
            this.res.render('backend/index', {
                userType : this.req.user.type,
                pageName: "track/edit",
                pageTitle: "Edit Track",
                validate : validationResult,
                track : track,
                artists : artists,
                albums : albums
            });
        } catch (error) {
            console.log("An error occured: ", error.message);
        }
    }

    async update(){
        const trackModel = new TrackModel(this.req, this.res);
        const inputValidationResult = trackModel.validate(this.req.body);

        if (inputValidationResult.error != null) {
            const validationHandler = new ValidationHandler(this.req, this.res);
            validationResult = validationHandler.setInputValidation(inputValidationResult);
        } 
        else {
            try {
                validationResult = await trackModel.updateTrack(this.req.params.id);
            } catch (error) {
                console.log("Track Updating Denied: ", error.message);
            }
        }
        this.res.redirect('/track/edit/'+this.req.params.id);
    }

    async delete() {
        const trackModel = new TrackModel(this.req, this.res);
        try {
            await trackModel.deleteTrack(this.req.body.id);   
        } catch (error) {
            console.log("Track Deleting Denied: ", error.message);
        }
        this.res.redirect('/track');
    }
}

module.exports = Track;