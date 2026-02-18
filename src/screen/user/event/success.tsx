import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EventSuccessPage() {
  const handleCreateSubEvent = () => {
    // This is a placeholder - in a real app, you would navigate to the subevent creation screen
    // with the event ID from the current context
    router.push("/(protected)/(client-stack)/events/[eventId]/subevent-create" as any);
  };

  const handleViewEvents = () => {
    router.replace("/(protected)/(client-tabs)/events" );
  };

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f6f7",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
  },
  successHeroCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#ee2b8c",
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 32,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#ee2b8c",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  successHeroInner: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#ee2b8c",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.3)",
  },
  checkmarkContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  successFloatIcon: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successFloatIcon1: {
    top: -10,
    right: -10,
  },
  successFloatIcon2: {
    bottom: 30,
    left: -20,
  },
  successFloatIcon3: {
    bottom: -5,
    right: 30,
  },
  successTextContent: {
    alignItems: "center",
    marginBottom: 32,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#181114",
    marginBottom: 12,
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#181114",
    marginBottom: 8,
    textAlign: "center",
  },
  successDescription: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    maxWidth: 280,
  },
  successOptions: {
    gap: 16,
    marginBottom: 32,
  },
  successOptionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  successOptionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#9333EA20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  successOptionTextContainer: {
    flex: 1,
  },
  successOptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#181114",
    marginBottom: 4,
  },
  successOptionSubtitle: {
    fontSize: 12,
    color: "#6B7280",
  },
  quickStats: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quickStatsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#181114",
    marginBottom: 16,
  },
  quickStatItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  quickStatText: {
    fontSize: 14,
    color: "#6B7280",
  },
});
