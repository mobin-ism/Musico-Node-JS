const express = require('express');
const router = express.Router();

const login = require('../../controllers/backend/Login');

router.get('/login', login.getLogin);
router.post('/login', login.postLogin);

router.get('/registration', login.getRegistration);
router.post('/registration', login.postRegistration);

router.get('/refresh', login.refresh);

module.exports = router;