var express = require('express');
var router = express.Router();
var Post = require('../../../models/post');
var Category = require('../../../models/category');
var getSlug = require('speakingurl');


router.get('/category/edit/:id', function (req, res) {
    Category.findById(req.params.id, function (err, category) {
        if (err) throw err;

        res.render('dashboard/categories/edit', {
            pageTitle: 'ویرایش دسته‌بندی',
            pageID: 'editcategory',
            category: category,
            language: 'fa'
        });
    });
});

router.put('/category/edit/:id', function (req, res) {
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
        Category.findById(req.params.id, function (err, category) {
            if (err) throw err;

            res.render('dashboard/categories/edit', {
                pageTitle: 'ایجاد دسته‌بندی',
                pageID: 'createcategory',
                errors: errors,
                name: name,
                slug: slug,
                category: category,
                language: 'fa'
            });
        })
        return;
    } // handle errors before edit category

    Category.findByIdAndUpdate(req.params.id, {
        name: name,
        slug: slug,
    }, function (err, category) {
        if (err) throw err;

        res.redirect('/dashboard/category/all'); // update category
    });
});


module.exports = router;
