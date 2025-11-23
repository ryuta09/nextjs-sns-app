'use client'
import { Button } from "@mantine/core";
import { useState } from "react";
import EditPostForm from "./EditPostForm";

interface EditPostButtonProps {
  postId: string;
  initialContent: string;
}

export default function EditPostButton({ postId, initialContent }: EditPostButtonProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <Button 
        variant="outline" 
        size="xs"
        onClick={() => setIsEditModalOpen(true)}
      >
        編集
      </Button>
      <EditPostForm
        postId={postId}
        initialContent={initialContent}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
}