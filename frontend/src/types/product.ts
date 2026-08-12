export type MovementType = 'IN' | 'OUT';

export interface StockLog {
  id: string;
  productId: string;
  quantityChanged: number;
  movementType: MovementType;
  reason: string;
  createdById: string;
  createdAt: string;
  product?: {
    id: string;
    name: string;
    sku: string;
    category: string;
    currentStock: number;
  };
  createdBy?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  unitPrice: number;
  currentStock: number;
  minStockAlert: number;
  location: string;
  createdById?: string | null;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
  stockLogs?: StockLog[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductPayload {
  name: string;
  sku: string;
  category: string;
  unitPrice: number;
  currentStock: number;
  minStockAlert: number;
  location?: string;
}

export interface StockAdjustmentPayload {
  productId: string;
  quantityChanged: number;
  movementType: MovementType;
  reason: string;
}

export interface ProductQueryParams {
  search?: string;
  category?: string;
  lowStock?: boolean;
  page?: number;
  limit?: number;
}
