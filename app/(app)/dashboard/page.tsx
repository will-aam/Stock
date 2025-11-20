import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { KPICards } from "@/components/dashboard/kpi-cards"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto p-4 pb-24 md:pb-8 space-y-6">
        <KPICards />
        <QuickActions />
        <ActivityFeed />
      </main>
    </div>
  )
}
