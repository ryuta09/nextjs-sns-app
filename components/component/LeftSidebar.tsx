'use client'
// components/LeftSidebar.tsx
import Link from "next/link";
import { Avatar, NavLink } from '@mantine/core';
import { useAuth, useUser } from "@clerk/nextjs";
import {
  HomeIcon,
  UserIcon,
  HeartIcon,
  SettingsIcon,
} from "./Icons";

interface LeftSidebarProps {
  currentUser: {
    id: string;
    name: string | null;
    image: string | null;
  } | null
}

export default function LeftSidebar({currentUser}: LeftSidebarProps) {
  const { user } = useUser();
  const { userId } = useAuth();
  const displayName = currentUser?.name ? currentUser.name : "User";
  const navItems = [
    { icon: HomeIcon, label: "Home", href: "/" },
    { icon: UserIcon, label: "Profile", href: userId ? `/profile/${currentUser?.name}` : '/sign-in' },
    { icon: HeartIcon, label: "Likes", href: userId ? "/likes" : '/sign-in' },
  ];
  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md p-4 h-full flex flex-col">
      <div className="flex items-center gap-4 pb-4 justify-center sm:justify-start">
        <Avatar className="w-12 h-12" radius="xl" src={user?.imageUrl || "/placeholder-user.jpg"} alt={displayName || "User"} />
        <div className="hidden sm:block">
          <h3 className="text-lg font-bold">{displayName}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">@{displayName}</p>
        </div>
      </div>
      <nav className="flex-grow">
        <ul className="flex flex-col gap-4">
          {navItems.map(({ icon: Icon, label, href }) => (
            <li key={label}>
              <Link href={href} className="flex items-center gap-2 justify-center sm:justify-start p-2">
                <span className="sr-only">{label}</span>
                <Icon className="h-5 w-5" />
                <span className="hidden sm:block">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto">
        <Link href="/settings" className="block">
          <div className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <SettingsIcon className="h-5 w-5" />
            <span className="hidden sm:block">Settings</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
