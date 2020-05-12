const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const Dashboard = require('../../controllers/backend/Dashboard');
const Artist = require('../../controllers/backend/Artist');
const multer  = require('multer');
var path = require('path');

    
router.get("/dashboard", auth, function(req, res) {
    const dashboard = new Dashboard(req, res);
    dashboard.index();
});

router.get("/artist", auth, function(req, res) {
    const artist = new Artist(req, res);
    artist.index();
});

router.get("/artist/create", auth, function(req, res) {
    const artist = new Artist(req, res);
    artist.create();
});

function randomString(length) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

const storateForArtistImage = multer.diskStorage({
    destination : function(req, file, callback){
        callback(null, 'media/artist/');
    },
    filename : function(req, file, callback) {
        file.customName = randomString(20)+path.extname(file.originalname);
        callback(null, file.customName);
    }
});
const uploadArtistImage = multer({ storage : storateForArtistImage });
router.post("/artist/store",[uploadArtistImage.single('image_artist'), auth], function(req, res) {
    console.log(req.body);
    req.body.image = req.file.customName;
    const artist = new Artist(req, res);
    artist.store();
});

router.get("/artist/edit/:id", auth, function(req, res) {
    const artist = new Artist(req, res);
    artist.edit();
});


router.put("/artist/update/:id", auth, function(req, res) {    
    const artist = new Artist(req, res);
    artist.update();
});

router.delete("/artist/delete", auth, function(req, res) {
    const artist = new Artist(req, res);
    artist.delete();
});

module.exports = router;