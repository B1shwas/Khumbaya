import api from "@/src/api/axios";
import { UserLoginType, UserSignupType } from "@/src/features/user/types";
import { useAuthStore } from "@/src/store/AuthStore";
import { ResponseFormat } from "@/src/utils/type/responce";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUserApi,
  getUserProfile,
  getUserWithPhone,
  updateUserMeApi,
  type UpdateUserMePayload,
} from "./user.service";

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

      setAuth(token as string, {
        username: data.username,
        email: data.email,
        id: data.id,
        info: data.info ?? null,
        dob: data.dob ?? null,
        city: data.city ?? null,
        zip: data.zip ?? null,
        address: data.address ?? null,
        coverPhoto: data.coverPhoto ?? null,
        photo: data.photo ?? null,
        familyId: data.familyId ?? null,
        relation: data.relation ?? null,
        foodPreference: data.foodPreference ?? null,
        country: data.country ?? null,
        bio: data.bio ?? null,
        location: data.location ?? null,
        phone: data.phone ?? "",
        accountStatus: data.accountStatus ?? null,
        createdAt: data.createdAt ?? null,
        updatedAt: data.updatedAt ?? null,
      });

      return data;
    },
  });
}

export function useUpdateUserMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: UpdateUserMePayload & { familyId?: number | null }
    ) => {
      const { familyId: _familyId, ...userPayload } = payload;
      const data = await updateUserMeApi(userPayload);
      return data;
    },
    onSuccess: async (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });

      if (variables.familyId != null) {
        queryClient.invalidateQueries({
          queryKey: ["family-members", variables.familyId],
        });
      }
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) => {
      const response = await api.patch("/user", data);
      return response.data;
    },
  });
}
interface UseFindUserWithPhoneOptions {
  enabled?: boolean;
}

export function useFindUserWithPhone(
  phone: string,
  { enabled = true }: UseFindUserWithPhoneOptions = {}
) {
  const token = useAuthStore((s) => s.token);
  const isLoading = useAuthStore((s) => s.isLoading);
  const normalizedPhone = phone.trim();

  return useQuery({
    queryKey: ["find", normalizedPhone],
    enabled: !!token && !isLoading && enabled && !!normalizedPhone,
    queryFn: async () => {
      const data = await getUserWithPhone(normalizedPhone);
      return data;
    },
  });
}
