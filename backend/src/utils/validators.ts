import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['Admin', 'Sales', 'Warehouse', 'Accounts']),
});

export const customerSchema = z.object({
  name: z.string().min(1, 'Customer name is required'),
  mobile: z.string().min(7, 'Valid mobile number is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  businessName: z.string().min(1, 'Business name is required'),
  gstNumber: z.string().optional().or(z.literal('')),
  customerType: z.enum(['Retail', 'Wholesale', 'Distributor']).default('Retail'),
  address: z.string().min(1, 'Address is required'),
  status: z.enum(['Lead', 'Active', 'Inactive']).default('Lead'),
  followUpDate: z.string().optional().nullable(),
});

export const customerNoteSchema = z.object({
  text: z.string().min(1, 'Note content cannot be empty'),
});

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  sku: z.string().min(1, 'SKU is required'),
  category: z.string().min(1, 'Category is required'),
  unitPrice: z.number().min(0, 'Unit price cannot be negative'),
  currentStock: z.number().min(0, 'Stock cannot be negative').default(0),
  minStockAlert: z.number().min(0, 'Min stock alert cannot be negative').default(5),
  location: z.string().optional(),
});

export const stockAdjustmentSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantityChanged: z.number().positive('Quantity must be greater than 0'),
  movementType: z.enum(['IN', 'OUT']),
  reason: z.string().min(1, 'Reason for adjustment is required'),
});

export const challanItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive('Quantity must be at least 1'),
});

export const createChallanSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  items: z.array(challanItemSchema).min(1, 'At least one item is required'),
  status: z.enum(['Draft', 'Confirmed']).default('Draft'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type CustomerInput = z.infer<typeof customerSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type StockAdjustmentInput = z.infer<typeof stockAdjustmentSchema>;
export type CreateChallanInput = z.infer<typeof createChallanSchema>;
