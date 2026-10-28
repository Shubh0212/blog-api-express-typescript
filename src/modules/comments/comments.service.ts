import type { UserDocument } from "../../models/user.model";
import { commentRepository } from "../../repositories/comment.repository";
import { postRepository } from "../../repositories/post.repository";
import { AppError } from "../../utils/AppError";
import { buildPagination } from "../../utils/pagination";

const getPublishedPost = async (postId: string) => {
  const post = await postRepository.findPublishedById(postId);
  if (!post) throw new AppError(404, "Post not found");
  return post;
};

export const commentService = {
  async create(user: UserDocument, postId: string, text: string) {
    const post = await getPublishedPost(postId); // comments only on published posts
    const comment = await commentRepository.create({
      postId: post._id,
      userId: user._id,
      userName: user.name,
      text,
    });
    await postRepository.incrementCommentCount(post._id, 1);
    return comment;
  },

  async list(
    postId: string,
    query: { page: number; limit: number; after?: string },
  ) {
    await getPublishedPost(postId);

    if (query.after) {
      const { data, hasMore } = await commentRepository.findAfterCursor(
        postId,
        query.after,
        query.limit,
      );
      return { data, nextCursor: hasMore ? (data.at(-1)?.id ?? null) : null };
    }

    const { data, total } = await commentRepository.findPageByPost(
      postId,
      query.page,
      query.limit,
    );
    return {
      data,
      pagination: buildPagination(query.page, query.limit, total),
    };
  },

  async remove(user: UserDocument, commentId: string) {
    const comment = await commentRepository.findById(commentId);
    if (!comment) throw new AppError(404, "Comment not found");

    const post = await postRepository.findById(comment.postId);
    const isCommentAuthor = comment.userId.equals(user._id);
    const isPostAuthor = !!post && post.author.equals(user._id);
    if (!isCommentAuthor && !isPostAuthor) {
      throw new AppError(403, "You are not allowed to delete this comment");
    }

    const deleted = await commentRepository.deleteById(commentId);
    if (deleted && post)
      await postRepository.incrementCommentCount(post._id, -1);
  },
};
