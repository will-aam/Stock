"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, PackageSearch } from "lucide-react";

// Interface do Produto
export interface Product {
  id: number;
  name: string;
  category: string;
  image: string;
  stock: number;
}

interface ProductCardProps {
  product: Product;
  qtyInCart: number;
  onAdd: (id: number) => void;
  onRemove: (id: number) => void;
  viewMode: "grid" | "list";
}

export function ProductCard({
  product,
  qtyInCart,
  onAdd,
  onRemove,
  viewMode,
}: ProductCardProps) {
  const outOfStock = product.stock <= 0;

  // --- LAYOUT EM LISTA (Horizontal) ---
  if (viewMode === "list") {
    return (
      <div className="flex gap-3 items-center p-3 border rounded-lg bg-card hover:bg-muted/30 transition-colors">
        {/* Imagem Pequena */}
        <div className="h-12 w-12 rounded-md bg-white border flex items-center justify-center shrink-0 relative overflow-hidden">
          {outOfStock && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
              <span className="text-[8px] font-bold text-destructive uppercase">
                Esgotado
              </span>
            </div>
          )}
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain p-1"
            />
          ) : (
            <PackageSearch className="h-5 w-5 text-muted-foreground/30" />
          )}
        </div>

        {/* Detalhes */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-sm truncate pr-2">
              {product.name}
            </h3>
            {product.stock < 20 && !outOfStock && (
              <span className="text-[10px] text-amber-600 font-medium shrink-0">
                Restam {product.stock}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{product.category}</p>
        </div>

        {/* Controles */}
        <div className="shrink-0">
          {qtyInCart > 0 ? (
            <div className="flex items-center border rounded-md h-8 bg-background">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none"
                onClick={() => onRemove(product.id)}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-6 text-center text-xs font-bold">
                {qtyInCart}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none text-primary"
                onClick={() => onAdd(product.id)}
                disabled={qtyInCart >= product.stock}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs"
              onClick={() => onAdd(product.id)}
              disabled={outOfStock}
            >
              Adicionar
            </Button>
          )}
        </div>
      </div>
    );
  }

  // --- LAYOUT EM GRADE / BLOCO (Compacto) ---
  return (
    <div className="bg-card border rounded-lg overflow-hidden shadow-sm flex flex-col h-full hover:border-primary/50 transition-all">
      {/* Imagem Quadrada */}
      <div className="aspect-square bg-white flex items-center justify-center relative">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain p-4 transition-transform hover:scale-105 duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-muted/10">
            <PackageSearch className="h-10 w-10 text-muted-foreground/20" />
          </div>
        )}

        {/* Badge de Categoria */}
        <Badge
          variant="secondary"
          className="absolute top-2 left-2 text-[9px] h-5 px-1.5 bg-background/90 backdrop-blur shadow-sm border-0"
        >
          {product.category}
        </Badge>

        {/* Overlay de Esgotado */}
        {outOfStock && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center backdrop-blur-[1px]">
            <span className="text-xs font-bold text-destructive border border-destructive px-2 py-1 rounded bg-background">
              ESGOTADO
            </span>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-3 flex-1 flex flex-col border-t">
        <div className="flex-1 mb-3">
          <h3
            className="font-medium text-xs sm:text-sm line-clamp-2 leading-tight min-h-[2.5em]"
            title={product.name}
          >
            {product.name}
          </h3>
          {!outOfStock && product.stock < 20 && (
            <p className="text-[10px] text-amber-600 mt-1 font-medium bg-amber-50 dark:bg-amber-950/30 w-fit px-1.5 rounded">
              Últimas {product.stock} un
            </p>
          )}
        </div>

        {/* Botão Full Width */}
        {qtyInCart > 0 ? (
          <div className="flex items-center justify-between bg-primary/5 rounded-md border border-primary/10 overflow-hidden h-8">
            <button
              className="h-full px-3 hover:bg-primary/10 flex items-center justify-center transition-colors text-primary"
              onClick={() => onRemove(product.id)}
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="text-xs font-bold text-primary">{qtyInCart}</span>
            <button
              className="h-full px-3 hover:bg-primary/10 flex items-center justify-center transition-colors text-primary disabled:opacity-50"
              onClick={() => onAdd(product.id)}
              disabled={qtyInCart >= product.stock}
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <Button
            variant="default"
            size="sm"
            className="w-full h-8 text-xs shadow-sm"
            onClick={() => onAdd(product.id)}
            disabled={outOfStock}
          >
            Adicionar
          </Button>
        )}
      </div>
    </div>
  );
}
