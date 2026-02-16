import {
  ArticleCard,
  CoupleCard,
  EventCard,
  HeroCard,
  HotelCard,
  QuickServices,
  SectionHeader,
  VenueCard,
} from "@/src/components/ui/home";
import { useAuth } from "@/src/store/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router, type RelativePathString } from "expo-router";
import { useCallback } from "react";
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

const EVENTS = [
  {
    id: "1",
    title: "Rahul & Simran's Sangeet",
    date: "DEC 12",
    time: "7:00 PM",
    location: "Mumbai",
    imageUrl:
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80",
  },
  {
    id: "2",
    title: "Annual Cultural Gala",
    date: "JAN 15",
    time: "6:00 PM",
    location: "New York",
    imageUrl:
      "https://images.unsplash.com/photo-1522673607200-1645062cd5d1?w=800&q=80",
  },
];

const ARTICLES = [
  {
    id: "1",
    category: "Decor",
    categoryColor: "#ee2b8c",
    title: "Top 10 Floral Trends for 2024",
    description:
      "From cascading bouquets to sustainable centerpieces, here is what is trending.",
    readTime: "5 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80",
  },
  {
    id: "2",
    category: "Finance",
    categoryColor: "#3b82f6",
    title: "Budgeting 101: Where to Splurge",
    description: "Expert advice on allocating your wedding funds effectively.",
    readTime: "8 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80",
  },
  {
    id: "3",
    category: "Fashion",
    categoryColor: "#8b5cf6",
    title: "Styling Modern Traditional Wear",
    description: "Mixing contemporary silhouettes with classic fabrics.",
    readTime: "4 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
  },
];

const VENUES = [
  {
    id: "1",
    name: "Grand Ballroom Palace",
    location: "Downtown Mumbai",
    capacity: "500-1000 guests",
    price: "₹2L - ₹5L",
    rating: 4.8,
    imageUrl:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
    type: "Banquet Hall",
  },
  {
    id: "2",
    name: "Sunset Garden Venue",
    location: "Lonavala",
    capacity: "200-400 guests",
    price: "₹1.5L - ₹3L",
    rating: 4.6,
    imageUrl:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
    type: "Outdoor Garden",
  },
  {
    id: "3",
    name: "Royal Palace Resort",
    location: "Jaipur",
    capacity: "300-600 guests",
    price: "₹3L - ₹6L",
    rating: 4.9,
    imageUrl:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    type: "Palace",
  },
];

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
  const { user } = useAuth();

  // Navigation handlers wrapped in useCallback
  const navigateToEvents = useCallback(
    () =>
      router.push("/(protected)/(client-tabs)/events" as RelativePathString),
    [],
  );

  const navigateToVenues = useCallback(
    () => router.push("/venues" as RelativePathString),
    [],
  );

  const navigateToHotels = useCallback(
    () => router.push("/hotels" as RelativePathString),
    [],
  );

  const navigateToVendors = useCallback(
    () => router.push("/(shared)/explore" as RelativePathString),
    [],
  );

  const navigateToBlog = useCallback(
    () => router.push("/blog" as RelativePathString),
    [],
  );

  // Render functions for FlatList items
  const renderEventItem = useCallback(
    ({ item }: { item: (typeof EVENTS)[0] }) => <EventCard {...item} />,
    [],
  );

  const renderVenueItem = useCallback(
    ({ item }: { item: (typeof VENUES)[0] }) => <VenueCard {...item} />,
    [],
  );

  const renderHotelItem = useCallback(
    ({ item }: { item: (typeof HOTELS)[0] }) => <HotelCard {...item} />,
    [],
  );

  const renderCoupleItem = useCallback(
    ({ item }: { item: (typeof COUPLES)[0] }) => <CoupleCard {...item} />,
    [],
  );

  return (
    <>
      < View style={styles.header} className="px-4" >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Hi, {user?.name || "Guest"} 👋</Text>
            <Text style={styles.title}>Plan Your Dream Event</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="notifications-outline" size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>
      </View >

      <FlatList
        data={[]} // Empty data for scroll, we render sections manually
        renderItem={null}
        keyExtractor={() => "header"}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={
          <>
            {/* Search Bar */}
            {/* <View style={styles.searchContainer}>
              <TouchableOpacity
                style={styles.searchBar}
                onPress={() => router.push("/search" as RelativePathString)}
              >
                <Ionicons name="search" size={20} color="#9CA3AF" />
                <Text style={styles.searchPlaceholder}>
                  Search venues, vendors, services...
                </Text>
              </TouchableOpacity>
            </View> */}

            {/* Hero Card */}
            <HeroCard />

            {/* Quick Services */}
            <QuickServices />

            {/* Your Events Section */}
            <SectionHeader title="Your Events" />
            <FlatList
              data={EVENTS}
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
            <SectionHeader title="Wedding Stories" />
            <FlatList
              data={COUPLES}
              renderItem={renderCoupleItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />

            {/* Articles & Tips Section */}
            <SectionHeader title="Articles & Tips" onPress={navigateToBlog} />
            {ARTICLES.map((article) => (
              <ArticleCard key={article.id} {...article} />
            ))}

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
            "/(protected)/(client-stack)/events/createevent" as RelativePathString,
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
