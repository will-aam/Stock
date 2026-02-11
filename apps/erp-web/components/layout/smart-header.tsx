"use client";

import { usePathname } from "next/navigation";
import { getRouteMetadata } from "@/config/route-config";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SmartHeader() {
  const pathname = usePathname();
  const metadata = getRouteMetadata(pathname);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold">{metadata.title}</h1>
          <p className="text-xs text-muted-foreground hidden sm:block">
            {metadata.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
