"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ScanBarcode, ClipboardCheck, Package } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [{ href: "/dashboard", icon: Home, label: "Início" }];

  return (
    <nav className="bottom-nav-fixed border-t bg-background md:hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-4 gap-1 py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
