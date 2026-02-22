import { useCallback, useEffect, useState } from "react";
import { subEventApi } from "../api/subEventApi";
import { SelectedSubEvent } from "../types";

interface UseSubEventsReturn {
  // Data
  subEvents: SelectedSubEvent[];

  // Loading states
  loading: boolean;
  refreshing: boolean;

  // Actions
  loadSubEvents: () => Promise<void>;
  refresh: () => Promise<void>;
  addSubEvent: (subEvent: SelectedSubEvent) => Promise<void>;
  updateSubEvent: (
    templateId: string,
    data: Partial<SelectedSubEvent>
  ) => Promise<void>;
  deleteSubEvent: (templateId: string) => Promise<void>;
  exists: (templateId: string) => boolean;
}

export const useSubEvents = (): UseSubEventsReturn => {
  const [subEvents, setSubEvents] = useState<SelectedSubEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Load sub-events
  const loadSubEvents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await subEventApi.getAll();
      setSubEvents(data);
    } catch (error) {
      console.error("Error loading sub-events:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh sub-events
  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await subEventApi.getAll();
      setSubEvents(data);
    } catch (error) {
      console.error("Error refreshing sub-events:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadSubEvents();
  }, [loadSubEvents]);

  // Add a new sub-event
  const addSubEvent = useCallback(async (subEvent: SelectedSubEvent) => {
    await subEventApi.create(subEvent);
    setSubEvents((prev) => [...prev, subEvent]);
  }, []);

  // Update an existing sub-event
  const updateSubEvent = useCallback(
    async (templateId: string, data: Partial<SelectedSubEvent>) => {
      const updated = await subEventApi.update(templateId, data);
      if (updated) {
        setSubEvents((prev) =>
          prev.map((item) =>
            item.template.id === templateId ? { ...item, ...updated } : item
          )
        );
      }
    },
    []
  );

  // Delete a sub-event
  const deleteSubEvent = useCallback(async (templateId: string) => {
    await subEventApi.delete(templateId);
    setSubEvents((prev) =>
      prev.filter((item) => item.template.id !== templateId)
    );
  }, []);

  // Check if a template is already selected
  const exists = useCallback(
    (templateId: string) => {
      return subEvents.some((item) => item.template.id === templateId);
    },
    [subEvents]
  );

  return {
    subEvents,
    loading,
    refreshing,
    loadSubEvents,
    refresh,
    addSubEvent,
    updateSubEvent,
    deleteSubEvent,
    exists,
  };
};
