import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ============================================
// Types
// ============================================

interface RSVPQuestion {
  id: string;
  question: string;
  type: "choice" | "text" | "multi" | "number";
  options?: string[];
  required: boolean;
}

interface InvitedEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  hostName: string;
  imageUrl: string;
  subEvents?: SubEvent[];
}

interface SubEvent {
  id: string;
  name: string;
  icon: string;
  date: string;
  time: string;
}

interface RSVPData {
  attending: boolean | null;
  responses: Record<string, string | string[]>;
  submitted: boolean;
}

// ============================================
// Mock Data
// ============================================

const invitedEventData: InvitedEvent = {
  id: "5",
  title: "Friend's Birthday Bash",
  date: "Mar 15, 2024",
  time: "8:00 PM",
  location: "Rooftop Lounge",
  venue: "San Francisco, CA",
  hostName: "John Doe",
  imageUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDSiNZxjryxVvBt_Qvd2BsU8jmuyGXsbWyZqiGyTJOFCn4I4QdwE-xrJUmE938nQ2sYjA0qbPec911z6qe-blSH_epWVfQJy2W2NwU5R-4dwi1k7uUfEgPutKfIV3RpR1EUutrAFt_7SBxXq5yRfR9EkuQCohSjZJpWgX0eNFvBY3F5rZ-xWmmB8Em-xGg1AvxCRQDlpUPXbLlpkcqBsqbQXGIi5tNUNw3p5WrCahAWFPRTkzEE0B8v47AYzYa8b-aEAMvtdko47AM",
  subEvents: [
    {
      id: "se1",
      name: "Welcome Drinks",
      icon: "wine",
      date: "Mar 15, 2024",
      time: "7:30 PM",
    },
    {
      id: "se2",
      name: "Dinner",
      icon: "restaurant",
      date: "Mar 15, 2024",
      time: "8:30 PM",
    },
    {
      id: "se3",
      name: "Cake Cutting",
      icon: "cake",
      date: "Mar 15, 2024",
      time: "10:00 PM",
    },
  ],
};

const rsvpQuestions: RSVPQuestion[] = [
  {
    id: "attendance",
    question: "Will you be attending?",
    type: "choice",
    options: ["Yes, I'll be there", "No, I can't make it"],
    required: true,
  },
  {
    id: "plus_one",
    question: "Will you be bringing a plus one?",
    type: "choice",
    options: ["Yes", "No"],
    required: false,
  },
  {
    id: "dietary",
    question: "Do you have any dietary restrictions?",
    type: "multi",
    options: [
      "Vegetarian",
      "Vegan",
      "Gluten-free",
      "Dairy-free",
      "Nut allergy",
      "Halal",
      "Kosher",
      "None",
    ],
    required: false,
  },
  {
    id: "song_request",
    question: "Any song requests for the party?",
    type: "text",
    required: false,
  },
  {
    id: "additional_guests",
    question: "How many additional guests (excluding plus one)?",
    type: "number",
    required: false,
  },
];

// ============================================
// Components
// ============================================

const QuestionCard = ({
  question,
  answer,
  onAnswer,
  isSubmitted,
}: {
  question: RSVPQuestion;
  answer: string | string[] | undefined;
  onAnswer: (value: string | string[]) => void;
  isSubmitted: boolean;
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    (answer as string[]) || []
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
                  {answer === option && (
                    <View style={styles.optionRadioDot} />
                  )}
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
                  selectedOptions.includes(option) && styles.optionButtonSelected,
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
                    selectedOptions.includes(option) && styles.optionTextSelected,
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
              disabled={isSubmitted || parseInt((answer as string) || "0", 10) <= 0}
            >
              <Ionicons name="remove" size={24} color="#ee2b8c" />
            </TouchableOpacity>
            <Text style={styles.numberValue}>
              {(answer as string) || "0"}
            </Text>
            <TouchableOpacity
              style={styles.numberButton}
              onPress={() => {
                const current = parseInt((answer as string) || "0", 10);
                if (current < 10) onAnswer(String(current + 1));
              }}
              disabled={isSubmitted || parseInt((answer as string) || "0", 10) >= 10}
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

const SubEventCard = ({ subEvent }: { subEvent: SubEvent }) => (
  <View style={styles.subEventCard}>
    <View style={styles.subEventIcon}>
      <Ionicons name={subEvent.icon as any} size={20} color="#ee2b8c" />
    </View>
    <View style={styles.subEventInfo}>
      <Text style={styles.subEventName}>{subEvent.name}</Text>
      <Text style={styles.subEventTime}>
        {subEvent.date} • {subEvent.time}
      </Text>
    </View>
  </View>
);

export default function RSVPPage() {
  const params = useLocalSearchParams();
  const eventId = params.eventId as string;

  const [rsvpData, setRsvpData] = useState<RSVPData>({
    attending: null,
    responses: {},
    submitted: false,
  });

  const [currentStep, setCurrentStep] = useState<"decision" | "questions" | "confirmation">(
    "decision"
  );

  const handleDecision = (attending: boolean) => {
    setRsvpData((prev) => ({ ...prev, attending }));

    if (attending) {
      setCurrentStep("questions");
    } else {
      setCurrentStep("confirmation");
    }
  };

  const handleAnswer = (questionId: string, value: string | string[]) => {
    setRsvpData((prev) => ({
      ...prev,
      responses: { ...prev.responses, [questionId]: value },
    }));
  };

  const handleSubmit = () => {
    // Validate required questions
    const requiredQuestions = rsvpQuestions.filter((q) => q.required);
    const missingRequired = requiredQuestions.filter(
      (q) => !rsvpData.responses[q.id]
    );

    if (missingRequired.length > 0) {
      Alert.alert(
        "Missing Information",
        "Please answer all required questions before submitting.",
        [{ text: "OK" }]
      );
      return;
    }

    setRsvpData((prev) => ({ ...prev, submitted: true }));
    setCurrentStep("confirmation");

    Alert.alert(
      rsvpData.attending ? "See You There!" : "We're Sorry",
      rsvpData.attending
        ? "Your RSVP has been submitted. We look forward to seeing you!"
        : "Your response has been noted. We'll miss you!",
      [{ text: "OK" }]
    );
  };

  const getStepIndicator = () => {
    const steps = ["Decision", "Questions", "Done"];
    const currentIndex =
      currentStep === "decision"
        ? 0
        : currentStep === "questions"
        ? 1
        : 2;

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
      {getStepIndicator()}

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {currentStep === "decision" && (
          <View style={styles.decisionContainer}>
            {/* Event Info */}
            <View style={styles.eventCard}>
              <Image
                source={{ uri: invitedEventData.imageUrl }}
                style={styles.eventImage}
              />
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{invitedEventData.title}</Text>
                <View style={styles.eventDetailRow}>
                  <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                  <Text style={styles.eventDetailText}>
                    {invitedEventData.date} • {invitedEventData.time}
                  </Text>
                </View>
                <View style={styles.eventDetailRow}>
                  <Ionicons name="location-outline" size={16} color="#6B7280" />
                  <Text style={styles.eventDetailText}>
                    {invitedEventData.location}
                  </Text>
                </View>
                <Text style={styles.hostedBy}>Hosted by {invitedEventData.hostName}</Text>
              </View>
            </View>

            {/* Sub Events */}
            {invitedEventData.subEvents &&
              invitedEventData.subEvents.length > 0 && (
                <View style={styles.subEventsSection}>
                  <Text style={styles.sectionTitle}>Schedule</Text>
                  {invitedEventData.subEvents.map((subEvent) => (
                    <SubEventCard key={subEvent.id} subEvent={subEvent} />
                  ))}
                </View>
              )}

            {/* Decision */}
            <Text style={styles.decisionTitle}>Will you be attending?</Text>

            <TouchableOpacity
              style={styles.decisionButton}
              onPress={() => handleDecision(true)}
            >
              <View style={styles.decisionIconContainer}>
                <Ionicons name="checkmark-circle" size={48} color="#10B981" />
              </View>
              <Text style={styles.decisionButtonTitle}>Yes, I'll be there!</Text>
              <Text style={styles.decisionButtonSubtitle}>
                I'd love to celebrate with you
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.decisionButton, styles.decisionButtonDecline]}
              onPress={() => handleDecision(false)}
            >
              <View
                style={[
                  styles.decisionIconContainer,
                  styles.decisionIconContainerDecline,
                ]}
              >
                <Ionicons name="close-circle" size={48} color="#EF4444" />
              </View>
              <Text
                style={[styles.decisionButtonTitle, styles.decisionButtonTitleDecline]}
              >
                No, I can't make it
              </Text>
              <Text style={styles.decisionButtonSubtitleDecline}>
                Unfortunately, I won't be able to attend
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {currentStep === "questions" && (
          <View style={styles.questionsContainer}>
            <View style={styles.questionsHeader}>
              <Text style={styles.questionsTitle}>Almost done!</Text>
              <Text style={styles.questionsSubtitle}>
                Please answer a few quick questions to help us plan better.
              </Text>
            </View>

            {rsvpQuestions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                answer={rsvpData.responses[question.id]}
                onAnswer={(value) => handleAnswer(question.id, value)}
                isSubmitted={rsvpData.submitted}
              />
            ))}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit RSVP</Text>
              <Ionicons name="send" size={20} color="white" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
        )}

        {currentStep === "confirmation" && (
          <View style={styles.confirmationContainer}>
            <View style={styles.confirmationIcon}>
              {rsvpData.attending ? (
                <Ionicons name="checkmark-circle" size={80} color="#10B981" />
              ) : (
                <Ionicons name="heart-dislike" size={80} color="#EF4444" />
              )}
            </View>

            <Text style={styles.confirmationTitle}>
              {rsvpData.attending
                ? "See You There! 🎉"
                : "We're Sorry to See You Go 💔"}
            </Text>

            <Text style={styles.confirmationMessage}>
              {rsvpData.attending
                ? `Your RSVP has been submitted. We look forward to seeing you on ${invitedEventData.date}!`
                : `Your response has been noted. We're sorry you can't make it to ${invitedEventData.title}.`}
            </Text>

            {/* Summary */}
            {rsvpData.attending && Object.keys(rsvpData.responses).length > 0 && (
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Your Responses</Text>
                <View style={styles.summaryContent}>
                  {rsvpQuestions.slice(0, 3).map((question) => {
                    const answer = rsvpData.responses[question.id];
                    if (!answer) return null;
                    return (
                      <View key={question.id} style={styles.summaryItem}>
                        <Text style={styles.summaryQuestion}>{question.question}</Text>
                        <Text style={styles.summaryAnswer}>
                          {Array.isArray(answer)
                            ? answer.join(", ")
                            : answer}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Event Details */}
            <View style={styles.confirmationEventCard}>
              <Image
                source={{ uri: invitedEventData.imageUrl }}
                style={styles.confirmationEventImage}
              />
              <View style={styles.confirmationEventInfo}>
                <Text style={styles.confirmationEventTitle}>
                  {invitedEventData.title}
                </Text>
                <Text style={styles.confirmationEventDate}>
                  {invitedEventData.date} • {invitedEventData.time}
                </Text>
                <Text style={styles.confirmationEventLocation}>
                  {invitedEventData.location}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => router.push("/events" as any)}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.addToCalendarButton}
              onPress={() => {
                Alert.alert(
                  "Calendar",
                  "Event added to your calendar!"
                );
              }}
            >
              <Ionicons name="calendar-outline" size={20} color="#ee2b8c" />
              <Text style={styles.addToCalendarText}>
                Add to Calendar
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
  },
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  stepCircleActive: {
    backgroundColor: "#ee2b8c",
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9ca3af",
  },
  stepNumberActive: {
    color: "white",
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: "#f3f4f6",
    marginHorizontal: 4,
  },
  stepLineActive: {
    backgroundColor: "#ee2b8c",
  },
  stepLabel: {
    fontSize: 12,
    color: "#9ca3af",
    marginLeft: 4,
  },
  stepLabelActive: {
    fontWeight: "600",
    color: "#1f2937",
  },
  content: {
    flex: 1,
  },
  decisionContainer: {
    padding: 16,
  },
  eventCard: {
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  eventImage: {
    width: "100%",
    height: 160,
  },
  eventInfo: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
  },
  eventDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  eventDetailText: {
    fontSize: 14,
    color: "#6b7280",
  },
  hostedBy: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 8,
  },
  subEventsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  subEventCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  subEventIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#fceaf4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  subEventInfo: {
    flex: 1,
  },
  subEventName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  subEventTime: {
    fontSize: 12,
    color: "#6b7280",
  },
  decisionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 16,
  },
  decisionButton: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  decisionButtonDecline: {
    backgroundColor: "#fef2f2",
  },
  decisionIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  decisionIconContainerDecline: {
    backgroundColor: "#fee2e2",
  },
  decisionButtonTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },
  decisionButtonTitleDecline: {
    color: "#dc2626",
  },
  decisionButtonSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  decisionButtonSubtitleDecline: {
    color: "#9ca3af",
  },
  questionsContainer: {
    padding: 16,
  },
  questionsHeader: {
    marginBottom: 24,
  },
  questionsTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },
  questionsSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  questionCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  questionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    flex: 1,
  },
  requiredBadge: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  requiredText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#d97706",
  },
  optionsContainer: {
    gap: 8,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
  },
  optionButtonSelected: {
    borderColor: "#ee2b8c",
    backgroundColor: "#fceaf4",
  },
  optionRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  optionRadioSelected: {
    borderColor: "#ee2b8c",
  },
  optionRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ee2b8c",
  },
  optionCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  optionCheckboxSelected: {
    borderColor: "#ee2b8c",
    backgroundColor: "#ee2b8c",
  },
  optionText: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },
  optionTextSelected: {
    fontWeight: "600",
    color: "#1f2937",
  },
  textInputContainer: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  textInput: {
    padding: 12,
    fontSize: 14,
    color: "#1f2937",
    minHeight: 80,
    textAlignVertical: "top",
  },
  numberInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  numberButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fceaf4",
    alignItems: "center",
    justifyContent: "center",
  },
  numberValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1f2937",
    minWidth: 60,
    textAlign: "center",
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ee2b8c",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
  confirmationContainer: {
    padding: 24,
    alignItems: "center",
  },
  confirmationIcon: {
    marginBottom: 16,
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 8,
  },
  confirmationMessage: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    width: "100%",
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  summaryContent: {
    gap: 12,
  },
  summaryItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingBottom: 8,
  },
  summaryQuestion: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 2,
  },
  summaryAnswer: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  confirmationEventCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    width: "100%",
    marginBottom: 24,
  },
  confirmationEventImage: {
    width: 80,
    height: 80,
  },
  confirmationEventInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  confirmationEventTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 2,
  },
  confirmationEventDate: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 2,
  },
  confirmationEventLocation: {
    fontSize: 12,
    color: "#9ca3af",
  },
  doneButton: {
    backgroundColor: "#ee2b8c",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
  addToCalendarButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  addToCalendarText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ee2b8c",
    marginLeft: 8,
  },
});
