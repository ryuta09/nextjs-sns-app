'use client'
// components/PostForm.tsx
import { useRef, useState } from "react";
import { addPostAction } from "@/lib/action";
import SubmitButton from "./SubmitButton";
import { useFormState } from "react-dom";
import { useUser } from "@clerk/nextjs";
import { Avatar, Input } from "@mantine/core";

export default function PostForm() {
  const initialState = { error: undefined, success: false }
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction] = useFormState(addPostAction, initialState)

  if (state.success && formRef.current) {
    formRef.current.reset()
  }

  const { user } = useUser();

  return (
    <div>
      <div className="flex items-center gap-4">
        <Avatar className="w-12 h-12" src={user?.imageUrl || "/placeholder-user.jpg"} alt={user?.imageUrl || "/placeholder-user.jpg"} />
        <form ref={formRef} action={formAction} className="flex items-center flex-1">
          <Input.Wrapper className="flex-1 mr-4" >
            <Input
              placeholder="What's on your mind?"
              className="rounded-full py-2"
              name="post" />
          </Input.Wrapper>

          <SubmitButton />
        </form>
      </div>
      {
        state.error && (
          <p className="text-destructive mt-1 ml-14">{state.error}</p>
        )
      }
    </div>


  );
}
