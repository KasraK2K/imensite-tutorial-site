import { Router } from 'express';
import { body, validationResult } from 'express-validator';

import { asyncHandler } from '../../../middleware/async-handler.js';
import Category from '../../../models/category.js';
import Post from '../../../models/post.js';
import { getStringArrayField, getStringField } from '../../../utils/form-data.js';
import { createSlug } from '../../../utils/slug.js';

const router = Router();
const postValidation = [
  body('title').trim().notEmpty().withMessage('پر کردن فیلد نام الزامیست.'),
  body('description').trim().notEmpty().withMessage('پر کردن فیلد محتوا الزامیست.'),
  body('category').notEmpty().withMessage('پر کردن فیلد دسته‌بندی الزامیست.'),
];

router.get('/post/create', asyncHandler(async (_request, response) => {
  const categories = await Category.find({}).select('name').sort({ name: 1 }).exec();
  response.render('dashboard/posts/create', {
    pageTitle: 'ایجاد پست', pageID: 'createpost', categories, selectedCategoryIds: [], language: 'fa',
  });
}));

router.post('/post/create', postValidation, asyncHandler(async (request, response) => {
  const requestBody: unknown = request.body;
  const title = getStringField(requestBody, 'title');
  const suppliedSlug = getStringField(requestBody, 'slug');
  const description = getStringField(requestBody, 'description');
  const selectedCategoryIds = getStringArrayField(requestBody, 'category');
  const slug = createSlug(suppliedSlug || title);
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    const categories = await Category.find({}).select('name').sort({ name: 1 }).exec();
    response.status(422).render('dashboard/posts/create', {
      pageTitle: 'ایجاد پست', pageID: 'createpost', errors: errors.array(), title, slug, description,
      categories, selectedCategoryIds, language: 'fa',
    });
    return;
  }

  await Post.create({ title, slug, description, category_id: selectedCategoryIds });
  response.redirect('/dashboard/post/all');
}));

export default router;
