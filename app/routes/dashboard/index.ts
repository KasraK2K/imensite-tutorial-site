import { Router } from 'express';

const router = Router();

router.get('/', (_request, response) => {
  response.render('dashboard/index', {
    pageTitle: 'داشبورد',
    pageID: 'dashboard',
    language: 'fa',
  });
});

export default router;
