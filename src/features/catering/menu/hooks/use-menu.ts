import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { menuService } from "../services/menuService";
import { CreateMenuPayload, UpdateMenuPayload } from "../types";

const menuQueryKeys = {
  all: ["menu"] as const,
  lists: () => [...menuQueryKeys.all, "list"] as const,
  list: (cateringId: number, page: number, limit: number) =>
    [...menuQueryKeys.lists(), { cateringId, page, limit }] as const,
  details: () => [...menuQueryKeys.all, "detail"] as const,
  detail: (menuId: number) => [...menuQueryKeys.details(), menuId] as const,
};

// Get menu list for a catering
export const useMenuList = (
  cateringId: number,
  page = 1,
  limit = 10,
  options = {}
) => {
  return useQuery({
    queryKey: menuQueryKeys.list(cateringId, page, limit),
    queryFn: () => menuService.getMenuList(cateringId, page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

// Get single menu item
export const useMenuById = (menuId: number, options = {}) => {
  return useQuery({
    queryKey: menuQueryKeys.detail(menuId),
    queryFn: () => menuService.getMenuById(menuId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

// Create menu item mutation
export const useCreateMenuMutation = (cateringId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMenuPayload) =>
      menuService.createMenu(cateringId, payload),
    onSuccess: () => {
      // Invalidate the menu list for this catering
      queryClient.invalidateQueries({
        queryKey: menuQueryKeys.lists(),
      });
    },
  });
};

// Update menu item mutation
export const useUpdateMenuMutation = (menuId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateMenuPayload) =>
      menuService.updateMenu(menuId, payload),
    onSuccess: () => {
      // Invalidate both the detail and list queries
      queryClient.invalidateQueries({
        queryKey: menuQueryKeys.detail(menuId),
      });
      queryClient.invalidateQueries({
        queryKey: menuQueryKeys.lists(),
      });
    },
  });
};

// Delete menu item mutation
export const useDeleteMenuMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (menuId: number) => menuService.deleteMenu(menuId),
    onSuccess: (_data, menuId) => {
      // Invalidate detail query
      queryClient.invalidateQueries({
        queryKey: menuQueryKeys.detail(menuId),
      });
      // Invalidate all lists
      queryClient.invalidateQueries({
        queryKey: menuQueryKeys.lists(),
      });
    },
  });
};
