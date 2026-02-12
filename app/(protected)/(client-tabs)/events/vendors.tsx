import { Ionicons } from "@expo/vector-icons";
import { router, type RelativePathString } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { VendorCard } from "./components/VendorCard";
import { useVendors } from "./hooks/useVendors";
import { styles } from "./styles/vendors.styles";

export default function EventVendorsPage() {
  const { filteredVendors, stats, tabs, activeTab, setActiveTab } =
    useVendors();

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
          <Text style={styles.statNumber}>{stats.booked}</Text>
          <Text style={styles.statLabel}>Booked</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.available}</Text>
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
          {tabs.map((tab) => (
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
