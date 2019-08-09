var express = require('express');
var router = express.Router();
var Post = require('../../../models/post');
var Category = require('../../../models/category');
var getSlug = require('speakingurl');


router.route('/post/create')
    .all(function(req, res, next) {
        next();
    })
    .get(function(req, res) {
        Category.find({}).select('name').exec(function (err, categories) {
            if (err) throw err;

            res.render('dashboard/posts/create', {
                pageTitle: 'ایجاد پست',
                pageID: 'createpost',
                categories: categories,
                language: 'fa'
            });
        }) // show create post form and send all category to chose in form
    })
    .post(function(req, res) {
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
            Category.find({}).select('name').exec(function (err, categories) {
                if (err) throw err;

                res.render('dashboard/posts/create', {
                    pageTitle: 'ایجاد پست',
                    pageID: 'createpost',
                    errors: errors,
                    title: title,
                    slug: slug,
                    description: description,
                    categories: categories,
                    category_id: category_id,
                    language: 'fa'
                });
            })
            return;
        } // handle errors before save post

        new Post({
            title: title,
            slug: slug,
            description: description,
            category_id: category_id,
        }).save(function (err, post) {
            if (err) throw err;
            res.redirect('/dashboard/post/all');
        }); // save post
    })


module.exports = router;
