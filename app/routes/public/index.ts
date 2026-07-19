import { Router } from 'express';

import { asyncHandler } from '../../middleware/async-handler.js';
import Post from '../../models/post.js';

const router = Router();

router.get('/', asyncHandler(async (_request, response) => {
  const posts = await Post.find({}).sort({ created_at: -1 }).exec();
  response.render('public/index', {
    pageTitle: 'صفحه اصلی',
    pageID: 'home',
    posts,
    language: 'fa',
  });
}));

export default router;
