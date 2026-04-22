import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assign_vehicle,
  AssignVehiclePayload,
  createVehicle,
  CreateVehicle,
  getEventVehicles,
  get_vehicle_assignment , 
  getGuestTransportation,
} from "../api";

import { 
  LogisticsTimelineItem, 
  mapToLogisticsTimeline 
} from "../type";

export const useGuestTransportation = (eventId: string) => {
  return useQuery({
    queryKey: ["logistics", "guest-transportation", eventId],
    queryFn: () => getGuestTransportation(eventId),
    enabled: !!eventId,
  });
};

export const useGetVehicle = (eventId: string) => {
  return useQuery({
    queryKey: ["logistics", "vehicle", eventId],
    queryFn: () => getEventVehicles(eventId),
    enabled: !!eventId,
  });
}

export const useGetVehicleAssignement = (vehicleId: string) => {
  return useQuery<LogisticsTimelineItem[]>({
    queryKey: ['vehicle/assign', vehicleId],
    queryFn: async () => {
      const data = await get_vehicle_assignment(vehicleId);
      return mapToLogisticsTimeline(data);
    },
    enabled: !!vehicleId
  });
}


export const useCreateVehicle = (eventId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["logistics", "create-vehicle", eventId],
    mutationFn: (params: CreateVehicle) => {

      return createVehicle(eventId, params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["logistics", "guest-transportation", eventId],
      });
      queryClient.invalidateQueries({
        queryKey: ["logistics", "vehicle", eventId],
      });
    },
  });
};

export const useAssignVehicle = (eventId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["logistics", "assign-vehicle", eventId],
    mutationFn: (params: AssignVehiclePayload) => assign_vehicle(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["logistics", "guest-transportation", eventId],
      });
      queryClient.invalidateQueries({
        queryKey: ["logistics", "vehicle", eventId],
      });
      queryClient.invalidateQueries({
        queryKey: ["vehicle/assign"],
      });
    },
  });
};
