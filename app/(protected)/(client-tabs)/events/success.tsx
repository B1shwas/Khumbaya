import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSuccess } from "@/src/features/events/hooks/useSuccess";
import { styles } from "@/src/features/events/styles/success.styles";

export default function EventSuccessPage() {
  const { handleCreateSubEvent, handleViewEvents } = useSuccess();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Animation Circle */}
        <View style={styles.successHeroCircle}>
          <View style={styles.successHeroInner}>
            <View style={styles.checkmarkContainer}>
              <Ionicons name="checkmark" size={48} color="white" />
            </View>
          </View>
          <View style={[styles.successFloatIcon, styles.successFloatIcon1]}>
            <Ionicons name="heart" size={24} color="#ee2b8c" />
          </View>
          <View style={[styles.successFloatIcon, styles.successFloatIcon2]}>
            <Ionicons name="star" size={20} color="#F59E0B" />
          </View>
          <View style={[styles.successFloatIcon, styles.successFloatIcon3]}>
            <Ionicons name="sparkles" size={18} color="#9333EA" />
          </View>
        </View>

        {/* Success Text Content */}
        <View style={styles.successTextContent}>
          <Text style={styles.successTitle}>🎉 Congratulations!</Text>
          <Text style={styles.successSubtitle}>
            Your event has been created successfully!
          </Text>
          <Text style={styles.successDescription}>
            Your dream celebration is now set up. What's next?
          </Text>
        </View>

        {/* Action Options */}
        <View style={styles.successOptions}>
          <TouchableOpacity
            style={styles.successOptionButton}
            onPress={handleCreateSubEvent}
            activeOpacity={0.8}
          >
            <View style={styles.successOptionIconContainer}>
              <Ionicons name="sparkles" size={28} color="#9333EA" />
            </View>
            <View style={styles.successOptionTextContainer}>
              <Text style={styles.successOptionTitle}>Create Sub Event</Text>
              <Text style={styles.successOptionSubtitle}>
                Sangeet, Mehendi, Reception
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#D1D5DB" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.successOptionButton}
            onPress={handleViewEvents}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.successOptionIconContainer,
                { backgroundColor: "#ee2b8c20" },
              ]}
            >
              <Ionicons name="calendar" size={28} color="#ee2b8c" />
            </View>
            <View style={styles.successOptionTextContainer}>
              <Text style={styles.successOptionTitle}>View My Events</Text>
              <Text style={styles.successOptionSubtitle}>
                See all your events
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#D1D5DB" />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <Text style={styles.quickStatsTitle}>Next Steps</Text>
          <View style={styles.quickStatItem}>
            <Ionicons name="people" size={20} color="#6B7280" />
            <Text style={styles.quickStatText}>Invite your guests</Text>
          </View>
          <View style={styles.quickStatItem}>
            <Ionicons name="storefront" size={20} color="#6B7280" />
            <Text style={styles.quickStatText}>Book vendors</Text>
          </View>
          <View style={styles.quickStatItem}>
            <Ionicons name="wallet" size={20} color="#6B7280" />
            <Text style={styles.quickStatText}>Set up your budget</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
