import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { InventoryList } from "@/components/inventario/inventory-list"

export default function InventarioPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto p-4 pb-24 md:pb-8">
        <InventoryList />
      </main>
    </div>
  )
}
