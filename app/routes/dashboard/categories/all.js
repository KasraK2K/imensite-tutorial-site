var express = require('express');
var router = express.Router();
var Category = require('../../../models/category');

router.route('/category/all')
    .all(function(req, res, next) {
        // var newCategory = new Category({
        //     name: 'دسته بندی دوم',
        //     slug: 'دسته-بندی-دوم',
        // });
        // newCategory.save();

        next();
    })
    .get(function(req, res) {
        Category.find({}).select('name slug').exec(function (err, categories) {
            if (err) throw err;

            res.render('dashboard/categories/all', {
                pageTitle: 'دسته‌بندی‌ها',
                pageID: 'categories',
                categories: categories,
                language: 'fa'
            });
        })
    })

router.delete('/category/delete/:id', function (req, res) {
    Category.findByIdAndDelete(req.params.id, function (err) {
        if (err) throw err;
        res.redirect('/dashboard/category/all');
    })
});


module.exports = router;
