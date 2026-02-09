import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface RSVPAnswers {
  attending: "yes" | "no" | null;
  fooding: boolean;
  lodging: boolean;
  arrivalDate: string;
  arrivalLocation: string;
  additionalNotes: string;
}

export default function RSVPPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const eventId = params.eventId as string;
  const eventTitle = (params.eventTitle as string) || "Our Wedding";

  const [answers, setAnswers] = useState<RSVPAnswers>({
    attending: null,
    fooding: false,
    lodging: false,
    arrivalDate: "",
    arrivalLocation: "",
    additionalNotes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleAttending = (value: "yes" | "no") => {
    setAnswers((prev) => ({ ...prev, attending: value }));
  };

  const handleSubmit = () => {
    if (!answers.attending) {
      Alert.alert("Required", "Please let us know if you will be attending");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  const handleBack = () => {
    if (submitted) {
      router.replace({
        pathname: "/(protected)/(client-tabs)/events/[eventId]",
        params: {
          eventId: eventId,
          view: "guest",
          rsvpStatus: "accepted",
        },
      });
    } else {
      router.back();
    }
  };

  // Show success screen
  if (submitted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={80} color="#10B981" />
          </View>
          <Text style={styles.successTitle}>Thank You!</Text>
          <Text style={styles.successSubtitle}>
            Your RSVP has been submitted
          </Text>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>You're attending</Text>
            <Text style={styles.summaryValue}>
              {answers.fooding ? "✓ Fooding arranged" : "✗ No fooding"}
            </Text>
            <Text style={styles.summaryValue}>
              {answers.lodging ? "✓ Lodging arranged" : "✗ No lodging"}
            </Text>
            {answers.arrivalDate && (
              <Text style={styles.summaryValue}>
                Arriving: {answers.arrivalDate}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.viewEventButton}
            onPress={() => {
              router.replace({
                pathname: "/(protected)/(client-tabs)/events/[eventId]",
                params: {
                  eventId: eventId,
                  view: "guest",
                  rsvpStatus: "accepted",
                },
              });
            }}
          >
            <Text style={styles.viewEventButtonText}>View Event Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.doneButton}
            onPress={() =>
              router.replace("/(protected)/(client-tabs)/events" as any)
            }
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#181114" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>RSVP</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Event Title */}
        <View style={styles.eventSection}>
          <Text style={styles.eventLabel}>You're invited to</Text>
          <Text style={styles.eventTitle}>{eventTitle}</Text>
        </View>

        {/* Question 1: Will you be joining us? */}
        <View style={styles.section}>
          <View style={styles.questionContainer}>
            <Text style={styles.questionNumber}>1</Text>
            <Text style={styles.questionText}>Will you be joining us?</Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.choiceButton,
                answers.attending === "yes" && styles.choiceButtonActive,
              ]}
              onPress={() => handleAttending("yes")}
            >
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={answers.attending === "yes" ? "#10B981" : "#6B7280"}
              />
              <Text
                style={[
                  styles.choiceButtonText,
                  answers.attending === "yes" && styles.choiceButtonTextActive,
                ]}
              >
                Yes, I'll be there!
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.choiceButton,
                answers.attending === "no" && styles.choiceButtonActive,
              ]}
              onPress={() => handleAttending("no")}
            >
              <Ionicons
                name="close-circle"
                size={24}
                color={answers.attending === "no" ? "#EF4444" : "#6B7280"}
              />
              <Text
                style={[
                  styles.choiceButtonText,
                  answers.attending === "no" && styles.choiceButtonTextActive,
                ]}
              >
                Sorry, can't make it
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Only show additional questions if attending */}
        {answers.attending === "yes" && (
          <>
            {/* Question 2: Fooding */}
            <View style={styles.section}>
              <View style={styles.questionContainer}>
                <Text style={styles.questionNumber}>2</Text>
                <Text style={styles.questionText}>
                  Would you like us to arrange fooding for you?
                </Text>
              </View>
              <Text style={styles.subQuestion}>
                We can arrange meals as per your preference
              </Text>

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>
                  Yes, please arrange fooding
                </Text>
                <TouchableOpacity
                  style={[
                    styles.switch,
                    answers.fooding && styles.switchActive,
                  ]}
                  onPress={() =>
                    setAnswers((prev) => ({ ...prev, fooding: !prev.fooding }))
                  }
                >
                  <View
                    style={[
                      styles.switchThumb,
                      answers.fooding && styles.switchThumbActive,
                    ]}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Question 3: Lodging */}
            <View style={styles.section}>
              <View style={styles.questionContainer}>
                <Text style={styles.questionNumber}>3</Text>
                <Text style={styles.questionText}>
                  Would you like us to arrange lodging?
                </Text>
              </View>
              <Text style={styles.subQuestion}>
                We can help you find accommodation
              </Text>

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>
                  Yes, please arrange lodging
                </Text>
                <TouchableOpacity
                  style={[
                    styles.switch,
                    answers.lodging && styles.switchActive,
                  ]}
                  onPress={() =>
                    setAnswers((prev) => ({ ...prev, lodging: !prev.lodging }))
                  }
                >
                  <View
                    style={[
                      styles.switchThumb,
                      answers.lodging && styles.switchThumbActive,
                    ]}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Question 4: Arrival Details */}
            <View style={styles.section}>
              <View style={styles.questionContainer}>
                <Text style={styles.questionNumber}>4</Text>
                <Text style={styles.questionText}>
                  When and where will you be arriving from?
                </Text>
              </View>
              <Text style={styles.subQuestion}>Help us plan your welcome!</Text>

              <View style={styles.inputContainer}>
                <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                <TextInput
                  style={styles.textInput}
                  placeholder="Expected arrival date & time"
                  placeholderTextColor="#9CA3AF"
                  value={answers.arrivalDate}
                  onChangeText={(text) =>
                    setAnswers((prev) => ({ ...prev, arrivalDate: text }))
                  }
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={20} color="#6B7280" />
                <TextInput
                  style={styles.textInput}
                  placeholder="Your arrival location/city"
                  placeholderTextColor="#9CA3AF"
                  value={answers.arrivalLocation}
                  onChangeText={(text) =>
                    setAnswers((prev) => ({ ...prev, arrivalLocation: text }))
                  }
                />
              </View>
            </View>

            {/* Additional Notes */}
            <View style={styles.section}>
              <View style={styles.questionContainer}>
                <Text style={styles.questionNumber}>5</Text>
                <Text style={styles.questionText}>
                  Any special requirements or notes?
                </Text>
              </View>
              <Text style={styles.subQuestion}>
                Dietary restrictions, accessibility needs, etc.
              </Text>

              <View style={styles.notesInputContainer}>
                <TextInput
                  style={styles.notesInput}
                  placeholder="Enter your notes here..."
                  placeholderTextColor="#9CA3AF"
                  value={answers.additionalNotes}
                  onChangeText={(text) =>
                    setAnswers((prev) => ({ ...prev, additionalNotes: text }))
                  }
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </>
        )}

        {/* Submit Button */}
        <View style={styles.submitSection}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Text style={styles.submitButtonText}>Submitting...</Text>
            ) : (
              <>
                <Ionicons name="send" size={20} color="white" />
                <Text style={styles.submitButtonText}>Submit RSVP</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f6f7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 8,
    backgroundColor: "white",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 18,
    color: "#181114",
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  eventSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: "center",
    backgroundColor: "white",
    marginTop: 12,
  },
  eventLabel: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  eventTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 24,
    color: "#181114",
    textAlign: "center",
  },
  section: {
    backgroundColor: "white",
    marginTop: 12,
    padding: 20,
  },
  questionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  questionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#ee2b8c",
    color: "white",
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 14,
    textAlign: "center",
    textAlignVertical: "center",
  },
  questionText: {
    flex: 1,
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 16,
    color: "#181114",
  },
  subQuestion: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  choiceButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  choiceButtonActive: {
    backgroundColor: "#F0FDF4",
    borderColor: "#10B981",
  },
  choiceButtonText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 13,
    color: "#6B7280",
  },
  choiceButtonTextActive: {
    color: "#10B981",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  switchLabel: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 15,
    color: "#374151",
  },
  switch: {
    width: 52,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    padding: 2,
  },
  switchActive: {
    backgroundColor: "#10B981",
  },
  switchThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  switchThumbActive: {
    marginLeft: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  textInput: {
    flex: 1,
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 15,
    color: "#181114",
  },
  notesInputContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  notesInput: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 15,
    color: "#181114",
    minHeight: 100,
  },
  submitSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#ee2b8c",
    borderRadius: 14,
    paddingVertical: 16,
  },
  submitButtonText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: "white",
  },
  bottomSpacing: {
    height: 40,
  },
  // Success Screen Styles
  successContainer: {
    flex: 1,
    backgroundColor: "#f8f6f7",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 32,
    color: "#181114",
    marginBottom: 8,
  },
  successSubtitle: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 32,
  },
  summaryCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryLabel: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 14,
    color: "#181114",
    marginBottom: 12,
  },
  summaryValue: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  viewEventButton: {
    backgroundColor: "#ee2b8c",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  viewEventButtonText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: "white",
  },
  doneButton: {
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: "100%",
    alignItems: "center",
  },
  doneButtonText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 16,
    color: "#6B7280",
  },
});
