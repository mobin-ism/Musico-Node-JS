const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const Album = require('../../controllers/backend/Album');
const multer = require('multer');
var path = require('path');

function randomString(length) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

const storageForAlbumImage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'media/album/');
    },
    filename: function (req, file, callback) {
        file.customName = randomString(20) + path.extname(file.originalname);
        callback(null, file.customName);
    }
});
const uploadAlbumImage = multer({
    storage: storageForAlbumImage
});

router.get("/", auth, function (req, res) {
    const album = new Album(req, res);
    album.index();
});

router.get("/create", auth, function (req, res) {
    const album = new Album(req, res);
    album.create();
});


router.post("/store", [uploadAlbumImage.single('album_art'), auth], function (req, res) {
    req.body.image = req.file.customName;
    const album = new Album(req, res);
    album.store();
});

router.delete("/delete", auth, function (req, res) {
    const album = new Album(req, res);
    album.delete();
});

router.get("/edit/:id", auth, function (req, res) {
    const album = new Album(req, res);
    album.edit();
});


router.put("/update/:id", auth, function (req, res) {
    const album = new Album(req, res);
    album.update();
});

module.exports = router;