import { Router } from 'express';

import { requireAuthentication } from '../../middleware/authentication.js';
import categoryAllRouter from './categories/all.js';
import categoryCreateRouter from './categories/create.js';
import categoryEditRouter from './categories/edit.js';
import commentsRouter from './comments/all.js';
import indexRouter from './index.js';
import postAllRouter from './posts/all.js';
import postCreateRouter from './posts/create.js';
import postEditRouter from './posts/edit.js';
import supportRouter from './support/support.js';

const router = Router();

router.use(requireAuthentication);
router.use(indexRouter);
router.all('/post', (_request, response) => response.redirect('/dashboard/post/all'));
router.use(postAllRouter, postCreateRouter, postEditRouter);
router.all('/category', (_request, response) => response.redirect('/dashboard/category/all'));
router.use(categoryAllRouter, categoryCreateRouter, categoryEditRouter);
router.all('/comment', (_request, response) => response.redirect('/dashboard/comment/all'));
router.use(commentsRouter, supportRouter);

export default router;
