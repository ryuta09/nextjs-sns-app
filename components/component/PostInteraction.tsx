'use client'
import { Button } from "@/components/ui/button";
import { HeartIcon, MessageCircleIcon, Share2Icon } from "./Icons";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { useState } from "react";
import { likeAction } from "@/lib/action";
import { useAuth } from "@clerk/nextjs";
type PostInteractionProps = {
  postId: string;
  initialLikes: string[];
  commentNumber: number;
}
export default function PostInteraction({ postId, initialLikes, commentNumber }: PostInteractionProps) {
  const { userId } = useAuth()
  const [likeState, setLikeState] = useState({ likeCount: initialLikes.length, isLiked: userId ? initialLikes.includes(userId) : false })


  async function handleLikeAction() {
    try {
      setLikeState(prev => ({
        likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1,
        isLiked: !prev.isLiked
      }))
      await likeAction(postId)
    } catch (error) {
      setLikeState(prev => ({
        likeCount: prev.isLiked ? prev.likeCount + 1 : prev.likeCount - 1,
        isLiked: !prev.isLiked
      }))
      console.error(error)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <form action={handleLikeAction}>
        <Button variant="ghost" size="icon">
          <HeartIcon className="h-5 w-5 text-muted-foreground" />
        </Button>
      </form>
      <span className="-ml-1">{likeState.likeCount}</span>
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