export type ChallanStatus = 'Draft' | 'Confirmed' | 'Cancelled';

export interface ChallanItem {
  id: string;
  challanId: string;
  productId: string;
  sku: string;
  name: string;
  unitPrice: number;
  quantity: number;
  totalAmount: number;
}

export interface Challan {
  id: string;
  challanNumber: string;
  customerId: string;
  customerName: string;
  customerMobile: string;
  customerBusiness: string;
  customerAddress: string;
  status: ChallanStatus;
  totalQuantity: number;
  grandTotal: number;
  createdById: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  items: ChallanItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateChallanItemPayload {
  productId: string;
  quantity: number;
}

export interface CreateChallanPayload {
  customerId: string;
  items: CreateChallanItemPayload[];
  status?: ChallanStatus;
}

export interface ChallanQueryParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}
