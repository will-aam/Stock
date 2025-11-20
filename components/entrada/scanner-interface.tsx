"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ScanBarcode } from "lucide-react"
import { BatchForm } from "./batch-form"

export function ScannerInterface() {
  const [barcode, setBarcode] = useState("")
  const [scannedProduct, setScannedProduct] = useState<any>(null)

  const handleScan = () => {
    // TODO: Buscar produto do banco de dados pelo EAN
    setScannedProduct({
      id: 1,
      ean: barcode,
      name: "Leite Integral 1L",
      category: "Laticínios",
      image: "/milk-carton.png",
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleScan()
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScanBarcode className="h-5 w-5" />
            Scanner de Código de Barras
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="barcode">Código EAN</Label>
            <div className="flex gap-2">
              <Input
                id="barcode"
                type="text"
                placeholder="Digite ou escaneie o código de barras"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                onKeyDown={handleKeyDown}
                className="barcode-input mobile-optimized font-mono"
                autoFocus
              />
              <Button onClick={handleScan} size="icon" className="shrink-0">
                <ScanBarcode className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {scannedProduct && (
            <div className="border rounded-lg p-4 space-y-4 scan-success">
              <div className="flex items-center gap-4">
                <img
                  src={scannedProduct.image || "/placeholder.svg"}
                  alt={scannedProduct.name}
                  className="w-20 h-20 object-cover rounded-lg bg-muted"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{scannedProduct.name}</h3>
                  <p className="text-sm text-muted-foreground">{scannedProduct.category}</p>
                  <p className="text-xs text-muted-foreground font-mono mt-1">EAN: {scannedProduct.ean}</p>
                </div>
              </div>

              <BatchForm
                productId={scannedProduct.id}
                onSuccess={() => {
                  setScannedProduct(null)
                  setBarcode("")
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
