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

router.get('/post/edit/:id', asyncHandler(async (request, response) => {
  const [post, categories] = await Promise.all([
    Post.findById(request.params.id).exec(),
    Category.find({}).select('name').sort({ name: 1 }).exec(),
  ]);
  if (!post) {
    response.status(404).send('پست پیدا نشد.');
    return;
  }
  response.render('dashboard/posts/edit', {
    pageTitle: 'ویرایش پست', pageID: 'editpost', post, categories,
    selectedCategoryIds: post.category_id.map(String), language: 'fa',
  });
}));

router.put('/post/edit/:id', postValidation, asyncHandler(async (request, response) => {
  const post = await Post.findById(request.params.id).exec();
  if (!post) {
    response.status(404).send('پست پیدا نشد.');
    return;
  }

  const requestBody: unknown = request.body;
  const title = getStringField(requestBody, 'title');
  const suppliedSlug = getStringField(requestBody, 'slug');
  const description = getStringField(requestBody, 'description');
  const selectedCategoryIds = getStringArrayField(requestBody, 'category');
  const slug = createSlug(suppliedSlug || title);
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    const categories = await Category.find({}).select('name').sort({ name: 1 }).exec();
    response.status(422).render('dashboard/posts/edit', {
      pageTitle: 'ویرایش پست', pageID: 'editpost', errors: errors.array(),
      post: { ...post.toObject(), title, slug, description }, categories, selectedCategoryIds, language: 'fa',
    });
    return;
  }

  post.set({ title, slug, description, category_id: selectedCategoryIds });
  await post.save();
  response.redirect('/dashboard/post/all');
}));

export default router;
