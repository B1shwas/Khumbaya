import { useCallback, useState } from "react";
import type {
    SelectedSubEvent,
    SubEventTemplate,
} from "../types/subEventCreate";

export const useSubEventCreate = () => {
  const [selectedSubEvents, setSelectedSubEvents] = useState<
    SelectedSubEvent[]
  >([]);

  const handleTemplateSelect = useCallback(
    (
      template: SubEventTemplate,
      navigate: (path: any) => void,
      eventId: string,
    ) => {
      const existingIndex = selectedSubEvents.findIndex(
        (s) => s.template.id === template.id,
      );

      if (existingIndex >= 0) {
        navigate({
          pathname: "/events/subevent-detail" as any,
          params: {
            subEventId: template.id,
            eventId: eventId || "1",
          },
        });
      } else {
        const newSubEvent: SelectedSubEvent = {
          template,
          date: "",
          theme: "",
          budget: "",
          activities: [],
        };
        setSelectedSubEvents((prev) => [...prev, newSubEvent]);

        navigate({
          pathname: "/events/subevent-detail" as any,
          params: {
            subEventId: template.id,
            eventId: eventId || "1",
            isNew: "true",
          },
        });
      }
    },
    [selectedSubEvents],
  );

  const handleRemoveSubEvent = useCallback((templateId: string) => {
    setSelectedSubEvents((prev) =>
      prev.filter((s) => s.template.id !== templateId),
    );
  }, []);

  const isTemplateSelected = useCallback(
    (templateId: string): boolean => {
      return selectedSubEvents.some((s) => s.template.id === templateId);
    },
    [selectedSubEvents],
  );

  return {
    selectedSubEvents,
    setSelectedSubEvents,
    handleTemplateSelect,
    handleRemoveSubEvent,
    isTemplateSelected,
  };
};
