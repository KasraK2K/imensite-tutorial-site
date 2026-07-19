import type { IUser } from '../models/user.js';

declare global {
  namespace Express {
    interface User extends IUser {
      readonly id: string;
    }
  }
}

export {};
