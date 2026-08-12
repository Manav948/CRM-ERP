import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type {
  Customer,
  CreateCustomerPayload,
  CustomerQueryParams,
  PaginatedResponse,
  ApiResponse,
} from '../types';

export const useGetCustomersQuery = (params: CustomerQueryParams = {}) => {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: async (): Promise<PaginatedResponse<Customer>> => {
      const { data } = await api.get<PaginatedResponse<Customer>>('/customers', {
        params,
      });
      return data;
    },
  });
};

export const useGetCustomerByIdQuery = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: async (): Promise<Customer> => {
      const { data } = await api.get<ApiResponse<Customer>>(`/customers/${id}`);
      return data.data!;
    },
    enabled: Boolean(id) && enabled,
  });
};

export const useCreateCustomerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateCustomerPayload): Promise<Customer> => {
      const { data } = await api.post<ApiResponse<Customer>>('/customers', payload);
      return data.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};

export const useUpdateCustomerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<CreateCustomerPayload> }): Promise<Customer> => {
      const { data } = await api.put<ApiResponse<Customer>>(`/customers/${id}`, payload);
      return data.data!;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer', variables.id] });
    },
  });
};

export const useAddCustomerNoteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, text }: { id: string; text: string }): Promise<Customer> => {
      const { data } = await api.post<ApiResponse<Customer>>(`/customers/${id}/notes`, { text });
      return data.data!;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customer', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};
