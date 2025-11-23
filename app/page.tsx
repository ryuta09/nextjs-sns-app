import LeftSidebar from "@/components/component/LeftSidebar";
import MainContent from "@/components/component/MainContent";
import RightSidebar from "@/components/component/RightSidebar";
import getCurrentUser from "@/lib/getCurrentUser";
import { auth } from "@clerk/nextjs/server";


export default async function Home() {
  const {userId} = await auth()
  const currentUser = userId ? await getCurrentUser(userId) : null

  return (
    <div className="h-full grid grid-cols-[80px_1fr] md:grid-cols-[240px_1fr_240px] gap-6 p-6 overflow-hidden">
      <LeftSidebar currentUser={currentUser} />
      <MainContent />
      <RightSidebar />
    </div>
  );
}
