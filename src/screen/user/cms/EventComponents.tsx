import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabel: string;
}

export function ProgressBar({
  currentStep,
  totalSteps,
  stepLabel,
}: ProgressBarProps) {
  const progressWidth = (currentStep / totalSteps) * 100;

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressLabels}>
        <Text style={styles.progressLabel}>{stepLabel}</Text>
        <Text style={styles.progressStep}>
          {currentStep} of {totalSteps}
        </Text>
      </View>
      <View style={styles.progressBarBackground}>
        <View
          style={[styles.progressBarFill, { width: `${progressWidth}%` }]}
        />
      </View>
    </View>
  );
}

interface HeaderProps {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
}

export function Header({ title, onBack, showBack = true }: HeaderProps) {
  return (
    <View style={styles.header}>
      {showBack && (
        <View style={styles.headerButton}>
          {/* Back icon placeholder - use actual icon in component */}
        </View>
      )}
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerSpacer} />
    </View>
  );
}

interface FooterButtonsProps {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  backLabel?: string;
  showBack?: boolean;
}

export function FooterButtons({
  onBack,
  onNext,
  nextLabel = "Next Step",
  backLabel = "Back",
  showBack = true,
}: FooterButtonsProps) {
  return (
    <View style={styles.footer}>
      {showBack && (
        <View style={styles.backButton}>
          <Text style={styles.backButtonText}>{backLabel}</Text>
        </View>
      )}
      <View style={styles.nextButton}>
        <Text style={styles.nextButtonText}>{nextLabel}</Text>
      </View>
    </View>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export function Section({ title, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 12,
    color: "#181114",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  progressStep: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 12,
    color: "#ee2b8c",
  },
  progressBarBackground: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(238, 43, 140, 0.1)",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: "#ee2b8c",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 8,
    backgroundColor: "#f8f6f7",
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 18,
    color: "#181114",
    flex: 1,
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    paddingBottom: 32,
  },
  backButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: "#6B7280",
  },
  nextButton: {
    flex: 2,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#ee2b8c",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#ee2b8c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: "white",
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  sectionTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: "#181114",
    marginBottom: 12,
  },
});
