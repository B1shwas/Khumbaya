import { Event } from "@/src/constants/event";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptRsvpInvitationApi,
  createEventApi,
  getCompletedEventsApi,
  getInvitedEvent,
  getUpcomingEventsApi,
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


interface EventQueryOptions {
  enabled?: boolean;
}

export const usegetUpcomingEvents = ({ enabled = true }: EventQueryOptions = {}) => {
  return useQuery({
    queryKey: ["events/upcoming"],
    queryFn: () => getUpcomingEventsApi(),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useGetInvitedEvents = ({ enabled = true }: EventQueryOptions = {}) => {
  return useQuery({
    queryKey: ["rsvp-invitations"],
    queryFn: getInvitedEvent,
    enabled,
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
export const useGetCompletedEvents = ({ enabled = true }: EventQueryOptions = {}) => {
  return useQuery({
    queryKey: ["events/completed"],
    queryFn: () => getCompletedEventsApi(),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useGetEventWithRole = ({ enabled = true }: EventQueryOptions = {}) => {
  return useQuery({
    queryKey: ["events/with-role"],
    enabled,
    queryFn: async () => {
      const [upcomingEvents, invitedEvents] = await Promise.all([
        getUpcomingEventsApi(),
        getInvitedEvent(),
      ]);

      const deduped = new Map<string, Event>();
      [...upcomingEvents, ...invitedEvents].forEach((event) => {
        deduped.set(String(event.id), event as Event);
      });

      return Array.from(deduped.values());
    },
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
      queryClient.invalidateQueries({ queryKey: ["events/with-role"] });
    },
  });
};
