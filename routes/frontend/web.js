const express = require('express');
const router = express.Router();
const home = require('../../controllers/frontend/Home');

router.get('/', home.index);
router.get('/artists', home.artists);
router.get('/albums', home.albums);
router.get('/about', home.about);

module.exports = router;