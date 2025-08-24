'use client'
// components/PostForm.tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { addPostAction } from "@/lib/action";
import SubmitButton from "./SubmitButton";

export default function PostForm() {
  const [error, setError] = useState<string | undefined>('')
  const formRef = useRef<HTMLFormElement>(null)
  
  async function handleSubmit(formData: FormData) {
    const result = await addPostAction(formData)
    if (!result?.success) {
      setError(result?.error)
    } else {
      if (formRef.current) {
        formRef.current.reset()
      }
    }
  }
  return (
    <div>
      <div className="flex items-center gap-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src="/placeholder-user.jpg" />
          <AvatarFallback>AC</AvatarFallback>
        </Avatar>
        <form ref={formRef} action={handleSubmit} className="flex items-center flex-1">
          <Input
            type="text"
            placeholder="What's on your mind?"
            className="rounded-full bg-muted px-4 py-2"
            name="post"
          />
          
          <SubmitButton />
        </form>
      </div>
      {
        error && (
          <p className="text-destructive mt-1 ml-14">{error}</p>
        )
      }
    </div>


  );
}
