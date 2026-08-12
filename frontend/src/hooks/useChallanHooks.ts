import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type {
  Challan,
  CreateChallanPayload,
  ChallanQueryParams,
  ChallanStatus,
  PaginatedResponse,
  ApiResponse,
} from '../types';

export const useGetChallansQuery = (params: ChallanQueryParams = {}) => {
  return useQuery({
    queryKey: ['challans', params],
    queryFn: async (): Promise<PaginatedResponse<Challan>> => {
      const { data } = await api.get<PaginatedResponse<Challan>>('/challans', {
        params,
      });
      return data;
    },
  });
};

export const useGetChallanByIdQuery = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ['challan', id],
    queryFn: async (): Promise<Challan> => {
      const { data } = await api.get<ApiResponse<Challan>>(`/challans/${id}`);
      return data.data!;
    },
    enabled: Boolean(id) && enabled,
  });
};

export const useCreateChallanMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateChallanPayload): Promise<Challan> => {
      const { data } = await api.post<ApiResponse<Challan>>('/challans', payload);
      return data.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challans'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['stockLogs'] });
    },
  });
};

export const useUpdateChallanStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ChallanStatus }): Promise<Challan> => {
      const { data } = await api.patch<ApiResponse<Challan>>(`/challans/${id}/status`, { status });
      return data.data!;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['challans'] });
      queryClient.invalidateQueries({ queryKey: ['challan', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['stockLogs'] });
    },
  });
};
