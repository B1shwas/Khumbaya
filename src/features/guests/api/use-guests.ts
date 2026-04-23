import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEventGuestCategory,
  type CreateGuestCategoryPayload,
  getEventGuest,
  getEventGuestCategories,
  getGuestRoom,
  getInvitation,
  inviteGuest,
  removeInvitation,
  type GuestCategoryOption,
  type InviteGuestPayload,
  updateGuestCheckIn,
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

export const useGetEventGuestCategories = (eventId: number | null) => {
  return useQuery<GuestCategoryOption[]>({
    queryKey: ["event-guest-categories", eventId],
    queryFn: () => getEventGuestCategories(eventId!),
    enabled: !!eventId,
  });
};

export const useCreateEventGuestCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eventId,
      payload,
    }: {
      eventId: number;
      payload: CreateGuestCategoryPayload;
    }) => createEventGuestCategory(eventId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["event-guest-categories", variables.eventId],
      });
    },
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

export const useRemoveInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, guestId }: { eventId: number; guestId: number }) =>
      removeInvitation(eventId, guestId),
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

export const useGetGuestRoom = (eventId: number | null) => {
  return useQuery({
    queryKey: ["event-guest-room", eventId],
    queryFn: () => getGuestRoom(eventId!),
    enabled: !!eventId,
  });
};

export const useUpdateGuestCheckIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      invitationId,
      action,
    }: {
      invitationId: number;
      action: "checkIn" | "checkOut";
    }) => updateGuestCheckIn({ invitationId, action }),
    onMutate: async ({ invitationId, action }) => {
      await queryClient.cancelQueries({
        queryKey: ["event-guest-room"],
      });

      const previousGuests = queryClient.getQueryData<any[]>([
        "event-guest-room",
      ]);

      queryClient.setQueryData<any[]>(
        ["event-guest-room"],
        (old) =>
          old?.map((g: any) =>
            g.invitationId === invitationId
              ? { ...g, checked_in: action === "checkIn" }
              : g
          ) ?? []
      );

      return { previousGuests };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousGuests) {
        queryClient.setQueryData(["event-guest-room"], context.previousGuests);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["event-guest-room"],
      });
    },
  });
};
