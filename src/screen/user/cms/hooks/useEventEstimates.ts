import { useCallback, useState } from "react";
import type { EstimatesFormData } from "../types/eventEstimates";

export const useEventEstimates = () => {
  const [formData, setFormData] = useState<EstimatesFormData>({
    guestCount: "",
    budget: "",
    currency: "USD",
    isBudgetPrivate: true,
  });

  const handleGuestCountChange = useCallback((text: string) => {
    const numericText = text.replace(/[^0-9]/g, "");
    setFormData((prev) => ({ ...prev, guestCount: numericText }));
  }, []);

  const handleBudgetChange = useCallback((text: string) => {
    const numericText = text.replace(/[^0-9.]/g, "");
    setFormData((prev) => ({ ...prev, budget: numericText }));
  }, []);

  const handleCurrencyChange = useCallback((currency: string) => {
    setFormData((prev) => ({ ...prev, currency }));
  }, []);

  const toggleBudgetPrivacy = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      isBudgetPrivate: !prev.isBudgetPrivate,
    }));
  }, []);

  return {
    formData,
    setFormData,
    handleGuestCountChange,
    handleBudgetChange,
    handleCurrencyChange,
    toggleBudgetPrivacy,
  };
};
