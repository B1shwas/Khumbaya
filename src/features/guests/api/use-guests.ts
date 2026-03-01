import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getEventGuest,
  getInvitation,
  inviteGuest,
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
