import {
  Avatar,
  Badge,
  Card,
  Collapsible,
  ListItem,
  Section,
} from "@/src/components/ui/guest-profile";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FamilyMember, Guest } from "./hooks/useGuests";

interface GuestDetailsScreenProps {
  guest?: Guest;
}

export default function GuestDetailsScreen({
  guest: propGuest,
}: GuestDetailsScreenProps) {
  const router = useRouter();
  const params = useLocalSearchParams();

  const guest =
    propGuest || (params.guest ? JSON.parse(params.guest as string) : null);

  // Helper functions
  const getStatusType = (status: string): "success" | "warning" | "default" => {
    switch (status) {
      case "Going":
      case "Confirmed":
        return "success";
      case "Pending":
        return "warning";
      default:
        return "default";
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "Not specified";
    // Try to format if it looks like a date
    if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = date.split("-");
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${day} ${months[parseInt(month) - 1]} ${year}`;
    }
    return date;
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return "Not specified";
    return `$${amount.toLocaleString()}`;
  };

  // Early return for missing guest
  if (!guest) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center p-8">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="text-lg text-gray-500 mt-4 mb-6">
            Guest not found
          </Text>
          <TouchableOpacity
            className="bg-pink-600 px-6 py-3 rounded-lg"
            onPress={() => router.back()}
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusType = getStatusType(guest.status);
  const showFamilyMembers =
    guest.status === "Going" || guest.status === "Confirmed";

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-700">
          Guest Details
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Guest Profile Card */}
        <Card className="items-center py-6 mb-4">
          <Avatar
            name={guest.name}
            uri={guest.avatar}
            size={80}
            className="mb-3"
          />

          <Text className="text-xl font-bold text-gray-900 mb-2">
            {guest.name}
          </Text>

          <Badge label={guest.status} type={statusType} className="mb-1" />

          {guest.category && (
            <Text className="text-sm text-gray-500 mt-1">{guest.category}</Text>
          )}
        </Card>

        {/* Contact Information */}
        <Section title="Contact Information">
          <Card>
            <ListItem
              label="Phone"
              value={guest.phone || "Not provided"}
              icon={<Ionicons name="call-outline" size={20} color="#6B7280" />}
            />
            <ListItem
              label="Email"
              value={guest.email || "Not provided"}
              icon={<Ionicons name="mail-outline" size={20} color="#6B7280" />}
            />
            <ListItem
              label="Address / Location"
              value={guest.address || guest.location || "Not provided"}
              icon={
                <Ionicons name="location-outline" size={20} color="#6B7280" />
              }
            />
            <ListItem
              label="Gender"
              value={guest.gender || "Not specified"}
              icon={
                <Ionicons name="person-outline" size={20} color="#6B7280" />
              }
            />
          </Card>
        </Section>

        {/* RSVP & Event Details */}
        <Section title="RSVP & Event Details">
          <Card>
            <ListItem
              label="Total Guests"
              value={String(guest.totalGuests || 1)}
              icon={
                <Ionicons name="people-outline" size={20} color="#6B7280" />
              }
            />
            {guest.hasPlusOne && guest.plusOneName && (
              <ListItem
                label="Plus One"
                value={guest.plusOneName}
                icon={
                  <Ionicons
                    name="person-add-outline"
                    size={20}
                    color="#6B7280"
                  />
                }
              />
            )}
            <ListItem
              label="Meal Preference"
              value={
                guest.mealPreference ||
                guest.dietaryRestrictions?.join(", ") ||
                "Not specified"
              }
              icon={
                <Ionicons name="restaurant-outline" size={20} color="#6B7280" />
              }
            />
            <ListItem
              label="Relation"
              value={guest.relation || "Not specified"}
              icon={<Ionicons name="heart-outline" size={20} color="#6B7280" />}
            />
          </Card>
        </Section>

        {/* Travel Details - Collapsible */}
        <Collapsible title="✈️ Travel Details" defaultExpanded>
          <Card>
            <ListItem
              label="Arrival Date"
              value={formatDate(guest.arrivalDate)}
              icon={
                <Ionicons name="airplane-outline" size={20} color="#6B7280" />
              }
            />
            <ListItem
              label="Arrival Location"
              value={guest.arrivalLocation || "Not specified"}
              icon={
                <Ionicons name="location-outline" size={20} color="#6B7280" />
              }
            />
            <ListItem
              label="Departure Date"
              value={formatDate(guest.departureDate)}
              icon={
                <Ionicons
                  name="airplane"
                  size={20}
                  color="#6B7280"
                  style={{ transform: [{ rotate: "180deg" }] }}
                />
              }
            />
            <ListItem
              label="Departure Location"
              value={guest.departureLocation || "Not specified"}
              icon={<Ionicons name="map-outline" size={20} color="#6B7280" />}
            />
          </Card>
        </Collapsible>

        {/* Accommodation - Collapsible */}
        <Collapsible title="🏨 Accommodation" defaultExpanded>
          <Card>
            <ListItem
              label="Room Allocation"
              value={
                guest.roomAllocation
                  ? `${guest.roomType || "Standard"} - ${guest.roomAllocation}`
                  : "Not allocated"
              }
              icon={<Ionicons name="bed-outline" size={20} color="#6B7280" />}
            />
          </Card>
        </Collapsible>

        {/* Gift Information - Collapsible */}
        <Collapsible title="🎁 Gift Information" defaultExpanded>
          <Card>
            <ListItem
              label="Gift Status"
              value={guest.giftStatus || "Pending"}
              icon={<Ionicons name="gift-outline" size={20} color="#6B7280" />}
            />
            {guest.giftAmount && (
              <ListItem
                label="Gift Amount"
                value={formatCurrency(guest.giftAmount)}
                icon={
                  <Ionicons name="cash-outline" size={20} color="#6B7280" />
                }
              />
            )}
            {guest.giftMessage && (
              <ListItem
                label="Gift Message"
                value={guest.giftMessage}
                icon={
                  <Ionicons
                    name="chatbubble-outline"
                    size={20}
                    color="#6B7280"
                  />
                }
              />
            )}
          </Card>
        </Collapsible>

        {/* Family Members - Only show for confirmed guests */}
        {showFamilyMembers &&
          guest.familyMembers &&
          guest.familyMembers.length > 0 && (
            <Collapsible
              title={`👨‍👩‍👧‍👦 Family Members (${guest.familyMembers.length})`}
              defaultExpanded
            >
              {guest.familyMembers.map((member: FamilyMember) => (
                <Card key={member.id} className="flex-row items-center mb-2">
                  <Avatar name={member.name} size={44} className="mr-3" />
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-900">
                      {member.name}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {member.relation}
                    </Text>
                    {member.mealPreference && (
                      <Text className="text-xs text-green-600 mt-0.5">
                        Meal: {member.mealPreference}
                      </Text>
                    )}
                  </View>
                </Card>
              ))}
            </Collapsible>
          )}

        {/* Additional Info */}
        <Section title="Additional Info">
          <Card>
            <ListItem
              label="Source"
              value={
                guest.source === "rsvp"
                  ? "RSVP Form"
                  : guest.source === "manual"
                    ? "Manual Entry"
                    : guest.source === "excel"
                      ? "Excel Import"
                      : "Contact Import"
              }
              icon={
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color="#6B7280"
                />
              }
            />
            {guest.invitedAt && (
              <ListItem
                label="Invited At"
                value={formatDate(guest.invitedAt)}
                icon={
                  <Ionicons name="send-outline" size={20} color="#6B7280" />
                }
              />
            )}
            {guest.createdAt && (
              <ListItem
                label="Added On"
                value={formatDate(guest.createdAt)}
                icon={
                  <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                }
              />
            )}
          </Card>
        </Section>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
