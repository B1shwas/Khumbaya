import { QueryClient } from "@tanstack/react-query";

let queryClientInstance: QueryClient | null = null;

export const setQueryClient = (client: QueryClient) => {
  queryClientInstance = client;
};

export const getQueryClient = (): QueryClient | null => {
  return queryClientInstance;
};

export const clearQueryCache = () => {
  if (queryClientInstance) {
    queryClientInstance.clear();
    console.log("✅ Query cache cleared");
  }
};
