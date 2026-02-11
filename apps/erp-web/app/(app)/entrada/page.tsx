import { ScannerInterface } from "@/components/entrada/scanner-interface";

export default function EntradaPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-4 pb-24 md:pb-8">
        <ScannerInterface />
      </main>
    </div>
  );
}
