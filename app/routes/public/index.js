var express = require('express');
var router = express.Router();
var Post = require('../../models/post');


router.get('/', function (req, res) {
    Post.find({}).sort({created_at: 1}).exec(function (err, posts) {
        if (err) throw err;

        res.render('public/index', {
            pageTitle: 'صفحه اصلی',
            pageID: 'home',
            posts: posts,
            language: 'fa'
        });
    });
});


module.exports = router;
