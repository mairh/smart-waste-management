"use client";

import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";

export function MainNav() {
  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-4 flex items-center space-x-2 lg:mr-6">
        <Icons.logo className="h-6 w-6" />
        <span className="hidden font-bold lg:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      <nav className="flex items-center gap-4 text-sm xl:gap-6">
        <Link
          href="https://smart-waste-management-docs.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "transition-colors hover:text-foreground/80",
            "text-foreground/60"
          )}
        >
          Docs
        </Link>
      </nav>
    </div>
  );
}
