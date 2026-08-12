import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type {
  Product,
  StockLog,
  CreateProductPayload,
  StockAdjustmentPayload,
  ProductQueryParams,
  PaginatedResponse,
  ApiResponse,
} from '../types';

export const useGetProductsQuery = (params: ProductQueryParams = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async (): Promise<PaginatedResponse<Product>> => {
      const { data } = await api.get<PaginatedResponse<Product>>('/products', {
        params,
      });
      return data;
    },
  });
};

export const useGetProductByIdQuery = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async (): Promise<Product> => {
      const { data } = await api.get<ApiResponse<Product>>(`/products/${id}`);
      return data.data!;
    },
    enabled: Boolean(id) && enabled,
  });
};

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateProductPayload): Promise<Product> => {
      const { data } = await api.post<ApiResponse<Product>>('/products', payload);
      return data.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<CreateProductPayload> }): Promise<Product> => {
      const { data } = await api.put<ApiResponse<Product>>(`/products/${id}`, payload);
      return data.data!;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
    },
  });
};

export const useAdjustStockMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: StockAdjustmentPayload) => {
      const { data } = await api.post<ApiResponse<any>>('/products/inventory/adjust', payload);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['stockLogs'] });
    },
  });
};

export const useGetStockLogsQuery = (productId?: string) => {
  return useQuery({
    queryKey: ['stockLogs', productId],
    queryFn: async (): Promise<PaginatedResponse<StockLog>> => {
      const { data } = await api.get<PaginatedResponse<StockLog>>('/products/inventory/logs', {
        params: productId ? { productId } : {},
      });
      return data;
    },
  });
};
