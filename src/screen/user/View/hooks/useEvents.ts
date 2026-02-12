import { useMemo, useState } from "react";
import { EVENTS_DATA, EventTab, TABS, type Event } from "../types/events";

export const useEvents = () => {
  const [activeTab, setActiveTab] = useState<EventTab>("myEvents");
  const [refreshing, setRefreshing] = useState(false);
  const events: Event[] = EVENTS_DATA;

  const filteredEvents = useMemo(
    () => events.filter((e) => e.isMyEvent === (activeTab === "myEvents")),
    [events, activeTab],
  );

  const upcomingEvents = useMemo(
    () => filteredEvents.filter((e) => !e.isPast),
    [filteredEvents],
  );

  const pastEvents = useMemo(
    () => filteredEvents.filter((e) => e.isPast),
    [filteredEvents],
  );

  const tabs = TABS;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return {
    activeTab,
    setActiveTab,
    filteredEvents,
    upcomingEvents,
    pastEvents,
    tabs,
    refreshing,
    onRefresh,
  };
};
