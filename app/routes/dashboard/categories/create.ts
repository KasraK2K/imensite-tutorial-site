import { Router } from 'express';
import { body, validationResult } from 'express-validator';

import { asyncHandler } from '../../../middleware/async-handler.js';
import Category from '../../../models/category.js';
import { getStringField } from '../../../utils/form-data.js';
import { createSlug } from '../../../utils/slug.js';

const router = Router();

router.get('/category/create', (_request, response) => {
  response.render('dashboard/categories/create', {
    pageTitle: 'ایجاد دسته‌بندی',
    pageID: 'createcategory',
    language: 'fa',
  });
});

router.post(
  '/category/create',
  body('name').trim().notEmpty().withMessage('پر کردن فیلد نام الزامیست.'),
  asyncHandler(async (request, response) => {
    const requestBody: unknown = request.body;
    const name = getStringField(requestBody, 'name');
    const suppliedSlug = getStringField(requestBody, 'slug');
    const slug = createSlug(suppliedSlug || name);
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      response.status(422).render('dashboard/categories/create', {
        pageTitle: 'ایجاد دسته‌بندی', pageID: 'createcategory', errors: errors.array(), name, slug, language: 'fa',
      });
      return;
    }

    await Category.create({ name, slug });
    response.redirect('/dashboard/category/all');
  }),
);

export default router;
