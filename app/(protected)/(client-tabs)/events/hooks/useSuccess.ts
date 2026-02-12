import { router, type RelativePathString } from "expo-router";
import { useCallback } from "react";

export const useSuccess = () => {
  const handleCreateSubEvent = useCallback(() => {
    router.push("/events/subevent-create" as RelativePathString);
  }, []);

  const handleViewEvents = useCallback(() => {
    router.replace("/events" as RelativePathString);
  }, []);

  return {
    handleCreateSubEvent,
    handleViewEvents,
  };
};
