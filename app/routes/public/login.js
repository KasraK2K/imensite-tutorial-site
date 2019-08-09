var express = require('express');
var router = express.Router()
var User = require('../../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

router.use(function (req, res, next) {
    if (req.isAuthenticated())
        res.redirect('/dashboard');
    else
        next();
});

router.get('/login', function (req, res) {
    res.render('public/login', {
        pageTitle: 'فرم ورود',
        pageID: 'login',
        language: 'fa'
    });
});

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function (email, password, done) {
    User.findOne({email: email.toLowerCase()}, function (err, user) {
        if (err) {
            return done(err)
        }

        if (!user) {
            return done(null, false, {});
        }

        if (!User.validPassword(password, user.password)) {
            return done(null, false, {});
        }

        return done(null, user);
    });
}));

router.post('/login', function (req, res, next) {
    var email = req.body.email.toLowerCase();
    var password = req.body.password;

    req.checkBody('email', 'پر کردن فیلد ایمیل الزامیست.').notEmpty();
    if (email) {
        req.checkBody('email', 'لطفا یک ایمیل صحیح وارد کنید.').isEmail();
    }
    req.checkBody('password', 'رمز ورود باید حداقل 6 و حداکثر 20 کاراکتر باشد.').isLength({min: 6, max: 20});
    req.checkBody('password', 'رمز عبور باید متشکل از عدد و حروف باشد.').matches(/([a-zA-Z]+[0-9]+|[0-9]+[a-zA-Z]+)/);

    var errors = req.validationErrors();
    if (errors) {
        res.render('public/login', {
            pageTitle: 'فرم ورود',
            pageID: 'login',
            errors: errors,
            email: email,
            language: 'fa'
        });
        return;
        // } else {
        //     User.findOne({ email: email }, function (err, user) {
        //         if(err)
        //             throw err;
        //         else if(!user)
        //             res.render('public/login', {
        //                 pageTitle: 'فرم ورود',
        //                 pageID: 'login',
        //                 emailError: 'ایمیل مورد نظر یافت نشد.',
        //                 email: email,
        //                 language: 'fa'
        //             });
        //         else if(!User.validPassword(password, user.password))
        //             res.render('public/login', {
        //                 pageTitle: 'فرم ورود',
        //                 pageID: 'login',
        //                 passwordError: 'رمز عبور اشتباه است.',
        //                 email: email,
        //                 language: 'fa'
        //             });
        //         else if(User.validPassword(password, user.password))
        //             res.json(user);
        //     });
    }
    next();
}, passport.authenticate('local-login', {failureRedirect: '/login'}), function (req, res) {
    console.log('login success');
    res.redirect('/dashboard');
});

module.exports = router;
