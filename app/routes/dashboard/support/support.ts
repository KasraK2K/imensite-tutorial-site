import { Router } from 'express';

const router = Router();

router.get('/support', (_request, response) => {
  response.render('dashboard/support/support', {
    pageTitle: 'پشتیبانی',
    pageID: 'support',
    language: 'fa',
  });
});

export default router;
