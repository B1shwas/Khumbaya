import { useMemo, useState } from "react";
import { timelineData, type TimelineSummary } from "../types/timeline";

export const useTimeline = () => {
  const [selectedDay, setSelectedDay] = useState("2");
  const [showAddModal, setShowAddModal] = useState(false);

  const summary: TimelineSummary = useMemo(() => {
    const goingCount = timelineData.filter((t) => !t.isPast).length;
    const activeCount = timelineData.filter((t) => t.isActive).length;
    const completedCount = timelineData.filter((t) => t.isPast).length;

    return {
      goingCount,
      activeCount,
      completedCount,
    };
  }, []);

  return {
    timelineItems: timelineData,
    selectedDay,
    setSelectedDay,
    showAddModal,
    setShowAddModal,
    summary,
  };
};
