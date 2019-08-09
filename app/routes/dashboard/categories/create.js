var express = require('express');
var router = express.Router();
var Post = require('../../../models/post');
var Category = require('../../../models/category');
var getSlug = require('speakingurl');


router.route('/category/create')
    .all(function(req, res, next) {
        next();
    })
    .get(function(req, res) {
        res.render('dashboard/categories/create', {
            pageTitle: 'ایجاد دسته‌بندی',
            pageID: 'createcategory',
            language: 'fa'
        });
    })
    .post(function(req, res) {
        var name = req.body.name;
        if (!req.body.slug.length) {
            var slug = getSlug(req.body.name, {
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

        req.checkBody('name', 'پر کردن فیلد نام الزامیست.').notEmpty();

        var errors = req.validationErrors();
        if (errors) {
            res.render('dashboard/categories/create', {
                pageTitle: 'ایجاد دسته‌بندی',
                pageID: 'createcategory',
                errors: errors,
                name: name,
                slug: slug,
                language: 'fa'
            });
            return;
        } // handle errors before save category

        new Category({
            name: name,
            slug: slug,
        }).save(function (err, post) {
            if (err) throw err;
            res.redirect('/dashboard/category/all');
        }); // save category
    })

module.exports = router;
