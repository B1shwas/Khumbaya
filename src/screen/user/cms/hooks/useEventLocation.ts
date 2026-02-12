import { useState, useCallback } from "react";
import type { LocationFormData } from "../types/eventLocation";

export const useEventLocation = () => {
  const [formData, setFormData] = useState<LocationFormData>({
    city: '',
    address: '',
    venueName: '',
    latitude: null,
    longitude: null,
  });
  
  const [isManualMode, setIsManualMode] = useState(false);

  const handleSearchChange = useCallback((text: string) => {
    setFormData(prev => ({ ...prev, venueName: text }));
  }, []);

  const handleCityChange = useCallback((text: string) => {
    setFormData(prev => ({ ...prev, city: text }));
  }, []);

  const handleAddressChange = useCallback((text: string) => {
    setFormData(prev => ({ ...prev, address: text }));
  }, []);

  const toggleManualMode = useCallback(() => {
    setIsManualMode(prev => !prev);
  }, []);

  return {
    formData,
    setFormData,
    isManualMode,
    toggleManualMode,
    handleSearchChange,
    handleCityChange,
    handleAddressChange,
  };
};
