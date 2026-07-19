import { Router, type RequestHandler } from 'express';
import { body, validationResult } from 'express-validator';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import User from '../../models/user.js';
import { getStringField } from '../../utils/form-data.js';

const router = Router();

passport.use('local-login', new LocalStrategy(
  { usernameField: 'email', passwordField: 'password' },
  (email, password, done) => {
    void (async () => {
      const user = await User.findOne({ email: email.toLowerCase() }).exec();
      if (!user || !(await User.validPassword(password, user.password))) {
        done(null, false);
        return;
      }
      done(null, user);
    })().catch(done);
  },
));

router.post('/logout', (request, response, next) => {
  request.logout((error) => {
    if (error) {
      next(error);
      return;
    }
    request.session.destroy((sessionError) => {
      if (sessionError) {
        next(sessionError);
        return;
      }
      response.clearCookie('connect.sid');
      response.redirect('/login');
    });
  });
});

router.use((request, response, next) => {
  if (request.isAuthenticated()) {
    response.redirect('/dashboard');
    return;
  }
  next();
});

router.get('/login', (_request, response) => {
  response.render('public/login', {
    pageTitle: 'فرم ورود',
    pageID: 'login',
    language: 'fa',
  });
});

router.post(
  '/login',
  body('email').trim().notEmpty().withMessage('پر کردن فیلد ایمیل الزامیست.').bail()
    .isEmail().withMessage('لطفا یک ایمیل صحیح وارد کنید.').normalizeEmail(),
  body('password').isLength({ min: 6, max: 72 })
    .withMessage('رمز ورود باید حداقل 6 و حداکثر 72 کاراکتر باشد.'),
  (request, response, next) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      response.status(422).render('public/login', {
        pageTitle: 'فرم ورود',
        pageID: 'login',
        errors: errors.array(),
        email: getStringField(request.body as unknown, 'email'),
        language: 'fa',
      });
      return;
    }
    next();
  },
  passport.authenticate('local-login', { failureRedirect: '/login' }) as RequestHandler,
  (_request, response) => response.redirect('/dashboard'),
);

export default router;
