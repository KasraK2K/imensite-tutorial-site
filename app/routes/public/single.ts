import { Router, type Response } from 'express';
import { body, validationResult, type ValidationError } from 'express-validator';

import { asyncHandler } from '../../middleware/async-handler.js';
import Comment from '../../models/comment.js';
import Post, { type IPost } from '../../models/post.js';
import type { HydratedDocument } from 'mongoose';
import { getStringField } from '../../utils/form-data.js';

const router = Router();

async function renderArticle(
  response: Response,
  post: HydratedDocument<IPost>,
  options: { errors?: ValidationError[]; commentSent?: string } = {},
): Promise<void> {
  const comments = await Comment.find({ post_id: post._id, approved: true })
    .sort({ created_at: -1 })
    .exec();

  response.render('public/single', {
    pageTitle: post.title,
    pageID: `post-${post.id}`,
    post,
    comments,
    language: 'fa',
    ...options,
  });
}

router.get('/article/:slug', asyncHandler(async (request, response) => {
  const post = await Post.findOne({ slug: request.params.slug }).exec();
  if (!post) {
    response.status(404).send('مقاله پیدا نشد.');
    return;
  }

  await renderArticle(response, post);
}));

router.post(
  '/article/:slug',
  body('comment').trim().notEmpty().withMessage('نوشتن متن کامنت الزامیست.'),
  body('commenter').trim().notEmpty().withMessage('نوشتن نام و نام خانوادگی الزامیست.'),
  asyncHandler(async (request, response) => {
    const post = await Post.findOne({ slug: request.params.slug }).exec();
    if (!post) {
      response.status(404).send('مقاله پیدا نشد.');
      return;
    }

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      await renderArticle(response.status(422), post, { errors: errors.array() });
      return;
    }

    const requestBody: unknown = request.body;
    await Comment.create({
      comment: getStringField(requestBody, 'comment'),
      commenter: getStringField(requestBody, 'commenter'),
      approved: false,
      post_id: post._id,
    });

    await renderArticle(response.status(201), post, {
      commentSent: 'دیدگاه شما با موفقیت ارسال شد و پس از بررسی و تایید در سایت منتشر می‌شود.',
    });
  }),
);

export default router;
