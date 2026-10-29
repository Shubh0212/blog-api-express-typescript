import { statsRepository } from "../../repositories/stats.repository";

export const statsService = {
  async getStats() {
    const r = await statsRepository.getStats();
    return {
      totalPublishedPosts: r.totalPublished[0]?.count ?? 0,
      topTags: r.topTags,
      topAuthors: r.topAuthors,
      mostCommentedPosts: r.mostCommented,
    };
  },
};
