import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../styles/EventSuccess.styles";

interface SuccessViewProps {
  onCreateSubEvent: () => void;
  onViewMyEvents: () => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({
  onCreateSubEvent,
  onViewMyEvents,
}) => {
  return (
    <View style={styles.content}>
      {/* Hero Illustration */}
      <View style={styles.heroContainer}>
        <View style={styles.heroCircle}>
          <View style={styles.heroInner}>
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDBTMpF5OGVFMpt0SFd1YYHvT0dbWhsJ1OiXWYAZtZHva3uRWvfDLTe0o9wji8CCfff_spyNbGa1EqMQAzU8TSgsZHHZyZczilaJjXsgkwdrHYtnhNzzELEAqjVUidiCPT2fu982NW88FUu6OLV-YHywILAwdx8LLdR69ManJPsqTJW1tjKuLVKnk4MgCSOSRbFhMOSEYIzSWmW-zWQIRd6Gn2odEDu-GJKhVcxGiy5nXwWuauIW5Hx3EfnwvPUTBI8LDijYJeRSk",
              }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          </View>

          {/* Floating decorative icons */}
          <View style={[styles.floatIcon, styles.floatIcon1]}>
            <Ionicons name="heart" size={24} color="#ee2b8c" fill="#ee2b8c" />
          </View>
          <View style={[styles.floatIcon, styles.floatIcon2]}>
            <Ionicons name="star" size={20} color="#ee2b8c" />
          </View>
          <View style={[styles.floatIcon, styles.floatIcon3]}>
            <Ionicons name="sparkles" size={18} color="#ee2b8c" />
          </View>
        </View>
      </View>

      {/* Text Content */}
      <View style={styles.textContent}>
        <Text style={styles.title}>Congratulations!</Text>
        <Text style={styles.title}>Your event is live.</Text>

        <Text style={styles.subtitle}>
          Your dream wedding is now set up. What's next?
        </Text>
      </View>

      {/* Option Buttons */}
      <View style={styles.optionButtons}>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={onCreateSubEvent}
          activeOpacity={0.8}
        >
          <View style={styles.optionIconContainer}>
            <Ionicons name="sparkles" size={28} color="#9333EA" />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Create Sub Event</Text>
            <Text style={styles.optionSubtitle}>
              Sangeet, Mehendi, Reception
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#D1D5DB" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={onViewMyEvents}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.optionIconContainer,
              { backgroundColor: "#EE2B8C20" },
            ]}
          >
            <Ionicons name="calendar" size={28} color="#ee2b8c" />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>View My Events</Text>
            <Text style={styles.optionSubtitle}>See all your events</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#D1D5DB" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
