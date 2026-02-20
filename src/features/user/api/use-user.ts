import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/src/api/axios";
import { ResponseFormat } from "@/src/utils/type/responce";
import { useAuthStore } from "@/src/store/AuthStore";
import { UserSignupType, UserLoginType } from "@/src/features/user/types";
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
      const { data } = await api.get<ResponseFormat<any>>("/user/me");

      console.log(data.data);

      setAuth(token, {
        name: data.data.user_full_name,
        email: data.data.user_email,
        id: data.data.user_id,
      });

      return data.data;
    },
  });
}
