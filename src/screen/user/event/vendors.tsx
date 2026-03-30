import {
  useContactVendor,
  useGetVendorList,
  useHireVendor,
} from "@/src/features/vendor/hooks/use-vendor";
import type { Vendor } from "@/src/features/vendor/types";
import { Ionicons } from "@expo/vector-icons";
import {
  router,
  useLocalSearchParams,
  type RelativePathString,
} from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const VendorCard = ({
  vendor,
  onHire,
  onContact,
}: {
  vendor: Vendor;
  onHire: (vendor: Vendor) => void;
  onContact: (vendor: Vendor) => void;
}) => (
  <TouchableOpacity
    className="bg-white rounded-2xl overflow-hidden shadow-lg flex-row items-center"
    onPress={() =>
      router.push(`/events/vendors/${vendor.id}` as RelativePathString)
    }
    activeOpacity={0.8}
  >
    <View className="w-[100px] h-[100px] relative">
      {vendor.imageUrl ? (
        <Image
          source={{ uri: vendor.imageUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-full bg-gray-100 items-center justify-center">
          <Ionicons name="storefront" size={32} color="#9CA3AF" />
        </View>
      )}
      <View
        className={`absolute top-2 left-2 px-2 py-1 rounded-xl ${
          vendor.status === "booked"
            ? "bg-green-100"
            : vendor.status === "pending"
              ? "bg-orange-100"
              : "bg-blue-100"
        }`}
      >
        <Text
          className={`text-[10px] font-semibold capitalize ${
            vendor.status === "booked"
              ? "text-green-600"
              : vendor.status === "pending"
                ? "text-orange-600"
                : "text-blue-600"
          }`}
        >
          {vendor.status}
        </Text>
      </View>
    </View>

    <View className="flex-1 p-3">
      <Text className="text-base font-semibold text-[#181114]">
        {vendor.name}
      </Text>
      <Text className="text-xs text-gray-500 mt-0.5">{vendor.category}</Text>

      <View className="flex-row items-center gap-3 mt-1.5">
        {vendor.rating && (
          <View className="flex-row items-center gap-1">
            <Ionicons name="star" size={14} color="#F59E0B" fill="#F59E0B" />
            <Text className="text-xs font-medium text-amber-500">
              {vendor.rating}
            </Text>
          </View>
        )}
        {vendor.price && (
          <Text className="text-xs font-semibold text-emerald-500">
            {vendor.price}
          </Text>
        )}
      </View>
    </View>

    <View className="pr-3">
      {vendor.status === "available" ? (
        <View className="flex-col gap-2">
          <TouchableOpacity
            className="bg-[#ee2b8c] px-3 py-1.5 rounded-lg flex-row items-center gap-1"
            onPress={() => onHire(vendor)}
          >
            <Ionicons name="briefcase-outline" size={16} color="white" />
            <Text className="text-white text-xs font-semibold">Hire</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-white px-3 py-1.5 rounded-lg border border-[#ee2b8c] flex-row items-center gap-1"
            onPress={() => onContact(vendor)}
          >
            <Ionicons name="chatbubble-outline" size={16} color="#ee2b8c" />
            <Text className="text-[#ee2b8c] text-xs font-semibold">
              Contact
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          className="p-2"
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
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const [activeTab, setActiveTab] = useState<
    "all" | "booked" | "pending" | "available"
  >("all");
  const [refreshing, setRefreshing] = useState(false);

  const { data: vendors, isLoading, isError, refetch } = useGetVendorList();
  const hireVendorMutation = useHireVendor();
  const contactVendorMutation = useContactVendor();

  const vendorList = Array.isArray(vendors) ? vendors : [];

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const filteredVendors = vendorList.filter((vendor) => {
    if (activeTab === "all") return true;
    return vendor.status === activeTab;
  });

  const bookedCount = vendorList.filter((v) => v.status === "booked").length;
  const pendingCount = vendorList.filter((v) => v.status === "pending").length;
  const availableCount = vendorList.filter(
    (v) => v.status === "available"
  ).length;

  const handleHire = (vendor: Vendor) => {
    Alert.alert(
      "Hire Vendor",
      `Are you sure you want to hire ${vendor.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Hire",
          onPress: async () => {
            try {
              await hireVendorMutation.mutateAsync({
                vendorId: vendor.id,
                eventId: eventId || "",
              });
              Alert.alert("Success", `${vendor.name} has been hired!`);
              refetch();
            } catch (error) {
              Alert.alert("Error", "Failed to hire vendor. Please try again.");
            }
          },
        },
      ]
    );
  };

  const handleContact = (vendor: Vendor) => {
    Alert.alert(
      "Contact Vendor",
      `How would you like to contact ${vendor.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Message",
          onPress: async () => {
            try {
              await contactVendorMutation.mutateAsync({
                vendorId: vendor.id,
                message: "Hello, I'm interested in your services.",
                contactType: "message",
              });
              Alert.alert("Success", "Message sent successfully!");
            } catch (error) {
              Alert.alert("Error", "Failed to send message. Please try again.");
            }
          },
        },
        {
          text: "Call",
          onPress: () => {
            if (vendor.contact) {
              Alert.alert("Call Vendor", `Call ${vendor.contact}?`);
            } else {
              Alert.alert("No Contact", "No contact number available.");
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#f8f6f7]" edges={["bottom"]}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#ee2b8c" />
          <Text className="mt-3 text-sm text-gray-500">Loading vendors...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-[#f8f6f7]" edges={["bottom"]}>
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="text-lg font-semibold text-gray-500 mt-4">
            Failed to load vendors
          </Text>
          <Text className="text-sm text-gray-400 mt-1 text-center">
            Pull down to try again
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#f8f6f7]" edges={["bottom"]}>
      {/* Stats Row */}
      <View className="flex-row px-4 py-3 gap-3">
        <View className="flex-1 bg-white rounded-xl p-3 items-center shadow-sm">
          <Text className="text-2xl font-bold text-[#ee2b8c]">
            {bookedCount}
          </Text>
          <Text className="text-xs text-gray-500 mt-0.5">Booked</Text>
        </View>
        <View className="flex-1 bg-white rounded-xl p-3 items-center shadow-sm">
          <Text className="text-2xl font-bold text-[#ee2b8c]">
            {pendingCount}
          </Text>
          <Text className="text-xs text-gray-500 mt-0.5">Pending</Text>
        </View>
        <View className="flex-1 bg-white rounded-xl p-3 items-center shadow-sm">
          <Text className="text-2xl font-bold text-[#ee2b8c]">
            {availableCount}
          </Text>
          <Text className="text-xs text-gray-500 mt-0.5">Available</Text>
        </View>
      </View>

      {/* Tabs */}
      <View className="bg-white border-b border-gray-200">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4 py-2 gap-2"
        >
          {(["all", "booked", "pending", "available"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              className={`px-4 py-2 rounded-full ${
                activeTab === tab ? "bg-[#ee2b8c]" : "bg-gray-100"
              }`}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                className={`text-sm font-medium ${
                  activeTab === tab ? "text-white" : "text-gray-500"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Vendor List */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, gap: 12 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ee2b8c"
          />
        }
      >
        {filteredVendors.map((vendor) => (
          <VendorCard
            key={vendor.id}
            vendor={vendor}
            onHire={handleHire}
            onContact={handleContact}
          />
        ))}

        {filteredVendors.length === 0 && (
          <View className="items-center justify-center py-16">
            <Ionicons name="storefront-outline" size={64} color="#D1D5DB" />
            <Text className="text-lg font-semibold text-gray-500 mt-4">
              No vendors found
            </Text>
            <Text className="text-sm text-gray-400 mt-1">
              Try adjusting your filters
            </Text>
          </View>
        )}

        {/* Bottom spacer for FAB */}
        <View className="h-20" />
      </ScrollView>

      {/* Floating Action Button: Add Vendor */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-[#ee2b8c] items-center justify-center shadow-lg"
        onPress={() => router.push("/(shared)/explore/explore")}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
