import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEventApi } from "../api/events.service";
export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEventApi,
    onMutate: async (newEvent) => {
     await queryClient.cancelQueries({ queryKey: ['events'] });
     const previousPost = queryClient.getQueryData(['events']);

    },
  });
};
