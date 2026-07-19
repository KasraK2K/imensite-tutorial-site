import { Router } from 'express';

import { asyncHandler } from '../../../middleware/async-handler.js';
import Comment from '../../../models/comment.js';

const router = Router();

router.get('/comment/all', asyncHandler(async (_request, response) => {
  const comments = await Comment.find({}).sort({ created_at: -1 }).exec();
  response.render('dashboard/comments/all', {
    pageTitle: 'کامنت‌ها',
    pageID: 'comments',
    comments,
    language: 'fa',
  });
}));

router.delete('/comment/delete/:id', asyncHandler(async (request, response) => {
  await Comment.findByIdAndDelete(request.params.id).exec();
  response.redirect('/dashboard/comment/all');
}));

router.patch('/comment/approve/:id', asyncHandler(async (request, response) => {
  await Comment.findByIdAndUpdate(request.params.id, { approved: true }).exec();
  response.redirect('/dashboard/comment/all');
}));

router.patch('/comment/suspend/:id', asyncHandler(async (request, response) => {
  await Comment.findByIdAndUpdate(request.params.id, { approved: false }).exec();
  response.redirect('/dashboard/comment/all');
}));

export default router;
