var express = require('express');
var router = express.Router();


router.get('/support', function (req, res) {
    res.render('dashboard/support/support', {
        pageTitle: 'پشتیبانی',
        pageID: 'support',
        language: 'fa'
    });
});


module.exports = router;
