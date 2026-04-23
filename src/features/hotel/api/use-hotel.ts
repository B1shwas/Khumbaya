import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleCheckin_out, ToggleCheckin_outType } from "./service";

export const useToggleCheckin_out = (eventId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      invitationId,
      action
    }: ToggleCheckin_outType) => toggleCheckin_out({ invitationId, action }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-guest-room", eventId] });
    },
  });
};

