import { model, Schema, Types } from 'mongoose';

export interface IComment {
  comment: string;
  commenter: string;
  approved: boolean;
  post_id: Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const commentSchema = new Schema<IComment>(
  {
    comment: { type: String, required: true, trim: true },
    commenter: { type: String, required: true, trim: true },
    approved: { type: Boolean, default: false, required: true },
    post_id: { type: Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

const Comment = model<IComment>('Comment', commentSchema);

export default Comment;
