// components/PostList.tsx

import { auth } from "@clerk/nextjs/server";
import { fetchPosts } from "@/lib/postDataFethcer";
import Post from "./Post";
import { ModalsProvider } from "@mantine/modals";
import prisma from "@/lib/prisma";
export default async function PostList({ username }: { username?: string }) {

  const { userId } = auth()
  if (!userId) {
    return (
      <div className="flex items-center justify-center">ログインをすると投稿が表示されます</div>
    )
  }

  const posts = await fetchPosts(userId, username)

  return (
    <ModalsProvider labels={{ confirm: '削除', cancel: 'キャンセル' }}>
    <div className="space-y-4">
      {posts ? posts.map((post) => (
        <Post key={post.id} post={post} userId={userId}/>
      )) : (
        <p>ポストが見つかりません</p>
      )}
    </div>
    </ModalsProvider>
  );
}
