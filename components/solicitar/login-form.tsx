"use client";

import type React from "react";

import { useState } from "react";
import { User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getFuncionarioByCpf } from "@/lib/mock-data";
import { useFuncionarioStore } from "@/lib/funcionario-store";

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [cpf, setCpf] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setFuncionarioLogado } = useFuncionarioStore();

  const formatCpf = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6)
      return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9)
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(
        6
      )}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(
      6,
      9
    )}-${numbers.slice(9, 11)}`;
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCpf(e.target.value);
    setCpf(formatted);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simula um delay de API
    await new Promise((resolve) => setTimeout(resolve, 500));

    const funcionario = getFuncionarioByCpf(cpf);

    if (!funcionario) {
      setError("CPF não encontrado no sistema. Verifique e tente novamente.");
      setIsLoading(false);
      return;
    }

    if (!funcionario.podeSolicitar) {
      setError("Você não tem permissão para fazer requisições.");
      setIsLoading(false);
      return;
    }

    setFuncionarioLogado(funcionario);
    setIsLoading(false);
    onSuccess();
  };

  return (
    <div className="bg-card border border-border rounded-xl p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-card-foreground mb-2">
          Identificação
        </h1>
        <p className="text-muted-foreground">
          Digite seu CPF para acessar o sistema
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="cpf">CPF</Label>
          <Input
            id="cpf"
            type="text"
            placeholder="000.000.000-00"
            value={cpf}
            onChange={handleCpfChange}
            maxLength={14}
            className="text-center text-lg font-mono"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-destructive-foreground bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={cpf.length < 14 || isLoading}
        >
          {isLoading ? "Verificando..." : "Entrar"}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Use um dos CPFs de teste listados na página inicial para acessar.
        </p>
      </div>
    </div>
  );
}
