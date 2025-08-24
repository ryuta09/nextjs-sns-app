import { Button } from "../ui/button";
interface FollowButtonProps {
  isFollowing: boolean
  isCurrentUser: boolean
}
export default function FollowButton({ isFollowing, isCurrentUser }: FollowButtonProps) {

  const getButtonContent = () => {
    if(isCurrentUser) {
      return "プロフィール編集"
    }

    if(isFollowing) {
      return "フォロー中"
    }

    return "フォローする"
  }
  const getButtonVariants = () => {
    if(isCurrentUser) {
      return "secondary"
    }

    if(isFollowing) {
      return "outline"
    }

    return "default"
  }

  return (
    <div>
      <Button variant={getButtonVariants()} className="w-full">{getButtonContent()}</Button>
    </div>
  )
}