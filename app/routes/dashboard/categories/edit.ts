import { Router } from 'express';
import { body, validationResult } from 'express-validator';

import { asyncHandler } from '../../../middleware/async-handler.js';
import Category from '../../../models/category.js';
import { getStringField } from '../../../utils/form-data.js';
import { createSlug } from '../../../utils/slug.js';

const router = Router();

router.get('/category/edit/:id', asyncHandler(async (request, response) => {
  const category = await Category.findById(request.params.id).exec();
  if (!category) {
    response.status(404).send('دسته‌بندی پیدا نشد.');
    return;
  }
  response.render('dashboard/categories/edit', {
    pageTitle: 'ویرایش دسته‌بندی', pageID: 'editcategory', category, language: 'fa',
  });
}));

router.put(
  '/category/edit/:id',
  body('name').trim().notEmpty().withMessage('پر کردن فیلد نام الزامیست.'),
  asyncHandler(async (request, response) => {
    const category = await Category.findById(request.params.id).exec();
    if (!category) {
      response.status(404).send('دسته‌بندی پیدا نشد.');
      return;
    }

    const requestBody: unknown = request.body;
    const name = getStringField(requestBody, 'name');
    const suppliedSlug = getStringField(requestBody, 'slug');
    const slug = createSlug(suppliedSlug || name);
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      response.status(422).render('dashboard/categories/edit', {
        pageTitle: 'ویرایش دسته‌بندی', pageID: 'editcategory', errors: errors.array(),
        category: { ...category.toObject(), name, slug }, language: 'fa',
      });
      return;
    }

    category.set({ name, slug });
    await category.save();
    response.redirect('/dashboard/category/all');
  }),
);

export default router;
