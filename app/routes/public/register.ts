import { Router } from 'express';
import { body, matchedData, validationResult } from 'express-validator';

import { asyncHandler } from '../../middleware/async-handler.js';
import User from '../../models/user.js';
import { getStringField } from '../../utils/form-data.js';

const router = Router();

function isDuplicateKeyError(error: unknown): error is { code: number } {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 11000;
}

router.get('/register', (_request, response) => {
  response.render('public/register', {
    pageTitle: 'فرم ثبت‌نام',
    pageID: 'register',
    language: 'fa',
  });
});

router.post(
  '/register',
  body('name').trim().notEmpty().withMessage('پر کردن فیلد نام الزامیست.'),
  body('email').trim().notEmpty().withMessage('پر کردن فیلد ایمیل الزامیست.').bail()
    .isEmail().withMessage('لطفا یک ایمیل صحیح وارد کنید.').normalizeEmail(),
  body('password').isLength({ min: 6, max: 72 })
    .withMessage('رمز ورود باید حداقل 6 و حداکثر 72 کاراکتر باشد.')
    .matches(/^(?=.*[A-Za-z])(?=.*\d).+$/)
    .withMessage('رمز عبور باید متشکل از عدد و حروف باشد.'),
  body('confirmPassword').custom((value: unknown, { req }) => value === getStringField(req.body as unknown, 'password'))
    .withMessage('رمز ورود و تکرار رمز ورود باید با هم برابر باشند.'),
  asyncHandler(async (request, response) => {
    const errors = validationResult(request);
    const values = matchedData<{ name?: string; email?: string }>(request, { onlyValidData: false });

    if (!errors.isEmpty()) {
      response.status(422).render('public/register', {
        pageTitle: 'فرم ثبت‌نام',
        pageID: 'register',
        errors: errors.array(),
        name: values.name,
        email: values.email,
        language: 'fa',
      });
      return;
    }

    const requestBody: unknown = request.body;
    const name = getStringField(requestBody, 'name');
    const email = getStringField(requestBody, 'email').toLowerCase();
    const password = getStringField(requestBody, 'password');

    try {
      await User.create({ name, email, password: await User.generateHash(password) });
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        response.status(409).render('public/register', {
          pageTitle: 'فرم ثبت‌نام',
          pageID: 'register',
          uniqueEmail: 'در حال حاضر کاربر با این ایمیل موجود می‌باشد.',
          name,
          email,
          language: 'fa',
        });
        return;
      }
      throw error;
    }

    response.status(201).render('public/login', {
      pageTitle: 'فرم ورود',
      pageID: 'login',
      success: 'اکانت کاربری شما با موفقیت ساخته شد.',
      language: 'fa',
    });
  }),
);

export default router;
