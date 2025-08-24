import prisma from "./prisma";

export async function fetchPosts(userId: string) {
  console.log("current userId:", userId)
  const following = await prisma.follow.findMany({
    where: {
      followerId: userId
    },
    select: {
      followingId: true
    }
  })

  // 配列で今フォローしている
  const followingIds = following.map(follow => follow.followingId)
  const ids = [userId, ...followingIds]

  return await prisma.post.findMany({
    where: {
      authorId: {
        in: ids
      }
    },
    include: {
      author: true,
      likes: {
        select: {
          userId: true
        }
      },
      _count: {
        select: {
          replies: true
        }
      },
    },

    orderBy: {
      createdAt: "desc"
    }
  })

}