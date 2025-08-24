// components/PostList.tsx

import { auth } from "@clerk/nextjs/server";
import { fetchPosts } from "@/lib/postDataFethcer";
import Post from "./Post";

export default async function PostList() {

  const { userId } = auth()
  if (!userId) {
    return
  }

  const posts = await fetchPosts(userId)

  return (
    <div className="space-y-4">
      {posts.length > 1 ? posts.map((post) => (
        <Post key={post.id} post={post} />
      )) : (
        <p>ポストが見つかりません</p>
      )}
    </div>
  );
}
