"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

// Função para verificar força da senha
const checkPasswordStrength = (password: string) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const passedChecks = Object.values(checks).filter(Boolean).length;
  return {
    ...checks,
    strength: passedChecks,
    message: getStrengthMessage(passedChecks),
  };
};

// Mensagem de acordo com a força da senha
const getStrengthMessage = (strength: number) => {
  switch (strength) {
    case 5:
      return "Muito Forte!";
    case 4:
      return "Forte";
    case 3:
      return "Moderada";
    default:
      return "Fraca";
  }
};

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    strength: 0,
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Atualiza verificação de senha sempre que muda
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordCheck(checkPasswordStrength(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verifica se senhas coincidem
    if (password !== confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "Por favor, confirme sua senha corretamente.",
        variant: "destructive",
      });
      return;
    }

    // Verifica força mínima da senha (pelo menos 3 critérios)
    if (passwordCheck.strength < 3) {
      toast({
        title: "Senha fraca",
        description: `Sua senha precisa atender pelo menos ${
          3 - passwordCheck.strength
        } critério(s) adicional(ais): ${getMissingCriteria(passwordCheck)}`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulação de cadastro
    console.log("Cadastro validado:", { name, email, password });

    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Conta criada com sucesso!",
        description: "Você já pode fazer login.",
      });
      router.push("/login");
    }, 1000);
  };

  // Retorna critérios faltantes
  const getMissingCriteria = (check: any) => {
    const missing = [];
    if (!check.length) missing.push("mínimo de 8 caracteres");
    if (!check.uppercase) missing.push("uma letra maiúscula");
    if (!check.lowercase) missing.push("uma letra minúscula");
    if (!check.number) missing.push("um número");
    if (!check.special) missing.push("um caractere especial");

    return missing.join(", ");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo</Label>
        <Input
          id="name"
          type="text"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar Senha</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Repita a senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className={`${
            password && password !== confirmPassword ? "border-destructive" : ""
          }`}
        />
      </div>
      {/* Indicador de força da senha */}
      <div className="mt-2 space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span>Força da senha:</span>
          <span
            className={
              passwordCheck.strength >= 4
                ? "text-green-600"
                : passwordCheck.strength >= 3
                ? "text-yellow-600"
                : "text-red-600"
            }
          >
            {passwordCheck.message}
          </span>
        </div>

        {/* Barra de progresso visual */}
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              passwordCheck.strength === 5
                ? "bg-green-500"
                : passwordCheck.strength >= 4
                ? "bg-blue-500"
                : passwordCheck.strength >= 3
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{ width: `${(passwordCheck.strength / 5) * 100}%` }}
          ></div>
        </div>

        {/* Critérios individuais */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <div className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                passwordCheck.length ? "bg-green-500" : "bg-gray-400"
              }`}
            ></div>
            <span>Mínimo 8 caracteres</span>
          </div>
          <div className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                passwordCheck.uppercase ? "bg-green-500" : "bg-gray-400"
              }`}
            ></div>
            <span>Letra maiúscula</span>
          </div>
          <div className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                passwordCheck.lowercase ? "bg-green-500" : "bg-gray-400"
              }`}
            ></div>
            <span>Letra minúscula</span>
          </div>
          <div className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                passwordCheck.number ? "bg-green-500" : "bg-gray-400"
              }`}
            ></div>
            <span>Número</span>
          </div>
          <div className="flex items-center col-span-2">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                passwordCheck.special ? "bg-green-500" : "bg-gray-400"
              }`}
            ></div>
            <span>Caractere especial (@#$%^&*)</span>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || passwordCheck.strength < 3}
      >
        {isLoading ? "Criando conta..." : "Cadastrar"}
      </Button>

      <div className="text-center text-sm text-muted-foreground mt-4">
        Já tem uma conta?{" "}
        <Link
          href="/login"
          className="text-primary hover:underline font-medium"
        >
          Fazer Login
        </Link>
      </div>
    </form>
  );
}
