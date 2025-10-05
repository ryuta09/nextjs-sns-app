import { ClockIcon } from "./Icons";
import PostInteraction from "./PostInteraction";
import Link from "next/link";
import { Avatar, Card } from '@mantine/core';
import DeletePostButton from "./DeletePostButton";

export default function Post({ post, userId }: any) {
  console.log(post);
  console.log(userId);
  return (
    <>
      <Card
        key={post.id}
        className="bg-white"
        shadow="sm"
        radius="md"
        withBorder
      >
        <div className="flex items-center gap-4 mb-4">
          <Link href={`/profile/${post.author.name}`}>
            <Avatar className="w-10 h-10" radius="xl" src={post.author.image || "/placeholder-user.jpg"} />
          </Link>
          <div>
            <h3 className="font-bold">{post.author.name}</h3>
            <p className="text-xs ">{post.author.name}</p>
          </div>
          <div className="ml-auto">
            {post.authorId === userId && (
              <DeletePostButton postId={post.id} />
            )}
          </div>
        </div>
        <div className="space-y-2">
          <p>{post.content}</p>
        </div>
        <div className="flex items-center justify-between mt-4">
          <PostInteraction initialLikes={post.likes.map((like: any) => like.userId)}
            commentNumber={post._count.replies}
            postId={post.id}
          />
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <ClockIcon className="h-5 w-5" />
          <span>{post.createdAt.toLocaleString()}</span>
        </div>
      </Card>
      {/* {post.comments && (
            <div className="mt-4 border-t pt-4 space-y-2">
              {post.comments.map((comment, index) => (
                <div key={index} className="flex items-center gap-4">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>AC</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{comment.author}</p>
                    <p className="text-muted-foreground">{comment.content}</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <HeartIcon className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
          )} */}
    </>
  )
}