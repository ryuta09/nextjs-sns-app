'use server'
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { success, z } from "zod";

type State = {
  error?: string | undefined;
  success: boolean;
}
export async function addPostAction(prevState: State,formData: FormData): Promise<State> {

  const { userId } = auth();
  if (!userId) {
    return {
      error: "ログインしてください",
      success: false
    }
  };

  try {
    const postText = formData.get('post');
    const postTextSchema = z.string().min(1, "ポスト内容を入力してください").max(140, "140字以内で入力してください");

    const validatedPostText = postTextSchema.safeParse(postText)

    if (!validatedPostText.success) {
      return {
        success: false,
        error: validatedPostText.error.issues.map(issue => issue.message).join(", ")
      }
    }

    await prisma.post.create({
      data: {
        content: validatedPostText.data,
        authorId: userId as string
      }
    })

    revalidatePath("/");

    return { error: undefined, success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const flat = z.treeifyError(error)
      return {
        success: false,
        error: "保存に失敗しました" 
      }
    } else if (error instanceof Error) {
      console.error(error)
      return {
        success: false,
        error: "保存に失敗しました" 
      }
    }
    return {
      success: false,
      error: "保存に失敗しました"
    }
  }
}


  export async function likeAction(postId: string) {
    const { userId } = auth()
    if (!userId) {
      throw new Error("User is not authenticated")
    }
    try {
      const exitingLike = await prisma.like.findFirst({
        where: {
          postId,
          userId
        }
      })
      if (exitingLike) {
        await prisma.like.delete({
          where: {
            id: exitingLike.id
          }
        })
        revalidatePath("/");
      } else {
        await prisma.like.create({
          data: {
            postId,
            userId
          }
        })
        revalidatePath("/");
      }
    } catch (error) {
      console.log(error)
    }
  }