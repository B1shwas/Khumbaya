import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptRsvpInvitationApi,
  createEventApi,
  getEventsApi,
  getInvitedEvent,
} from "../api/events.service";

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEventApi,
    onMutate: async (newEvent) => {
      await queryClient.cancelQueries({ queryKey: ["events"] });
      const previousEvents = queryClient.getQueryData(["events"]);
      queryClient.setQueryData(["events"], (old: any[] | undefined) =>
        Array.isArray(old) ? [...old, newEvent] : [newEvent]
      );
      return { previousEvents };
    },
    onError: (_error, _newEvent, context) => {
      if (context?.previousEvents) {
        queryClient.setQueryData(["events"], context.previousEvents);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useGetEventWithRole = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: () => getEventsApi(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useGetInvitedEvents = () => {
  return useQuery({
    queryKey: ["rsvp-invitations"],
    queryFn: getInvitedEvent,
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useAcceptRsvpInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptRsvpInvitationApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rsvp-invitations"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};
