import { fetchAllPosts } from "@/lib/postDataFethcer";
import PostForm from "./PostForm";
import PostList from "./PostList";

export default async function MainContent() {
  const posts = await fetchAllPosts();
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 space-y-6 flex flex-col h-full overflow-hidden">
      <PostForm />
      <div className="overflow-y-auto">
        <PostList posts={posts} />
      </div>
    </div>
  );
}
