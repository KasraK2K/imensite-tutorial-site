import { Router } from 'express';

import { asyncHandler } from '../../../middleware/async-handler.js';
import Comment from '../../../models/comment.js';
import Post from '../../../models/post.js';

const router = Router();

router.get('/post/all', asyncHandler(async (_request, response) => {
  const posts = await Post.find({})
    .select('title slug category_id')
    .populate('category_id', 'name')
    .sort({ created_at: -1 })
    .exec();
  response.render('dashboard/posts/all', {
    pageTitle: 'همه پست‌ها', pageID: 'allposts', posts, language: 'fa',
  });
}));

router.delete('/post/delete/:id', asyncHandler(async (request, response) => {
  const post = await Post.findByIdAndDelete(request.params.id).exec();
  if (post) {
    await Comment.deleteMany({ post_id: post._id }).exec();
  }
  response.redirect('/dashboard/post/all');
}));

export default router;
