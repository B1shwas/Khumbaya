import { useCallback, useState } from "react";
import type { Event, ViewMode } from "../types/eventSuccess";

interface UseEventSuccessReturn {
  viewMode: ViewMode;
  selectedEvent: Event | null;
  expandedSubEvents: string[];
  setViewMode: (mode: ViewMode) => void;
  setSelectedEvent: (event: Event | null) => void;
  toggleSubEvent: (subEventId: string) => void;
  handleBackToSuccess: () => void;
  handleBackToEvents: () => void;
  handleEventPress: (event: Event) => void;
  handleCreateSubEvent: () => void;
  handleViewMyEvents: () => void;
  handleAddVendor: (subEventId: string) => void;
  handleCopyLink: (event: Event) => Promise<void>;
}

export const useEventSuccess = (): UseEventSuccessReturn => {
  const [viewMode, setViewMode] = useState<ViewMode>("success");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [expandedSubEvents, setExpandedSubEvents] = useState<string[]>([]);

  const handleBackToSuccess = useCallback(() => {
    setViewMode("success");
    setSelectedEvent(null);
    setExpandedSubEvents([]);
  }, []);

  const handleBackToEvents = useCallback(() => {
    setViewMode("events");
    setSelectedEvent(null);
  }, []);

  const handleEventPress = useCallback((event: Event) => {
    setSelectedEvent(event);
    setViewMode("subevent");
  }, []);

  const handleCreateSubEvent = useCallback(() => {
    // Navigation would be handled by router
  }, []);

  const handleViewMyEvents = useCallback(() => {
    setViewMode("events");
  }, []);

  const toggleSubEvent = useCallback((subEventId: string) => {
    setExpandedSubEvents((prev) =>
      prev.includes(subEventId)
        ? prev.filter((id) => id !== subEventId)
        : [...prev, subEventId],
    );
  }, []);

  const handleAddVendor = useCallback((subEventId: string) => {
    // TODO: Navigate to vendor selection for this sub-event
    console.log("Add vendor for sub-event:", subEventId);
  }, []);

  const handleCopyLink = useCallback(async (event: Event) => {
    // Haptics would be handled by expo-haptics
    console.log(
      "Link copied:",
      `wedding.app/events/${event.name.toLowerCase().replace(/ /g, "-")}`,
    );
  }, []);

  return {
    viewMode,
    selectedEvent,
    expandedSubEvents,
    setViewMode,
    setSelectedEvent,
    toggleSubEvent,
    handleBackToSuccess,
    handleBackToEvents,
    handleEventPress,
    handleCreateSubEvent,
    handleViewMyEvents,
    handleAddVendor,
    handleCopyLink,
  };
};
