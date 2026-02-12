import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useEventEstimates } from "./hooks/useEventEstimates";
import { styles } from "./styles/EventEstimates.styles";
import { CURRENCIES } from "./types/eventEstimates";

const HEADER_HEIGHT = 80;
const FOOTER_HEIGHT = 120;

export default function EventEstimates() {
  const navigation = useNavigation();
  const {
    formData,
    handleGuestCountChange,
    handleBudgetChange,
    handleCurrencyChange,
    toggleBudgetPrivacy,
  } = useEventEstimates();
  const [budgetFocused, setBudgetFocused] = useState(false);

  const getCurrencySymbol = (currency: string) => {
    const curr = CURRENCIES.find((c) => c.code === currency);
    return curr ? curr.symbol : "$";
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: HEADER_HEIGHT }]}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={20} color="#181114" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create an Event</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressLabels}>
            <Text style={styles.progressStep}>Step 2/7</Text>
            <Text style={styles.progressLabel}>Event Estimates</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: "28.57%" }]} />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Event Estimates</Text>
            <Text style={styles.subtitle}>
              Help vendors understand your budget expectations by providing your
              estimated guest count and budget.
            </Text>
          </View>

          {/* Guest Count */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              How many guests are you expecting?
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                value={formData.guestCount}
                onChangeText={handleGuestCountChange}
              />
              <View style={styles.inputIcon}>
                <Ionicons name="people-outline" size={20} color="#6B7280" />
              </View>
            </View>
          </View>

          {/* Budget */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              What's your estimated budget?
            </Text>
            <View style={styles.budgetRow}>
              <View style={[styles.budgetInput, { position: "relative" }]}>
                <View style={styles.currencyIcon}>
                  <Text style={styles.currencySymbol}>
                    {getCurrencySymbol(formData.currency)}
                  </Text>
                </View>
                <TextInput
                  style={[styles.textInput, { paddingLeft: 36 }]}
                  placeholder="0.00"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="decimal-pad"
                  value={formData.budget}
                  onChangeText={handleBudgetChange}
                  onFocus={() => setBudgetFocused(true)}
                  onBlur={() => setBudgetFocused(false)}
                />
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.currencyScroll}
                contentContainerStyle={{ flexDirection: "row", gap: 8 }}
              >
                {CURRENCIES.map((currency) => (
                  <TouchableOpacity
                    key={currency.code}
                    style={[
                      styles.currencyButton,
                      formData.currency === currency.code &&
                        styles.currencyButtonSelected,
                    ]}
                    onPress={() => handleCurrencyChange(currency.code)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text
                      style={[
                        styles.currencyText,
                        formData.currency === currency.code &&
                          styles.currencyTextSelected,
                      ]}
                    >
                      {currency.code}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Privacy Toggle */}
          <View style={styles.privacySection}>
            <Pressable
              style={styles.privacyContainer}
              onPress={toggleBudgetPrivacy}
            >
              <View style={styles.privacyTextContainer}>
                <Text style={styles.privacyTitle}>Keep my budget private</Text>
                <Text style={styles.privacySubtitle}>
                  Only show budget range to vendors you directly contact
                </Text>
              </View>
              <View
                style={{
                  width: 48,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: formData.isBudgetPrivate
                    ? "#ee2b8c"
                    : "#E5E7EB",
                  justifyContent: "center",
                  paddingHorizontal: 2,
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: "white",
                    alignSelf: formData.isBudgetPrivate
                      ? "flex-end"
                      : "flex-start",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.15,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                />
              </View>
            </Pressable>
          </View>

          {/* Tip */}
          <View style={styles.tipContainer}>
            <Ionicons name="bulb-outline" size={20} color="#6B7280" />
            <Text style={styles.tipText}>
              Tip: Including a budget range helps vendors provide more accurate
              quotes and speeds up the planning process.
            </Text>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={20} color="#6B7280" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => navigation.navigate("event-location" as never)}
          >
            <Text style={styles.nextButtonText}>Next</Text>
            <Ionicons name="chevron-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
