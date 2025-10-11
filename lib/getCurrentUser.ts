import prisma from "./prisma";

export default async function getCurrentUser(userId: string) {
  const result = await prisma.user.findFirst({
    where: {
      id: userId
    },
    select :{
      id: true,
      name: true,
      image: true,
    }
  })
  return result
}