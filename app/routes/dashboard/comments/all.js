var express = require('express');
var router = express.Router();
var Post = require('../../../models/post');
var Category = require('../../../models/category');
var Comment = require('../../../models/comment');


router.route('/comment/all')
    .all(function(req, res, next) {
        next();
    })
    .get(function(req, res) {
        // var newComment = new Comment({
        //     comment: 'خیلی ها الکی واسه اینکه بگن ما هم هستیم میان کامنت میزارن که اشکالی هم نداره فقط تایید نمیشه',
        //     commenter: 'کسری کرمی',
        //     approved: false,
        //     post_id: '5cb9e16e502b8d2d7cc1f99b',
        // });
        // newComment.save();

        Comment.find({}).select('comment commenter approved').exec(function (err, comments) {
            if (err) throw err;

            res.render('dashboard/comments/all', {
                pageTitle: 'کامنت‌ها',
                pageID: 'comments',
                comments: comments,
                language: 'fa'
            });
        });
    })

router.delete('/comment/delete/:id', function (req, res) {
    Comment.findByIdAndDelete(req.params.id, function (err) {
        if (err) throw err;
        res.redirect('/dashboard/comment/all');
    });
}); // delete comment

router.get('/comment/approve/:id', function (req, res) {
    Comment.findByIdAndUpdate(req.params.id, {
        approved: true
    }, function (err) {
        if (err) throw err;

        res.redirect('/dashboard/comment/all');
    });
}); // approve comment

router.get('/comment/susspend/:id', function (req, res) {
    Comment.findByIdAndUpdate(req.params.id, {
        approved: false
    }, function (err) {
        if (err) throw err;

        res.redirect('/dashboard/comment/all');
    });
}); // susspend comment


module.exports = router;
