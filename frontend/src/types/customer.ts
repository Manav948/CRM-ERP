export type CustomerType = 'Retail' | 'Wholesale' | 'Distributor';
export type CustomerStatus = 'Lead' | 'Active' | 'Inactive';

export interface CustomerNote {
  id: string;
  text: string;
  customerId: string;
  createdById: string;
  createdAt: string;
  createdBy?: {
    id: string;
    name: string;
    role: string;
  };
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email?: string | null;
  businessName: string;
  gstNumber?: string | null;
  customerType: CustomerType;
  address: string;
  status: CustomerStatus;
  followUpDate?: string | null;
  createdById?: string | null;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
  notes?: CustomerNote[];
  _count?: {
    notes: number;
    challans: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerPayload {
  name: string;
  mobile: string;
  email?: string;
  businessName: string;
  gstNumber?: string;
  customerType: CustomerType;
  address: string;
  status: CustomerStatus;
  followUpDate?: string | null;
}

export interface CustomerQueryParams {
  search?: string;
  status?: string;
  customerType?: string;
  page?: number;
  limit?: number;
}
