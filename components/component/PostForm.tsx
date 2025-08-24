// components/PostForm.tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendIcon } from "./Icons";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export default function PostForm() {
  const { userId } = auth();
  async function addPostAction(formData: FormData) {
    'use server'
    const postText = formData.get('post');

    if(!userId) return;
    
    try {
      await prisma.post.create({
        data: {
          content: postText as string,
          authorId: userId as string
        }
      })
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar className="w-10 h-10">
        <AvatarImage src="/placeholder-user.jpg" />
        <AvatarFallback>AC</AvatarFallback>
      </Avatar>
      <form action={addPostAction} className="flex items-center flex-1">

        <Input
          type="text"
          placeholder="What's on your mind?"
          className="rounded-full bg-muted px-4 py-2"
          name="post"
        />
        <Button variant="ghost" size="icon">
          <SendIcon className="h-5 w-5 text-muted-foreground" />
          <span className="sr-only">Tweet</span>
        </Button>
      </form>
    </div>
  );
}
