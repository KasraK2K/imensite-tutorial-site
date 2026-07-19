import type { RequestHandler } from 'express';

export const requireAuthentication: RequestHandler = (request, response, next) => {
  if (request.isAuthenticated()) {
    next();
    return;
  }

  response.redirect('/login');
};
