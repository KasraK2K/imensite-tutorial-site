import { Router } from 'express';

import { asyncHandler } from '../../../middleware/async-handler.js';
import Category from '../../../models/category.js';
import Post from '../../../models/post.js';

const router = Router();

router.get('/category/all', asyncHandler(async (_request, response) => {
  const categories = await Category.find({}).select('name slug').sort({ name: 1 }).exec();
  response.render('dashboard/categories/all', {
    pageTitle: 'دسته‌بندی‌ها',
    pageID: 'categories',
    categories,
    language: 'fa',
  });
}));

router.delete('/category/delete/:id', asyncHandler(async (request, response) => {
  const category = await Category.findByIdAndDelete(request.params.id).exec();
  if (category) {
    await Post.updateMany({}, { $pull: { category_id: category._id } }).exec();
  }
  response.redirect('/dashboard/category/all');
}));

export default router;
