import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getEventResponses,
  getEventGuest,
  getInvitation,
  inviteGuest,
  setInvitationResponce,
  type EventResponseItem,
  type InvitationResponcePayload,
  type InviteGuestPayload,
} from "./service";

export const useGetEventGuests = (eventId: number | null) => {
  return useQuery({
    queryKey: ["event-guests", eventId],
    queryFn: () => getEventGuest(eventId!),
    enabled: !!eventId,
  });
};

export const useGetInvitationsForEvent = (eventId: number | null) => {
  return useQuery({
    queryKey: ["event-invitations", eventId],
    queryFn: () => getInvitation(eventId!),
    enabled: !!eventId,
  });
};

export const useGetEventResponses = (eventId: number | null) => {
  return useQuery<EventResponseItem[]>({
    queryKey: ["event-responses", eventId],
    queryFn: () => getEventResponses(eventId!),
    enabled: !!eventId,
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useInviteGuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eventId,
      payload,
    }: {
      eventId: number;
      payload: InviteGuestPayload;
    }) => inviteGuest(eventId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["event-invitations", variables.eventId],
      });
      queryClient.invalidateQueries({
        queryKey: ["event-guests", variables.eventId],
      });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useSetInvitationResponce = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eventId,
      payload,
    }: {
      eventId: number;
      payload: InvitationResponcePayload;
    }) => setInvitationResponce(eventId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["event-invitations", variables.eventId],
      });
      queryClient.invalidateQueries({
        queryKey: ["event-guests", variables.eventId],
      });
      queryClient.invalidateQueries({
        queryKey: ["event-responses", variables.eventId],
      });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

// Backward-compatible alias for existing imports/usages.
export const useSetResponse = useSetInvitationResponce;