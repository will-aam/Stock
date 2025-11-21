import { redirect } from "next/navigation";

export default function HomePage() {
  // Como ainda não temos verificação de sessão real,
  // vamos forçar o usuário a ir para o login primeiro.
  redirect("/login");
}
