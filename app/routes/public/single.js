var express = require('express');
var router = express.Router();
var Post = require('../../models/post');
var Category = require('../../models/category');
var Comment = require('../../models/comment');

router.get('/article/:slug', function (req, res) {
    Post.findOne({slug: req.params.slug}, function (err, post) {
        if (err) throw err;

        Comment
            .find({post_id: post._id})
            .where('approved').equals(true)
            .exec(function (err, comments) {
                if (err) throw err;

                res.render('public/single', {
                    pageTitle: post.title,
                    pageID: 'post-' + post._id,
                    // pageID: 'singlepost',
                    post: post,
                    comments: comments,
                    language: 'fa'
                });
            });
    })
});

router.post('/article/:slug', function (req, res) {
    var comment = req.body.comment;
    var commenter = req.body.commenter;

    req.checkBody('comment', 'نوشتن متن کامنت الزامیست.').notEmpty();
    req.checkBody('commenter', 'نوشتن نام و نام خانوادگی الزامیست.').notEmpty();

    var errors = req.validationErrors();
    if (errors) {

        Post.findOne({slug: req.params.slug}, function (err, post) {
            if (err) throw err;

            Comment
                .find({post_id: post._id})
                .where('approved').equals(true)
                .exec(function (err, comments) {
                    if (err) throw err;

                    res.render('public/single', {
                        pageTitle: post.title,
                        pageID: 'post-' + post._id,
                        post: post,
                        comments: comments,
                        errors: errors,
                        language: 'fa'
                    });
                });
        });
        // res.redirect(req.get('referer'));
        return;
    }

    Post.findOne({slug: req.params.slug}, function (err, post) {
        if (err) throw err;

        var newComment = new Comment({
            comment: comment,
            commenter: commenter, // badan bayad ino az name karbari ke vared shode begiram ama alan az request migiram
            approved: false,
            post_id: post._id,
        });
        newComment.save();

        Comment
            .find({post_id: post._id})
            .where('approved').equals(true)
            .exec(function (err, comments) {
                if (err) throw err;

                res.render('public/single', {
                    pageTitle: post.title,
                    pageID: 'post-' + post._id,
                    post: post,
                    comments: comments,
                    commentSent: 'دیدگاه شما با موفقیت ارسال شد که پس از برسی و تایید در سایت منتشر می‌شود.',
                    language: 'fa'
                });
            });
    });
});

module.exports = router;
