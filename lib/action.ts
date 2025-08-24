'use server'
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { success, z } from "zod";


export async function addPostAction(formData: FormData) {

  const { userId } = auth();
  if (!userId) return;

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
  }
}