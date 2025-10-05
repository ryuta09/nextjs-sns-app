import prisma from "./prisma";

export async function fetchPosts(userId: string, username?: string) {
  return await prisma.post.findMany({
    where: {
      author: {
        name: username
      }
    },
    select: {
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
  },
  })
}