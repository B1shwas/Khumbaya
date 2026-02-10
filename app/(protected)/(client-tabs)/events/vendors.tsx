import { Ionicons } from "@expo/vector-icons";
import { router, type RelativePathString } from "expo-router";
import { useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Vendor {
  id: string;
  name: string;
  category: string;
  status: "booked" | "pending" | "available";
  contact?: string;
  price?: string;
  rating?: number;
  imageUrl?: string;
}

const vendorsData: Vendor[] = [
  {
    id: "1",
    name: "Floral Dreams Studio",
    category: "Florist",
    status: "booked",
    contact: "+91 98765 43210",
    price: "₹50,000",
    rating: 4.9,
    imageUrl:
      "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80",
  },
  {
    id: "2",
    name: "Crown Catering",
    category: "Catering",
    status: "booked",
    contact: "+91 98765 43211",
    price: "₹1,500/plate",
    rating: 4.7,
    imageUrl:
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80",
  },
  {
    id: "3",
    name: "Elite Photography",
    category: "Photography",
    status: "booked",
    contact: "+91 98765 43212",
    price: "₹75,000",
    rating: 4.8,
    imageUrl:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
  },
  {
    id: "4",
    name: "DJ Wave Sounds",
    category: "DJ/Music",
    status: "pending",
    contact: "+91 98765 43213",
    price: "₹25,000",
    rating: 4.6,
    imageUrl:
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80",
  },
  {
    id: "5",
    name: "Royal Decorations",
    category: "Decoration",
    status: "pending",
    contact: "+91 98765 43214",
    price: "₹1,00,000",
    rating: 4.5,
    imageUrl:
      "https://images.unsplash.com/photo-1519225421980-715cb0202128?w=800&q=80",
  },
  {
    id: "6",
    name: "Sweet Tooth Cakes",
    category: "Cake",
    status: "available",
    contact: "+91 98765 43215",
    price: "₹5,000",
    rating: 4.9,
    imageUrl:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "booked":
      return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
    case "pending":
      return "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400";
    case "available":
      return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const VendorCard = ({ vendor }: { vendor: Vendor }) => (
  <TouchableOpacity
    style={styles.vendorCard}
    onPress={() =>
      router.push(`/events/vendors/${vendor.id}` as RelativePathString)
    }
    activeOpacity={0.8}
  >
    <View style={styles.vendorImageContainer}>
      {vendor.imageUrl ? (
        <Image
          source={{ uri: vendor.imageUrl }}
          style={styles.vendorImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.vendorImagePlaceholder}>
          <Ionicons name="storefront" size={32} color="#9CA3AF" />
        </View>
      )}
      <View
        style={[
          styles.statusBadge,
          vendor.status === "booked" && styles.statusBooked,
          vendor.status === "pending" && styles.statusPending,
          vendor.status === "available" && styles.statusAvailable,
        ]}
      >
        <Text
          style={[
            styles.statusText,
            vendor.status === "booked" && styles.statusTextBooked,
            vendor.status === "pending" && styles.statusTextPending,
            vendor.status === "available" && styles.statusTextAvailable,
          ]}
        >
          {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
        </Text>
      </View>
    </View>

    <View style={styles.vendorInfo}>
      <Text style={styles.vendorName}>{vendor.name}</Text>
      <Text style={styles.vendorCategory}>{vendor.category}</Text>

      <View style={styles.vendorMeta}>
        {vendor.rating && (
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingText}>{vendor.rating}</Text>
          </View>
        )}
        {vendor.price && <Text style={styles.priceText}>{vendor.price}</Text>}
      </View>
    </View>

    <View style={styles.vendorAction}>
      {vendor.status === "available" ? (
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() =>
            router.push(`/events/vendors/${vendor.id}` as RelativePathString)
          }
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() =>
            router.push(`/events/vendors/${vendor.id}` as RelativePathString)
          }
        >
          <Ionicons name="ellipsis-horizontal" size={20} color="#6B7280" />
        </TouchableOpacity>
      )}
    </View>
  </TouchableOpacity>
);

export default function EventVendorsPage() {
  const [activeTab, setActiveTab] = useState<
    "all" | "booked" | "pending" | "available"
  >("all");

  const filteredVendors = vendorsData.filter((vendor) => {
    if (activeTab === "all") return true;
    return vendor.status === activeTab;
  });

  const bookedCount = vendorsData.filter((v) => v.status === "booked").length;
  const pendingCount = vendorsData.filter((v) => v.status === "pending").length;
  const availableCount = vendorsData.filter(
    (v) => v.status === "available",
  ).length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Top App Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#181114" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Vendors</Text>
          <Text style={styles.headerSubtitle}>Sarah & Mike's Wedding</Text>
        </View>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="search" size={24} color="#181114" />
        </TouchableOpacity>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{bookedCount}</Text>
          <Text style={styles.statLabel}>Booked</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{pendingCount}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{availableCount}</Text>
          <Text style={styles.statLabel}>Available</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {(["all", "booked", "pending", "available"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Vendor List */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.vendorList}
        showsVerticalScrollIndicator={false}
      >
        {filteredVendors.map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor} />
        ))}

        {filteredVendors.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="storefront-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No vendors found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your filters</Text>
          </View>
        )}

        {/* Bottom spacer for FAB */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Floating Action Button: Add Vendor */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/explore" as RelativePathString)}
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#181114",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#6B7280",
  },
  headerButton: {
    padding: 8,
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ee2b8c",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  tabsContainer: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  tabActive: {
    backgroundColor: "#ee2b8c",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  tabTextActive: {
    color: "white",
  },
  content: {
    flex: 1,
  },
  vendorList: {
    padding: 16,
    gap: 12,
  },
  vendorCard: {
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  vendorImageContainer: {
    width: 100,
    height: 100,
    position: "relative",
  },
  vendorImage: {
    width: "100%",
    height: "100%",
  },
  vendorImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  statusBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBooked: {
    backgroundColor: "#DCFCE7",
  },
  statusPending: {
    backgroundColor: "#FFEDD5",
  },
  statusAvailable: {
    backgroundColor: "#DBEAFE",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  statusTextBooked: {
    color: "#16A34A",
  },
  statusTextPending: {
    color: "#EA580C",
  },
  statusTextAvailable: {
    color: "#2563EB",
  },
  vendorInfo: {
    flex: 1,
    padding: 12,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#181114",
  },
  vendorCategory: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  vendorMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#F59E0B",
  },
  priceText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#10B981",
  },
  vendorAction: {
    paddingRight: 12,
  },
  bookButton: {
    backgroundColor: "#ee2b8c",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  viewButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 4,
  },
  bottomSpacer: {
    height: 80,
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
});
