import { ScannerInterface } from "@/components/entrada/scanner-interface"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function EntradaPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto p-4 pb-24 md:pb-8">
        <ScannerInterface />
      </main>
    </div>
  )
}
