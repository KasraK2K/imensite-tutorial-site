var express = require('express');
var router = express.Router();
var Post = require('../../../models/post');
var Category = require('../../../models/category');


router.route('/post/all')
    .all(function(req, res, next) {
        next();
    })
    .get(function(req, res) {
        Post.find({}).select('title slug category_id').exec(function (err, posts) {
            // var newPost = new Post({
            //     title: 'عنوان تستی برای پست دستی',
            //     slug: 'عنوان-تستی-برای-پست-دستی',
            //     description: 'یک متن الکی برای امتحان کردن به روشهای گوناگونی جانداران بسیار متحیر کنندگی خوب این نوع از شوینده است.',
            // });
            // newPost.save();

            if (err) throw err;

            Category.find({}).select('name').exec(function (err, categories) {
                if (err) throw err;

                res.render('dashboard/posts/all', {
                    pageTitle: 'همه پست‌ها',
                    pageID: 'allposts',
                    posts: posts,
                    categories: categories,
                    language: 'fa'
                });
            })
        });
    })
    .post(function(req, res) {

    })
    .put(function(req, res) {

    })

router.delete('/post/delete/:id', function (req, res) {
    Post.findByIdAndDelete(req.params.id, function (err) {
        if (err) throw err;
        res.redirect('/dashboard/post/all');
    })
});


module.exports = router;
