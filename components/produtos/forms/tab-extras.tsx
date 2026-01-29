"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Image as ImageIcon, Plus, Trash2, Barcode } from "lucide-react";

// Tipos
import { Produto } from "@/lib/mock/produtos/index";

interface TabExtrasProps {
  formData: Partial<Produto>;
  onChange: (field: string, value: any) => void;
}

export function TabExtras({ formData, onChange }: TabExtrasProps) {
  const [tempImageUrl, setTempImageUrl] = useState("");
  const [tempBarcode, setTempBarcode] = useState("");

  // --- IMAGENS ---
  const addImage = () => {
    if (!tempImageUrl) return;
    onChange("imagens", [...(formData.imagens || []), tempImageUrl]);
    setTempImageUrl("");
  };

  const removeImage = (index: number) => {
    onChange(
      "imagens",
      formData.imagens?.filter((_, i) => i !== index),
    );
  };

  // --- CÓDIGOS DE BARRAS ---
  const addBarcode = () => {
    if (!tempBarcode) return;
    onChange("codigosBarrasAdicionais", [
      ...(formData.codigosBarrasAdicionais || []),
      tempBarcode,
    ]);
    setTempBarcode("");
  };

  const removeBarcode = (index: number) => {
    onChange(
      "codigosBarrasAdicionais",
      formData.codigosBarrasAdicionais?.filter((_, i) => i !== index),
    );
  };

  return (
    <div className="space-y-8">
      {/* Galeria de Imagens */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" /> Galeria de Imagens
          </Label>
          <div className="flex gap-2 w-full max-w-sm">
            <Input
              value={tempImageUrl}
              onChange={(e) => setTempImageUrl(e.target.value)}
              placeholder="Cole a URL da imagem..."
              className="h-8 text-xs"
            />
            <Button
              onClick={addImage}
              size="sm"
              variant="secondary"
              className="h-8"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {formData.imagens?.map((url, idx) => (
            <div
              key={idx}
              className="relative group aspect-square rounded-md border bg-background overflow-hidden"
            >
              <img
                src={url}
                alt={`Img ${idx}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
          {(!formData.imagens || formData.imagens.length === 0) && (
            <div className="col-span-4 py-8 text-center text-xs text-muted-foreground border border-dashed rounded-md">
              Nenhuma imagem adicionada.
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Códigos Adicionais */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Barcode className="h-4 w-4" /> Códigos de Barras Vinculados
          </Label>
          <div className="flex gap-2 w-full max-w-xs">
            <Input
              value={tempBarcode}
              onChange={(e) => setTempBarcode(e.target.value)}
              placeholder="Novo EAN..."
              className="h-8 text-xs font-mono"
            />
            <Button
              onClick={addBarcode}
              size="sm"
              variant="secondary"
              className="h-8"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {formData.codigosBarrasAdicionais?.map((code, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 bg-muted/20 rounded border text-sm font-mono"
            >
              {code}
              <Button
                onClick={() => removeBarcode(idx)}
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
          {(!formData.codigosBarrasAdicionais ||
            formData.codigosBarrasAdicionais.length === 0) && (
            <div className="py-4 text-center text-xs text-muted-foreground border border-dashed rounded-md">
              Nenhum código extra vinculado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
