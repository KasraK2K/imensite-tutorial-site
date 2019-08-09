var express = require('express');
var router = express.Router();


router.param('id', function (req, res, next, id) {
    req.params.id = {
        id: 1,
        author: 'kasra',
        title: 'my first title',
        description: 'it is my sample description then you do not need to read this'
    }
    next();
}); // bazi ba parametr
router.get('/article/:id', function (req, res) {
    res.send(req.params.id);
}); // bazi ba parametr

// router.use(function (req, res, next) {
//     if (req.isAuthenticated())
//         next();
//     else
//         res.redirect('/login');
// }); // cheack user Authenticate

// dashboard main
router.use(require('./index'));

// post
router.route('/post').all(function (req, res) {
    res.redirect('/dashboard/post/all');
}); // redirect from route /post to all post page
router.use(require('./posts/all'));
router.use(require('./posts/create'));
router.use(require('./posts/edit'));

// category
router.route('/category').all(function (req, res) {
    res.redirect('/dashboard/category/all');
}); // redirect from route /category to all category page
router.use(require('./categories/all'));
router.use(require('./categories/create'));
router.use(require('./categories/edit'));

// comment
router.route('/comment').all(function (req, res) {
    res.redirect('/dashboard/comment/all');
}); // redirect from route /comment to all comment page
router.use(require('./comments/all'));

// support
router.use(require('./support/support'));


module.exports = router;
