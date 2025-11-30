import { DashboardHeader } from "@/components/home/dashboard-header";
import { UserList } from "@/components/usuarios/user-list";
import { Separator } from "@/components/ui/separator";

export default function UsuariosPage() {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div className="md:hidden">
        <DashboardHeader />
      </div>

      <main className="container mx-auto max-w-6xl space-y-8 p-4">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">
            Gestão de Usuários
          </h2>
          <p className="text-muted-foreground">
            Cadastre funcionários e gerencie o acesso aos módulos do sistema
            (Stock, Countifly, etc).
          </p>
        </div>

        <Separator />

        <UserList />
      </main>
    </div>
  );
}
