import { HeroSection } from "@/src/components/business/[businessId]/Hero";
import ServiceDetailsSection from "@/src/components/business/[businessId]/ServiceDetailsScreen";
import { StatsRow } from "@/src/components/business/[businessId]/stats/StatsRow";
import VenueDetailsSection from "@/src/components/business/[businessId]/VenueDetailsSection";
import { Text } from "@/src/components/ui/Text";
import {
  BusinessRequest,
  BusinessReview,
  OtherServiceAttribute,
  VenueAttribute
} from "@/src/constants/business";
import { useDeleteBusiness, useGetBusinessById } from "@/src/features/business";
import { useBusinessDraftStore } from "@/src/features/business/store/useBusiness";
import { shadowStyle } from "@/src/utils/helper";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Hero ────────────────────────────────────────────────────────────────────



// ─── Profile Completion ───────────────────────────────────────────────────────

// function ProfileCompletionCard({ completion }: { completion: number }) {
//   return (
//     <View
//       className="bg-white rounded-2xl p-4 border border-gray-100"
//       style={shadowStyle}
//     >
//       <View className="flex-row justify-between items-center mb-2">
//         <Text className="text-sm font-bold text-[#181114]">
//           Profile Completion
//         </Text>
//         <Text className="text-sm font-extrabold text-primary">
//           {completion}%
//         </Text>
//       </View>
//       <View className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
//         <View
//           className="h-2 bg-primary rounded-full"
//           style={{ width: `${completion}%` }}
//         />
//       </View>
//       <Text className="text-xs text-[#594048] mb-3">
//         Add your services, portfolio photos, and availability to attract more
//         clients.
//       </Text>
//       <TouchableOpacity
//         activeOpacity={0.85}
//         className="bg-primary rounded-xl py-2.5 items-center"
//       >
//         <Text className="text-white text-sm font-bold">Complete Profile</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// ─── Stats ────────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  iconName,
  iconColor,
  bgColor,
}: {
  label: string;
  value: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
  bgColor: string;
}) {
  return (
    <View
      className="flex-1 rounded-md p-3 border border-gray-100"
      style={[shadowStyle, { backgroundColor: bgColor }]}
    >
      <MaterialIcons name={iconName} size={20} color={iconColor} />
      <Text
        variant="h1"
        className="text-lg mt-1"
        style={{ color: iconColor }}
      >
        {value}
      </Text>
      <Text
        variant="caption"
        className="text-[10px] text-[#594048] mt-0.5"
        numberOfLines={2}
      >
        {label}
      </Text>
    </View>
  );
}

// ─── Active Requests ──────────────────────────────────────────────────────────

function RequestCard({ request }: { request: BusinessRequest }) {
  const isPending = request.status === "pending";

  return (
    <View className="px-4 py-3 border-b border-gray-50">
      <View className="flex-row items-center gap-3">
        <Image
          source={{ uri: request.clientAvatarUrl }}
          className="w-10 h-10 rounded-full bg-gray-100"
          resizeMode="cover"
        />
        <View className="flex-1">
          <Text variant="h1" className="text-sm text-[#181114]">
            {request.clientName}
          </Text>
          <Text className="text-xs text-[#594048]">{request.eventType}</Text>
          <View className="flex-row items-center gap-1 mt-0.5">
            <MaterialIcons name="calendar-today" size={11} color="#9ca3af" />
            <Text className="text-[11px] text-gray-400">{request.date}</Text>
          </View>
        </View>
        {isPending ? (
          <View className="flex-row gap-2">
            <TouchableOpacity
              activeOpacity={0.85}
              className="bg-primary rounded-lg px-3 py-1.5"
            >
              <Text variant="h1" className="text-white text-xs">Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              className="bg-gray-100 rounded-lg px-3 py-1.5"
            >
              <Text variant="h1" className="text-gray-500 text-xs">Reject</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="bg-emerald-100 rounded-full px-3 py-1">
            <Text variant="h1" className="text-emerald-600 text-xs">
              Confirmed
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

function ActiveRequestsSection({ requests }: { requests: BusinessRequest[] }) {
  return (
    <View
      className="bg-white rounded-md border border-gray-100 overflow-hidden"
      style={shadowStyle}
    >
      <View className="flex-row items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100">
        <Text variant="h1" className="text-base text-[#181114]">
          Active Requests
        </Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text variant="h1" className="text-xs text-primary">View All</Text>
        </TouchableOpacity>
      </View>
      {requests.length === 0 ? (
        <View className="py-8 items-center">
          <MaterialIcons name="inbox" size={32} color="#d1d5db" />
          <Text className="text-gray-400 text-sm mt-2">
            No pending requests
          </Text>
        </View>
      ) : (
        requests.map((req) => <RequestCard key={req.id} request={req} />)
      )}
    </View>
  );
}

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function AvailabilityCalendar({
  dates,
}: {
  dates?: { booked: number[]; pending: number[] };
}) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const monthName = now.toLocaleString("default", { month: "long" });

  const cells: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = Array.from({ length: cells.length / 7 }, (_, i) =>
    cells.slice(i * 7, i * 7 + 7)
  );

  return (
    <View
      className="bg-white rounded-md border border-gray-100 p-4"
      style={shadowStyle}
    >
      <View className="flex-row items-center justify-between mb-3">
        <Text variant="h1" className="text-base text-[#181114]">Availability</Text>
        <Text variant="h2" className="text-xs text-[#594048]">
          {monthName} {year}
        </Text>
      </View>

      {/* Day labels */}
      <View className="flex-row mb-1">
        {DAY_LABELS.map((d, i) => (
          <View key={i} style={{ flex: 1, alignItems: "center" }}>
            <Text variant="h1" className="text-[10px] text-gray-400">{d}</Text>
          </View>
        ))}
      </View>

      {/* Weeks */}
      {weeks.map((week, wi) => (
        <View key={wi} className="flex-row mb-1">
          {week.map((day, di) => {
            if (day === null) return <View key={di} style={{ flex: 1 }} />;
            const isBooked = dates?.booked.includes(day);
            const isPending = dates?.pending.includes(day);
            return (
              <View key={di} style={{ flex: 1, alignItems: "center" }}>
                <View
                  className={`w-7 h-7 rounded-full items-center justify-center ${isBooked
                    ? "bg-primary"
                    : isPending
                      ? "bg-amber-400"
                      : "bg-transparent"
                    }`}
                >
                  <Text
                    variant="h2"
                    className={`text-xs ${isBooked || isPending ? "text-white" : "text-[#181114]"
                      }`}
                  >
                    {day}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      ))}

      {/* Legend */}
      <View className="flex-row gap-4 mt-2 pt-2 border-t border-gray-100">
        <View className="flex-row items-center gap-1.5">
          <View className="w-3 h-3 rounded-full bg-primary" />
          <Text className="text-xs text-[#594048]">Booked</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <View className="w-3 h-3 rounded-full bg-amber-400" />
          <Text className="text-xs text-[#594048]">Pending</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <View className="w-3 h-3 rounded-full bg-gray-200" />
          <Text className="text-xs text-[#594048]">Available</Text>
        </View>
      </View>
    </View>
  );
}


function LatestReviewSection({ reviews }: { reviews: BusinessReview[] }) {
  if (reviews.length === 0) return null;
  const review = reviews[0];
  return (
    <View
      className="bg-white rounded-md border border-gray-100 p-4"
      style={shadowStyle}
    >
      <Text variant="h1" className="text-base text-[#181114] mb-3">
        Latest Review
      </Text>
      <View className="flex-row gap-0.5 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <MaterialIcons
            key={star}
            name="star"
            size={16}
            color={star <= review.rating ? "#ee2b8c" : "#e5e7eb"}
          />
        ))}
      </View>
      <Text className="text-sm text-[#594048] italic mb-3 leading-5">
        "{review.quote}"
      </Text>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Image
            source={{ uri: review.reviewerAvatarUrl }}
            className="w-8 h-8 rounded-full bg-gray-100"
            resizeMode="cover"
          />
          <View>
            <Text variant="h1" className="text-xs text-[#181114]">
              {review.reviewerName}
            </Text>
            <Text className="text-[10px] text-gray-400">{review.date}</Text>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-row items-center gap-1 border border-gray-200 rounded-full px-3 py-1.5"
        >
          <MaterialIcons name="reply" size={13} color="#594048" />
          <Text variant="h2" className="text-xs text-[#594048]">Reply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


export default function BusinessDetailsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { businessId } = useLocalSearchParams<{ businessId: string }>();
  const { data: businessWithAttribute, isLoading } = useGetBusinessById(businessId ?? "");
  const deleteBusiness = useDeleteBusiness();
  const setBusinessDraft = useBusinessDraftStore((state) => state.setBusiness);
  const clearBusinessDraft = useBusinessDraftStore((state) => state.clearBusiness);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    clearBusinessDraft();
  }, [clearBusinessDraft]);

  const handleEditPress = () => {
    if (!businessWithAttribute?.business_information) return;
    setBusinessDraft(businessWithAttribute.business_information);
    router.push({
      pathname: "/(protected)/(client-tabs)/business/[businessId]/edit" as never,
      params: {
        businessId: String(businessWithAttribute.business_information.id),
      },
    });
  };


  const handleDelete = () => {
    if (!businessWithAttribute) return;
    Alert.alert(
      "Delete Business",
      `Are you sure you want to delete "${businessWithAttribute.business_information.business_name}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteBusiness.mutate(businessId!, {
              onSuccess: () => {
                Alert.alert("Deleted", "Business deleted successfully.", [
                  { text: "OK", onPress: () => router.back() },
                ]);
              },
              onError: () => {
                Alert.alert("Error", "Failed to delete business. Please try again.");
              },
            });
          },
        },
      ]
    );
  };

  const handleEditVenuePress = (venue: VenueAttribute) => {
    if (!businessWithAttribute?.business_information?.id || !venue?.venue_id) {
      console.log('This is the venue if of the informarion',venue)
      return;
    }
    console.log("Thgis is the edit venue page in the ui to edit the venue for the business in the section for this 🐮🐮🐮🐮🐮🐮" , {
      businessId:String(businessWithAttribute.business_information.id),
      venueId:String(venue.venue_id),
    });
    router.push({
      pathname: "/business/[businessId]/venue/[venueId]/update",
      params: {
        businessId: String(businessWithAttribute.business_information.id),
        venueId: String(venue.venue_id),
        mode: "edit",
      },
    });
  };

  const handleAddVenuePress = () => {
    if (!businessWithAttribute?.business_information?.id) return;
    router.push({
      pathname:`/business/[businessId]/venue/create` ,
      params:{
        businessId: String(businessWithAttribute.business_information.id),
        mode:"create",

      }}
    );
  };

  const handleEditServicePress = (service: OtherServiceAttribute) => {
    if (!businessWithAttribute?.business_information?.id || !service?.id) {
      return;
    }

    router.push({
      pathname: "/business/[businessId]/service/[serviceId]/update",
      params: {
        businessId: String(businessWithAttribute.business_information.id),
        serviceId: String(service.id),
        mode: "edit",
      },
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#f8f6f7] items-center justify-center">
        <ActivityIndicator color="#ee2b8c" />
      </SafeAreaView>
    );
  }

  if (!businessWithAttribute) {
    return (
      <SafeAreaView className="flex-1 bg-[#f8f6f7] items-center justify-center">
        <MaterialIcons name="storefront" size={48} color="#d1d5db" />
        <Text variant="h2" className="text-[#594048] mt-3 text-base">
          Business not found
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-[#f8f6f7]">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <HeroSection 
        onEditPress={handleEditPress}
          business={businessWithAttribute.business_information}
        />

        <View className="px-4 gap-4 mt-4">
          <StatsRow business={businessWithAttribute.business_information} />
          <ActiveRequestsSection requests={businessWithAttribute.business_information.requests ?? []} />

          {/* Category-specific details (from constants) */}
          {businessWithAttribute.business_information.category === "Venue" && (
            <VenueDetailsSection
              venues={businessWithAttribute.venue_information}
              onEditVenue={handleEditVenuePress}
              onAddVenue={handleAddVenuePress}
            />
          )}
          {businessWithAttribute.business_information.category !== "Venue" && businessWithAttribute.business_information.category != null && (
            <ServiceDetailsSection
              service={
                businessWithAttribute.vendor_services_information?.[0] ?? {
                  id: 0,
                  business_id: businessWithAttribute.business_information.id,
                  artist_type: null,
                  styles_specialized: null,
                  max_bookings_per_day: null,
                  advance_amount: null,
                  uses_own_material: false,
                  travel_charges: null,
                  portfolio_link: null,
                  available_for_destination: false,
                  customization_available: false,
                  serves_veg: false,
                  min_order: null,
                  createdAt: "",
                  updatedAt: "",
                }
              }
              onEdit={
                businessWithAttribute.vendor_services_information?.[0]
                  ? () => handleEditServicePress(businessWithAttribute.vendor_services_information[0])
                  : undefined
              }
            />
          )}

          {/* <PortfolioGrid portfolio={business.portfolio ?? []} /> */}
          <AvailabilityCalendar dates={businessWithAttribute.business_information.availabilityDates} />
          <LatestReviewSection reviews={businessWithAttribute.business_information.reviews ?? []} />

          {/* Danger Zone */}
          <View className="flex-row items-center justify-between rounded-2xl border border-red-200 bg-red-50 p-4">
            <View>
              <Text variant="h1" className="text-sm text-red-600">
                Delete Business
              </Text>
              <Text className="text-[11px] text-red-400">
                This action cannot be undone.
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleDelete}
              activeOpacity={0.8}
              className="rounded-lg px-4 py-2"
            >
              <Text variant="h1" className="text-xs uppercase tracking-widest text-red-600">
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Dropdown menu overlay */}
    
    </View>
  );
}
