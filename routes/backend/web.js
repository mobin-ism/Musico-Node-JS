const express = require('express');
const router = express.Router({strict: true});
const auth = require('../../middlewares/auth');
const Dashboard = require('../../controllers/backend/Dashboard');
const Artist = require('../../controllers/backend/Artist');
    
router.get("/dashboard", auth, function(req, res) {
    const dashboard = new Dashboard(req, res);
    dashboard.index();
});

router.get("/artist", auth, function(req, res) {
    const artist = new Artist(req, res);
    artist.index();
});

router.get("/artist/add", auth, function(req, res) {
    const artist = new Artist(req, res);
    artist.add();
});

module.exports = router;