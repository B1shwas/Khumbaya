import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Business,
  BusinessPayload,
  createBusinessApi,
  deleteBusinessApi,
  getBusinessByIdApi,
  getBusinessesApi,
  getMyBusinessesApi,
  updateBusinessApi,
} from "../api/business.service";

// -----------------------------------------------------------------------------
// mutations
// -----------------------------------------------------------------------------

export const useCreateBusiness = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBusinessApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      queryClient.invalidateQueries({ queryKey: ["my-businesses"] });
    },
  });
};

export const useUpdateBusiness = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<BusinessPayload> }) =>
      updateBusinessApi(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["business", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      queryClient.invalidateQueries({ queryKey: ["my-businesses"] });
    },
  });
};

export const useDeleteBusiness = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBusinessApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      queryClient.invalidateQueries({ queryKey: ["my-businesses"] });
    },
  });
};

// -----------------------------------------------------------------------------
// queries
// -----------------------------------------------------------------------------

export const useGetBusinesses = ({ page = 1, limit = 20 } = {}) => {
  return useQuery({
    queryKey: ["businesses", page, limit],
    queryFn: () => getBusinessesApi({ page, limit }),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useGetMyBusinesses = () => {
  return useQuery({
    queryKey: ["my-businesses"],
    queryFn: getMyBusinessesApi,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useGetBusinessById = (id?: number) => {
  return useQuery({
    queryKey: ["business", id],
    queryFn: () => getBusinessByIdApi(id as number),
    enabled: typeof id === "number",
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
