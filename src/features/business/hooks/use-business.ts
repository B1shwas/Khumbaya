import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBusinessApi,
  deleteBusinessApi,
  getBusinessByIdApi,
  getBusinessListApi,
  updateBusinessApi,
} from "../api";
import { UpdateBusinessPayload, CreateBusinessPayload } from "../types";

export const useGetBusinessList = () => {
  return useQuery({
    queryKey: ["business/list"],
    queryFn: getBusinessListApi,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useGetBusinessById = (id: string) => {
  return useQuery({
    queryKey: ["business", id],
    queryFn: () => getBusinessByIdApi(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useCreateBusiness = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBusinessPayload) => createBusinessApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business/list"] });
    },
  });
};

export const useUpdateBusiness = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBusinessPayload }) =>
      updateBusinessApi(id, payload),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["business/list"] });
      queryClient.invalidateQueries({ queryKey: ["business", id] });
    },
  });
};

export const useDeleteBusiness = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBusinessApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business/list"] });
    },
  });
};
