const express = require('express');
const router = express.Router();
const HomeController = require('../../controllers/frontend/HomeController');
const homeController = new HomeController();

router.get('/', homeController.index);
router.get('/artists', homeController.artists);
router.get('/albums', homeController.albums);
router.get('/about', homeController.about);
router.get('/login', homeController.login);
router.get('/registration', homeController.registration);

module.exports = router;