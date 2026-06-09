import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { User } from "@/types/users";

export interface CreateModeratorData {
  email: string;
  permissions: string[];
}

export function useModerators() {
  return useQuery<User[]>({
    queryKey: ["moderators"],
    queryFn: async () => {
      const { data } = await api.get("/api/admin/moderators");
      return data.data;
    },
  });
}

export function useCreateModerator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateModeratorData) => {
      const response = await api.post("/api/admin/moderators", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moderators"] });
    },
  });
}

export function useUpdateModeratorPermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number | string; permissions: string[]; email: string }) => {
      const response = await api.put(`/api/admin/moderators/${data.id}`, {
        permissions: data.permissions,
        email: data.email,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moderators"] });
    },
  });
}

export function useDeleteModerator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string) => {
      const response = await api.delete(`/api/admin/moderators/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moderators"] });
    },
  });
}
