"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Lock, Mail } from "lucide-react";

export function PersonalDataForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  // Estados mockados (simulando dados vindos do banco)
  const [name, setName] = useState("Will Desenvolvedor");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simula delay de API
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Dados atualizados",
        description: "Suas informações pessoais foram salvas com sucesso.",
      });
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados Pessoais</CardTitle>
        <CardDescription>
          Atualize suas informações de identificação e contato.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullname">Nome Completo</Label>
            <Input
              id="fullname"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mobile-optimized"
              placeholder="Seu nome completo"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className="mobile-optimized"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Celular / WhatsApp</Label>
              <Input
                id="phone"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mobile-optimized"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Salvar Alterações
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function SecurityForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Estado mockado para o e-mail atual
  const [email, setEmail] = useState("will@exemplo.com");

  // Estados para troca de senha
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação simples de senha
    if (newPassword && newPassword !== confirmNewPassword) {
      toast({
        title: "Senhas não conferem",
        description: "A nova senha e a confirmação devem ser iguais.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Limpa os campos de senha após salvar
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

      toast({
        title: "Segurança atualizada",
        description: "Suas configurações de login foram salvas.",
      });
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acesso e Segurança</CardTitle>
        <CardDescription>Gerencie seu e-mail de login e senha.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-6">
          {/* Seção de E-mail */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <Mail className="h-4 w-4" />
              <span>E-mail de Acesso</span>
            </div>
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="mobile-optimized"
              />
              <p className="text-[0.8rem] text-muted-foreground">
                Este é o e-mail que você usa para fazer login na plataforma Val.
              </p>
            </div>
          </div>

          <div className="border-t my-4"></div>

          {/* Seção de Senha */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <Lock className="h-4 w-4" />
              <span>Alterar Senha</span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="current-password">Senha Atual</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Digite para confirmar alterações"
                className="mobile-optimized"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="new-password">Nova Senha</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Deixe em branco para manter"
                  className="mobile-optimized"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">
                  Confirmar Nova Senha
                </Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="mobile-optimized"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="default" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Salvar Configurações"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
