import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import type { RSVPStep } from "../types/rsvp";
import { styles } from "./styles/RSVP.styles";

interface StepIndicatorProps {
  currentStep: RSVPStep;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
}) => {
  const steps = ["Decision", "Questions", "Done"];
  const currentIndex =
    currentStep === "decision" ? 0 : currentStep === "questions" ? 1 : 2;

  return (
    <View style={styles.stepIndicator}>
      {steps.map((step, index) => (
        <View key={step} style={styles.stepItem}>
          <View
            style={[
              styles.stepCircle,
              index <= currentIndex && styles.stepCircleActive,
            ]}
          >
            {index < currentIndex ? (
              <Ionicons name="checkmark" size={16} color="white" />
            ) : (
              <Text
                style={[
                  styles.stepNumber,
                  index <= currentIndex && styles.stepNumberActive,
                ]}
              >
                {index + 1}
              </Text>
            )}
          </View>
          <Text
            style={[
              styles.stepLabel,
              index <= currentIndex && styles.stepLabelActive,
            ]}
          >
            {step}
          </Text>
          {index < steps.length - 1 && (
            <View
              style={[
                styles.stepLine,
                index < currentIndex && styles.stepLineActive,
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );
};
