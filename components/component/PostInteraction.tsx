'use client'
import { Button } from "@/components/ui/button";
import { HeartIcon, MessageCircleIcon, Share2Icon } from "./Icons";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { useOptimistic, useState } from "react";
import { likeAction } from "@/lib/action";
import { useAuth } from "@clerk/nextjs";

interface PostInteractionProps {
  postId: string;
  initialLikes: string[];
  commentNumber: number;
}

interface LikeState {
  likeCount: number;
  isLiked: boolean;
}

export default function PostInteraction({ postId, initialLikes, commentNumber }: PostInteractionProps) {
  const { userId } = useAuth()
  const initialState = {
    likeCount: initialLikes.length,
    isLiked: userId ? initialLikes.includes(userId) : false
  }
  const [optimisticLike, addOptimisticLike] = useOptimistic<LikeState, void>(initialState, currentState => ({
    likeCount: currentState.isLiked ? currentState.likeCount - 1 : currentState.likeCount + 1,
    isLiked: !currentState.isLiked
  }))

  async function handleLikeAction() {
    try {
      addOptimisticLike()
      await likeAction(postId)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <form action={handleLikeAction}>
        <Button variant="ghost" size="icon">
          <HeartIcon className={`h-5 w-5  ${optimisticLike.isLiked ? 'text-destructive' : 'text-muted-foreground' }`} />
        </Button>
      </form>
      <span className={`-ml-1 ${optimisticLike.isLiked ? 'text-destructive' : 'text-muted-foreground'}`}>{optimisticLike.likeCount}</span>
      <Button variant="ghost" size="icon">
        <MessageCircleIcon className="h-5 w-5 text-muted-foreground" />
      </Button>
      <span className="-ml-1">{commentNumber}</span>
      <Button variant="ghost" size="icon">
        <Share2Icon className="h-5 w-5 text-muted-foreground" />
      </Button>
    </div>

  )
}