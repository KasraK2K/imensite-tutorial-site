var express = require('express');
var router = express.Router();


router.use(require('./index')); // home page - root
router.use(require('./article')); // article page - all post
router.use(require('./single')); // single post page
router.use(require('./login')); // login
router.use(require('./register')); // register
module.exports = router;
