var express = require('express');
var router = express.Router();
var User = require('../../models/user');

router.get('/register', function(req, res) {
    res.render('public/register', {
        pageTitle: 'فرم ثبت‌نام',
        pageID: 'register',
        language: 'fa'
    });
});

router.post('/register', function(req, res) {
    var name = req.body.name;
    var email = req.body.email.toLowerCase();
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;

    req.checkBody('name', 'پر کردن فیلد نام الزامیست.').notEmpty();
    req.checkBody('email', 'پر کردن فیلد ایمیل الزامیست.').notEmpty();
    if (email) { req.checkBody('email', 'لطفا یک ایمیل صحیح وارد کنید.').isEmail(); }
    req.checkBody('password', 'رمز ورود باید حداقل 6 و حداکثر 20 کاراکتر باشد.').isLength({ min: 6, max: 20 });
    req.checkBody('password', 'رمز عبور باید متشکل از عدد و حروف باشد.').matches(/([a-zA-Z]+[0-9]+|[0-9]+[a-zA-Z]+)/);
    req.checkBody('confirmPassword', 'تکرار رمز ورود باید حداقل 6 و حداکثر 20 کاراکتر باشد.').isLength({ min: 6, max: 20 });
    req.checkBody('confirmPassword', 'تکرار رمز عبور باید متشکل از عدد و حروف باشد.').matches(/([a-zA-Z]+[0-9]|[0-9]+[a-zA-Z]+)/);
    req.checkBody('confirmPassword', 'رمز ورود و تکرار رمز ورود باید با هم برابر باشند.').equals(password);

    var errors = req.validationErrors();
    if (errors) {
        res.render('public/register', {
            pageTitle: 'فرم ثبت‌نام',
            pageID: 'register',
            errors: errors,
            name: name,
            email: email,
            language: 'fa'
        });
        return;
    } else {
        var newUser = new User({
            name: name,
            email: email,
            password: User.generateHash(password),
        });

        newUser.save(function(err) {
            if (err)
                if (User.findOne({ email: email })) // inshart moshkel dare bayad dorostesh konam
                    res.render('public/login', {
                    pageTitle: 'فرم ورود',
                    pageID: 'login',
                    uniqueEmail: 'در حال حاضر کاربر با این ایمیل موجود می‌باشد.',
                    email: email,
                    language: 'fa'
                });
                else
                    throw err;
            else
                res.render('public/login', {
                    pageTitle: 'فرم ورود',
                    pageID: 'login',
                    success: 'اکانت کاربری شما با موفقیت ساخته شد.',
                    language: 'fa'
                });
        });
    }
});

module.exports = router;
