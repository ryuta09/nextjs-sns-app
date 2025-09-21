import prisma from "./prisma";

export async function getUser(username: string, currentUserId: string) {
  return prisma.user.findFirst({
    where: {
      name: username
    },
    include: {
      _count: {
        select: {
          following: true,
          followedBy: true,
          posts: true
        }
      },
      following: {
        where: {
          followerId: currentUserId
        }
      }
    }
  })
}