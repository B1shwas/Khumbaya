import { Ionicons } from "@expo/vector-icons";
import { router, useGlobalSearchParams, type RelativePathString } from "expo-router";
import { useState } from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type EventStatus = "Planning" | "Confirmed" | "Completed";
type EventTab = "myEvents" | "invited";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  imageUrl: string;
  status: EventStatus;
  isPast: boolean;
  isMyEvent: boolean;
  subEvents?: SubEvent[];
}

interface SubEvent {
  id: string;
  name: string;
  icon: string;
  date: string;
  time: string;
  activitiesCount: number;
  budget: string;
}

// Mock sub-events data
const mockSubEvents: SubEvent[] = [
  {
    id: "sangeet",
    name: "Sangeet",
    icon: "musical-notes",
    date: "Oct 24, 2023",
    time: "6:00 PM",
    activitiesCount: 8,
    budget: "$2,500",
  },
  {
    id: "mehendi",
    name: "Mehendi",
    icon: "color-filter",
    date: "Oct 25, 2023",
    time: "2:00 PM",
    activitiesCount: 6,
    budget: "$800",
  },
  {
    id: "haldi",
    name: "Haldi",
    icon: "water",
    date: "Oct 26, 2023",
    time: "10:00 AM",
    activitiesCount: 5,
    budget: "$500",
  },
];

const eventsData: Event[] = [
  {
    id: "1",
    title: "Sarah & Mike's Wedding",
    date: "Oct 24, 2023",
    time: "5:00 PM",
    location: "Grand Plaza Hotel",
    venue: "San Francisco, CA",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDMGBAVSA0a2mbV1NAsUQzu2bct2K06QsiZ1jLIpIf7nbUcD0SDuTMc-z75hROFlu_LFYS6GfeT0IqRnm7AbLiKsfERuzOvTIpNCDlKtTOcXYihWGijl5lpv6FUuJYne95hB_oQ_nxA-dIl28E1klx3juyud1wdRFijk9m43KdAbhRH-Lce5awx3x0UgGnkiFS7pGORCgl84OWwOA9D5zVEiQmLn-qp6adJQhSWlzYgKW5GpmgN2XlVRKLIC5jv2n1SqnX__0gkXGo",
    status: "Planning",
    isPast: false,
    isMyEvent: true,
    subEvents: mockSubEvents,
  },
  {
    id: "2",
    title: "Diwali Celebration",
    date: "Nov 12, 2023",
    time: "7:00 PM",
    location: "Community Center",
    venue: "San Francisco, CA",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAoqHk60jIeSNZ9ki1c8iJtQhNgAylhPNie7B-e6RbVhqxqPZYWqYOStnWl2heFJMQW4km9uazp2AJ27FMETIhQQO3tXxYSIvbPNLiMuyf2dg0b3qT3v_GGw5YsO8M3pcj5Bnk0kNmcSQKT1p6x0bsxOFgm0JL10HY5_xet3NtTFkdXUpZlZid6xWZ7LqikDKmn0bLoVzit5hQKLe7VmvXCaa50hemlczbPWpDQbXcqd7R368vilNmPfa2ysrPk64t5Wga7Wgb-EVU",
    status: "Confirmed",
    isPast: false,
    isMyEvent: true,
  },
  {
    id: "3",
    title: "Annual Gala Dinner",
    date: "Dec 15, 2022",
    time: "6:30 PM",
    location: "City Convention Hall",
    venue: "San Francisco, CA",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuApbhlzAVy4OJVcYMZ4izXUlnKPSNe70nYIazGktsGplBpkgzEzpvxp_qgIiF3dn8QLXQ1ADctibRDxZ_8gdSpJtPeEoAzmBa0mHWTHfuzG_-R1aDiqm_BFUf7Q3xk-cIN9jnmVd3yZIPYwSMQ_Mu4phO1tDt1Z-TSTdGCpvwYmq3-Q9FRAq6bw6rkqiEBN4F029JIYHOxmHinCw-RP9-524nQVGQFR9CRcag0PgTHdiwqETf0l_HGG1IVwJVdDlPIb-Lqrd3JnXWk",
    status: "Completed",
    isPast: true,
    isMyEvent: true,
  },
  {
    id: "4",
    title: "Summer Music Fest",
    date: "Jul 10, 2022",
    time: "2:00 PM",
    location: "Riverside Park",
    venue: "San Francisco, CA",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuARGMTc7YD75O5-P1JXaqRK-kzu8vG4dIq7cAWSf3T_MtObQL1wDay2EjrgmOhEisjwDrxbgUi5CmmuPeBpNY8oTzyqjiQYIfhoMuhQ4alM838I-CHqYkWS_cPTJX3q8wMUv09PvLSFpA12g4XHRnHkHjl2GhsUzvy9UqCcZCecd_vx_3teq2dxTkkxf581tF1IXSMceXsU8alw80NOAhNnnzmeKmprOew-lXzEx3_2-LLgMplSZ80ITS0ryusXkdprVSAYOc0Y5Mc",
    status: "Completed",
    isPast: true,
    isMyEvent: false,
  },
  {
    id: "5",
    title: "Friend's Birthday Bash",
    date: "Mar 15, 2024",
    time: "8:00 PM",
    location: "Rooftop Lounge",
    venue: "San Francisco, CA",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDSiNZxjryxVvBt_Qvd2BsU8jmuyGXsbWyZqiGyTJOFCn4I4QdwE-xrJUmE938nQ2sYjA0qbPec911z6qe-blSH_epWVfQJy2W2NwU5R-4dwi1k7uUfEgPutKfIV3RpR1EUutrAFt_7SBxXq5yRfR9EkuQCohSjZJpWgX0eNFvBY3F5rZ-xWmmB8Em-xGg1AvxCRQDlpUPXbLlpkcqBsqbQXGIi5tNUNw3p5WrCahAWFPRTkzEE0B8v47AYzYa8b-aEAMvtdko47AM",
    status: "Confirmed",
    isPast: false,
    isMyEvent: false,
  },
];

const getStatusColor = (status: EventStatus, isPast: boolean) => {
  if (isPast) {
    return "bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-400 border-gray-200 dark:border-gray-700";
  }
  switch (status) {
    case "Planning":
      return "bg-primary/10 text-primary border-primary/20";
    case "Confirmed":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const getDateColor = (isPast: boolean) => {
  return isPast
    ? "text-gray-400 dark:text-gray-500"
    : "text-primary dark:text-pink-300";
};

// SubEvent Card Component
const SubEventCard = ({ subEvent }: { subEvent: SubEvent }) => (
  <TouchableOpacity
    style={styles.subEventCard}
    onPress={() =>
      router.push(
        `/(protected)/(client-stack)/events/subevent-detail?subEventId=${subEvent.id}&eventId=1`,
      )
    }
  >
    <View style={styles.subEventIcon}>
      <Ionicons name={subEvent.icon as any} size={20} color="#ee2b8c" />
    </View>
    <View style={styles.subEventInfo}>
      <Text style={styles.subEventName}>{subEvent.name}</Text>
      <Text style={styles.subEventDetails}>
        {subEvent.date} • {subEvent.time}
      </Text>
    </View>
    <View style={styles.subEventStats}>
      <Text style={styles.subEventStatLabel}>
        {subEvent.activitiesCount} activities
      </Text>
      <Text style={styles.subEventStatBudget}>{subEvent.budget}</Text>
    </View>
    <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
  </TouchableOpacity>
);

// Event Card Component
const EventCard = ({ event }: { event: Event }) => (
  <View style={styles.eventCard}>
    <TouchableOpacity
      style={styles.eventCardTouchable}
      onPress={() => router.push(`/(protected)/(client-stack)/events/${event.id}`)} // go to the related event with the id number 
      activeOpacity={0.8}
    >
      <View style={styles.eventImageContainer}>
        <Image
          source={{ uri: event.imageUrl }}
          style={[styles.eventImage, event.isPast && styles.eventImagePast]}
        />
      </View>
      <View style={styles.eventInfo}>
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle} numberOfLines={2}>
            {event.title}
          </Text>
          <View
            style={[styles.statusBadge, event.isPast && styles.statusBadgePast]}
          >
            <Text
              style={[styles.statusText, event.isPast && styles.statusTextPast]}
            >
              {event.status}
            </Text>
          </View>
        </View>
        <View>
          <View style={styles.eventLocationRow}>
            <Ionicons name="location" size={14} color="#6B7280" />
            <Text style={styles.eventLocation} numberOfLines={1}>
              {event.location}
            </Text>
          </View>
          <View style={styles.eventDateRow}>
            <Ionicons
              name="calendar"
              size={14}
              color={event.isPast ? "#9CA3AF" : "#ee2b8c"}
            />
            <Text
              style={[styles.eventDate, event.isPast && styles.eventDatePast]}
            >
              {event.date} • {event.time}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>

    {/* Sub Events Section */}
    {event.subEvents && event.subEvents.length > 0 && (
      <View style={styles.subEventsSection}>
        <View style={styles.subEventsHeader}>
          <Text style={styles.subEventsTitle}>Sub Events</Text>
          <Text style={styles.subEventsCount}>
            {event.subEvents.length} scheduled
          </Text>
        </View>
        {event.subEvents.map((subEvent) => (
          <SubEventCard key={subEvent.id} subEvent={subEvent} />
        ))}
      </View>
    )}

    {/* Action Buttons */}
    <View style={styles.eventActions}>
      {event.isMyEvent ? (
        <>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              router.push(
                `/(protected)/(client-stack)/events/subevent-create?eventId=${event.id}` ,
              )
            }
          >
            <Ionicons name="add-circle-outline" size={18} color="#ee2b8c" />
            <Text style={styles.actionButtonText}>Add Sub Event</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              router.push(
                `/(protected)/(client-stack)/events/table-management?eventId=${event.id}` ,
              )
            }
          >
            <Ionicons name="grid-outline" size={18} color="#3B82F6" />
            <Text style={styles.actionButtonText}>Manage Tables</Text>
          </TouchableOpacity>
        </>
      ) : (
        !event.isPast && (
          <TouchableOpacity
            style={[styles.actionButton, styles.rsvpButton]}
            onPress={() => {
              router.push(
                `/events/rsvp?eventId=${event.id}` as RelativePathString,
              );
            }}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={18}
              color="#10B981"
            />
            <Text style={[styles.actionButtonText, styles.rsvpButtonText]}>
              RSVP Now
            </Text>
          </TouchableOpacity>
        )
      )}
    </View>
  </View>
);

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<EventTab>("myEvents");
  const [refreshing, setRefreshing] = useState(false);
  const params = useGlobalSearchParams();
  const showSuccess = params?.success === "true";

  const handleDismissSuccess = () => {
    router.replace("/(protected)/(client-tabs)/event" as RelativePathString);
  };

  const handleCreateSubEvent = () => {
    router.push("/(protected)/(client-stack)/events/subevent-create" as RelativePathString);
  };

  const filteredEvents = eventsData.filter(
    (e) => e.isMyEvent === (activeTab === "myEvents"),
  );
  const upcomingEvents = filteredEvents.filter((e) => !e.isPast);
  const pastEvents = filteredEvents.filter((e) => e.isPast);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Your Events</Text>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => router.push("/settings" as RelativePathString)}
          >
            <Ionicons name="settings" size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "myEvents" && styles.tabActive]}
              onPress={() => setActiveTab("myEvents")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "myEvents" && styles.tabTextActive,
                ]}
              >
                My Events
              </Text>
            </TouchableOpacity>
            <View
             className={`flex-1 py-2 px-4 rounded-lg transition-all ${activeTab === "invited" ? "bg-white shadow-sm" : "bg-transparent"}`}
            >
                <TouchableOpacity
              onPress={() => setActiveTab("invited")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "invited" && styles.tabTextActive,
                ]}
              >
                Invited
              </Text>
            </TouchableOpacity>

            </View>
          
          </View>
        </View>
      </View>

      {/* Content List */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming</Text>
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </View>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Past Events</Text>
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </View>
        )}

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No events found</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === "myEvents"
                ? "Create your first event to get started"
                : "No pending invitations"}
            </Text>
          </View>
        )}

        {/* Bottom spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          router.push(
            "/(protected)/(client-tabs)/events/create" as RelativePathString,
          )
        }
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f6f7",
  },
  header: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 20,
    color: "#181114",
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  tabsContainer: {
    marginTop: 12,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "#6B7280",
  },
  tabTextActive: {
    color: "#ee2b8c",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 14,
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  eventCard: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  eventCardTouchable: {
    flexDirection: "row",
    padding: 12,
  },
  eventImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: "hidden",
  },
  eventImage: {
    width: "100%",
    height: "100%",
  },
  eventImagePast: {
    opacity: 0.6,
  },
  eventInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  eventTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: "#181114",
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "#FDF2F8",
    borderWidth: 1,
    borderColor: "#FBCFE8",
  },
  statusBadgePast: {
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
  },
  statusText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 10,
    color: "#ee2b8c",
    textTransform: "uppercase",
  },
  statusTextPast: {
    color: "#6B7280",
  },
  eventLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  eventLocation: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 13,
    color: "#6B7280",
    marginLeft: 4,
  },
  eventDateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  eventDate: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 13,
    color: "#ee2b8c",
    marginLeft: 4,
  },
  eventDatePast: {
    color: "#9CA3AF",
  },
  subEventsSection: {
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    padding: 12,
  },
  subEventsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  subEventsTitle: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "#181114",
  },
  subEventsCount: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: "#6B7280",
  },
  subEventCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  subEventIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#FDF2F8",
    alignItems: "center",
    justifyContent: "center",
  },
  subEventInfo: {
    flex: 1,
    marginLeft: 10,
  },
  subEventName: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "#181114",
  },
  subEventDetails: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  subEventStats: {
    alignItems: "flex-end",
  },
  subEventStatLabel: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 11,
    color: "#6B7280",
  },
  subEventStatBudget: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 12,
    color: "#10B981",
  },
  eventActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    padding: 12,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    paddingVertical: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  actionButtonText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 13,
    color: "#374151",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 18,
    color: "#6B7280",
    marginTop: 16,
  },
  emptySubtitle: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 4,
  },
  bottomSpacer: {
    height: 80,
  },
  rsvpButton: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#10B981",
  },
  rsvpButtonText: {
    color: "#10B981",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#ee2b8c",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#ee2b8c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  // Success View Styles
  successContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  successHeroCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#FDF2F8",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: 16,
  },
  successHeroInner: {
    width: 110,
    height: 110,
    borderRadius: 55,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#FBCFE8",
  },
  successHeroImage: {
    width: "100%",
    height: "100%",
  },
  successFloatIcon: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 6,
    shadowColor: "#ee2b8c",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  successFloatIcon1: {
    top: 10,
    right: 10,
  },
  successFloatIcon2: {
    bottom: 15,
    left: 10,
  },
  successFloatIcon3: {
    bottom: 10,
    right: 15,
  },
  successTextContent: {
    alignItems: "center",
    marginBottom: 20,
  },
  successTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 22,
    color: "#181114",
    textAlign: "center",
  },
  successSubtitle: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
  },
  successOptions: {
    width: "100%",
    gap: 12,
  },
  successOptionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  successOptionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#9333EA20",
    alignItems: "center",
    justifyContent: "center",
  },
  successOptionTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  successOptionTitle: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 15,
    color: "#181114",
  },
  successOptionSubtitle: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
});
