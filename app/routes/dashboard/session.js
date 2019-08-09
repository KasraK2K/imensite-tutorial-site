var express = require('express');
var router = express.Router();


router.get('/cookie', function (req, res) {
    res.cookie('cookieName', 'cookieValue', {
        expires: new Date(Date.now() + 900000),
        httpOnly: true,
    });
    res.json(req.cookies);
});

router.get('/session', function (req, res) {
    req.session.name = 'Kasra';
    req.session.family = 'Karami';

    res.json(req.session);
});


module.exports = router;
