const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const Artist = require('../../controllers/backend/Artist');
const multer = require('multer');
var path = require('path');
function randomString(length) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

const storateForArtistImage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'media/artist/');
    },
    filename: function (req, file, callback) {
        file.customName = randomString(20) + path.extname(file.originalname);
        callback(null, file.customName);
    }
});
const uploadArtistImage = multer({
    storage: storateForArtistImage
});

router.get("/", auth, function (req, res) {
    const artist = new Artist(req, res);
    artist.index();
});

router.get("/create", auth, function (req, res) {
    const artist = new Artist(req, res);
    artist.create();
});


router.post("/store", [uploadArtistImage.single('image_artist'), auth], function (req, res) {
    console.log(req.body);
    req.body.image = req.file.customName;
    const artist = new Artist(req, res);
    artist.store();
});

router.delete("/delete", auth, function (req, res) {
    const artist = new Artist(req, res);
    artist.delete();
});

router.get("/edit/:id", auth, function (req, res) {
    const artist = new Artist(req, res);
    artist.edit();
});


router.put("/update/:id", auth, function (req, res) {
    const artist = new Artist(req, res);
    artist.update();
});

module.exports = router;