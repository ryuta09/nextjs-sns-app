'use client'
import { editPostAction } from "@/lib/action";
import { Button, Textarea, Modal, Text } from "@mantine/core";
import { useActionState, useEffect, useRef } from "react";

interface EditPostFormProps {
  postId: string;
  initialContent: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditPostForm({ postId, initialContent, isOpen, onClose }: EditPostFormProps) {
  const [state, formAction] = useActionState(editPostAction, { success: false });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      onClose();
      formRef.current?.reset();
    }
  }, [state, onClose]);

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="投稿を編集"
      size="md"
    >
      <form ref={formRef} action={formAction}>
        <input type="hidden" name="postId" value={postId} />
        <div className="space-y-4">
          <Textarea
            name="post"
            defaultValue={initialContent}
            placeholder="いまどうしてる？"
            minRows={3}
            maxRows={6}
            autosize
            required
            maxLength={140}
          />
          {state.error && (
            <Text c="red" size="sm">
              {state.error}
            </Text>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button type="submit">
              更新
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}