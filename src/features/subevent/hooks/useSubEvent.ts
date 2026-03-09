import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createSubEventApi,
    CreateSubEventPayload,
    deleteSubEventApi,
    getSubEventById,
    getSubEventsApi,
    getSubEventTemplatesApi,
    SubEvent,
    updateSubEventApi,
    UpdateSubEventPayload,
} from "../api/subEvent.service";

export interface SubEventQueryOptions {
  enabled?: boolean;
}

/**
 * Hook to get all sub-events for an event
 */
export const useSubEvents = (
  eventId: number,
  { enabled = true }: SubEventQueryOptions = {}
) => {
  return useQuery({
    queryKey: ["subevents", eventId],
    queryFn: () => getSubEventsApi({ eventId }),
    enabled: enabled && !!eventId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

/**
 * Hook to get a single sub-event by ID
 */
export const useSubEventById = (subEventId: number) => {
  return useQuery({
    queryKey: ["subevent", subEventId],
    queryFn: () => getSubEventById(subEventId),
    enabled: !!subEventId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to get all sub-event templates
 */
export const useSubEventTemplates = ({
  enabled = true,
}: SubEventQueryOptions = {}) => {
  return useQuery({
    queryKey: ["subevent-templates"],
    queryFn: getSubEventTemplatesApi,
    enabled,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};

/**
 * Hook to create a new sub-event
 */
export const useCreateSubEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSubEventPayload) => createSubEventApi(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["subevents", variables.eventId],
      });
    },
  });
};

/**
 * Hook to update an existing sub-event
 */
export const useUpdateSubEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      subEventId,
      data,
    }: {
      subEventId: number;
      data: UpdateSubEventPayload;
    }) => updateSubEventApi(subEventId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["subevent", variables.subEventId],
      });
    },
  });
};

/**
 * Hook to delete a sub-event
 */
export const useDeleteSubEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subEventId: number) => deleteSubEventApi(subEventId),
    onSuccess: () => {
      // Invalidate all subevents queries since we don't know which event
      queryClient.invalidateQueries({
        queryKey: ["subevents"],
      });
    },
  });
};

/**
 * Hook to create a sub-event with optimistic updates
 */
export const useCreateSubEventOptimistic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSubEventPayload) => createSubEventApi(payload),
    onMutate: async (newSubEvent: CreateSubEventPayload) => {
      await queryClient.cancelQueries({
        queryKey: ["subevents", newSubEvent.eventId],
      });

      const previousSubEvents = queryClient.getQueryData<SubEvent[]>([
        "subevents",
        newSubEvent.eventId,
      ]);

      const optimisticSubEvent: SubEvent = {
        id: Date.now() as unknown as number,
        eventId: newSubEvent.eventId,
        templateId: newSubEvent.templateId,
        date: newSubEvent.date,
        theme: newSubEvent.theme,
        budget: newSubEvent.budget,
        activities: newSubEvent.activities,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<SubEvent[]>(
        ["subevents", newSubEvent.eventId],
        (old) => (old ? [optimisticSubEvent, ...old] : [optimisticSubEvent])
      );

      return { previousSubEvents };
    },
    onError: (_error, _newSubEvent, context) => {
      if (context?.previousSubEvents) {
        queryClient.setQueryData(
          ["subevents", _newSubEvent.eventId],
          context.previousSubEvents
        );
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["subevents", variables.eventId],
      });
    },
  });
};
