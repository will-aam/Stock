import { redirect } from "next/navigation"

export default function HomePage() {
  // Redireciona para o dashboard se autenticado, ou login se não
  redirect("/dashboard")
}
