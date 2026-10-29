import type { Types } from "mongoose";
import { Post, type IPost } from "../models/post.model";
import { escapeRegex } from "../utils/escapeRegex";

export type PostSort = "newest" | "oldest" | "mostCommented";

export interface PostListFilter {
  page: number;
  limit: number;
  search?: string;
  tag?: string;
  sort: PostSort;
}

const SORTS: Record<PostSort, Record<string, 1 | -1>> = {
  newest: { createdAt: -1, _id: -1 },
  oldest: { createdAt: 1, _id: 1 },
  mostCommented: { commentCount: -1, createdAt: -1, _id: -1 },
}; // _id is a tie-breaker so pages never overlap

type PostEditable = Partial<Pick<IPost, "title" | "body" | "tags" | "status">>;

export const postRepository = {
  create: (
    data: Pick<IPost, "title" | "body" | "author" | "authorName"> &
      PostEditable,
  ) => Post.create(data),

  findById: (id: string | Types.ObjectId) => Post.findById(id),

  findPublishedById: (id: string) =>
    Post.findOne({ _id: id, status: "published" }),

  updateById: (id: string, update: PostEditable) =>
    Post.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true },
    ),

  deleteById: (id: string) => Post.findByIdAndDelete(id),

  incrementCommentCount: (id: Types.ObjectId | string, by: 1 | -1) =>
    Post.updateOne({ _id: id }, { $inc: { commentCount: by } }),

  // page of data AND total count in ONE query ($facet)
  async findPublishedPage({ page, limit, search, tag, sort }: PostListFilter) {
    const match: Record<string, unknown> = { status: "published" };
    if (tag) match.tags = tag;
    if (search) match.title = { $regex: escapeRegex(search), $options: "i" };

    const [result] = await Post.aggregate<{
      data: unknown[];
      total: { count: number }[];
    }>([
      { $match: match },
      {
        $facet: {
          data: [
            { $sort: SORTS[sort] },
            { $skip: (page - 1) * limit },
            { $limit: limit },
            { $project: { body: 0, __v: 0 } }, // no body in list responses
          ],
          total: [{ $count: "count" }],
        },
      },
    ]);

    return { data: result.data, total: result.total[0]?.count ?? 0 };
  },

  async findByAuthor(authorId: Types.ObjectId, page: number, limit: number) {
    const filter = { author: authorId };
    const [data, total] = await Promise.all([
      Post.find(filter)
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Post.countDocuments(filter),
    ]);
    return { data, total };
  },
};
