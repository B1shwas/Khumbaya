import { Text } from "@/src/components/ui/Text";
import {
  Business,
  BusinessCategory,
  BUSINESSES,
  BusinessRequest,
  BusinessReview,
  BusinessService,
} from "@/src/constants/business";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CATEGORY_ICONS: Record<
  BusinessCategory,
  keyof typeof MaterialIcons.glyphMap
> = {
  photography: "photo-camera",
  videography: "videocam",
  decor: "palette",
  catering: "restaurant",
  music: "music-note",
  venue: "location-city",
  makeup: "face",
  florist: "local-florist",
  "wedding-planning": "event",
  other: "storefront",
};

function getBusinessIcon(
  category?: BusinessCategory
): keyof typeof MaterialIcons.glyphMap {
  if (!category) return "storefront";
  return CATEGORY_ICONS[category];
}

const shadowStyle = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  android: { elevation: 2 },
  default: {},
});

// ─── Hero ────────────────────────────────────────────────────────────────────

function HeroSection({
  business,
  onEditPress,
}: {
  business: Business;
  onEditPress: () => void;
}) {
  return (
    <View style={{ height: 210 }} className="w-full">
      <Image
        source={{ uri: business.coverImageUrl ?? business.imageUrl }}
        style={{ width: "100%", height: "100%", position: "absolute" }}
        resizeMode="cover"
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.82)"]}
        start={{ x: 0, y: 0.25 }}
        end={{ x: 0, y: 1 }}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      />

      {/* Edit button */}
      <TouchableOpacity
        onPress={onEditPress}
        activeOpacity={0.8}
        className="absolute top-3 right-3 flex-row items-center gap-1 px-3 py-1.5 rounded-full border border-white/40 bg-black/30"
      >
        <MaterialIcons name="edit" size={13} color="white" />
        <Text variant="h1" className="text-white text-xs">Edit Profile</Text>
      </TouchableOpacity>

      {/* Bottom info */}
      <View className="absolute bottom-0 left-0 right-0 px-4 pb-4">
        <View className="flex-row items-end gap-3">
          <View className="w-14 h-14 rounded-2xl bg-white/20 border-2 border-white/50 items-center justify-center">
            <MaterialIcons name={getBusinessIcon(business.category)} size={28} color="white" />
          </View>
          <View className="flex-1">
            <Text
              variant="h1"
              className="text-white text-lg leading-tight"
              numberOfLines={1}
            >
              {business.name}
            </Text>
            <View className="flex-row items-center gap-1 mt-0.5">
              <MaterialIcons
                name="location-on"
                size={12}
                color="rgba(255,255,255,0.75)"
              />
              <Text className="text-white/75 text-xs">
                {business.location ?? "Location not set"}
              </Text>
              {business.priceTier && (
                <Text className="text-white/60 text-xs ml-2">
                  {business.priceTier}
                </Text>
              )}
            </View>
            {business.rating !== null && (
              <View className="flex-row items-center gap-1 mt-0.5">
                <MaterialIcons name="star" size={12} color="#ee2b8c" />
                <Text variant="h2" className="text-white text-xs">
                  {business.rating}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

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

function StatsRow({ business }: { business: Business }) {
  const views = business.profileViews ?? 0;
  const viewsFormatted =
    views >= 1000 ? `${(views / 1000).toFixed(1)}k` : String(views);

  return (
    <View className="flex-row gap-3">
      <StatCard
        label="Total Bookings"
        value={String(business.totalBookings ?? 0)}
        iconName="event-available"
        iconColor="#ee2b8c"
        bgColor="#fdf2f8"
      />
      <StatCard
        label="Total Earnings"
        value={business.totalEarnings ?? "$0"}
        iconName="payments"
        iconColor="#059669"
        bgColor="#d1fae5"
      />
      <StatCard
        label="Profile Views"
        value={viewsFormatted}
        iconName="visibility"
        iconColor="#2563eb"
        bgColor="#dbeafe"
      />
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

// ─── Portfolio Grid ───────────────────────────────────────────────────────────

function PortfolioGrid({ portfolio }: { portfolio: string[] }) {
  const screenWidth = Dimensions.get("window").width;
  const tileSize = (screenWidth - 32 - 4) / 3;

  return (
    <View
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
      style={shadowStyle}
    >
      <View className="flex-row items-center justify-between px-4 pt-4 pb-3">
        <Text variant="h1" className="text-base text-[#181114]">Portfolio</Text>
        <TouchableOpacity
          activeOpacity={0.85}
          className="flex-row items-center gap-1 bg-primary/10 rounded-full px-3 py-1.5"
        >
          <MaterialIcons name="add-a-photo" size={13} color="#ee2b8c" />
          <Text variant="h1" className="text-primary text-xs">Add Work</Text>
        </TouchableOpacity>
      </View>
      {portfolio.length === 0 ? (
        <View className="py-8 items-center mb-2">
          <MaterialIcons name="photo-library" size={32} color="#d1d5db" />
          <Text className="text-gray-400 text-sm mt-2">
            No portfolio photos yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={portfolio}
          numColumns={3}
          scrollEnabled={false}
          keyExtractor={(_, index) => `portfolio-${index}`}
          columnWrapperStyle={{ gap: 2 }}
          ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.85}>
              <Image
                source={{ uri: item }}
                style={{ width: tileSize, height: tileSize }}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────

function ServiceCard({ service }: { service: BusinessService }) {
  return (
    <View
      className="bg-gray-50 rounded-xl p-3 border border-gray-100 w-full"
    >
      <View className="flex flex-row items-center  justify-between mb-2">

      <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mb-2">
        <MaterialIcons
          name={service.iconName as keyof typeof MaterialIcons.glyphMap}
          size={20}
          color="#ee2b8c"
          />
          </View>
      <Text variant="h2" className="text-xs text-primary mt-0.5">
        {service.price}
      </Text>
      </View>
      <Text variant="h1" className="text-sm text-[#181114]" numberOfLines={1}>
        {service.title}
      </Text>
      <Text className="text-xs text-[#594048] mt-1" numberOfLines={2}>
        {service.description}
      </Text>
    </View>
  );
}

function ServicesSection({ services }: { services: BusinessService[] }) {
  if (services.length === 0) return null;

  return (
    <View
      className="bg-white rounded-2xl border border-gray-100 p-4"
    >
      <Text variant="h1" className="text-base text-[#181114] mb-3">Services</Text>
      <View className="flex-row flex-wrap gap-3">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </View>
    </View>
  );
}

// ─── Availability Calendar ────────────────────────────────────────────────────

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
                  className={`w-7 h-7 rounded-full items-center justify-center ${
                    isBooked
                      ? "bg-primary"
                      : isPending
                      ? "bg-amber-400"
                      : "bg-transparent"
                  }`}
                >
                  <Text
                    variant="h2"
                    className={`text-xs ${
                      isBooked || isPending ? "text-white" : "text-[#181114]"
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

// ─── Latest Review ────────────────────────────────────────────────────────────

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


// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function BusinessDetailsScreen() {
  const { businessId } = useLocalSearchParams<{ businessId: string }>();
  const business = BUSINESSES.find((b) => b.id === businessId);

  if (!business) {
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
        <HeroSection business={business} onEditPress={() => {}} />

        <View className="px-4 gap-4 mt-4">
          {/* <ProfileCompletionCard
            completion={business.profileCompletion ?? 0}
          /> */}
          <StatsRow business={business} />
          <ActiveRequestsSection requests={business.requests ?? []} />
          <PortfolioGrid portfolio={business.portfolio ?? []} />
          <ServicesSection services={business.services ?? []} />
          <AvailabilityCalendar dates={business.availabilityDates} />
          <LatestReviewSection reviews={business.reviews ?? []} />
        </View>
      </ScrollView>
    </View>
  );
}
