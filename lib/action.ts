'use server'
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { success, z } from "zod";

type State = {
  error?: string | undefined;
  success: boolean;
}
export async function addPostAction(prevState: State,formData: FormData): Promise<State> {

  const { userId } = await auth();
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
    const { userId } = await auth()
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

  export async function followAction(userId: string) {

    const { userId: currentUserId } = await auth()
    if (!currentUserId) {
      throw new Error("User is not authenticated")
    }
    try {
      // noFollow
    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId: currentUserId,
        followingId: userId,
      },
    });

    if (existingFollow) {
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: userId,
          },
        },
      });
    } else {
      //follow
      await prisma.follow.create({
        data: {
          followerId: currentUserId,
          followingId: userId,
        },
      });
    }

    revalidatePath(`/profile/${userId}`);
    revalidatePath(`/profile/${currentUserId}`);
    } catch (error) {
      console.log(error)
    }
  }

const ProfileSchema = z.object({
  image: z.string().url("画像は有効なURL形式で入力してください").optional().or(z.literal("")).transform(v => v || null),
  name: z.string().min(1, "名前は必須です").max(50, "名前は50文字以内で入力してください"),
  bio: z.string().max(280, "プロフィールは280文字以内です").optional().or(z.literal("")).transform(v => v || null),
  website: z.string().url("WebサイトはURLで入力してください").optional().or(z.literal("")).transform(v => v || null),
  location: z.string().max(50, "ロケーションは50文字以内です").optional().or(z.literal("")).transform(v => v || null),
});

export async function updateProfileAction(prevState: State,formData: FormData): Promise<State>{
    const { userId } = await auth();
  if (!userId) {
    return {
      error: "ログインしてください",
      success: false
    }
  };

  // 変更前 name
  const before = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });

  const parsed = ProfileSchema.safeParse({
    image: formData.get("image"),
    name: formData.get("name"),
    bio: formData.get("bio"),
    website: formData.get("website"),
    location: formData.get("location"),
  })

  if(!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map(issue => issue.message).join(", ")
    } 
  }


  const nextName = parsed.data.name;
  const changedName = before?.name !== nextName;


  try {
    await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        image: parsed.data.image,
        name: parsed.data.name,
        bio: parsed.data.bio,
        website: parsed.data.website,
        location: parsed.data.location,
      }
    })
  } catch (error) {
    console.error(error)
    return {
      success: false,
      error: "プロフィールの更新に失敗しました"
    }
  }

  if (before?.name) revalidatePath(`/profile/${before.name}`);
  revalidatePath(`/profile/${nextName}`);

  if (changedName) {
    redirect(`/profile/${nextName}`);
  }

  return {
    success: true,
    error: undefined
  }
  
}

export async function deletePostAction(postId: string) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error("User is not authenticated")
  }
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId
      }
    })
    if (!post) {
      throw new Error("Post not found")
    }
    if (post.authorId !== userId) {
      throw new Error("You are not authorized to delete this post")
    }
    
    await prisma.$transaction([
      prisma.like.deleteMany({ where: { postId } }),
      prisma.post.delete({ where: { id: postId } })
    ])
    revalidatePath("/");
  } catch (error) {
    console.log(error)
    throw new Error('Failed to delete post')
  }
}