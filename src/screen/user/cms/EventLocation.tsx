import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useEventLocation } from "./hooks/useEventLocation";
import { styles } from "./styles/EventLocation.styles";

export default function EventLocation() {
  const router = useRouter();
  const {
    formData,
    isManualMode,
    toggleManualMode,
    handleSearchChange,
    handleCityChange,
    handleAddressChange,
  } = useEventLocation();

  const scale = useSharedValue(1);

  const handleNextStep = () => {
    router.push("/(protected)/(client-tabs)/events/event-estimates" as any);
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
          <Text style={styles.headerTitle}>Create Event</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>Location & Venue</Text>
            <Text style={styles.progressStep}>Step 2 of 4</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBarFill,
                { width: "50%" },
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
          {/* Venue Search */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Search Venue</Text>
            <View style={styles.searchContainer}>
              <View style={styles.searchIcon}>
                <Ionicons name="search" size={20} color="#9CA3AF" />
              </View>
              <TextInput
                style={styles.searchInput}
                placeholder="Search for a hotel, hall, or landmark"
                placeholderTextColor="#9CA3AF"
                value={formData.venueName}
                onChangeText={handleSearchChange}
              />
            </View>
          </View>

          {/* Manual Toggle */}
          <TouchableOpacity
            style={styles.manualToggle}
            onPress={toggleManualMode}
            activeOpacity={0.8}
          >
            <View style={styles.manualIcon}>
              <Ionicons name="location" size={20} color="#ee2b8c" />
            </View>
            <View style={styles.manualTextContainer}>
              <Text style={styles.manualTitle}>Not finding your venue?</Text>
              <Text style={styles.manualSubtitle}>
                Enter address manually below
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ee2b8c" />
          </TouchableOpacity>

          {/* Manual Input Fields */}
          <View style={styles.section}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>City</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Mumbai, India"
                placeholderTextColor="#9CA3AF"
                value={formData.city}
                onChangeText={handleCityChange}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Venue Address</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="House number, Street name, Area..."
                placeholderTextColor="#9CA3AF"
                value={formData.address}
                onChangeText={handleAddressChange}
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Location Preview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location Preview</Text>
            <View style={styles.mapPlaceholder}>
              <View style={styles.mapIconContainer}>
                <Ionicons name="location" size={40} color="#ee2b8c" />
              </View>
              <Text style={styles.mapPlaceholderText}>
                {formData.address
                  ? formData.address
                  : "Enter address to see preview"}
              </Text>
            </View>
          </View>

          {/* Bottom spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Sticky Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

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
