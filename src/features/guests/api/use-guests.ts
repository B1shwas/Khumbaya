import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inviteGuest, type InviteGuestPayload } from "./service";

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
        queryKey: ["event-guests", variables.eventId],
      });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};
