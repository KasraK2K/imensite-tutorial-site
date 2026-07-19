import { Router } from 'express';

import { asyncHandler } from '../../middleware/async-handler.js';
import Post from '../../models/post.js';

const router = Router();

router.get('/article', asyncHandler(async (_request, response) => {
  const posts = await Post.find({}).sort({ created_at: -1 }).exec();
  response.render('public/article', {
    pageTitle: 'مقالات',
    pageID: 'article',
    posts,
    language: 'fa',
  });
}));

export default router;
