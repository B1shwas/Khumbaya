import api from "@/src/api/axios";
import { UserLoginType, UserSignupType } from "@/src/features/user/types";
import { useAuthStore } from "@/src/store/AuthStore";
import { ResponseFormat } from "@/src/utils/type/responce";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
interface LoginResponse {
  token: string;
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
    onSuccess: (data) => {
      useAuthStore.getState().setAuth(data.token, null );
      queryClient.clear();
    },
  });
}
export function useSignup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: UserSignupType) => {
      const { data } = await api.post<ResponseFormat<LoginResponse>>(
        "user/signup",
        credentials
      );
      return data.data;
    },
    onSuccess: (data) => {
      useAuthStore.getState().setAuth(data.token, null);
      queryClient.clear();
    },
  });
}
export function useProfile() {
  const token = useAuthStore((s) => s.token);
  const setAuth = useAuthStore((s) => s.setAuth);

  return useQuery({
    queryKey: ["profile"],
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,

    queryFn: async () => {
      const { data } = await api.get<ResponseFormat<any>>("/user/profile");

      console.log(data.data);

      setAuth(token as string, {
        name: data.data.name,
        email: data.data.email,
        id: data.data.id,
      });

      return data.data;
    },
  });
}
