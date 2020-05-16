const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const Gallery = require('../../controllers/backend/Gallery');
const multer = require('multer');
var path = require('path');

function randomString(length) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

const storageForGalleryImage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'media/gallery/');
    },
    filename: function (req, file, callback) {
        file.customName = randomString(20) + path.extname(file.originalname);
        callback(null, file.customName);
    }
});
const uploadGalleryImage = multer({
    storage: storageForGalleryImage
});

router.get("/", auth, function (req, res) {
    const gallery = new Gallery(req, res);
    gallery.index();
});

router.get("/create", auth, function (req, res) {
    const gallery = new Gallery(req, res);
    gallery.create();
});


router.post("/store", [uploadGalleryImage.single('image'), auth], function (req, res) {
    req.body.image = req.file.customName;
    const gallery = new Gallery(req, res);
    gallery.store();
});

router.delete("/delete", auth, function (req, res) {
    const gallery = new Gallery(req, res);
    gallery.delete();
});

module.exports = router;