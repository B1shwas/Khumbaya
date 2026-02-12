import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/RSVP.styles";
import type { RSVPQuestion } from "../types/rsvp";
import { QuestionCard } from "./QuestionCard";

interface QuestionsViewProps {
  questions: RSVPQuestion[];
  responses: Record<string, string | string[]>;
  onAnswer: (questionId: string, value: string | string[]) => void;
  onSubmit: () => void;
  isSubmitted: boolean;
}

export const QuestionsView: React.FC<QuestionsViewProps> = ({
  questions,
  responses,
  onAnswer,
  onSubmit,
  isSubmitted,
}) => {
  return (
    <View style={styles.questionsContainer}>
      <View style={styles.questionsHeader}>
        <Text style={styles.questionsTitle}>Almost done!</Text>
        <Text style={styles.questionsSubtitle}>
          Please answer a few quick questions to help us plan better.
        </Text>
      </View>

      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          answer={responses[question.id]}
          onAnswer={(value) => onAnswer(question.id, value)}
          isSubmitted={isSubmitted}
        />
      ))}

      <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
        <Text style={styles.submitButtonText}>Submit RSVP</Text>
        <Ionicons
          name="send"
          size={20}
          color="white"
          style={{ marginLeft: 8 }}
        />
      </TouchableOpacity>
    </View>
  );
};
