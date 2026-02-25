import { useAuthStore } from "@/src/store/AuthStore";
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

interface Guest {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isAdult: boolean;
  idNumber?: string; // Required only for adults
  idImage?: string; // ID image URI for adults
  height?: string; // Required for adults (18+)
  dob?: string; // Date of birth for adults (18+)
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
}

interface RSVPData {
  attending: boolean | null;
  totalGuests: number;
  guests: Guest[];
  submitted: boolean;
}

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
};

const GuestForm = ({
  guest,
  index,
  onUpdate,
  onRemove,
}: {
  guest: Guest;
  index: number;
  onUpdate: (guest: Guest) => void;
  onRemove: () => void;
}) => {
  const isSelf = index === 0;
  const relationships = isSelf
    ? ["Self"]
    : ["Spouse", "Child", "Parent", "Sibling", "Friend", "Colleague", "Other"];

  return (
    <View style={styles.guestCard}>
      <View style={styles.guestHeader}>
        <Text style={styles.guestTitle}>
          {isSelf ? "Your Details" : `Guest ${index + 1}`}
        </Text>
        {!isSelf && (
          <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Full Name (Self)*</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter guest name"
          placeholderTextColor="#9CA3AF"
          value={guest.name}
          onChangeText={(text) => onUpdate({ ...guest, name: text })}
        />
      </View>

      {!isSelf && (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Relationship *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chipContainer}>
              {relationships.map((rel) => (
                <TouchableOpacity
                  key={rel}
                  style={[
                    styles.chip,
                    guest.relationship === rel && styles.chipSelected,
                  ]}
                  onPress={() => onUpdate({ ...guest, relationship: rel })}
                >
                  <Text
                    style={[
                      styles.chipText,
                      guest.relationship === rel && styles.chipTextSelected,
                    ]}
                  >
                    {rel}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Phone Number *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter phone number"
          placeholderTextColor="#9CA3AF"
          value={guest.phone}
          onChangeText={(text) => onUpdate({ ...guest, phone: text })}
          keyboardType="phone-pad"
        />
      </View>

      {/* Adult toggle - ask age first */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Is this guest 18 or older?</Text>
        <View style={styles.chipContainer}>
          <TouchableOpacity
            style={[styles.chip, guest.isAdult && styles.chipSelected]}
            onPress={() => onUpdate({ ...guest, isAdult: true })}
          >
            <Text
              style={[
                styles.chipText,
                guest.isAdult && styles.chipTextSelected,
              ]}
            >
              Yes (18+)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, !guest.isAdult && styles.chipSelected]}
            onPress={() =>
              onUpdate({
                ...guest,
                isAdult: false,
                idNumber: undefined,
                idImage: undefined,
                height: undefined,
                dob: undefined,
              })
            }
          >
            <Text
              style={[
                styles.chipText,
                !guest.isAdult && styles.chipTextSelected,
              ]}
            >
              No (Under 18)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Fields for adults (18+) */}
      {guest.isAdult && (
        <>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Date of Birth *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., 15/06/1995"
              placeholderTextColor="#9CA3AF"
              value={guest.dob || ""}
              onChangeText={(text) => onUpdate({ ...guest, dob: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Height (cm) *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., 175"
              placeholderTextColor="#9CA3AF"
              value={guest.height || ""}
              onChangeText={(text) => onUpdate({ ...guest, height: text })}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              ID Number (Passport/License) *
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter ID number"
              placeholderTextColor="#9CA3AF"
              value={guest.idNumber || ""}
              onChangeText={(text) => onUpdate({ ...guest, idNumber: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>ID Image URI (optional)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter ID image URL or upload"
              placeholderTextColor="#9CA3AF"
              value={guest.idImage || ""}
              onChangeText={(text) => onUpdate({ ...guest, idImage: text })}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default function RSVPPage() {
  const params = useLocalSearchParams();
  const eventId = params.eventId as string;

  // Get logged-in user from auth store
  const user = useAuthStore((state) => state.user);

  const [rsvpData, setRsvpData] = useState<RSVPData>({
    attending: null,
    totalGuests: 1,
    guests: [],
    submitted: false,
  });

  const [currentStep, setCurrentStep] = useState<
    "decision" | "guestCount" | "guestDetails" | "confirmation"
  >("decision");

  const handleDecision = (attending: boolean) => {
    setRsvpData((prev) => ({ ...prev, attending }));

    if (attending) {
      setCurrentStep("guestCount");
    } else {
      setCurrentStep("confirmation");
    }
  };

  const handleGuestCountSubmit = () => {
    const count = rsvpData.totalGuests;
    if (count < 1) {
      Alert.alert("Error", "Please enter at least 1 guest (yourself)");
      return;
    }

    // Get user data from auth store for self (first guest)
    const userData = user || {
      username: "",
      name: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      date_of_birth: "",
      idNumber: "",
      idImage: "",
      id_image: "",
    };
    const userName = userData.username || userData.name || "";
    const userPhone = userData.phone || "";
    const userDOB = userData.dateOfBirth || userData.date_of_birth || "";

    // Create guest entries (starting with self as first guest)
    const newGuests: Guest[] = Array.from({ length: count }, (_, i) => ({
      id: `guest-${i + 1}`,
      name: i === 0 && userName ? userName : "", // First guest is self - use auth store
      relationship: i === 0 ? "Self" : "",
      phone: i === 0 && userPhone ? userPhone : "", // Pre-fill phone for self
      isAdult: true,
      idNumber: i === 0 && userData.idNumber ? userData.idNumber : "",
      idImage:
        i === 0 && (userData.idImage || userData.id_image)
          ? userData.idImage || userData.id_image
          : "",
      height: "",
      dob: i === 0 && userDOB ? userDOB : "", // Pre-fill DOB for self
    }));

    setRsvpData((prev) => ({ ...prev, guests: newGuests }));
    setCurrentStep("guestDetails");
  };

  const updateGuest = (index: number, updatedGuest: Guest) => {
    setRsvpData((prev) => ({
      ...prev,
      guests: prev.guests.map((g, i) => (i === index ? updatedGuest : g)),
    }));
  };

  const removeGuest = (index: number) => {
    // Cannot remove self (first guest)
    if (index === 0) {
      Alert.alert("Error", "You cannot remove yourself from the RSVP");
      return;
    }
    if (rsvpData.guests.length <= 1) {
      Alert.alert("Error", "You must include at least yourself");
      return;
    }
    setRsvpData((prev) => ({
      ...prev,
      guests: prev.guests.filter((_, i) => i !== index),
      totalGuests: prev.totalGuests - 1,
    }));
  };

  const validateGuestDetails = (): boolean => {
    for (let i = 0; i < rsvpData.guests.length; i++) {
      const guest = rsvpData.guests[i];
      const isSelf = i === 0;

      if (!guest.name.trim()) {
        Alert.alert(
          "Error",
          `Please enter ${isSelf ? "your name" : "name for Guest " + (i + 1)}`
        );
        return false;
      }
      // Skip relationship check for self (first guest)
      if (!isSelf && !guest.relationship) {
        Alert.alert("Error", `Please select relationship for Guest ${i + 1}`);
        return false;
      }
      if (!guest.phone.trim()) {
        Alert.alert(
          "Error",
          `Please enter ${isSelf ? "your phone" : "phone for Guest " + (i + 1)}`
        );
        return false;
      }
      // Basic phone validation
      const phoneRegex = /^[0-9]{7,15}$/;
      if (!phoneRegex.test(guest.phone.trim())) {
        Alert.alert(
          "Invalid Phone",
          `Please enter a valid phone number for ${isSelf ? "yourself" : "Guest " + (i + 1)}`
        );
        return false;
      }
      // Validate adult-specific fields
      if (guest.isAdult) {
        if (!guest.dob?.trim()) {
          Alert.alert(
            "Error",
            `Please enter date of birth for ${isSelf ? "yourself" : "Guest " + (i + 1)}`
          );
          return false;
        }
        if (!guest.height?.trim()) {
          Alert.alert(
            "Error",
            `Please enter height for ${isSelf ? "yourself" : "Guest " + (i + 1)}`
          );
          return false;
        }
        if (!guest.idNumber?.trim()) {
          Alert.alert(
            "Error",
            `Please enter ID number for ${isSelf ? "yourself" : "Guest " + (i + 1)}`
          );
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateGuestDetails()) {
      return;
    }

    setRsvpData((prev) => ({ ...prev, submitted: true }));
    setCurrentStep("confirmation");

    Alert.alert(
      "See You There!",
      `Your RSVP for ${rsvpData.totalGuests} guest(s) has been submitted.`,
      [{ text: "OK" }]
    );
  };

  const getStepIndicator = () => {
    const steps = ["RSVP", "Guests", "Details", "Done"];
    const stepMap = {
      decision: 0,
      guestCount: 1,
      guestDetails: 2,
      confirmation: 3,
    };
    const currentIndex = stepMap[currentStep];

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
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Step 1: Decision */}
        {currentStep === "decision" && (
          <View style={styles.decisionContainer}>
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
                <Text style={styles.hostedBy}>
                  Hosted by {invitedEventData.hostName}
                </Text>
              </View>
            </View>

            <Text style={styles.decisionTitle}>Will you be attending?</Text>

            <TouchableOpacity
              style={styles.decisionButton}
              onPress={() => handleDecision(true)}
            >
              <View style={styles.decisionIconContainer}>
                <Ionicons name="checkmark-circle" size={48} color="#10B981" />
              </View>
              <Text style={styles.decisionButtonTitle}>
                Yes, I'll be there!
              </Text>
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
                style={[
                  styles.decisionButtonTitle,
                  styles.decisionButtonTitleDecline,
                ]}
              >
                No, I can't make it
              </Text>
              <Text style={styles.decisionButtonSubtitleDecline}>
                Unfortunately, I won't be able to attend
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 2: Guest Count */}
        {currentStep === "guestCount" && (
          <View style={styles.guestCountContainer}>
            <View style={styles.questionsHeader}>
              <Text style={styles.questionsTitle}>How many guests?</Text>
              <Text style={styles.questionsSubtitle}>
                Including yourself - how many people will be attending?
              </Text>
            </View>

            <View style={styles.guestCountCard}>
              <TouchableOpacity
                style={styles.countButton}
                onPress={() =>
                  setRsvpData((prev) => ({
                    ...prev,
                    totalGuests: Math.max(1, prev.totalGuests - 1),
                  }))
                }
                disabled={rsvpData.totalGuests <= 1}
              >
                <Ionicons
                  name="remove"
                  size={32}
                  color={rsvpData.totalGuests <= 1 ? "#9CA3AF" : "#ee2b8c"}
                />
              </TouchableOpacity>

              <View style={styles.countDisplay}>
                <Text style={styles.countNumber}>{rsvpData.totalGuests}</Text>
                <Text style={styles.countLabel}>
                  {rsvpData.totalGuests === 1 ? "Guest" : "Guests"}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.countButton}
                onPress={() =>
                  setRsvpData((prev) => ({
                    ...prev,
                    totalGuests: Math.min(10, prev.totalGuests + 1),
                  }))
                }
                disabled={rsvpData.totalGuests >= 10}
              >
                <Ionicons
                  name="add"
                  size={32}
                  color={rsvpData.totalGuests >= 10 ? "#9CA3AF" : "#ee2b8c"}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.guestHint}>Maximum 10 guests allowed</Text>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleGuestCountSubmit}
            >
              <Text style={styles.submitButtonText}>Continue</Text>
              <Ionicons
                name="arrow-forward"
                size={20}
                color="white"
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Step 3: Guest Details */}
        {currentStep === "guestDetails" && (
          <View style={styles.guestDetailsContainer}>
            <View style={styles.questionsHeader}>
              <Text style={styles.questionsTitle}>Guest Details</Text>
              <Text style={styles.questionsSubtitle}>
                Please provide details for each guest
              </Text>
            </View>

            {rsvpData.guests.map((guest, index) => (
              <GuestForm
                key={guest.id}
                guest={guest}
                index={index}
                onUpdate={(updated) => updateGuest(index, updated)}
                onRemove={() => removeGuest(index)}
              />
            ))}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit RSVP</Text>
              <Ionicons
                name="send"
                size={20}
                color="white"
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Step 4: Confirmation */}
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
                ? `Your RSVP for ${rsvpData.totalGuests} guest(s) has been submitted.`
                : `Your response has been noted.`}
            </Text>

            {rsvpData.attending && (
              <>
                {/* Transportation Section */}
                <TouchableOpacity
                  style={styles.optionCard}
                  onPress={() =>
                    router.push({
                      pathname:
                        "/(protected)/(client-stack)/events/[eventId]/(guest)/transport",
                      params: { eventId },
                    })
                  }
                >
                  <View style={styles.optionIcon}>
                    <Ionicons name="car" size={24} color="#ee2b8c" />
                  </View>
                  <View style={styles.optionInfo}>
                    <Text style={styles.optionTitle}>Transportation</Text>
                    <Text style={styles.optionSubtitle}>
                      Manage transport for guests
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>

                {/* Accommodation Section */}
                <TouchableOpacity
                  style={styles.optionCard}
                  onPress={() =>
                    router.push({
                      pathname:
                        "/(protected)/(client-stack)/events/[eventId]/(guest)/accommodation",
                      params: { eventId },
                    })
                  }
                >
                  <View style={styles.optionIcon}>
                    <Ionicons name="bed" size={24} color="#ee2b8c" />
                  </View>
                  <View style={styles.optionInfo}>
                    <Text style={styles.optionTitle}>Accommodation</Text>
                    <Text style={styles.optionSubtitle}>
                      Manage rooms for guests
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </>
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
              onPress={() =>
                router.push("/(protected)/(client-tabs)/events" as any)
              }
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>

            {rsvpData.attending && (
              <TouchableOpacity
                style={styles.addToCalendarButton}
                onPress={() => {
                  Alert.alert("Calendar", "Event added to your calendar!");
                }}
              >
                {/* <Ionicons name="calendar-outline" size={20} color="#ee2b8c" />
                <Text style={styles.addToCalendarText}>Add to Calendar</Text> */}
              </TouchableOpacity>
            )}
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
    width: 48,
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
    width: 30,
    height: 2,
    backgroundColor: "#f3f4f6",
    marginHorizontal: 4,
  },
  stepLineActive: {
    backgroundColor: "#ee2b8c",
  },
  stepLabel: {
    fontSize: 10,
    color: "#9ca3af",
    marginLeft: 2,
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
  decisionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
    textAlign: "center",
  },
  decisionButton: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#10B981",
  },
  decisionButtonDecline: {
    borderColor: "#EF4444",
  },
  decisionIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 12,
  },
  decisionIconContainerDecline: {
    backgroundColor: "#FEF2F2",
  },
  decisionButtonTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#10B981",
    textAlign: "center",
    marginBottom: 4,
  },
  decisionButtonTitleDecline: {
    color: "#EF4444",
  },
  decisionButtonSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  decisionButtonSubtitleDecline: {
    color: "#9ca3af",
  },
  guestCountContainer: {
    padding: 16,
  },
  questionsHeader: {
    marginBottom: 24,
  },
  questionsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
  },
  questionsSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  guestCountCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  countButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FCE7F3",
    alignItems: "center",
    justifyContent: "center",
  },
  countDisplay: {
    alignItems: "center",
  },
  countNumber: {
    fontSize: 48,
    fontWeight: "700",
    color: "#1f2937",
  },
  countLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  guestHint: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: "#ee2b8c",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
  guestDetailsContainer: {
    padding: 16,
  },
  guestCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  guestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  guestTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
  },
  removeButton: {
    padding: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  inputHint: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
  textInput: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: "#1f2937",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  chipSelected: {
    backgroundColor: "#ee2b8c",
    borderColor: "#ee2b8c",
  },
  chipText: {
    fontSize: 14,
    color: "#6b7280",
  },
  chipTextSelected: {
    color: "white",
    fontWeight: "600",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  switchLabelContainer: {
    flex: 1,
  },
  switchHint: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  confirmationContainer: {
    padding: 16,
  },
  confirmationIcon: {
    alignItems: "center",
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
  optionCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FCE7F3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  optionSubtitle: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  optionExpanded: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    marginTop: -8,
    paddingTop: 24,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    marginTop: 8,
  },
  roomCounter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    marginBottom: 16,
  },
  countButtonSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FCE7F3",
    alignItems: "center",
    justifyContent: "center",
  },
  roomCount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
    minWidth: 40,
    textAlign: "center",
  },
  confirmationEventCard: {
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  confirmationEventImage: {
    width: "100%",
    height: 120,
  },
  confirmationEventInfo: {
    padding: 16,
  },
  confirmationEventTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },
  confirmationEventDate: {
    fontSize: 14,
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
    paddingVertical: 16,
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
    gap: 8,
  },
  addToCalendarText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ee2b8c",
  },
  // Image upload styles
  imageUploadButton: {
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
  },
  idImagePreview: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  imageUploadPlaceholder: {
    width: "100%",
    height: 120,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  imageUploadText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginTop: 8,
  },
  imageUploadHint: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
  removeImageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    marginTop: 8,
    padding: 8,
  },
  removeImageText: {
    fontSize: 14,
    color: "#EF4444",
    fontWeight: "500",
  },
});
