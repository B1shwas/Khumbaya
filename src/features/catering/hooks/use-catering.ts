import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createCateringApi,
    createCateringMenuApi,
    deleteCateringApi,
    deleteMenuApi,
    getCateringByIdApi,
    getCateringMenuApi,
    getCateringsByEventIdApi,
    updateCateringApi,
    updateMenuApi,
} from "../api/catering.service";
import {
    CreateCateringPayload,
    CreateMenuPayload,
    UpdateCateringPayload,
    UpdateMenuPayload,
} from "../types/catering.types";

export const useGetCateringsByEventId = (
  eventId?: string | number,
  page = 1,
  limit = 10
) => {
  return useQuery({
    queryKey: ["catering/event", eventId, page, limit],
    queryFn: () =>
      getCateringsByEventIdApi(eventId as string | number, page, limit),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetCateringById = (cateringId?: string | number) => {
  return useQuery({
    queryKey: ["catering", cateringId],
    queryFn: () => getCateringByIdApi(cateringId as string | number),
    enabled: !!cateringId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetCateringMenu = (cateringId?: string | number) => {
  return useQuery({
    queryKey: ["catering", cateringId, "menu"],
    queryFn: () => getCateringMenuApi(cateringId as string | number),
    enabled: !!cateringId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateCatering = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventId,
      payload,
    }: {
      eventId: string | number;
      payload: CreateCateringPayload;
    }) => createCateringApi(eventId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["catering/event"] });
      queryClient.invalidateQueries({
        queryKey: ["catering/event", String(variables.eventId)],
      });
    },
  });
};

export const useUpdateCatering = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      cateringId,
      payload,
      eventId,
    }: {
      cateringId: string | number;
      eventId?: string | number;
      payload: UpdateCateringPayload;
    }) => updateCateringApi(cateringId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["catering", String(variables.cateringId)],
      });
      queryClient.invalidateQueries({ queryKey: ["catering/event"] });
      if (variables.eventId) {
        queryClient.invalidateQueries({
          queryKey: ["catering/event", String(variables.eventId)],
        });
      }
    },
  });
};

export const useDeleteCatering = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      cateringId,
      eventId,
    }: {
      cateringId: string | number;
      eventId?: string | number;
    }) => deleteCateringApi(cateringId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["catering/event"] });
      if (variables.eventId) {
        queryClient.invalidateQueries({
          queryKey: ["catering/event", String(variables.eventId)],
        });
      }
    },
  });
};

export const useCreateCateringMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      cateringId,
      payload,
      eventId,
    }: {
      cateringId: string | number;
      eventId?: string | number;
      payload: CreateMenuPayload;
    }) => createCateringMenuApi(cateringId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["catering", String(variables.cateringId), "menu"],
      });
      queryClient.invalidateQueries({
        queryKey: ["catering", String(variables.cateringId)],
      });
      if (variables.eventId) {
        queryClient.invalidateQueries({
          queryKey: ["catering/event", String(variables.eventId)],
        });
      }
    },
  });
};

export const useUpdateMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      menuId,
      payload,
      eventId,
      cateringId,
    }: {
      menuId: string | number;
      cateringId?: string | number;
      eventId?: string | number;
      payload: UpdateMenuPayload;
    }) => updateMenuApi(menuId, payload),
    onSuccess: (_data, variables) => {
      if (variables.cateringId) {
        queryClient.invalidateQueries({
          queryKey: ["catering", String(variables.cateringId), "menu"],
        });
        queryClient.invalidateQueries({
          queryKey: ["catering", String(variables.cateringId)],
        });
      }
      if (variables.eventId) {
        queryClient.invalidateQueries({
          queryKey: ["catering/event", String(variables.eventId)],
        });
      }
    },
  });
};

export const useDeleteMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      menuId,
      cateringId,
      eventId,
    }: {
      menuId: string | number;
      cateringId?: string | number;
      eventId?: string | number;
    }) => deleteMenuApi(menuId),
    onSuccess: (_data, variables) => {
      if (variables.cateringId) {
        queryClient.invalidateQueries({
          queryKey: ["catering", String(variables.cateringId), "menu"],
        });
        queryClient.invalidateQueries({
          queryKey: ["catering", String(variables.cateringId)],
        });
      }
      if (variables.eventId) {
        queryClient.invalidateQueries({
          queryKey: ["catering/event", String(variables.eventId)],
        });
      }
    },
  });
};
