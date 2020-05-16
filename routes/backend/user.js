const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const User = require('../../controllers/backend/User');
const multer = require('multer');
var path = require('path');

function randomString(length) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

const storageForUserImage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'media/user/');
    },
    filename: function (req, file, callback) {
        file.customName = randomString(20) + path.extname(file.originalname);
        callback(null, file.customName);
    }
});
const uploadUserImage = multer({
    storage: storageForUserImage
});

router.get("/", auth, function (req, res) {
    const user = new User(req, res);
    user.index();
});

router.get("/create", auth, function (req, res) {
    const user = new User(req, res);
    user.create();
});


router.post("/store", [uploadUserImage.single('image'), auth], function (req, res) {
    req.body.image = req.file.customName;
    const user = new User(req, res);
    user.store();
});

router.delete("/delete", auth, function (req, res) {
    const user = new User(req, res);
    user.delete();
});

router.get("/edit/:id", auth, function (req, res) {
    const user = new User(req, res);
    user.edit();
});


router.put("/update/:id", [uploadUserImage.single('image'), auth], function (req, res) {
    if(req.file){
        req.body.image = req.file.customName;
    }
    console.log(req.file);
    const user = new User(req, res);
    user.update();
});

module.exports = router;