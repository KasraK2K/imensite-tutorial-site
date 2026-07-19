import { model, Schema } from 'mongoose';

export interface ICategory {
  name: string;
  slug: string;
  created_at: Date;
  updated_at: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

const Category = model<ICategory>('Category', categorySchema);

export default Category;
