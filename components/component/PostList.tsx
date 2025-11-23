// components/PostList.tsx

import { auth } from "@clerk/nextjs/server";
import { ModalsProvider } from "@mantine/modals";
import type { Post } from "@/app/types/post";
import PostItem from "./PostItem";

interface PostListProps {
  username?: string;
  posts?: Post[]
}

export default async function PostList({ username, posts }: PostListProps) {

  if(!posts) return

  const { userId } = await auth()
  if (!userId) {
    return (
      <div className="flex items-center justify-center">ログインをすると投稿が表示されます</div>
    )
  }

  return (
    <ModalsProvider labels={{ confirm: '削除', cancel: 'キャンセル' }}>
    <div className="space-y-4">
      {posts ? posts.map((post: Post) => (
        <PostItem key={post.id} post={post} userId={userId}/>
      )) : (
        <p>ポストが見つかりません</p>
      )}
    </div>
    </ModalsProvider>
  );
}
