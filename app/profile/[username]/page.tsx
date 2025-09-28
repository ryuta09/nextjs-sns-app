import FollowButton from "@/components/component/FollowButton";
import PostList from "@/components/component/PostList";
import { getUser } from "@/lib/getUser";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { Avatar } from '@mantine/core';

export default async function ProfilePage({ params }: { params: { username: string } }) {

  const username = params.username;
  const { userId: currentUserId } = auth()

  if (!currentUserId) notFound()
  const user = await getUser(username, currentUserId)


  if (!user) notFound()

  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUserId,
        followingId: user.id,
      },
    },
  });


  if (!user) notFound()

  const isCurrentUser = currentUserId === user.id
  const isFollowing = !!existingFollow;

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <div className="container py-6 md:py-10 lg:py-12 mx-auto">
          <div className="grid gap-6 md:grid-cols-[1fr_300px]">
            <div>
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24 mb-4 md:mb-0" src={user?.image || "/placeholder-user.jpg"} alt={user?.image || "/placeholder-user.jpg"} />
                <div>
                  <h1 className="font-bold">{user?.name}</h1>
                  <div className="text-xs">@{user?.name}</div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4 text-muted-foreground">
                <div>
                  <MapPinIcon className="w-4 h-4 mr-1 inline" />
                  xxxxxxxxx
                </div>
                <div>
                  <LinkIcon className="w-4 h-4 mr-1 inline" />
                  xxxxxx.com
                </div>
              </div>
              <div className="mt-6 flex items-center gap-6">
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold">{user?._count.posts}</div>
                  <div className="text-muted-foreground">Posts</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold">{user?._count.following}</div>
                  <div className="text-muted-foreground">フォロー</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold">{user?._count.followedBy}</div>
                  <div className="text-muted-foreground">フォロワー</div>
                </div>
              </div>

              <div className="mt-6 h-[500px] overflow-y-auto">
                <PostList username={username} />
              </div>
            </div>
            <div className="sticky top-14 self-start space-y-6">

              <FollowButton isFollowing={isFollowing} isCurrentUser={isCurrentUser} user={user}/>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function LinkIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function MapPinIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PlusIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
