import { useQuery } from "@tanstack/react-query";
import { getHotelManagement } from "./service";

export const useGetHotelManagement = (eventId: number | null) => {
  return useQuery({
    queryKey: ["hotel-management", eventId],
    queryFn: () => getHotelManagement(eventId!),
    enabled: !!eventId,
  });
};
