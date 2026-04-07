import { useQuery } from "@tanstack/react-query";
import { getCategoryOfType } from "./service";

export const useCategory = (type: string) => {
  return useQuery({
    queryKey: ["category", type],
    queryFn: () => getCategoryOfType(type),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
