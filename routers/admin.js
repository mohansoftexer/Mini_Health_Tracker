var express = require('express');
var router = express.Router();
var verification = require('./VerificationToken')

router.post('/dashboard', verification, (req, res) => {
    var dashboard_route = require('../Controllers/Admin/AdminDashboard');
    dashboard_route.dashboard_route(req, res)
})

module.exports = router;