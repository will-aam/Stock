import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScanBarcode, ClipboardCheck } from "lucide-react"

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <Link href="/entrada" className="block">
          <Button className="w-full h-20 text-lg mobile-button" size="lg">
            <ScanBarcode className="mr-2 h-6 w-6" />
            Nova Entrada
          </Button>
        </Link>
        <Link href="/auditoria" className="block">
          <Button className="w-full h-20 text-lg mobile-button" variant="secondary" size="lg">
            <ClipboardCheck className="mr-2 h-6 w-6" />
            Iniciar Auditoria
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
