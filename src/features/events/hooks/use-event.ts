import { Event } from "@/src/constants/event";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptRsvpInvitationApi,
  CREATEEVENT,
  createEventApi,
  getCompletedEventsApi,
  getEventById,
  getInvitedEvent,
  getResponsesWithUser,
  getSubEventOfEvent,
  getUpcomingEventsApi,
  makeEventMember,
  MakeEventMemberType,
  RsvpResponsePayload,
  submitRsvpResponseApi,
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
    onSuccess: async (_data, variables) => {
      const invalidations = [
        queryClient.invalidateQueries({ queryKey: ["events/upcoming"] }),
        queryClient.invalidateQueries({ queryKey: ["events/completed"] }),
        queryClient.invalidateQueries({ queryKey: ["events/with-role"] }),
      ];
      if (variables.parentId) {
        invalidations.push(
          queryClient.invalidateQueries({
            queryKey: ["sub-events", variables.parentId],
          })
        );
      }
      await Promise.all(invalidations);
    },
  });
};

interface EventQueryOptions {
  enabled?: boolean;
}

export const usegetUpcomingEvents = ({
  enabled = true,
}: EventQueryOptions = {}) => {
  return useQuery({
    queryKey: ["events/upcoming"],
    queryFn: () => getUpcomingEventsApi(),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useGetInvitedEvents = ({
  enabled = true,
}: EventQueryOptions = {}) => {
  return useQuery({
    queryKey: ["rsvp-invitations"],
    queryFn: getInvitedEvent,
    enabled,
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
export const useGetCompletedEvents = ({
  enabled = true,
}: EventQueryOptions = {}) => {
  return useQuery({
    queryKey: ["events/completed"],
    queryFn: () => getCompletedEventsApi(),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useGetEventWithRole = ({
  enabled = true,
}: EventQueryOptions = {}) => {
  return useQuery({
    queryKey: ["events/with-role"],
    enabled,
    queryFn: async () => {
      const upcomingEvents = await getUpcomingEventsApi();

      return upcomingEvents;
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

interface UseEventByIdOptions {
  enabled?: boolean;
}

export const useEventById = (
  eventId: number,
  options?: UseEventByIdOptions
) => {
  return useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const events = await getEventById(eventId);
      return events;
    },
    enabled: options?.enabled ?? true,
  });
};

export const useEventResponseWithUser = (eventId: number) => {
  return useQuery({
    queryKey: ["event-responses", eventId],
    queryFn: async () => {
      const responses = await getResponsesWithUser(eventId);
      return responses;
    },
  });
};

export const useSubmitRsvpResponse = (eventId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RsvpResponsePayload) =>
      submitRsvpResponseApi(eventId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-responses", eventId] });
      queryClient.invalidateQueries({
        queryKey: ["event-invitations", eventId],
      });
      queryClient.invalidateQueries({ queryKey: ["event-guests", eventId] });
      queryClient.invalidateQueries({ queryKey: ["rsvp-invitations"] });
    },
  });
};

export const useSubEventsOfEvent = (eventId: number) => {
  return useQuery({
    queryKey: ["sub-events", eventId],
    queryFn: async () => {
      const subEvents = await getSubEventOfEvent(eventId);
      return subEvents;
    },
  });
};

export const useMakeEventMember = (eventId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: MakeEventMemberType) =>
      makeEventMember(eventId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-responses", eventId] });
      queryClient.invalidateQueries({ queryKey: ["rsvp-invitations"] });
    },
  });
};
