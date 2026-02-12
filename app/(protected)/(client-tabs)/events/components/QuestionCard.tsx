import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import type { RSVPQuestion } from "../types/rsvp";
import { styles } from "./styles/RSVP.styles";

interface QuestionCardProps {
  question: RSVPQuestion;
  answer: string | string[] | undefined;
  onAnswer: (value: string | string[]) => void;
  isSubmitted: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  answer,
  onAnswer,
  isSubmitted,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    (answer as string[]) || [],
  );

  const handleOptionPress = (option: string) => {
    if (question.type === "multi") {
      const newOptions = selectedOptions.includes(option)
        ? selectedOptions.filter((o) => o !== option)
        : [...selectedOptions, option];
      setSelectedOptions(newOptions);
      onAnswer(newOptions);
    } else {
      onAnswer(option);
    }
  };

  const renderQuestion = () => {
    switch (question.type) {
      case "choice":
        return (
          <View style={styles.optionsContainer}>
            {question.options?.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  answer === option && styles.optionButtonSelected,
                ]}
                onPress={() => handleOptionPress(option)}
                disabled={isSubmitted}
              >
                <View
                  style={[
                    styles.optionRadio,
                    answer === option && styles.optionRadioSelected,
                  ]}
                >
                  {answer === option && <View style={styles.optionRadioDot} />}
                </View>
                <Text
                  style={[
                    styles.optionText,
                    answer === option && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case "multi":
        return (
          <View style={styles.optionsContainer}>
            {question.options?.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedOptions.includes(option) &&
                    styles.optionButtonSelected,
                ]}
                onPress={() => handleOptionPress(option)}
                disabled={isSubmitted}
              >
                <View
                  style={[
                    styles.optionCheckbox,
                    selectedOptions.includes(option) &&
                      styles.optionCheckboxSelected,
                  ]}
                >
                  {selectedOptions.includes(option) && (
                    <Ionicons name="checkmark" size={14} color="white" />
                  )}
                </View>
                <Text
                  style={[
                    styles.optionText,
                    selectedOptions.includes(option) &&
                      styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case "text":
        return (
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your answer..."
              placeholderTextColor="#9CA3AF"
              value={(answer as string) || ""}
              onChangeText={(text: string) => onAnswer(text)}
              editable={!isSubmitted}
              multiline
            />
          </View>
        );

      case "number":
        return (
          <View style={styles.numberInputContainer}>
            <TouchableOpacity
              style={styles.numberButton}
              onPress={() => {
                const current = parseInt((answer as string) || "0", 10);
                if (current > 0) onAnswer(String(current - 1));
              }}
              disabled={
                isSubmitted || parseInt((answer as string) || "0", 10) <= 0
              }
            >
              <Ionicons name="remove" size={24} color="#ee2b8c" />
            </TouchableOpacity>
            <Text style={styles.numberValue}>{(answer as string) || "0"}</Text>
            <TouchableOpacity
              style={styles.numberButton}
              onPress={() => {
                const current = parseInt((answer as string) || "0", 10);
                if (current < 10) onAnswer(String(current + 1));
              }}
              disabled={
                isSubmitted || parseInt((answer as string) || "0", 10) >= 10
              }
            >
              <Ionicons name="add" size={24} color="#ee2b8c" />
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.questionCard}>
      <View style={styles.questionHeader}>
        <Text style={styles.questionText}>{question.question}</Text>
        {question.required && (
          <View style={styles.requiredBadge}>
            <Text style={styles.requiredText}>Required</Text>
          </View>
        )}
      </View>
      {renderQuestion()}
    </View>
  );
};
