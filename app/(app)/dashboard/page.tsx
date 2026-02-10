import { DashboardHeader } from "@/components/home/dashboard-header";
import { Home } from "@/components/home/home";

export default function DashboardPage() {
  return (
    <div className="flex flex-col flex-1 h-full bg-background">
      <DashboardHeader />
      <main className="container mx-auto p-4 pb-24 md:pb-8 space-y-6">
        {/* <Home /> */}
      </main>
    </div>
  );
}
