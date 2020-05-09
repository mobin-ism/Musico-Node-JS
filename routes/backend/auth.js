const express = require('express');
const router = express.Router();

const auth = require('../../controllers/backend/AuthController');

router.get('/login', auth.getLogin);
router.post('/login', auth.postLogin);

router.get('/registration', auth.getRegistration);
router.post('/registration', auth.postRegistration);

router.get('/logout', auth.getLogout);

router.get('/refresh', auth.refresh);

module.exports = router;