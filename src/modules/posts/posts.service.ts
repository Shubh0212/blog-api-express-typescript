import type { UserDocument } from "../../models/user.model";
import { commentRepository } from "../../repositories/comment.repository";
import { postRepository } from "../../repositories/post.repository";
import { AppError } from "../../utils/AppError";
import { buildPagination } from "../../utils/pagination";
import type {
  CreatePostInput,
  ListPostsQuery,
  UpdatePostInput,
} from "./posts.schema";

const getOwnedPost = async (user: UserDocument, id: string) => {
  const post = await postRepository.findById(id);
  if (!post) throw new AppError(404, "Post not found");
  if (!post.author.equals(user._id))
    throw new AppError(403, "You can only modify your own posts");
  return post;
};

export const postService = {
  create(user: UserDocument, input: CreatePostInput) {
    return postRepository.create({
      ...input,
      author: user._id,
      authorName: user.name,
    });
  },

  async getPublished(id: string) {
    const post = await postRepository.findPublishedById(id);
    if (!post) throw new AppError(404, "Post not found"); // drafts look like "not found" to the public
    return post;
  },

  async list(query: ListPostsQuery) {
    const { data, total } = await postRepository.findPublishedPage(query);
    return {
      data,
      pagination: buildPagination(query.page, query.limit, total),
    };
  },

  async listMine(user: UserDocument, page: number, limit: number) {
    const { data, total } = await postRepository.findByAuthor(
      user._id,
      page,
      limit,
    );
    return { data, pagination: buildPagination(page, limit, total) };
  },

  async update(user: UserDocument, id: string, input: UpdatePostInput) {
    await getOwnedPost(user, id);
    const updated = await postRepository.updateById(id, input);
    if (!updated) throw new AppError(404, "Post not found");
    return updated;
  },

  async remove(user: UserDocument, id: string) {
    const post = await getOwnedPost(user, id);
    // delete the post first so nobody can add new comments, then remove its comments
    await postRepository.deleteById(id);
    await commentRepository.deleteByPostId(post._id);
  },
};
