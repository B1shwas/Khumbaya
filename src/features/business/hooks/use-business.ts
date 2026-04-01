import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBusinessApi,
  deleteBusinessApi,
  getBusinessByIdApi,
  getBusinessListApi,
  updateBusinessApi,
  updateBusinessServiceApi,
  updateBusinessVenueApi,
} from "../api";
import {
  CreateBusinessPayload,
  UpdateBusinessPayload,
  UpdateBusinessServicePayload,
  UpdateBusinessVenuePayload,
} from "../types";

export const useGetBusinessList = (userId?: number) => {
  return useQuery({
    queryKey: ["business/list", userId],
    queryFn: () => getBusinessListApi(userId),
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

export const useUpdateBusinessService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      serviceId,
      payload,
      businessId,
    }: {
      serviceId: number;
      payload: UpdateBusinessServicePayload;
      businessId?: string | number;
    }) => updateBusinessServiceApi(serviceId, payload),
    onSuccess: (data, variables) => {
      const resolvedBusinessId =
        data?.business_information?.id ?? variables.businessId;

      queryClient.invalidateQueries({ queryKey: ["business/list"] });

      if (resolvedBusinessId) {
        queryClient.invalidateQueries({
          queryKey: ["business", String(resolvedBusinessId)],
        });
      }
    },
  });
};

export const useUpdateBusinessVenue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      venueId,
      payload,
      businessId,
    }: {
      venueId: number;
      payload: UpdateBusinessVenuePayload;
      businessId?: string | number;
    }) => updateBusinessVenueApi(venueId, payload),
    onSuccess: (data, variables) => {
      const resolvedBusinessId =
        data?.business_information?.id ?? variables.businessId;

      queryClient.invalidateQueries({ queryKey: ["business/list"] });

      if (resolvedBusinessId) {
        queryClient.invalidateQueries({
          queryKey: ["business", String(resolvedBusinessId)],
        });
      }
    },
  });
};
