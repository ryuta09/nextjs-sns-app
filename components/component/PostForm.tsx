'use client'
// components/PostForm.tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendIcon } from "./Icons";
import { useState } from "react";
import { addPostAction } from "@/lib/action";

export default function PostForm() {
  const [error, setError] = useState<string | undefined>('')

  async function handleSubmit(formData: FormData) {
    const result = await addPostAction(formData)
    if (!result?.success) {
      setError(result?.error)
    } else {
      setError("")
    }
  }
  return (
    <div className="flex items-center gap-4">
      <Avatar className="w-10 h-10">
        <AvatarImage src="/placeholder-user.jpg" />
        <AvatarFallback>AC</AvatarFallback>
      </Avatar>
      <form action={handleSubmit} className="flex items-center flex-1">
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
      {error && (
        <p className="text-red-500 mt-1 ml-14">{error}</p>
      )}
    </div>
  );
}
