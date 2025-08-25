'use client'
import { followAction } from "@/lib/action";
import { Button } from "../ui/button";
import { useOptimistic } from "react";
interface FollowButtonProps {
  isFollowing: boolean
  isCurrentUser: boolean
  userId: string
}
export default function FollowButton({ isFollowing, isCurrentUser, userId }: FollowButtonProps) {

  const [optimisticFollow, addOptimisticFollow] = useOptimistic<{ isFollowing: boolean; }, void>({
    isFollowing,
  }, (currentState) => ({
    isFollowing: !currentState.isFollowing
  }))

  const getButtonContent = () => {
    if (isCurrentUser) {
      return "プロフィール編集"
    }

    if (optimisticFollow.isFollowing) {
      return "フォロー中"
    }

    return "フォローする"
  }
  const getButtonVariants = () => {
    if (isCurrentUser) {
      return "secondary"
    }

    if (optimisticFollow.isFollowing) {
      return "outline"
    }

    return "default"
  }

  async function handleFollowAction() {

    if (isCurrentUser) return

    try {
      addOptimisticFollow()
      await followAction(userId)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form action={handleFollowAction}>
      <Button variant={getButtonVariants()} className="w-full">{getButtonContent()}</Button>
    </form>
  )
}