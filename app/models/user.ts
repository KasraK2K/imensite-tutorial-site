import bcrypt from 'bcryptjs';
import { model, Schema, type Model } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

interface UserModel extends Model<IUser> {
  generateHash(password: string): Promise<string>;
  validPassword(password: string, hash: string): Promise<boolean>;
}

const userSchema = new Schema<IUser, UserModel>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

userSchema.static('generateHash', (password: string) => bcrypt.hash(password, 12));
userSchema.static('validPassword', (password: string, hash: string) => bcrypt.compare(password, hash));

const User = model<IUser, UserModel>('User', userSchema);

export default User;
