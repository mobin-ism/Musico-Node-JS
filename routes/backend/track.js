const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const Track = require('../../controllers/backend/Track');
const multer = require('multer');
var path = require('path');

function randomString(length) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

const storageForTracks = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'media/track/');
    },
    filename: function (req, file, callback) {
        file.customName = randomString(20) + path.extname(file.originalname);
        callback(null, file.customName);
    }
});
const uploadTrack = multer({
    storage: storageForTracks
});

router.get("/", auth, function (req, res) {
    const track = new Track(req, res);
    track.index();
});

router.get("/create", auth, function (req, res) {
    const track = new Track(req, res);
    track.create();
});


router.post("/store", [uploadTrack.single('track'), auth], function (req, res) {
    req.body.track = req.file.customName;
    const track = new Track(req, res);
    track.store();
});

router.delete("/delete", auth, function (req, res) {
    const track = new Track(req, res);
    track.delete();
});

router.get("/edit/:id", auth, function (req, res) {
    const track = new Track(req, res);
    track.edit();
});


router.put("/update/:id", auth, function (req, res) {
    const track = new Track(req, res);
    track.update();
});

module.exports = router;