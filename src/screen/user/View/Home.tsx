import {
  CoupleCard,
  EventCard,
  HeroCard,
  HotelCard,
  QuickServices,
  SectionHeader,
  VenueCard,
} from "@/src/components/home";

import EventList from "@/src/constants/event";
import VENUES from "@/src/constants/venues";
import { useAuthStore } from "@/src/store/AuthStore";
import { Ionicons } from "@expo/vector-icons";
import { router, type RelativePathString } from "expo-router";
import React, { useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ============================================
// STATIC DATA (Moved outside component)
// ============================================

const HOTELS = [
  {
    id: "1",
    name: "Taj Lands End",
    location: "Bandra, Mumbai",
    distance: "2.5 km from venue",
    price: "₹8,500/night",
    rating: 4.7,
    imageUrl:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
    amenities: ["Pool", "Spa", "WiFi"],
  },
  {
    id: "2",
    name: "The Leela Palace",
    location: "Andheri, Mumbai",
    distance: "5 km from venue",
    price: "₹12,000/night",
    rating: 4.9,
    imageUrl:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    amenities: ["Pool", "Spa", "Gym"],
  },
];

const COUPLES = [
  {
    id: "1",
    names: "Priya & Rahul",
    date: "Mar 15, 2024",
    location: "Udaipur",
    imageUrl:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    story: "Love story of two hearts meeting in college...",
  },
  {
    id: "2",
    names: "Ananya & Arjun",
    date: "Apr 20, 2024",
    location: "Jaipur",
    imageUrl:
      "https://images.unsplash.com/photo-1529636721194-799f9462431e?w=800&q=80",
    story: "A journey from friendship to forever...",
  },
];

// ============================================
// HOME PAGE COMPONENT
// ============================================

export default function HomePage() {
  const { user } = useAuthStore();
  const fetchUserProfile = useAuthStore((state) => state.fetchUserProfile);

  // Fetch user profile on mount
  React.useEffect(() => {
    fetchUserProfile();
  }, []);

  // Navigation handlers wrapped in useCallback
  const navigateToEvents = useCallback(
    () =>
      router.push("/(protected)/(client-tabs)/events" as RelativePathString),
    []
  );

  const navigateToVenues = useCallback(
    () => router.push("/(shared)/explore/explore"),
    []
  );

  const navigateToHotels = useCallback(
    () => router.push("/hotels" as RelativePathString),
    []
  );

  const navigateToVendors = useCallback(
    () => router.push("/(shared)/explore" as RelativePathString),
    []
  );

  const navigateToBlog = useCallback(
    () => router.push("/blog" as RelativePathString),
    []
  );

  // Render functions for FlatList items
  const renderEventItem = useCallback(
    ({ item }: { item: (typeof EventList)[0] }) => <EventCard {...item} />,
    []
  );

  const renderVenueItem = useCallback(
    ({ item }: { item: (typeof VENUES)[0] }) => <VenueCard {...item} />,
    []
  );

  const renderHotelItem = useCallback(
    ({ item }: { item: (typeof HOTELS)[0] }) => <HotelCard {...item} />,
    []
  );

  const renderCoupleItem = useCallback(
    ({ item }: { item: (typeof COUPLES)[0] }) => <CoupleCard {...item} />,
    []
  );

  return (
    <>
      <View style={styles.header} className="px-4">
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>
              Hi, {user?.username || user?.name || "Guest"} 👋
            </Text>
            <Text style={styles.title}>Plan Your Dream Event</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="notifications-outline" size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={[]} // Empty data for scroll, we render sections manually
        renderItem={null}
        keyExtractor={() => "header"}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={
          <>
            {/* Hero Card */}
            <HeroCard />

            {/* Quick Services */}
            <QuickServices />

            {/* Your Events Section */}
            <SectionHeader title="Your Events" />
            <FlatList
              data={EventList}
              renderItem={renderEventItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />

            {/* Popular Venues Section */}
            <SectionHeader title="Popular Venues" onPress={navigateToVenues} />
            <FlatList
              data={VENUES}
              renderItem={renderVenueItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />

            {/* Nearby Hotels Section
            <SectionHeader title="Nearby Hotels" onPress={navigateToHotels} />
            <FlatList
              data={HOTELS}
              renderItem={renderHotelItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            /> */}

            {/* Wedding Stories Section */}
            {/* <SectionHeader title="Wedding Stories" /> */}
            {/* <FlatList
              data={COUPLES}
              renderItem={renderCoupleItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            /> */}

            {/* Articles & Tips Section */}
            {/* <SectionHeader title="Articles & Tips" onPress={navigateToBlog} />
            {ARTICLES.map((article) => (
              <ArticleCard key={article.id} {...article} />
            ))} */}

            {/* Bottom Spacer */}
            <View style={styles.bottomSpacer} />
          </>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          router.push(
            "/(protected)/(client-stack)/events/createevent" as RelativePathString
          )
        }
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f6f7",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "white",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greeting: {
    fontSize: 14,
    color: "#6b7280",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
  },
  notificationBtn: {
    padding: 8,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 14,
    color: "#9CA3AF",
  },
  horizontalList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  bottomSpacer: {
    height: 100,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "white",
    paddingVertical: 12,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    justifyContent: "space-around",
  },
  navItem: {
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  navText: {
    fontSize: 10,
    color: "#9CA3AF",
  },
  navTextActive: {
    color: "#ee2b8c",
    fontWeight: "600",
  },
  centerBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#ee2b8c",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -30,
    shadowColor: "#ee2b8c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
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
});
