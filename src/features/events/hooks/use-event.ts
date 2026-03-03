import { Event } from "@/src/constants/event";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptRsvpInvitationApi,
  CREATEEVENT,
  createEventApi,
  getCompletedEventsApi,
  getInvitedEvent,
  getUpcomingEventsApi,
} from "../api/events.service";

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEventApi,
    onMutate: async (newEvent: CREATEEVENT) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["events/upcoming"] }),
        queryClient.cancelQueries({ queryKey: ["events/with-role"] }),
      ]);

      const previousUpcomingEvents = queryClient.getQueryData<Event[]>([
        "events/upcoming",
      ]);
      const previousEventsWithRole = queryClient.getQueryData<Event[]>([
        "events/with-role",
      ]);

      const startDate = newEvent.startDateTime
        ? new Date(newEvent.startDateTime)
        : new Date();
      const endDate = newEvent.endDateTime
        ? new Date(newEvent.endDateTime)
        : startDate;

      const optimisticEvent: Event = {
        id: `temp-${Date.now()}`,
        title: newEvent.title ?? "Untitled Event",
        startDateTime: startDate.toISOString(),
        endDateTime: endDate.toISOString(),
        location: newEvent.location ?? "TBD",
        venue: newEvent.location ?? "TBD",
        imageUrl: newEvent.imageUrl ?? "",
        role: "Organizer",
        status: "upcoming",
        date: startDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        time: startDate.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
      };

      queryClient.setQueryData<Event[]>(["events/upcoming"], (old) =>
        Array.isArray(old) ? [optimisticEvent, ...old] : [optimisticEvent]
      );

      queryClient.setQueryData<Event[]>(["events/with-role"], (old) =>
        Array.isArray(old) ? [optimisticEvent, ...old] : [optimisticEvent]
      );

      return { previousUpcomingEvents, previousEventsWithRole };
    },
    onError: (_error, _newEvent, context) => {
      if (context?.previousUpcomingEvents) {
        queryClient.setQueryData(
          ["events/upcoming"],
          context.previousUpcomingEvents
        );
      }

      if (context?.previousEventsWithRole) {
        queryClient.setQueryData(
          ["events/with-role"],
          context.previousEventsWithRole
        );
      }
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["events/upcoming"] }),
        queryClient.invalidateQueries({ queryKey: ["events/completed"] }),
        queryClient.invalidateQueries({ queryKey: ["events/with-role"] }),
      ]);
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
      queryClient.invalidateQueries({ queryKey: ["events/upcoming"] });
      queryClient.invalidateQueries({ queryKey: ["events/completed"] });
      queryClient.invalidateQueries({ queryKey: ["events/with-role"] });
    },
  });
};
