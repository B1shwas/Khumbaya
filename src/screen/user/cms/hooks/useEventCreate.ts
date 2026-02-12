import { useCallback, useState } from "react";
import type { EventFormData, EventType } from "../types/eventCreate";

interface UseEventCreateReturn {
  formData: EventFormData;
  currentMonth: number;
  currentYear: number;
  selectedDate: Date;
  setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
  setCurrentMonth: (month: number) => void;
  setCurrentYear: (year: number) => void;
  setSelectedDate: (date: Date) => void;
  handleEventNameChange: (text: string) => void;
  handleEventTypeSelect: (type: EventType) => void;
  handleDateSelect: (day: number) => void;
  handleMonthChange: (direction: "prev" | "next") => void;
  handleCoverPress: () => void;
}

export const useEventCreate = (): UseEventCreateReturn => {
  const [formData, setFormData] = useState<EventFormData>({
    name: "Aisha & Omar's Wedding",
    eventType: "Wedding" as EventType,
    date: new Date(2024, 5, 16), // June 16, 2024
    coverImage: null,
  });

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(5); // June 2024
  const [currentYear, setCurrentYear] = useState(2024);
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 5, 16));

  const handleEventNameChange = useCallback((text: string) => {
    setFormData((prev) => ({ ...prev, name: text }));
  }, []);

  const handleEventTypeSelect = useCallback((type: EventType) => {
    setFormData((prev) => ({ ...prev, eventType: type }));
  }, []);

  const handleDateSelect = useCallback(
    (day: number) => {
      const newDate = new Date(currentYear, currentMonth, day);
      setSelectedDate(newDate);
      setFormData((prev) => ({ ...prev, date: newDate }));
    },
    [currentYear, currentMonth],
  );

  const handleMonthChange = useCallback(
    (direction: "prev" | "next") => {
      if (direction === "prev") {
        if (currentMonth === 0) {
          setCurrentMonth(11);
          setCurrentYear((prev) => prev - 1);
        } else {
          setCurrentMonth((prev) => prev - 1);
        }
      } else {
        if (currentMonth === 11) {
          setCurrentMonth(0);
          setCurrentYear((prev) => prev + 1);
        } else {
          setCurrentMonth((prev) => prev + 1);
        }
      }
    },
    [currentMonth],
  );

  const handleCoverPress = useCallback(() => {
    // TODO: Backend Integration - Image picker
    console.log("Open image picker for cover image");
  }, []);

  return {
    formData,
    currentMonth,
    currentYear,
    selectedDate,
    setFormData,
    setCurrentMonth,
    setCurrentYear,
    setSelectedDate,
    handleEventNameChange,
    handleEventTypeSelect,
    handleDateSelect,
    handleMonthChange,
    handleCoverPress,
  };
};
