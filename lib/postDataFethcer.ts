import prisma from "./prisma";

const postSelect = {
  id: true,
  content: true,
  createdAt: true,
  author: {
    select: {
      id: true,
      name: true,
      image: true,
    },
  },
  likes: { select: { userId: true } },
  _count: { select: { replies: true } },
};

export async function fetchPosts(userId: string, username?: string) {
  return await prisma.post.findMany({
    where: {
      author: {
        name: username,
      },
    },
    select: postSelect,
    orderBy: { createdAt: "desc" },
  });
}

export async function fetchLikedPosts(userId: string) {
  return await prisma.post.findMany({
    where: {
      likes: {
        some: {
          userId,
        },
      },
    },
    select: postSelect,
    orderBy: { createdAt: "desc" },
  });
}
