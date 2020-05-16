const TrackModel = require('../../models/Track');
const ArtistModel = require('../../models/Artist');
const AlbumModel = require('../../models/Album');
const SettingsModel = require('../../models/Settings');
const GalleryModel = require('../../models/Gallery');

class Home {

    // FOR RENDERING HOMEPAGE
    async index(req, res) {
        const trackModel = new TrackModel(req, res);
        const albumModel = new AlbumModel(req, res);
        const artistModel = new ArtistModel(req, res);
        const galleryModel = new GalleryModel(req, res);

        try {
            const featuredTrack = await trackModel.getFeaturedTrack();
            const latestTracks = await trackModel.getLatestTracks();
            const latestAlbums = await albumModel.getLatestAlbums();
            const featuredArtist = await artistModel.getFeaturedArtist();
            const galleryImages = await galleryModel.getGalleryImages();

            res.render('frontend/index', {
                pageName: "home",
                pageTitle: "Home",
                featuredTrack: featuredTrack,
                latestTracks: latestTracks,
                latestAlbums: latestAlbums,
                featuredArtist: featuredArtist,
                galleryImages: galleryImages
            });
        } catch (error) {
            console.log("An Error Occured:", error.message);
        }
    }

    // FOR RENDERING ARTISTS
    async artists(req, res) {
        const artistModel = new ArtistModel(req, res);
        try {
            const artists = await artistModel.getArtists();
            res.render('frontend/index', {
                pageName: "artists",
                pageTitle: "Artists",
                artists : artists
            });   
        } catch (error) {
            console.log("An Error Occured: ", error.message);
        }
    }

    // FOR RENDERING ALBUMS
    async albums(req, res) {
        const albumModel = new AlbumModel(req, res);
        try {
            const albums = await albumModel.getAlbums();
            res.render('frontend/index', {
                pageName: "albums",
                pageTitle: "Albums",
                albums : albums
            });
        } catch (error) {
            console.log("An Error Occured: ", error.message);
        }
    }

    // FOR RENDERING ABOUT
    async about(req, res) {
        const settingsModel = new SettingsModel(req, res);
        try {
            const settingsData = await settingsModel.getAbout();
            res.render('frontend/index', {
                pageName: "about",
                pageTitle: "About",
                about: settingsData.value
            });
        } catch (error) {
            console.log("An Error Occured:", error.message);
        }
    }
}

module.exports = new Home();