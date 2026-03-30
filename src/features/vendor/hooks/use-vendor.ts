import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    contactVendorApi,
    getVendorByIdApi,
    getVendorListApi,
    getVendorsByEventApi,
    hireVendorApi,
} from "../api";
import { ContactVendorPayload, HireVendorPayload } from "../types";

export const useGetVendorList = () => {
  return useQuery({
    queryKey: ["vendor/list"],
    queryFn: getVendorListApi,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useGetVendorById = (id: string) => {
  return useQuery({
    queryKey: ["vendor", id],
    queryFn: () => getVendorByIdApi(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useGetVendorsByEvent = (eventId: string) => {
  return useQuery({
    queryKey: ["vendor/event", eventId],
    queryFn: () => getVendorsByEventApi(eventId),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useHireVendor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: HireVendorPayload) => hireVendorApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor/list"] });
    },
  });
};

export const useContactVendor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ContactVendorPayload) => contactVendorApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor/list"] });
    },
  });
};
