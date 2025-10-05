'use client'
import { deletePostAction } from "@/lib/action";
import { Button, Text } from "@mantine/core";
import { modals } from '@mantine/modals';
import { useRouter } from "next/navigation";
import { useTransition } from "react";
export default function DeletePostButton({ postId }: { postId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter()
  const openModal = (postId: string) =>  modals.openConfirmModal({
    title: '本当に削除しますか？',
    children: (
      <Text size="sm">
        続行するには、これらのボタンのいずれかをクリックしてください。
      </Text>
    ),
    onConfirm: () => {
      startTransition( async () => {
        try {
          await deletePostAction(postId)
          router.refresh()
        } catch(error) {
          console.error(error)
          throw new Error("削除に失敗しました")
        }
      })
    }
  })

  return (
    <Button variant="outline" color="red" onClick={() => openModal(postId)}>削除</Button>
  )
}