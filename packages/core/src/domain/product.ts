export enum ProductUnit {
  UN = "UN",
  KG = "KG",
  LT = "LT",
  CX = "CX",
  FD = "FD",
  M = "M",
  M2 = "M2",
}

export interface Product {
  id: string;
  name: string;
  gtin: string;
  ncm: string;
  unit: ProductUnit;
  description?: string;
  categoryId?: string;
}
