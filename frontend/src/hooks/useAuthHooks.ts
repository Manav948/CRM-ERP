import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { LoginPayload, RegisterPayload, AuthResponse, User } from '../types';

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (payload: LoginPayload): Promise<AuthResponse> => {
      const { data } = await api.post<AuthResponse>('/auth/login', payload);
      return data;
    },
  });
};

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: RegisterPayload): Promise<AuthResponse> => {
      const { data } = await api.post<AuthResponse>('/auth/register', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useProfileQuery = (enabled = true) => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async (): Promise<User> => {
      const { data } = await api.get<{ success: boolean; user: User }>('/auth/me');
      return data.user;
    },
    enabled,
  });
};
