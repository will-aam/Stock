import { InventoryList } from "@/components/inventario/inventory-list";

export default function InventarioPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-4 pb-24 md:pb-8">
        <InventoryList />
      </main>
    </div>
  );
}
