var express = require('express');
var router = express.Router();
var Post = require('../../models/post');


router.get('/article', function (req, res) {
    Post.find({}).sort({created_at: 1}).exec(function (err, posts) {
        if (err) throw err;

        res.render('public/article', {
            pageTitle: 'مقالات',
            pageID: 'article',
            posts: posts,
            language: 'fa'
        });
    });
});

module.exports = router;
