import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "@/src/features/events/styles/RSVP.styles";
import { useRSVPPage } from "@/src/features/events/hooks/useRSVPPage";
import { invitedEventData, rsvpQuestions } from "@/src/features/events/types/rsvp";

// Components
import { ConfirmationView } from "@/src/features/events/components/ConfirmationView";
import { DecisionView } from "@/src/features/events/components/DecisionView";
import { QuestionsView } from "@/src/features/events/components/QuestionsView";
import { StepIndicator } from "@/src/features/events/components/StepIndicator";

export default function RSVPPage() {
  const { rsvpData, currentStep, handleDecision, handleAnswer, handleSubmit } =
    useRSVPPage();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>RSVP</Text>
        <View style={styles.headerButton} />
      </View>

      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} />

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === "decision" && (
          <DecisionView event={invitedEventData} onDecision={handleDecision} />
        )}

        {currentStep === "questions" && (
          <QuestionsView
            questions={rsvpQuestions}
            responses={rsvpData.responses}
            onAnswer={handleAnswer}
            onSubmit={handleSubmit}
            isSubmitted={rsvpData.submitted}
          />
        )}

        {currentStep === "confirmation" && (
          <ConfirmationView
            event={invitedEventData}
            attending={rsvpData.attending}
            responses={rsvpData.responses}
            questions={rsvpQuestions}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
