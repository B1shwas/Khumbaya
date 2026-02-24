import api from "@/src/api/axios";
import { UserLoginType, UserSignupType } from "@/src/features/user/types";
import { useAuthStore } from "@/src/store/AuthStore";
import { ResponseFormat } from "@/src/utils/type/responce";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUserApi, getUserProfile } from "./user.service";

interface LoginResponse {
  id: number;
  token: string;
  user: {
    name: string;
    email: string;
  };
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: UserLoginType) => {
      const { data } = await api.post<ResponseFormat<LoginResponse>>(
        "user/login",
        credentials
      );
      return data.data;
    },
    onSuccess: async (data) => {
      useAuthStore.getState().setAuth(data.token, null);
      queryClient.invalidateQueries(); // clear all queries to ensure fresh data after login
    },
  });
}
export function useSignup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: UserSignupType) => {
      const data = await createUserApi(credentials);
      return data;
    },
    onSuccess: async (data) => {
      useAuthStore.getState().setAuth(data.token, null);
      queryClient.invalidateQueries();
    },
  });
}
export function useProfile() {
  const token = useAuthStore((s) => s.token);
  const setAuth = useAuthStore((s) => s.setAuth);
  const isLoading = useAuthStore((s) => s.isLoading);

  return useQuery({
    queryKey: ["profile"],
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !isLoading && !!token,

    queryFn: async () => {
      const data = await getUserProfile();
      console.log(data);
      setAuth(token as string, {
        name: data.username,
        email: data.email,
        id: data.id,
      });

      return data;
    },
  });
}
