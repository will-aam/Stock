import type React from "react";
import { Navigation } from "@/components/shared/navigation";
import { Footer } from "@/components/shared/footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Navigation />
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
