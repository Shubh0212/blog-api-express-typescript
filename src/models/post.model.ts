import { Schema, model, type HydratedDocument, type Types } from "mongoose";

export const POST_STATUSES = ["draft", "published"] as const;
export type PostStatus = (typeof POST_STATUSES)[number];

export interface IPost {
  title: string;
  body: string;
  tags: string[];
  author: Types.ObjectId;
  authorName: string;
  status: PostStatus;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
}
export type PostDocument = HydratedDocument<IPost>;

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 120,
    },
    body: { type: String, required: true, minlength: 20 },
    tags: {
      type: [{ type: String, lowercase: true, trim: true }], // embedded array of strings
      default: [],
      validate: {
        validator: (v: string[]) => v.length <= 5,
        message: "A post can have at most 5 tags",
      },
    },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    authorName: { type: String, required: true },
    status: { type: String, enum: POST_STATUSES, default: "draft" },
    commentCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

postSchema.index({ tags: 1 });
postSchema.index({ status: 1, createdAt: -1 });
postSchema.index({ author: 1, createdAt: -1 }); // speeds up GET /users/me/posts

export const Post = model<IPost>("Post", postSchema);
