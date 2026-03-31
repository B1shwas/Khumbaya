import { Text } from "@/src/components/ui/Text";
import {
  Business,
  BusinessRequest,
  BusinessReview,
  BusinessService,
  VenueAttribute,
  OtherServiceAttribute,
  MOCK_VENUE_ATTRIBUTES,
  MOCK_SERVICE_ATTRIBUTE,
} from "@/src/constants/business";
import { getBusinessIcon } from "@/src/constants/business-icons";
import { useGetBusinessById, useDeleteBusiness } from "@/src/features/business";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
        source={{ uri: business.cover ?? business.avatar ?? undefined }}
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
            <MaterialIcons name={getBusinessIcon(business.category ?? undefined)} size={28} color="white" />
          </View>
          <View className="flex-1">
            <Text
              variant="h1"
              className="text-white text-lg leading-tight"
              numberOfLines={1}
            >
              {business.business_name}
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
              {business.price_starting_from != null && (
                <Text className="text-white/60 text-xs ml-2">
                  From {business.price_starting_from.toLocaleString()}
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


// ─── Venue Details ────────────────────────────────────────────────────────────

function AmenityChip({
  icon,
  label,
  active,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  active: boolean;
}) {
  if (!active) return null;
  return (
    <View className="flex-row items-center gap-1 bg-primary/10 rounded-full px-2.5 py-1">
      <MaterialIcons name={icon} size={12} color="#ee2b8c" />
      <Text className="text-[10px] text-primary">{label}</Text>
    </View>
  );
}

function VenueCard({ venue, onEdit }: { venue: VenueAttribute; onEdit: () => void }) {
  const amenities: Array<{
    icon: keyof typeof MaterialIcons.glyphMap;
    label: string;
    active: boolean;
  }> = [
    { icon: "restaurant", label: "Catering", active: venue.has_catering },
    { icon: "tv", label: "AV Equipment", active: venue.has_av_equipment },
    { icon: "wb-sunny", label: "Outdoor", active: venue.is_outDoor },
    { icon: "local-parking", label: "Parking", active: venue.parking },
    { icon: "directions-car", label: "Valet", active: venue.valet_available },
    { icon: "local-bar", label: "Alcohol Allowed", active: venue.alcohol_allowed },
  ];
  const activeAmenities = amenities.filter((a) => a.active);

  return (
    <View
      className="bg-white rounded-2xl border border-gray-100 p-4 mb-3"
      style={shadowStyle}
    >
      {/* Top row: venue type + price + edit */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2 flex-1">
          <View className="w-9 h-9 rounded-xl bg-primary/10 items-center justify-center">
            <MaterialIcons name="meeting-room" size={18} color="#ee2b8c" />
          </View>
          <View>
            <Text variant="h1" className="text-sm text-[#181114]">
              {venue.venue_type ?? "Venue"}
            </Text>
            {venue.capacity != null && (
              <Text className="text-[10px] text-[#594048]">
                Up to {venue.capacity} guests
              </Text>
            )}
          </View>
        </View>
        <View className="flex-row items-center gap-2">
          {venue.price_per_hour != null && (
            <View className="items-end">
              <Text variant="h1" className="text-primary text-base">
                ₹{venue.price_per_hour.toLocaleString()}
              </Text>
              <Text className="text-[10px] text-gray-400">per hour</Text>
            </View>
          )}
          <TouchableOpacity
            onPress={onEdit}
            activeOpacity={0.75}
            className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
          >
            <MaterialIcons name="edit" size={15} color="#594048" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats grid */}
      <View className="flex-row gap-2 mb-3">
        {venue.area_sqft != null && (
          <View className="flex-1 bg-gray-50 rounded-xl p-2.5 items-center">
            <MaterialIcons name="straighten" size={16} color="#594048" />
            <Text variant="h1" className="text-xs text-[#181114] mt-1">
              {venue.area_sqft.toLocaleString()} sqft
            </Text>
            <Text className="text-[9px] text-gray-400">Area</Text>
          </View>
        )}
        {venue.rooms_available != null && (
          <View className="flex-1 bg-gray-50 rounded-xl p-2.5 items-center">
            <MaterialIcons name="hotel" size={16} color="#594048" />
            <Text variant="h1" className="text-xs text-[#181114] mt-1">
              {venue.rooms_available}
            </Text>
            <Text className="text-[9px] text-gray-400">Rooms</Text>
          </View>
        )}
        {(venue.min_booking_hours != null || venue.max_booking_hours != null) && (
          <View className="flex-1 bg-gray-50 rounded-xl p-2.5 items-center">
            <MaterialIcons name="schedule" size={16} color="#594048" />
            <Text variant="h1" className="text-xs text-[#181114] mt-1">
              {venue.min_booking_hours ?? "—"}–{venue.max_booking_hours ?? "—"}h
            </Text>
            <Text className="text-[9px] text-gray-400">Booking Hrs</Text>
          </View>
        )}
        {venue.sound_limit_db != null && (
          <View className="flex-1 bg-gray-50 rounded-xl p-2.5 items-center">
            <MaterialIcons name="volume-up" size={16} color="#594048" />
            <Text variant="h1" className="text-xs text-[#181114] mt-1">
              {venue.sound_limit_db} dB
            </Text>
            <Text className="text-[9px] text-gray-400">Sound Limit</Text>
          </View>
        )}
      </View>

      {/* Amenity chips */}
      {activeAmenities.length > 0 && (
        <View className="flex-row flex-wrap gap-1.5 pt-2 border-t border-gray-100">
          {activeAmenities.map((a) => (
            <AmenityChip key={a.label} icon={a.icon} label={a.label} active />
          ))}
        </View>
      )}
    </View>
  );
}

function VenueDetailsSection({
  venues,
  onEditVenue,
  onAddVenue,
}: {
  venues: VenueAttribute[];
  onEditVenue: (venue: VenueAttribute) => void;
  onAddVenue: () => void;
}) {
  return (
    <View>
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <Text variant="h1" className="text-base text-[#181114]">Venues</Text>
          {venues.length > 0 && (
            <View className="bg-primary/10 rounded-full px-2.5 py-1">
              <Text className="text-[11px] text-primary">{venues.length} listed</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          onPress={onAddVenue}
          activeOpacity={0.8}
          className="flex-row items-center gap-1 bg-primary/10 rounded-full px-3 py-1.5"
        >
          <MaterialIcons name="add" size={14} color="#ee2b8c" />
          <Text variant="h1" className="text-primary text-xs">Add Venue</Text>
        </TouchableOpacity>
      </View>

      {venues.length === 0 ? (
        <TouchableOpacity
          onPress={onAddVenue}
          activeOpacity={0.8}
          className="bg-white rounded-2xl border border-dashed border-primary/40 py-10 items-center justify-center gap-2"
        >
          <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center">
            <MaterialIcons name="add-business" size={24} color="#ee2b8c" />
          </View>
          <Text variant="h1" className="text-sm text-[#181114]">Add your first venue</Text>
          <Text className="text-xs text-gray-400">Tap to add capacity, pricing & amenities</Text>
        </TouchableOpacity>
      ) : (
        venues.map((v) => (
          <VenueCard key={v.id} venue={v} onEdit={() => onEditVenue(v)} />
        ))
      )}
    </View>
  );
}

// ─── Service Details ──────────────────────────────────────────────────────────

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string | number;
}) {
  return (
    <View className="flex-row items-center gap-3 py-3 border-b border-gray-50">
      <View className="w-8 h-8 rounded-xl bg-primary/10 items-center justify-center">
        <MaterialIcons name={icon} size={16} color="#ee2b8c" />
      </View>
      <Text className="text-xs text-[#594048] flex-1">{label}</Text>
      <Text variant="h1" className="text-xs text-[#181114] text-right max-w-[50%]" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function BoolBadge({ label, value }: { label: string; value: boolean }) {
  return (
    <View
      className={`flex-row items-center gap-1.5 rounded-xl px-3 py-2 ${
        value ? "bg-emerald-50 border border-emerald-200" : "bg-gray-50 border border-gray-200"
      }`}
    >
      <MaterialIcons
        name={value ? "check-circle" : "cancel"}
        size={14}
        color={value ? "#059669" : "#9ca3af"}
      />
      <Text
        className={`text-[11px] ${value ? "text-emerald-700" : "text-gray-400"}`}
      >
        {label}
      </Text>
    </View>
  );
}

type InfoRowItem = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string | number | null | undefined;
};

function ServiceDetailsSection({ service }: { service: OtherServiceAttribute }) {
  const allRows: InfoRowItem[] = [
    { icon: "person", label: "Artist Type", value: service.artist_type },
    { icon: "palette", label: "Styles Specialized", value: service.styles_specialized },
    { icon: "event-available", label: "Max Bookings / Day", value: service.max_bookings_per_day },
    {
      icon: "payments",
      label: "Advance Amount",
      value: service.advance_amount != null ? `₹${service.advance_amount.toLocaleString()}` : null,
    },
    {
      icon: "flight-takeoff",
      label: "Travel Charges",
      value: service.travel_charges != null ? `₹${service.travel_charges.toLocaleString()}` : null,
    },
    {
      icon: "shopping-bag",
      label: "Minimum Order",
      value: service.min_order != null ? `₹${service.min_order.toLocaleString()}` : null,
    },
  ];
  const infoRows = allRows.filter(
    (r): r is InfoRowItem & { value: string | number } => r.value != null
  );

  const boolFlags = [
    { label: "Uses Own Material", value: service.uses_own_material },
    { label: "Available for Destination", value: service.available_for_destination },
    { label: "Customization Available", value: service.customization_available },
    { label: "Serves Veg", value: service.serves_veg },
  ];

  return (
    <View
      className="bg-white rounded-2xl border border-gray-100 p-4"
      style={shadowStyle}
    >
      <View className="flex-row items-center gap-2 mb-1">
        <MaterialIcons name="miscellaneous-services" size={18} color="#ee2b8c" />
        <Text variant="h1" className="text-base text-[#181114]">Service Details</Text>
      </View>

      {infoRows.map((r) => (
        <InfoRow key={r.label} icon={r.icon} label={r.label} value={r.value} />
      ))}

      {service.portfolio_link != null && (
        <InfoRow
          icon="link"
          label="Portfolio"
          value={service.portfolio_link}
        />
      )}

      <View className="flex-row flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
        {boolFlags.map((f) => (
          <BoolBadge key={f.label} label={f.label} value={f.value} />
        ))}
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function BusinessDetailsScreen() {
  const router = useRouter();
  const { businessId } = useLocalSearchParams<{ businessId: string }>();
  const { data: business, isLoading } = useGetBusinessById(businessId ?? "");
  const deleteBusiness = useDeleteBusiness();

  const handleDelete = () => {
    if (!business) return;
    Alert.alert(
      "Delete Business",
      `Are you sure you want to delete "${business.business_name}"? This action cannot be undone.`,
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

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#f8f6f7] items-center justify-center">
        <ActivityIndicator color="#ee2b8c" />
      </SafeAreaView>
    );
  }

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
        <HeroSection
          business={business}
          onEditPress={() => router.push(`/business/edit/${businessId}`)}
        />

        <View className="px-4 gap-4 mt-4">
          <StatsRow business={business} />
          <ActiveRequestsSection requests={business.requests ?? []} />

          {/* Category-specific details (from constants) */}
          {business.category === "Venue" && (
            <VenueDetailsSection
              venues={MOCK_VENUE_ATTRIBUTES}
              onEditVenue={(venue) =>
                Alert.alert("Edit Venue", `Editing: ${venue.venue_type ?? "Venue"}`)
              }
              onAddVenue={() => Alert.alert("Add Venue", "Open add venue form")}
            />
          )}
          {business.category !== "Venue" && business.category != null && (
            <ServiceDetailsSection service={MOCK_SERVICE_ATTRIBUTE} />
          )}

          <PortfolioGrid portfolio={business.portfolio ?? []} />
          <ServicesSection services={business.services ?? []} />
          <AvailabilityCalendar dates={business.availabilityDates} />
          <LatestReviewSection reviews={business.reviews ?? []} />

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
    </View>
  );
}
