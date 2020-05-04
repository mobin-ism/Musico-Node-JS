const express = require('express');
const router = express.Router();

const LoginRegistraion = require('../../controllers/backend/LoginController');
const loginRegistraion = new LoginRegistraion();

router.post('/register', loginRegistraion.register);

module.exports = router;