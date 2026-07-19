import { model, Schema, Types } from 'mongoose';

export interface IPost {
  title: string;
  slug: string;
  description: string;
  category_id: Types.ObjectId[];
  created_at: Date;
  updated_at: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    category_id: [{ type: Schema.Types.ObjectId, ref: 'Category', required: true }],
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

const Post = model<IPost>('Post', postSchema);

export default Post;
