var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var cookieParser = require('cookie-parser');


function isLogedIn(req, res, next) {
    if (req.isAuthenticated())
        next();
    else
        res.redirect('/login');
}

router.route('/')
    .all(function (req, res, next) {
        next();
    })
    .get(function(req, res) {
        res.render('dashboard/index', {
            pageTitle: 'داشبورد',
            pageID: 'dashboard',
            language: 'fa'
        });
    })
    .post(function(req, res) {
        res.send('<h1>Dashboard-post</h1>');
    })
    .put(function(req, res) {
        res.send('<h1>Dashboard-put</h1>');
    })
    .delete(function(req, res) {
        res.send('<h1>Dashboard-delete</h1>');
    })


module.exports = router;
