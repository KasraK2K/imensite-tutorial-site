var express = require('express');
var router = express.Router();
var Post = require('../../../models/post');
var Category = require('../../../models/category');
var getSlug = require('speakingurl');


router.get('/post/edit/:id', function (req, res) {
    Post.findById(req.params.id, function (err, post) {
        if (err) throw err;

        Category.find({}).select('name').exec(function (err, categories) {
            if (err) throw err;

            res.render('dashboard/posts/edit', {
                pageTitle: 'ویرایش پست',
                pageID: 'editpost',
                post: post,
                categories: categories,
                language: 'fa'
            });
        })
    });
});

router.put('/post/edit/:id', function (req, res) {
    var title = req.body.title;
    if (!req.body.slug.length) {
        var slug = getSlug(req.body.title, {
            custom: persianCharacters,
            separator: '-',
            lang: 'fa'
        }); // if slug was empety
    } else {
        var slug = getSlug(req.body.slug, {
            custom: persianCharacters,
            separator: '-',
            lang: 'fa'
        }); // if slug was not empety
    }
    var description = req.body.description;
    var category_id = req.body.category;

    req.checkBody('title', 'پر کردن فیلد نام الزامیست.').notEmpty();
    req.checkBody('description', 'پر کردن فیلد محتوا الزامیست.').notEmpty();
    req.checkBody('category', 'پر کردن فیلد دسته‌بندی الزامیست.').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        Post.findById(req.params.id, function (err, post) {
            if (err) throw err;

            Category.find({}).select('name').exec(function (err, categories) {
                if (err) throw err;

                res.render('dashboard/posts/edit', {
                    pageTitle: 'ویرایش پست',
                    pageID: 'editpost',
                    errors: errors,
                    post: post,
                    categories: categories,
                    language: 'fa'
                });
            });
        })
        return;
    } // handle errors before edit post

    Post.findByIdAndUpdate(req.params.id, {
        title: title,
        slug: slug,
        description: description,
        category_id: category_id,
    }, function (err, post) {
        if (err) throw err;

        res.redirect('/dashboard/post/all'); // update post
    });
});


module.exports = router;
