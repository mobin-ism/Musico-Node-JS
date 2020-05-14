const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const Dashboard = require('../../controllers/backend/Dashboard');

router.get("/dashboard", auth, function(req, res) {
    const dashboard = new Dashboard(req, res);
    dashboard.index();
});

module.exports = router;