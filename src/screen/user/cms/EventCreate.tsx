import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  CoverUpload,
  DatePicker,
  EventNameInput,
  EventTypeSelector,
} from "./components/eventCreate";
import { useEventCreate } from "./hooks/useEventCreate";
import { styles } from "./styles/EventCreate.styles";

export default function EventCreate() {
  const router = useRouter();
  const {
    formData,
    currentMonth,
    currentYear,
    selectedDate,
    handleEventNameChange,
    handleEventTypeSelect,
    handleDateSelect,
    handleMonthChange,
    handleCoverPress,
  } = useEventCreate();

  // Animation values
  const scale = useSharedValue(1);

  const handleNextStep = async () => {
    // TODO: Backend Integration
    console.log("Form data ready for API submission:", formData);

    // Navigate to location step
    router.push("/(protected)/(client-tabs)/events/event-location" as any);
  };

  const handleBack = () => {
    router.back();
  };

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(scale.value, { duration: 150 }) }],
    };
  });

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={20} color="#181114" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create New Event</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>Basic Information</Text>
            <Text style={styles.progressStep}>1 of 4</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBarFill,
                { width: "25%" },
                animatedButtonStyle,
              ]}
            />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <CoverUpload onPress={handleCoverPress} />

          <EventNameInput
            value={formData.name}
            onChangeText={handleEventNameChange}
          />

          <EventTypeSelector
            selectedType={formData.eventType as any}
            onSelect={handleEventTypeSelect}
          />

          <DatePicker
            currentMonth={currentMonth}
            currentYear={currentYear}
            selectedDate={selectedDate}
            onMonthChange={handleMonthChange}
            onDateSelect={handleDateSelect}
          />

          {/* Bottom spacing for footer */}
          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Sticky Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleNextStep}
            style={styles.nextButton}
            activeOpacity={0.8}
            onPressIn={() => {
              scale.value = 0.98;
            }}
            onPressOut={() => {
              scale.value = 1;
            }}
          >
            <Text style={styles.nextButtonText}>Next Step</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
