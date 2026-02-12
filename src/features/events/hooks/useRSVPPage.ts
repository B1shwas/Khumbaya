import { useCallback, useState } from "react";
import { Alert } from "react-native";
import type { RSVPData, RSVPStep } from "../types/rsvp";
import { rsvpQuestions } from "../types/rsvp";

export const useRSVPPage = () => {
  const [rsvpData, setRsvpData] = useState<RSVPData>({
    attending: null,
    responses: {},
    submitted: false,
  });

  const [currentStep, setCurrentStep] = useState<RSVPStep>("decision");

  const handleDecision = useCallback((attending: boolean) => {
    setRsvpData((prev) => ({ ...prev, attending }));

    if (attending) {
      setCurrentStep("questions");
    } else {
      setCurrentStep("confirmation");
    }
  }, []);

  const handleAnswer = useCallback(
    (questionId: string, value: string | string[]) => {
      setRsvpData((prev) => ({
        ...prev,
        responses: { ...prev.responses, [questionId]: value },
      }));
    },
    [],
  );

  const handleSubmit = useCallback(() => {
    // Validate required questions
    const requiredQuestions = rsvpQuestions.filter((q) => q.required);
    const missingRequired = requiredQuestions.filter(
      (q) => !rsvpData.responses[q.id],
    );

    if (missingRequired.length > 0) {
      Alert.alert(
        "Missing Information",
        "Please answer all required questions before submitting.",
        [{ text: "OK" }],
      );
      return { success: false };
    }

    setRsvpData((prev) => ({ ...prev, submitted: true }));
    setCurrentStep("confirmation");

    Alert.alert(
      rsvpData.attending ? "See You There!" : "We're Sorry",
      rsvpData.attending
        ? "Your RSVP has been submitted. We look forward to seeing you!"
        : "Your response has been noted. We'll miss you!",
      [{ text: "OK" }],
    );

    return { success: true };
  }, [rsvpData.attending, rsvpData.responses]);

  return {
    rsvpData,
    setRsvpData,
    currentStep,
    setCurrentStep,
    handleDecision,
    handleAnswer,
    handleSubmit,
  };
};
