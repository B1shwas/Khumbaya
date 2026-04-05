import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  allocateGuestToRoom,
  getHotelsForEvent,
  getRoomAllocations,
  removeRoomAllocation,
  updateRoomAllocation,
} from "./service";

export const useGetHotelsForEvent = (eventId: number | null) => {
  return useQuery({
    queryKey: ["event-hotels", eventId],
    queryFn: () => getHotelsForEvent(eventId!),
    enabled: !!eventId,
  });
};

export const useGetRoomAllocations = (eventId: number | null) => {
  return useQuery({
    queryKey: ["event-hotel-allocations", eventId],
    queryFn: () => getRoomAllocations(eventId!),
    enabled: !!eventId,
  });
};

export const useAllocateGuestToRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: allocateGuestToRoom,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["event-hotel-allocations", variables.eventId] });
      queryClient.invalidateQueries({ queryKey: ["event-hotels", variables.eventId] });
    },
  });
};

export const useUpdateRoomAllocation = (eventId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ allocationId, payload }: Parameters<typeof updateRoomAllocation>[0] extends number ? { allocationId: number; payload: Parameters<typeof updateRoomAllocation>[1] } : never) =>
      updateRoomAllocation(allocationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-hotel-allocations", eventId] });
    },
  });
};

export const useRemoveRoomAllocation = (eventId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeRoomAllocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-hotel-allocations", eventId] });
    },
  });
};
