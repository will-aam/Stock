import {
  PersonalDataForm,
  SecurityForm,
} from "@/components/profile/profile-forms";
import { Separator } from "@/components/ui/separator";

export default function PerfilPage() {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <main className="container mx-auto max-w-4xl space-y-8 p-4">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Meu Perfil</h2>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais e preferências de conta.
          </p>
        </div>

        <Separator />

        <div className="grid gap-6">
          <PersonalDataForm />
          <SecurityForm />
        </div>
      </main>
    </div>
  );
}
