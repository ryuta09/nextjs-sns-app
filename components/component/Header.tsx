"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { LogInIcon, SearchIcon, BellIcon, MailIcon } from "./Icons";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { SignedOut } from "@clerk/clerk-react";
import { Button } from "@mantine/core";

export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md px-4 md:px-6 py-3 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2" prefetch={false}>
        <LogInIcon className="h-6 w-6 text-primary" />
        <span className="text-lg font-bold text-primary">Next SNS</span>
      </Link>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4">
          <div>
            <SignedIn>
              <UserButton />
            </SignedIn>

            <SignedOut>
              <Button variant="filled">
                <Link className="w-20 inline-block" href={'/sign-in'}>サインイン</Link>
              </Button>
            </SignedOut>
          </div>

        </div>
      </div>
    </header>
  );
}
