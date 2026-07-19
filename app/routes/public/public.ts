import { Router } from 'express';

import articleRouter from './article.js';
import indexRouter from './index.js';
import loginRouter from './login.js';
import registerRouter from './register.js';
import singleRouter from './single.js';

const router = Router();

router.use(indexRouter, articleRouter, singleRouter, loginRouter, registerRouter);

export default router;
