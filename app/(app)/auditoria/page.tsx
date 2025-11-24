import { DashboardHeader } from "@/components/home/dashboard-header";
import { AuditInterface } from "@/components/auditoria/audit-interface";

export default function AuditoriaPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto p-4 pb-24 md:pb-8">
        <AuditInterface />
      </main>
    </div>
  );
}
