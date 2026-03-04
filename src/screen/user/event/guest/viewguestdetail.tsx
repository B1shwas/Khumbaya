import { useGetInvitationsForEvent } from "@/src/features/guests/api/use-guests";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    {title ? <Text className="text-base font-semibold text-gray-900 mb-4">{title}</Text> : null}
    {items.map((item, idx) => (
      <View key={idx} className="flex-row items-start mb-4 last:mb-0">
        <View className="w-9 h-9 rounded-full bg-gray-50 items-center justify-center mr-3">
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

const CollapsibleSection = ({
  title,
  children,
  defaultExpanded = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}) => {
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

export default function ViewGuestDetail() {
  const router = useRouter();
  const { eventId: rawEventId, id: guestId, guest: guestParam } = useLocalSearchParams();

  const eventId = useMemo(() => {
    const raw = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;
    return raw ? Number(raw) : null;
  }, [rawEventId]);

  const { data: invitations, isLoading } = useGetInvitationsForEvent(eventId);

  const guest = useMemo(() => {
    if (guestParam) {
      try {
        return JSON.parse(guestParam as string);
      } catch (e) {
        console.error("Failed to parse guest param", e);
      }
    }
    if (invitations && guestId) {
      return invitations.find((inv: any) => String(inv.id) === String(guestId));
    }
    return null;
  }, [guestParam, invitations, guestId]);

  const getStatusColor = (status: string) => {
    const s = (status || "Pending").toLowerCase();
    switch (s) {
      case "accepted":
      case "going":
      case "confirmed":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          border: "border-green-200",
        };
      case "pending":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-700",
          border: "border-yellow-200",
        };
      case "declined":
      case "not going":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          border: "border-red-200",
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
    if (!name) return "GU";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading && !guest) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#EE2B8C" />
      </SafeAreaView>
    );
  }

  if (!guest) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center p-8">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="text-lg text-gray-500 mt-4 mb-6">Guest not found</Text>
          <TouchableOpacity
            className="bg-[#EE2B8C] px-6 py-3 rounded-lg"
            onPress={() => router.back()}
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const displayName = guest.user?.username || guest.fullName || "Guest";
  const displayStatus = guest.status || guest.rsvp_status || "Pending";
  const statusStyle = getStatusColor(displayStatus);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center rounded-full active:bg-gray-100"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1a1b3a" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-[#1a1b3a]">Guest Details</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="bg-white items-center py-8 px-4 mb-4 shadow-sm border-b border-gray-100">
          <View className="mb-4">
            {guest.user?.photo || guest.avatar ? (
              <Image
                source={{ uri: guest.user?.photo || guest.avatar }}
                className="w-24 h-24 rounded-full border-4 border-gray-50"
              />
            ) : (
              <View className="w-24 h-24 rounded-full bg-[#EE2B8C] items-center justify-center shadow-md">
                <Text className="text-white text-3xl font-bold">
                  {getInitials(displayName)}
                </Text>
              </View>
            )}
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
            {displayName}
          </Text>

          <View className={`px-5 py-1.5 rounded-full ${statusStyle.bg} border ${statusStyle.border} shadow-sm`}>
            <Text className={`text-sm font-bold uppercase ${statusStyle.text}`}>
              {displayStatus}
            </Text>
          </View>
        </View>

        {/* Contact info */}
        <InfoCard
          title="Contact Information"
          items={[
            {
              label: "Phone",
              value: guest.user?.phone || guest.phone || "Not provided",
              icon: <Ionicons name="call-outline" size={20} color="#6B7280" />,
            },
            {
              label: "Email",
              value: guest.user?.email || guest.email || "Not provided",
              icon: <Ionicons name="mail-outline" size={20} color="#6B7280" />,
            },
            {
              label: "Relation",
              value: guest.user?.relation || guest.relation || "Not specified",
              icon: <Ionicons name="people-outline" size={20} color="#6B7280" />,
            },
          ]}
        />

        {/* RSVP Details */}
        <CollapsibleSection title="RSVP Details">
          <InfoCard
            title=""
            items={[
              {
                label: "Total Guests",
                value: String(guest.total_guests || guest.totalGuests || 1),
                icon: <Ionicons name="person-add-outline" size={20} color="#6B7280" />,
              },
              {
                label: "Family Invitation",
                value: guest.is_family || guest.isFamily ? "Yes" : "No",
                icon: <Ionicons name="home-outline" size={20} color="#6B7280" />,
              },
            ]}
          />
        </CollapsibleSection>

        {/* Additional Info placeholders */}
        {guest.notes && (
          <CollapsibleSection title="Notes">
            <View className="bg-gray-50 p-4 rounded-xl">
              <Text className="text-gray-700 italic">"{guest.notes}"</Text>
            </View>
          </CollapsibleSection>
        )}

        <View className="h-10" />
      </ScrollView>

      {/* Action Footer if needed */}
      <View className="p-4 bg-white border-t border-gray-100">
        <TouchableOpacity
          className="w-full bg-[#EE2B8C] py-4 rounded-xl items-center shadow-lg"
          onPress={() => {
            // Future extension: Resend invitation or Edit guest
          }}
        >
          <Text className="text-white font-bold text-base">Actions</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}