import LeftSidebar from "@/components/component/LeftSidebar";
import PostList from "@/components/component/PostList";
import RightSidebar from "@/components/component/RightSidebar";
import getCurrentUser from "@/lib/getCurrentUser";
import { fetchLikedPosts } from "@/lib/postDataFethcer";
import { auth } from "@clerk/nextjs/server";

export default async function LikesPage() {
  const { userId } = await auth();
  const currentUser = userId ? await getCurrentUser(userId) : null;
  const posts = await fetchLikedPosts(userId!);

  if(!posts) return
  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-[240px_1fr_240px] gap-6 p-6 overflow-hidden">
      <LeftSidebar currentUser={currentUser} />
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 space-y-4 flex flex-col h-full overflow-hidden">
        <div>
          <h1 className="text-xl font-bold">いいねした投稿</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ログイン中のユーザーが「いいね」した投稿のみを表示します。
          </p>
        </div>
        <div className="overflow-y-auto">
          <PostList posts={posts}/>
        </div>
      </div>
      <RightSidebar />
    </div>
  );
}
