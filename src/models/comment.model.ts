import { Schema, model, type HydratedDocument, type Types } from "mongoose";

export interface IComment {
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  userName: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}
export type CommentDocument = HydratedDocument<IComment>;

const commentSchema = new Schema<IComment>(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    text: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 500,
    },
  },
  { timestamps: true },
);

commentSchema.index({ postId: 1, createdAt: -1 });

export const Comment = model<IComment>("Comment", commentSchema);
