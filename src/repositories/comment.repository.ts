import type { Types } from "mongoose";
import { Comment } from "../models/comment.model";

export const commentRepository = {
  create: (data: {
    postId: Types.ObjectId;
    userId: Types.ObjectId;
    userName: string;
    text: string;
  }) => Comment.create(data),

  findById: (id: string) => Comment.findById(id),

  // returns the deleted document (or null), so two racing deletes can't both decrement the count
  deleteById: (id: string) => Comment.findByIdAndDelete(id),

  deleteByPostId: (postId: Types.ObjectId | string) =>
    Comment.deleteMany({ postId }),

  async findPageByPost(postId: string, page: number, limit: number) {
    const filter = { postId };
    const [data, total] = await Promise.all([
      Comment.find(filter)
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Comment.countDocuments(filter),
    ]);
    return { data, total };
  },

  // bonus: cursor pagination, newest first
  async findAfterCursor(postId: string, after: string, limit: number) {
    const rows = await Comment.find({ postId, _id: { $lt: after } })
      .sort({ _id: -1 })
      .limit(limit + 1); // one extra row tells us whether more exist
    const hasMore = rows.length > limit;
    return { data: hasMore ? rows.slice(0, limit) : rows, hasMore };
  },
};
