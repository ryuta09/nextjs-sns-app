'use client';

import { followAction, updateProfileAction } from "@/lib/action";
import { useActionState, useEffect, useOptimistic, useState, useTransition } from "react";
import { Modal, Button, TextInput } from '@mantine/core';

interface FollowButtonProps {
  isFollowing: boolean;
  isCurrentUser: boolean;
  user: {
    id: string;
    name: string | null;
    image: string | null;
    bio: string | null;
    location: string | null;
    website: string | null;
  }
}

export default function FollowButton({ isFollowing, isCurrentUser, user }: FollowButtonProps) {
  const initialState = { error: undefined, success: false }
  const [state, formAction] = useActionState(updateProfileAction, initialState)
  const [optimisticFollow, addOptimisticFollow] = useOptimistic<{ isFollowing: boolean }, { isFollowing: boolean }>(
    { isFollowing },
    (currentState) => ({ isFollowing: !currentState.isFollowing })
  );
  const [opened, setOpened] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (state.success) setOpened(false)
  }, [state.success])


  if (isCurrentUser) {
    return (
      <>
        <Button
          type="button"
          variant="filled"
          className="w-full"
          color="gray"
          onClick={() => setOpened(true)}
        >
          プロフィールを編集
        </Button>

        <Modal
          opened={opened}
          onClose={() => setOpened(false)}
          title="プロフィールを編集"
          centered
        >
          <form action={formAction}>
            <TextInput name="image" label="画像" defaultValue={user.image || ""} />
            <TextInput name="name" label="名前" mt="md" defaultValue={user.name || ""} />
            <TextInput name="bio" label="プロフィール" mt="md" defaultValue={user.bio || ""} />
            <TextInput name="website" label="WebSite" mt="md" defaultValue={user.website || ""} />
            <TextInput name="location" label="Location" mt="md" defaultValue={user.location || ""} />
            <div className="flex gap-2 justify-center mt-4">
              <Button variant="default" onClick={() => setOpened(false)}>キャンセル</Button>
              <Button variant="default" type="submit">保存</Button>
            </div>
          </form>
        </Modal>
      </>
    );
  }

  const handleFollowClick = () => {
    if (isPending) return;

    const prev = optimisticFollow;
    const next = { isFollowing: !optimisticFollow.isFollowing };

    addOptimisticFollow(next);
    startTransition(async () => {
      try {
        await followAction(user.id);
      } catch (error) {
        console.error(error);
        addOptimisticFollow(prev);
      }
    });
  };

  return (
    <Button
      variant={optimisticFollow.isFollowing ? "outline" : "default"}
      className="w-full"
      onClick={handleFollowClick}
    >
      {optimisticFollow.isFollowing ? "フォロー中" : "フォローする"}
    </Button>
  );
}