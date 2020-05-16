const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const Settings = require('../../controllers/backend/Settings');


router.get("/", auth, function (req, res) {
    const settings = new Settings(req, res);
    settings.index();
});

router.put("/update", auth, function (req, res) {
    const settings = new Settings(req, res);
    settings.update();
});

module.exports = router;