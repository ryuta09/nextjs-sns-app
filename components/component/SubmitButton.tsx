'use client'
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { SendIcon } from "./Icons";

export default function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button variant="ghost" size="icon" disabled={pending}>
      <SendIcon className="h-5 w-5 text-muted-foreground" />
      <span className="sr-only">Tweet</span>
    </Button>
  )
}