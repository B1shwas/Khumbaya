import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEventApi,
  getEventsApi,
  getEventGuest,
} from "../api/events.service";

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEventApi,
    onMutate: async (newEvent) => {
      await queryClient.cancelQueries({ queryKey: ["events"] });
      const previousPost = queryClient.getQueryData(["events"]);
      queryClient.setQueryData(["events"], (old: any) => [...old, newEvent]);
      return { previousPost };
    },
  });
};

export const useGetEventWithRole = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: getEventsApi,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
  

