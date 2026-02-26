import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FamilyMember,
  Guest,
} from "../../../../../../src/features/guests/hooks/useGuests";

interface GuestDetailsScreenProps {
  guest?: Guest;
}

interface InfoItem {
  label: string;
  value: string;
  icon: React.ReactNode;
}

interface InfoCardProps {
  title: string;
  items: InfoItem[];
}

const InfoCard = ({ title, items }: InfoCardProps) => (
  <View className="bg-white mb-4 px-4 py-4 rounded-xl shadow-sm">
    <Text className="text-base font-semibold text-gray-900 mb-4">{title}</Text>
    {items.map((item, idx) => (
      <View key={idx} className="flex-row items-start mb-4 last:mb-0">
        <View className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center mr-3">
          {item.icon}
        </View>
        <View className="flex-1">
          <Text className="text-xs text-gray-500 mb-0.5">{item.label}</Text>
          <Text className="text-base font-medium text-gray-900">
            {item.value}
          </Text>
        </View>
      </View>
    ))}
  </View>
);

interface FamilyMemberCardProps {
  member: FamilyMember;
  onUpdateRSVP?: (
    rsvpStatus: "Going" | "Pending" | "Not Going" | "Not Invited"
  ) => void;
}

const FamilyMemberCard = ({ member, onUpdateRSVP }: FamilyMemberCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "Going":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Not Going":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  return (
    <View className="flex-row items-center bg-gray-50 rounded-xl p-3 mb-2">
      <View className="w-11 h-11 rounded-full bg-pink-600 items-center justify-center mr-3">
        <Text className="text-white font-semibold text-base">
          {getInitials(member.name)}
        </Text>
      </View>
      <View className="flex-1">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-base font-semibold text-gray-900">
              {member.name}
            </Text>
            <Text className="text-sm text-gray-500">{member.relation}</Text>
          </View>
          {/* RSVP Status Badge */}
          {member.rsvpStatus && member.rsvpStatus !== "Not Invited" ? (
            <View
              className={`px-2 py-1 rounded-full ${getStatusColor(member.rsvpStatus)}`}
            >
              <Text className="text-xs font-medium">{member.rsvpStatus}</Text>
            </View>
          ) : (
            onUpdateRSVP && (
              <TouchableOpacity
                className="px-3 py-1 rounded-full bg-indigo-100"
                onPress={() => onUpdateRSVP("Pending")}
              >
                <Text className="text-xs font-medium text-indigo-700">
                  Invite
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>
        {member.mealPreference && (
          <Text className="text-xs text-green-600 mt-0.5">
            Meal: {member.mealPreference}
          </Text>
        )}
        {member.dietaryRestrictions &&
          member.dietaryRestrictions.length > 0 && (
            <Text className="text-xs text-orange-600 mt-0.5">
              Dietary: {member.dietaryRestrictions.join(", ")}
            </Text>
          )}
        {/* RSVP Action Buttons */}
        {onUpdateRSVP &&
          member.rsvpStatus &&
          member.rsvpStatus !== "Not Invited" && (
            <View className="flex-row gap-2 mt-2">
              <TouchableOpacity
                className="px-2 py-1 rounded bg-green-500"
                onPress={() => onUpdateRSVP("Going")}
              >
                <Text className="text-xs text-white font-medium">Going</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-2 py-1 rounded bg-yellow-500"
                onPress={() => onUpdateRSVP("Pending")}
              >
                <Text className="text-xs text-white font-medium">Pending</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-2 py-1 rounded bg-red-500"
                onPress={() => onUpdateRSVP("Not Going")}
              >
                <Text className="text-xs text-white font-medium">Can't Go</Text>
              </TouchableOpacity>
            </View>
          )}
      </View>
    </View>
  );
};

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const CollapsibleSection = ({
  title,
  children,
  defaultExpanded = true,
}: CollapsibleSectionProps) => {
  const [collapsed, setCollapsed] = useState(!defaultExpanded);

  return (
    <View className="mb-4 bg-white rounded-xl shadow-sm">
      <TouchableOpacity
        className="px-4 py-3 flex-row justify-between items-center"
        onPress={() => setCollapsed(!collapsed)}
        activeOpacity={0.7}
      >
        <Text className="font-semibold text-gray-900">{title}</Text>
        <Ionicons
          name={collapsed ? "chevron-down" : "chevron-up"}
          size={20}
          color="#6B7280"
        />
      </TouchableOpacity>
      {!collapsed && <View className="px-4 pb-4">{children}</View>}
    </View>
  );
};

export default function GuestDetailsScreen({
  guest: propGuest,
}: GuestDetailsScreenProps) {
  const router = useRouter();
  const params = useLocalSearchParams();

  const initialGuest =
    propGuest || (params.guest ? JSON.parse(params.guest as string) : null);

  // Local state to track guest updates
  const [guest, setGuest] = useState<Guest | null>(initialGuest);

  // Update family member RSVP status
  const handleFamilyMemberRSVP = (
    familyMemberId: string,
    rsvpStatus: "Going" | "Pending" | "Not Going" | "Not Invited"
  ) => {
    if (!guest || !guest.familyMembers) return;

    setGuest((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        familyMembers: prev.familyMembers?.map((member) =>
          member.id === familyMemberId ? { ...member, rsvpStatus } : member
        ),
      };
    });
  };

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Going":
      case "Confirmed":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          border: "border-green-200",
        };
      case "Pending":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-700",
          border: "border-yellow-200",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
          border: "border-gray-200",
        };
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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

  const statusStyle = getStatusColor(guest.status);
  const showFamilyMembers = guest.status === "Going";

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
        <View className="bg-white items-center py-6 px-4 mb-4 shadow-sm">
          <View className="mb-3">
            {guest.avatar ? (
              <Image
                source={{ uri: guest.avatar }}
                className="w-20 h-20 rounded-full"
              />
            ) : (
              <View className="w-20 h-20 rounded-full bg-pink-600 items-center justify-center shadow-md">
                <Text className="text-white text-2xl font-semibold">
                  {getInitials(guest.name)}
                </Text>
              </View>
            )}
          </View>
          <Text className="text-xl font-bold text-gray-900 mb-2">
            {guest.name}
          </Text>

          {/* Status Badge with shadow */}
          <View
            className={`px-4 py-1.5 rounded-full ${statusStyle.bg} border ${statusStyle.border} mb-1 shadow-sm`}
          >
            <Text className={`text-sm font-semibold ${statusStyle.text}`}>
              {guest.status}
            </Text>
          </View>

          {guest.category && (
            <Text className="text-sm text-gray-500 mt-1">{guest.category}</Text>
          )}
        </View>
        {/* Contact Information */}
        <InfoCard
          title="Contact Information"
          items={[
            {
              label: "Phone",
              value: guest.phone || "Not provided",
              icon: <Ionicons name="call-outline" size={20} color="#6B7280" />,
            },
            {
              label: "Email",
              value: guest.email || "Not provided",
              icon: <Ionicons name="mail-outline" size={20} color="#6B7280" />,
            },
            {
              label: "Address / Location",
              value: guest.address || guest.location || "Not provided",
              icon: (
                <Ionicons name="location-outline" size={20} color="#6B7280" />
              ),
            },
            {
              label: "Gender",
              value: guest.gender || "Not specified",
              icon: (
                <Ionicons name="person-outline" size={20} color="#6B7280" />
              ),
            },
          ]}
        />
        {/* RSVP & Event Details */}
        <InfoCard
          title="RSVP & Event Details"
          items={[
            {
              label: "Total Guests",
              value: String(guest.totalGuests || 1),
              icon: (
                <Ionicons name="people-outline" size={20} color="#6B7280" />
              ),
            },
            ...(guest.hasPlusOne && guest.plusOneName
              ? [
                  {
                    label: "Plus One",
                    value: guest.plusOneName,
                    icon: (
                      <Ionicons
                        name="person-add-outline"
                        size={20}
                        color="#6B7280"
                      />
                    ),
                  },
                ]
              : []),
            {
              label: "Meal Preference",
              value:
                guest.mealPreference ||
                guest.dietaryRestrictions?.join(", ") ||
                "Not specified",
              icon: (
                <Ionicons name="restaurant-outline" size={20} color="#6B7280" />
              ),
            },
            {
              label: "Relation",
              value: guest.relation || "Not specified",
              icon: <Ionicons name="heart-outline" size={20} color="#6B7280" />,
            },
          ]}
        />
        {/* Travel Details - Collapsible */}
        <CollapsibleSection title="✈️ Travel Details">
          <InfoCard
            title=""
            items={[
              {
                label: "Arrival Date",
                value: formatDate(guest.arrivalDate),
                icon: (
                  <Ionicons name="airplane-outline" size={20} color="#6B7280" />
                ),
              },
              {
                label: "Arrival Location",
                value: guest.arrivalLocation || "Not specified",
                icon: (
                  <Ionicons name="location-outline" size={20} color="#6B7280" />
                ),
              },
              {
                label: "Departure Date",
                value: formatDate(guest.departureDate),
                icon: (
                  <Ionicons
                    name="airplane"
                    size={20}
                    color="#6B7280"
                    style={{ transform: [{ rotate: "180deg" }] }}
                  />
                ),
              },
              {
                label: "Departure Location",
                value: guest.departureLocation || "Not specified",
                icon: <Ionicons name="map-outline" size={20} color="#6B7280" />,
              },
            ]}
          />
        </CollapsibleSection>
        {/* Accommodation - Collapsible */}
        <CollapsibleSection title="🏨 Accommodation">
          <InfoCard
            title=""
            items={[
              {
                label: "Room Allocation",
                value: guest.roomAllocation
                  ? `${guest.roomType || "Standard"} - ${guest.roomAllocation}`
                  : "Not allocated",
                icon: <Ionicons name="bed-outline" size={20} color="#6B7280" />,
              },
            ]}
          />
        </CollapsibleSection>
        Gift Information - Collapsible
        <CollapsibleSection title="🎁 Gift Information">
          <InfoCard
            title=""
            items={[
              {
                label: "Gift Status",
                value: guest.giftStatus || "Pending",
                icon: (
                  <Ionicons name="gift-outline" size={20} color="#6B7280" />
                ),
              },
              ...(guest.giftAmount
                ? [
                    {
                      label: "Gift Amount",
                      value: formatCurrency(guest.giftAmount),
                      icon: (
                        <Ionicons
                          name="cash-outline"
                          size={20}
                          color="#6B7280"
                        />
                      ),
                    },
                  ]
                : []),
              ...(guest.giftMessage
                ? [
                    {
                      label: "Gift Message",
                      value: guest.giftMessage,
                      icon: (
                        <Ionicons
                          name="chatbubble-outline"
                          size={20}
                          color="#6B7280"
                        />
                      ),
                    },
                  ]
                : []),
            ]}
          />
        </CollapsibleSection>
        {/* Family Members - Only show for confirmed guests */}
        {showFamilyMembers &&
          guest.familyMembers &&
          guest.familyMembers.length > 0 && (
            <CollapsibleSection
              title={`👨‍👩‍👧‍👦 Family Members (${guest.familyMembers.length})`}
            >
              {guest.familyMembers.map((member: FamilyMember) => (
                <FamilyMemberCard
                  key={member.id}
                  member={member}
                  onUpdateRSVP={(rsvpStatus) =>
                    handleFamilyMemberRSVP(member.id, rsvpStatus)
                  }
                />
              ))}
            </CollapsibleSection>
          )}
        {/* Additional Info */}
        <InfoCard
          title="Additional Info"
          items={[
            {
              label: "Source",
              value:
                guest.source === "rsvp"
                  ? "RSVP Form"
                  : guest.source === "manual"
                    ? "Manual Entry"
                    : guest.source === "excel"
                      ? "Excel Import"
                      : "Contact Import",
              icon: (
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color="#6B7280"
                />
              ),
            },
            ...(guest.invitedAt
              ? [
                  {
                    label: "Invited At",
                    value: formatDate(guest.invitedAt),
                    icon: (
                      <Ionicons name="send-outline" size={20} color="#6B7280" />
                    ),
                  },
                ]
              : []),
            ...(guest.createdAt
              ? [
                  {
                    label: "Added On",
                    value: formatDate(guest.createdAt),
                    icon: (
                      <Ionicons
                        name="calendar-outline"
                        size={20}
                        color="#6B7280"
                      />
                    ),
                  },
                ]
              : []),
          ]}
        />
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
