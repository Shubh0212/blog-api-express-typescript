import type { Types } from "mongoose";
import { Post } from "../models/post.model";
import { User } from "../models/user.model";

export interface StatsFacetResult {
  totalPublished: { count: number }[];
  topTags: { tag: string; count: number }[];
  topAuthors: { authorId: Types.ObjectId; name?: string; postCount: number }[];
  mostCommented: { _id: Types.ObjectId; title: string; commentCount: number }[];
}

export const statsRepository = {
  async getStats() {
    const [result] = await Post.aggregate<StatsFacetResult>([
      { $match: { status: "published" } },
      {
        $facet: {
          totalPublished: [{ $count: "count" }],
          topTags: [
            { $unwind: "$tags" },
            { $group: { _id: "$tags", count: { $sum: 1 } } },
            { $sort: { count: -1, _id: 1 } },
            { $limit: 10 },
            { $project: { _id: 0, tag: "$_id", count: 1 } },
          ],
          topAuthors: [
            { $group: { _id: "$author", postCount: { $sum: 1 } } },
            { $sort: { postCount: -1, _id: 1 } },
            { $limit: 5 },
            {
              $lookup: {
                from: User.collection.name, // "users"
                localField: "_id",
                foreignField: "_id",
                as: "author",
              },
            },
            { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
            {
              $project: {
                _id: 0,
                authorId: "$_id",
                name: "$author.name",
                postCount: 1,
              },
            },
          ],
          mostCommented: [
            { $sort: { commentCount: -1, createdAt: -1 } },
            { $limit: 5 },
            { $project: { title: 1, commentCount: 1 } },
          ],
        },
      },
    ]);
    return result;
  },
};
