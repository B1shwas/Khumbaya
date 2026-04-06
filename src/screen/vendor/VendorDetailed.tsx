import { Text } from "@/src/components/ui/Text";
import { BusinessCategory, OtherServiceAttribute, VenueAttribute } from "@/src/constants/business";
import { useGetBusinessById } from "@/src/features/business/hooks/use-business";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;
const TILE_SIZE = (SCREEN_WIDTH - 48) / 2;

const FALLBACK_HEADER =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCkAYir1uyaMJpHYxd3cTDm5UEx_lcVJTxtNY2aX-7SjfphxWwmRyzcN_I9jAgIIpqkB_WoA3q32x9izN6Kr_lfZk_2h8e2QgTa8ySCVzEuaPyt5iGLXvBLYh3Zmyzj9cd9ehQAy-8AIflmKb745Ui3-jn0RoRfgnaTlQuf-Ma27foOExZUSdI-ngacDOkkK56JuW_U6PfIPZug2LybUCfyo33uKUW6vcSNo2nbtsj91MFuVaVvo5d1GpzvmPpd9hv1643KT_ec4KM";
const FALLBACK_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDIWVyUn7mizRXt-pU0k_RKFdAfNF_d21mLZuL6fE-z88oUHVipXSGUhNmA5WfOISIeb5QApM1WV-MqiArQgJejxYGuerwubu6lcVkwkED06qEDLGBM7Xqz0ISW7b9rPn7S5ZW1hwAZxyVJLtwp0mkKKpGBUzYThC2D9AsRi-INlhoD8olL86wNyceuSQjvSCGLvlkuKEaRRpvGNa3ooDKEzBTa-g2eoD-4QuvwrSjC7f8_Nwv5Gm18EKFeYf5rKFnpg1QNMlLOq18";

// ─── Venue badge helpers ──────────────────────────────────────────────────────

const VENUE_BADGE_MAP: Record<string, string> = {
  "Banquet Hall": "PREMIER VENUE",
  "Lawn / Garden": "GARDEN EXPERIENCE",
  "Rooftop Terrace": "ROOFTOP SUITE",
  "Garden Terrace": "BOUTIQUE EXPERIENCE",
  "Conference Room": "CORPORATE SUITE",
};
const VENUE_BADGE_DEFAULTS = [
  "PREMIER VENUE",
  "BOUTIQUE EXPERIENCE",
  "SIGNATURE SPACE",
  "EXCLUSIVE HALL",
];

function getVenueBadgeLabel(venueType: string | null, index: number): string {
  if (venueType && VENUE_BADGE_MAP[venueType]) return VENUE_BADGE_MAP[venueType];
  return VENUE_BADGE_DEFAULTS[index % VENUE_BADGE_DEFAULTS.length];
}

// ─── Empty service fallback ───────────────────────────────────────────────────

const EMPTY_SERVICE_FALLBACK: OtherServiceAttribute = {
  id: 0,
  business_id: 0,
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
};

// ─── VenueDetailModal ─────────────────────────────────────────────────────────

function VenueDetailModal({
  venue,
  image,
  visible,
  onClose,
}: {
  venue: VenueAttribute | null;
  image: string;
  visible: boolean;
  onClose: () => void;
}) {
  if (!venue) return null;

  type AmenityItem = { key: keyof VenueAttribute; label: string; icon: string };
  const AMENITIES: AmenityItem[] = [
    { key: "has_catering", label: "Catering", icon: "restaurant" },
    { key: "parking", label: "Parking", icon: "local-parking" },
    { key: "valet_available", label: "Valet", icon: "directions-car" },
    { key: "has_av_equipment", label: "AV Equipment", icon: "tv" },
    { key: "alcohol_allowed", label: "Alcohol Allowed", icon: "local-bar" },
    { key: "is_outDoor", label: "Outdoor Space", icon: "park" },
  ];
  const activeAmenities = AMENITIES.filter((a) => venue[a.key] === true);
  const inactiveAmenities = AMENITIES.filter((a) => !venue[a.key]);

  const infoRows: { icon: string; label: string; value: string }[] = [
    {
      icon: "group",
      label: "Max Capacity",
      value: venue.capacity ? `${venue.capacity} guests` : "—",
    },
    {
      icon: "straighten",
      label: "Total Area",
      value: venue.area_sqft ? `${venue.area_sqft} sqft` : "—",
    },
    {
      icon: "attach-money",
      label: "Price / Hour",
      value: venue.price_per_hour ? `₹${venue.price_per_hour.toLocaleString()}` : "On Request",
    },
    {
      icon: "schedule",
      label: "Min Booking",
      value: venue.min_booking_hours ? `${venue.min_booking_hours} hrs` : "Flexible",
    },
    {
      icon: "timelapse",
      label: "Max Booking",
      value: venue.max_booking_hours ? `${venue.max_booking_hours} hrs` : "Flexible",
    },
    {
      icon: "hotel",
      label: "Rooms Available",
      value: venue.rooms_available ? `${venue.rooms_available} rooms` : "N/A",
    },
    {
      icon: "volume-up",
      label: "Sound Limit",
      value: venue.sound_limit_db ? `${venue.sound_limit_db} dB` : "No Limit",
    },
  ];

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-[#f8f8fa]">
        {/* Hero image */}
        <View style={{ height: 240 }}>
          <Image
            source={{ uri: image }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
          {/* Gradient overlay at bottom */}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 80,
              backgroundColor: "transparent",
            }}
          />
          {/* Close button */}
          <Pressable
            onPress={onClose}
            className="absolute top-4 left-4 h-10 w-10 items-center justify-center rounded-full bg-black/40"
          >
            <MaterialIcons name="arrow-back" size={20} color="#fff" />
          </Pressable>
          {/* Badge */}
          <View className="absolute bottom-4 left-4 bg-primary px-3 py-1 rounded-full">
            <Text className="text-white text-[10px] font-bold tracking-widest uppercase">
              {venue.is_outDoor ? "Outdoor" : "Indoor"} · {venue.venue_type ?? "Venue"}
            </Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          {/* Title block */}
          <View className="px-5 pt-5 pb-4 bg-white">
            <Text className="text-2xl font-bold text-[#181114]">
              {venue.venue_type ?? "Venue Space"}
            </Text>
            <Text className="text-sm text-gray-400 mt-1">
              {venue.is_outDoor ? "Outdoor venue" : "Indoor venue"} · Venue #{venue.venue_id}
            </Text>
          </View>

          {/* Key stats grid */}
          <View className="mx-4 mt-4 rounded-2xl overflow-hidden border border-gray-100 bg-white" style={{ elevation: 1 }}>
            <View className="px-4 pt-4 pb-2">
              <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Venue Details
              </Text>
            </View>
            {infoRows.map((row, i) => (
              <View
                key={row.label}
                className={`flex-row items-center px-4 py-3.5 ${
                  i < infoRows.length - 1 ? "border-b border-gray-50" : ""
                }`}
              >
                <View className="h-9 w-9 rounded-xl bg-primary/10 items-center justify-center mr-3">
                  <MaterialIcons name={row.icon as any} size={18} color="#ee2b8c" />
                </View>
                <Text className="flex-1 text-sm text-gray-500">{row.label}</Text>
                <Text className="text-sm font-bold text-[#181114]">{row.value}</Text>
              </View>
            ))}
          </View>

          {/* Amenities */}
          <View className="mx-4 mt-4 rounded-2xl overflow-hidden border border-gray-100 bg-white" style={{ elevation: 1 }}>
            <View className="px-4 pt-4 pb-2">
              <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Amenities
              </Text>
            </View>
            <View className="px-4 pb-4 pt-2 flex-row flex-wrap gap-2">
              {activeAmenities.map((a) => (
                <View
                  key={a.key}
                  className="flex-row items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3 py-1.5"
                >
                  <MaterialIcons name={a.icon as any} size={13} color="#ee2b8c" />
                  <Text className="text-primary text-xs font-semibold">{a.label}</Text>
                </View>
              ))}
              {inactiveAmenities.map((a) => (
                <View
                  key={a.key}
                  className="flex-row items-center gap-1.5 bg-gray-100 border border-gray-200 rounded-full px-3 py-1.5"
                >
                  <MaterialIcons name={a.icon as any} size={13} color="#9ca3af" />
                  <Text className="text-gray-400 text-xs">{a.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Booking hours info card */}
          <View
            className="mx-4 mt-4 rounded-2xl overflow-hidden p-4"
            style={{ backgroundColor: "#1a1a2e" }}
          >
            <View className="flex-row items-center gap-2 mb-3">
              <MaterialIcons name="info-outline" size={18} color="#ee2b8c" />
              <Text className="text-white font-bold text-sm">Booking Info</Text>
            </View>
            <View className="flex-row gap-4">
              <View className="flex-1 bg-white/10 rounded-xl p-3">
                <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }} className="uppercase tracking-widest mb-1">
                  Min Hours
                </Text>
                <Text className="text-white font-bold text-base">
                  {venue.min_booking_hours ?? "—"} hrs
                </Text>
              </View>
              <View className="flex-1 bg-white/10 rounded-xl p-3">
                <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }} className="uppercase tracking-widest mb-1">
                  Max Hours
                </Text>
                <Text className="text-white font-bold text-base">
                  {venue.max_booking_hours ?? "—"} hrs
                </Text>
              </View>
              <View className="flex-1 bg-white/10 rounded-xl p-3">
                <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }} className="uppercase tracking-widest mb-1">
                  Per Hour
                </Text>
                <Text className="text-white font-bold text-base">
                  {venue.price_per_hour ? `₹${venue.price_per_hour}` : "—"}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

// ─── AvailableSpacesSection ───────────────────────────────────────────────────

function AvailableSpacesSection({
  venues,
  coverFallback,
  portfolio,
}: {
  venues: VenueAttribute[];
  coverFallback: string | null;
  portfolio: string[];
}) {
  const [selectedVenue, setSelectedVenue] = useState<{
    venue: VenueAttribute;
    image: string;
  } | null>(null);

  type AmenityItem = { key: keyof VenueAttribute; label: string; icon: string };

  const AMENITIES: AmenityItem[] = [
    { key: "has_catering", label: "Catering", icon: "restaurant" },
    { key: "parking", label: "Parking", icon: "local-parking" },
    { key: "valet_available", label: "Valet", icon: "directions-car" },
    { key: "has_av_equipment", label: "AV Equipment", icon: "tv" },
    { key: "alcohol_allowed", label: "Alcohol", icon: "local-bar" },
    { key: "is_outDoor", label: "Outdoor", icon: "park" },
  ];

  return (
    <View className="bg-white mt-2 pb-2">
      {/* Section header */}
      <View className="flex-row justify-between items-center px-4 pt-5 pb-3">
        <View>
          <Text className="text-xl font-bold text-[#181114]">Available Spaces</Text>
          <Text className="text-xs text-gray-400 mt-0.5">Select your preferred venue</Text>
        </View>
        <Pressable>
          <Text className="text-primary text-xs font-bold uppercase tracking-wide">
            VIEW ALL →
          </Text>
        </Pressable>
      </View>

      {venues.length === 0 ? (
        <View className="items-center py-10">
          <MaterialIcons name="meeting-room" size={40} color="#d1d5db" />
          <Text className="text-gray-400 mt-2 text-sm">No spaces listed yet</Text>
        </View>
      ) : (
        venues.map((venue, index) => {
          const image = portfolio[index] ?? coverFallback ?? FALLBACK_HEADER;
          const badge = getVenueBadgeLabel(venue.venue_type, index);
          const activeAmenities = AMENITIES.filter((a) => venue[a.key] === true);

          return (
            <View
              key={venue.venue_id}
              className="mx-4 mb-5 rounded-3xl overflow-hidden bg-white"
              style={{
                elevation: 4,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
              }}
            >
              {/* Image with overlaid info */}
              <View style={{ height: 200 }}>
                <Image
                  source={{ uri: image }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
                {/* Dark scrim at bottom */}
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 90,
                    backgroundColor: "rgba(0,0,0,0.45)",
                  }}
                />
                {/* Badge top-left */}
                <View className="absolute top-3 left-3 bg-primary px-3 py-1 rounded-full">
                  <Text className="text-white text-[10px] font-bold tracking-widest">
                    {badge}
                  </Text>
                </View>
                {/* Indoor/Outdoor pill top-right */}
                <View className="absolute top-3 right-3 bg-black/40 px-3 py-1 rounded-full">
                  <Text className="text-white text-[10px] font-semibold uppercase tracking-wide">
                    {venue.is_outDoor ? "Outdoor" : "Indoor"}
                  </Text>
                </View>
                {/* Title + mini stats on scrim */}
                <View className="absolute bottom-3 left-4 right-4">
                  <Text className="text-white text-lg font-bold leading-tight">
                    {venue.venue_type ?? "Venue Space"}
                  </Text>
                  <View className="flex-row gap-4 mt-1">
                    {venue.capacity != null && (
                      <View className="flex-row items-center gap-1">
                        <MaterialIcons name="group" size={13} color="rgba(255,255,255,0.8)" />
                        <Text className="text-white/80 text-xs">{venue.capacity} guests</Text>
                      </View>
                    )}
                    {venue.area_sqft != null && (
                      <View className="flex-row items-center gap-1">
                        <MaterialIcons name="straighten" size={13} color="rgba(255,255,255,0.8)" />
                        <Text className="text-white/80 text-xs">{venue.area_sqft} sqft</Text>
                      </View>
                    )}
                    {venue.price_per_hour != null && (
                      <View className="flex-row items-center gap-1">
                        <MaterialIcons name="attach-money" size={13} color="rgba(255,255,255,0.8)" />
                        <Text className="text-white/80 text-xs">₹{venue.price_per_hour}/hr</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              {/* Card body */}
              <View className="px-4 pt-3 pb-4">
                {/* Amenity chips */}
                {activeAmenities.length > 0 && (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ flexDirection: "row", gap: 8, paddingBottom: 12 }}
                  >
                    {activeAmenities.map((a) => (
                      <View
                        key={a.key}
                        className="flex-row items-center gap-1 bg-primary/10 rounded-full px-3 py-1"
                      >
                        <MaterialIcons name={a.icon as any} size={12} color="#ee2b8c" />
                        <Text className="text-primary text-[11px] font-semibold">{a.label}</Text>
                      </View>
                    ))}
                  </ScrollView>
                )}

                {/* CTA */}
                <Pressable
                  className="rounded-2xl py-3.5 items-center"
                  style={{ backgroundColor: "#1a1a2e" }}
                  onPress={() => setSelectedVenue({ venue, image })}
                >
                  <Text className="text-white font-bold text-sm uppercase tracking-widest">
                    Explore Space →
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        })
      )}

      {/* Venue detail modal */}
      <VenueDetailModal
        venue={selectedVenue?.venue ?? null}
        image={selectedVenue?.image ?? ""}
        visible={selectedVenue !== null}
        onClose={() => setSelectedVenue(null)}
      />
    </View>
  );
}

// ─── ServiceInfoSection ───────────────────────────────────────────────────────

// Shared dark stat tile used in the booking card
function StatTile({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View className="flex-1 rounded-xl p-3" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
      <MaterialIcons name={icon as any} size={16} color="#ee2b8c" style={{ marginBottom: 4 }} />
      <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 9 }} className="uppercase tracking-widest">
        {label}
      </Text>
      <Text className="text-white font-bold text-sm mt-0.5">{value}</Text>
    </View>
  );
}

// Shared light info row used in specialty cards
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between py-2.5 border-b border-gray-100">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className="text-sm font-semibold text-[#181114]">{value}</Text>
    </View>
  );
}

function ServiceInfoSection({
  service,
  category,
}: {
  service: OtherServiceAttribute;
  category: BusinessCategory | null;
}) {
  const styles = service.styles_specialized
    ? service.styles_specialized.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  // ── Shared booking card (bottom dark card, always shown) ──────────────────
  const BookingCard = () => (
    <View
      className="mx-4 mb-4 rounded-2xl overflow-hidden"
      style={{ backgroundColor: "#1a1a2e" }}
    >
      <View className="flex-row items-center gap-2 px-4 pt-4 pb-3">
        <MaterialIcons name="verified-user" size={20} color="#ee2b8c" />
        <Text className="text-white font-bold text-base">Booking & Availability</Text>
      </View>
      <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.08)" }} />
      <View className="px-4 pt-3 pb-4 flex-row gap-2">
        <StatTile
          icon="payments"
          label="Advance"
          value={service.advance_amount != null ? `₹${service.advance_amount.toLocaleString()}` : "On Request"}
        />
        <StatTile
          icon="flight-takeoff"
          label="Travel"
          value={service.travel_charges != null && service.travel_charges > 0 ? `₹${service.travel_charges.toLocaleString()}` : "Included"}
        />
        <StatTile
          icon="event-available"
          label="Max / Day"
          value={service.max_bookings_per_day != null ? `${service.max_bookings_per_day}` : "Flexible"}
        />
      </View>
      {/* Feature flags row */}
      <View className="flex-row gap-2 px-4 pb-4">
        {service.available_for_destination && (
          <View className="flex-row items-center gap-1 bg-white/10 rounded-full px-3 py-1">
            <MaterialIcons name="flight" size={11} color="#ee2b8c" />
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 10 }}>Destination Events</Text>
          </View>
        )}
        {service.customization_available && (
          <View className="flex-row items-center gap-1 bg-white/10 rounded-full px-3 py-1">
            <MaterialIcons name="tune" size={11} color="#ee2b8c" />
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 10 }}>Customizable</Text>
          </View>
        )}
      </View>
    </View>
  );

  // ── Photographer / Videographer / Pre-Wedding ─────────────────────────────
  if (
    category === BusinessCategory.PhotographerVideographer ||
    category === BusinessCategory.PreWeddingShoot
  ) {
    return (
      <View className="mt-2">
        <View className="mx-4 mb-3 bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ elevation: 1 }}>
          <View className="flex-row items-center gap-2 px-4 pt-4 pb-2">
            <View className="h-8 w-8 rounded-lg bg-primary/10 items-center justify-center">
              <MaterialIcons name="camera-alt" size={18} color="#ee2b8c" />
            </View>
            <Text className="font-bold text-[#181114] text-base">Photography Details</Text>
          </View>
          <View className="px-4 pb-4">
            {service.artist_type ? <InfoRow label="Shoot Style" value={service.artist_type} /> : null}
            <InfoRow
              label="Uses Own Equipment"
              value={service.uses_own_material ? "Yes — all gear included" : "Client provides equipment"}
            />
            {styles.length > 0 && (
              <View className="mt-3">
                <Text className="text-xs text-gray-400 uppercase tracking-wide mb-2">Specializations</Text>
                <View className="flex-row flex-wrap gap-2">
                  {styles.map((s) => (
                    <View key={s} className="bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
                      <Text className="text-primary text-xs font-semibold">{s}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            {!service.artist_type && styles.length === 0 && (
              <Text className="text-sm text-gray-400 mt-2">Details not provided</Text>
            )}
          </View>
        </View>
        <BookingCard />
      </View>
    );
  }

  // ── Makeup Artist / Bridal Grooming / Mehendi ─────────────────────────────
  if (
    category === BusinessCategory.MakeupArtist ||
    category === BusinessCategory.BridalGrooming ||
    category === BusinessCategory.MehendiArtist
  ) {
    const iconName =
      category === BusinessCategory.MehendiArtist ? "brush" : "face-retouching-natural";
    const cardTitle =
      category === BusinessCategory.MehendiArtist
        ? "Mehendi Specialization"
        : category === BusinessCategory.BridalGrooming
        ? "Grooming Expertise"
        : "Makeup Artistry";

    return (
      <View className="mt-2">
        <View className="mx-4 mb-3 bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ elevation: 1 }}>
          <View className="flex-row items-center gap-2 px-4 pt-4 pb-2">
            <View className="h-8 w-8 rounded-lg bg-primary/10 items-center justify-center">
              <MaterialIcons name={iconName as any} size={18} color="#ee2b8c" />
            </View>
            <Text className="font-bold text-[#181114] text-base">{cardTitle}</Text>
          </View>
          <View className="px-4 pb-4">
            {service.artist_type ? <InfoRow label="Artist Type" value={service.artist_type} /> : null}
            <InfoRow
              label="Uses Own Products"
              value={service.uses_own_material ? "Yes — products included" : "Client provides products"}
            />
            {styles.length > 0 && (
              <View className="mt-3">
                <Text className="text-xs text-gray-400 uppercase tracking-wide mb-2">Styles</Text>
                <View className="flex-row flex-wrap gap-2">
                  {styles.map((s) => (
                    <View key={s} className="bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
                      <Text className="text-primary text-xs font-semibold">{s}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            {!service.artist_type && styles.length === 0 && (
              <Text className="text-sm text-gray-400 mt-2">Details not provided</Text>
            )}
          </View>
        </View>
        <BookingCard />
      </View>
    );
  }

  // ── Wedding Planners & Decorator ──────────────────────────────────────────
  if (category === BusinessCategory.WeddingPlannersDecorator) {
    return (
      <View className="mt-2">
        <View className="mx-4 mb-3 bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ elevation: 1 }}>
          <View className="flex-row items-center gap-2 px-4 pt-4 pb-2">
            <View className="h-8 w-8 rounded-lg bg-primary/10 items-center justify-center">
              <MaterialIcons name="celebration" size={18} color="#ee2b8c" />
            </View>
            <Text className="font-bold text-[#181114] text-base">Planning & Decor</Text>
          </View>
          <View className="px-4 pb-4">
            {service.artist_type ? <InfoRow label="Specialization" value={service.artist_type} /> : null}
            <InfoRow
              label="Customization"
              value={service.customization_available ? "Full custom themes available" : "Standard packages"}
            />
            <InfoRow
              label="Destination Events"
              value={service.available_for_destination ? "Available" : "Local only"}
            />
            {styles.length > 0 && (
              <View className="mt-3">
                <Text className="text-xs text-gray-400 uppercase tracking-wide mb-2">Decor Styles</Text>
                <View className="flex-row flex-wrap gap-2">
                  {styles.map((s) => (
                    <View key={s} className="bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
                      <Text className="text-primary text-xs font-semibold">{s}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
        <BookingCard />
      </View>
    );
  }

  // ── Music & Entertainment / Baraat ────────────────────────────────────────
  if (
    category === BusinessCategory.MusicEntertainment ||
    category === BusinessCategory.Baraat
  ) {
    return (
      <View className="mt-2">
        <View className="mx-4 mb-3 bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ elevation: 1 }}>
          <View className="flex-row items-center gap-2 px-4 pt-4 pb-2">
            <View className="h-8 w-8 rounded-lg bg-primary/10 items-center justify-center">
              <MaterialIcons name="music-note" size={18} color="#ee2b8c" />
            </View>
            <Text className="font-bold text-[#181114] text-base">
              {category === BusinessCategory.Baraat ? "Baraat Details" : "Entertainment"}
            </Text>
          </View>
          <View className="px-4 pb-4">
            {service.artist_type ? <InfoRow label="Act Type" value={service.artist_type} /> : null}
            <InfoRow
              label="Own Sound System"
              value={service.uses_own_material ? "Yes — full setup included" : "Venue sound required"}
            />
            <InfoRow
              label="Destination Gigs"
              value={service.available_for_destination ? "Available" : "Local only"}
            />
            {styles.length > 0 && (
              <View className="mt-3">
                <Text className="text-xs text-gray-400 uppercase tracking-wide mb-2">Genres / Styles</Text>
                <View className="flex-row flex-wrap gap-2">
                  {styles.map((s) => (
                    <View key={s} className="bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
                      <Text className="text-primary text-xs font-semibold">{s}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
        <BookingCard />
      </View>
    );
  }

  // ── Food & Catering ───────────────────────────────────────────────────────
  if (category === BusinessCategory.FoodCatering) {
    return (
      <View className="mt-2">
        <View className="mx-4 mb-3 bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ elevation: 1 }}>
          <View className="flex-row items-center gap-2 px-4 pt-4 pb-2">
            <View className="h-8 w-8 rounded-lg bg-primary/10 items-center justify-center">
              <MaterialIcons name="restaurant" size={18} color="#ee2b8c" />
            </View>
            <Text className="font-bold text-[#181114] text-base">Catering Details</Text>
          </View>
          <View className="px-4 pb-4">
            {service.artist_type ? <InfoRow label="Cuisine Type" value={service.artist_type} /> : null}
            <InfoRow label="Veg Menu" value={service.serves_veg ? "Available" : "Non-veg only"} />
            {service.min_order != null && (
              <InfoRow label="Min. Order" value={`₹${service.min_order.toLocaleString()}`} />
            )}
            {styles.length > 0 && (
              <View className="mt-3">
                <Text className="text-xs text-gray-400 uppercase tracking-wide mb-2">Menu Styles</Text>
                <View className="flex-row flex-wrap gap-2">
                  {styles.map((s) => (
                    <View key={s} className="bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
                      <Text className="text-primary text-xs font-semibold">{s}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
        <BookingCard />
      </View>
    );
  }

  // ── Invites & Gift / Bridal Wear / Jewelry ────────────────────────────────
  if (
    category === BusinessCategory.InvitesGift ||
    category === BusinessCategory.BridalWear ||
    category === BusinessCategory.JewelryAccessories
  ) {
    const icon =
      category === BusinessCategory.JewelryAccessories
        ? "diamond"
        : category === BusinessCategory.BridalWear
        ? "checkroom"
        : "card-giftcard";
    const title =
      category === BusinessCategory.JewelryAccessories
        ? "Jewelry & Accessories"
        : category === BusinessCategory.BridalWear
        ? "Bridal Wear"
        : "Invites & Gifting";

    return (
      <View className="mt-2">
        <View className="mx-4 mb-3 bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ elevation: 1 }}>
          <View className="flex-row items-center gap-2 px-4 pt-4 pb-2">
            <View className="h-8 w-8 rounded-lg bg-primary/10 items-center justify-center">
              <MaterialIcons name={icon as any} size={18} color="#ee2b8c" />
            </View>
            <Text className="font-bold text-[#181114] text-base">{title}</Text>
          </View>
          <View className="px-4 pb-4">
            {service.artist_type ? <InfoRow label="Specialty" value={service.artist_type} /> : null}
            <InfoRow
              label="Customization"
              value={service.customization_available ? "Custom designs available" : "Ready-made only"}
            />
            {service.min_order != null && (
              <InfoRow label="Min. Order" value={`₹${service.min_order.toLocaleString()}`} />
            )}
            {styles.length > 0 && (
              <View className="mt-3">
                <Text className="text-xs text-gray-400 uppercase tracking-wide mb-2">Collections</Text>
                <View className="flex-row flex-wrap gap-2">
                  {styles.map((s) => (
                    <View key={s} className="bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
                      <Text className="text-primary text-xs font-semibold">{s}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
        <BookingCard />
      </View>
    );
  }

  // ── Security Guard ────────────────────────────────────────────────────────
  if (category === BusinessCategory.SecurityGuard) {
    return (
      <View className="mt-2">
        <View className="mx-4 mb-3 bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ elevation: 1 }}>
          <View className="flex-row items-center gap-2 px-4 pt-4 pb-2">
            <View className="h-8 w-8 rounded-lg bg-primary/10 items-center justify-center">
              <MaterialIcons name="security" size={18} color="#ee2b8c" />
            </View>
            <Text className="font-bold text-[#181114] text-base">Security Services</Text>
          </View>
          <View className="px-4 pb-4">
            {service.artist_type ? <InfoRow label="Guard Type" value={service.artist_type} /> : null}
            <InfoRow
              label="Destination Deployments"
              value={service.available_for_destination ? "Available" : "Local only"}
            />
            {styles.length > 0 && (
              <View className="mt-3">
                <Text className="text-xs text-gray-400 uppercase tracking-wide mb-2">Services</Text>
                <View className="flex-row flex-wrap gap-2">
                  {styles.map((s) => (
                    <View key={s} className="bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
                      <Text className="text-primary text-xs font-semibold">{s}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
        <BookingCard />
      </View>
    );
  }

  // ── Generic fallback ──────────────────────────────────────────────────────
  return (
    <View className="mt-2">
      <View className="mx-4 mb-3 bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ elevation: 1 }}>
        <View className="flex-row items-center gap-2 px-4 pt-4 pb-2">
          <View className="h-8 w-8 rounded-lg bg-primary/10 items-center justify-center">
            <MaterialIcons name="palette" size={18} color="#ee2b8c" />
          </View>
          <Text className="font-bold text-[#181114] text-base">Service Details</Text>
        </View>
        <View className="px-4 pb-4">
          {service.artist_type ? <InfoRow label="Specialization" value={service.artist_type} /> : null}
          {styles.length > 0 ? (
            <View className="mt-3">
              <Text className="text-xs text-gray-400 uppercase tracking-wide mb-2">Styles</Text>
              <View className="flex-row flex-wrap gap-2">
                {styles.map((s) => (
                  <View key={s} className="bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
                    <Text className="text-primary text-xs font-semibold">{s}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
          {!service.artist_type && styles.length === 0 && (
            <Text className="text-sm text-gray-400 mt-2">Details not provided</Text>
          )}
        </View>
      </View>
      <BookingCard />
    </View>
  );
}

// ─── Main VendorDetailed screen ───────────────────────────────────────────────

export default function VendorDetailed() {
  const router = useRouter();
  const { vendorId } = useLocalSearchParams<{ vendorId: string }>();
  const resolvedId = Array.isArray(vendorId) ? vendorId[0] : (vendorId ?? "");

  const [showGallery, setShowGallery] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All Photos");

  const { data: businessWithAttribute, isLoading, isError } = useGetBusinessById(resolvedId);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#ee2b8c" />
      </View>
    );
  }

  // ── Error / not found state ────────────────────────────────────────────────
  if (isError || !businessWithAttribute) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <MaterialIcons name="store-mall-directory" size={48} color="#d1d5db" />
        <Text className="text-lg text-gray-600 mt-3">Vendor not found</Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-4 px-6 py-3 bg-primary rounded-lg"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  // ── Data mapping ───────────────────────────────────────────────────────────
  const biz = businessWithAttribute.business_information;
  const portfolio = biz.portfolio ?? [];
  const tags =
    biz.services && biz.services.length > 0
      ? biz.services.map((s) => s.title)
      : [];

  const galleryImage0 = portfolio[0] ?? biz.cover ?? FALLBACK_HEADER;
  const galleryImage1 = portfolio[1] ?? biz.avatar ?? FALLBACK_HEADER;
  const galleryImage2 = portfolio[2] ?? biz.cover ?? FALLBACK_HEADER;
  const extraCount = Math.max(0, portfolio.length - 3);

  const galleryData = portfolio.map((uri, i) => ({
    uri,
    category: tags[i % Math.max(1, tags.length)] ?? "Photo",
  }));
  const galleryFilters = ["All Photos", ...tags];

  const reviews = biz.reviews ?? [];

  const headerImage = biz.cover ?? biz.avatar ?? FALLBACK_HEADER;
  const avatarImage = biz.avatar ?? FALLBACK_AVATAR;
  const locationText =
    biz.city && biz.country
      ? `${biz.city}, ${biz.country}`
      : biz.location ?? "—";

  const serviceAttr =
    businessWithAttribute.vendor_services_information?.[0] ?? EMPTY_SERVICE_FALLBACK;

  return (
    <>
      {/* Sticky bottom CTA */}
      <View className="absolute bottom-0 left-0 right-0 z-10 h-24">
        <View className="bg-white/90 border-t border-gray-200 px-4 py-4">
          <View className="w-full max-w-md self-center">
            <Pressable
              className="w-full rounded-lg bg-primary py-3.5 px-4 items-center justify-center shadow-lg shadow-primary/30 active:scale-[0.98]"
              onPress={() =>
                router.push({
                  pathname: "/(shared)/explore/[vendorId]/enquiryform",
                  params: { vendorId: resolvedId },
                })
              }
            >
              <Text className="text-lg font-bold text-white font-display">Send Enquiry</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-32"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header image + avatar ─────────────────────────────────────────── */}
        <View className="relative w-full rounded-md">
          <ImageBackground
            source={{ uri: headerImage }}
            className="w-full h-[24vh]"
            resizeMode="cover"
          >
            <View className="flex-row justify-between items-center px-4 pt-4">
              <Pressable
                onPress={() => router.back()}
                className="h-10 w-10 items-center justify-center rounded-full bg-black/30 shadow-sm"
              >
                <MaterialIcons name="arrow-back" size={20} color="#ffffff" />
              </Pressable>
              <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-black/30 shadow-sm">
                <MaterialIcons name="favorite" size={20} color="#ffffff" />
              </Pressable>
            </View>
          </ImageBackground>
          <View className="h-32 w-32 absolute -bottom-16 left-4 z-20 border-1 rounded-full border-primary bg-primary p-1">
            <View className="h-full w-full rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
              <Image
                source={{ uri: avatarImage }}
                className="h-full w-full"
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        {/* ── Vendor info ───────────────────────────────────────────────────── */}
        <View className="px-4 pt-20 pb-4 bg-white">
          <View className="flex-row justify-between items-start">
            <Text className="text-2xl font-bold leading-tight tracking-tight text-[#181114] flex-1 mr-2">
              {biz.business_name}
            </Text>
            <View className="flex gap-2">
              <View className="flex-row items-center gap-1 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                <MaterialIcons name="verified" size={14} color="#16a34a" />
                <Text className="text-[10px] font-bold text-green-700 uppercase tracking-wider">
                  {biz.is_verified ? "Verified" : "Unverified"}
                </Text>
              </View>
              <View className="flex-row gap-2 shadow-sm shadow-black">
                <Pressable
                  className="flex-row items-center gap-1 bg-green-50 px-2 py-1 rounded-full border border-green-100"
                  onPress={() =>
                    router.push(`/(shared)/explore/${resolvedId}/vendorcomparision`)
                  }
                >
                  <MaterialIcons name="compare-arrows" size={18} color="#16a34a" />
                  <Text className="text-[10px] font-bold text-green-700 uppercase tracking-wider">
                    Compare
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          <View className="flex-row items-center gap-1 mt-1">
            <MaterialIcons name="location-on" size={18} color="#6B7280" />
            <Text className="text-sm text-gray-500">{locationText}</Text>
          </View>

          <View className="flex-row items-center gap-3 mt-2">
            <View className="flex-row items-center gap-1 bg-primary/5 px-2 py-1 rounded-md border border-primary/10">
              <MaterialIcons name="star" size={16} color="#ee2b8c" />
              <Text className="text-sm font-bold text-[#181114]">
                {biz.rating ?? "N/A"}
              </Text>
              <Text className="text-xs text-gray-500">
                ({biz.totalBookings ?? 0} Bookings)
              </Text>
            </View>
            <View className="h-4 w-px bg-gray-200" />
            <Text className="text-sm text-primary font-semibold">Top Rated Vendor</Text>
          </View>

        </View>

        {/* ── Tags strip ───────────────────────────────────────────────────── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="bg-white"
          contentContainerClassName="px-4 py-2 gap-2"
        >
          {tags.map((tag) => (
            <View
              key={tag}
              className="px-4 py-1.5 rounded-full bg-gray-50 border border-gray-100"
            >
              <Text className="text-gray-600 text-xs font-medium">{tag}</Text>
            </View>
          ))}
        </ScrollView>

        {/* ── Description ──────────────────────────────────────────────────── */}
        {biz.description ? (
          <View className="mx-4 mb-2 mt-1 rounded-2xl overflow-hidden border border-gray-100 bg-white"
            style={{ elevation: 1, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}
          >
            {/* Header bar */}
            <View className="flex-row items-center gap-2 px-4 pt-4 pb-3 border-b border-gray-50">
              <View className="h-7 w-7 rounded-lg bg-primary/10 items-center justify-center">
                <MaterialIcons name="info-outline" size={15} color="#ee2b8c" />
              </View>
              <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">About</Text>
            </View>
            {/* Body */}
            <View className="px-4 py-3">
              <Text className="text-[#374151] text-sm leading-6">
                {biz.description}
              </Text>
            </View>
          </View>
        ) : null}

        {/* ── Category-specific section ─────────────────────────────────────  */}
        {biz.category === BusinessCategory.Venue ? (
          <AvailableSpacesSection
            venues={businessWithAttribute.venue_information}
            coverFallback={biz.cover}
            portfolio={portfolio}
          />
        ) : (
          <ServiceInfoSection service={serviceAttr} category={biz.category} />
        )}


        {/* ── Featured Gallery ──────────────────────────────────────────────── */}
        <View className="px-4 py-6 bg-white">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-[#181114]">Featured Gallery</Text>
            <Pressable onPress={() => setShowGallery(true)}>
              <Text className="text-primary text-sm font-bold">View All</Text>
            </Pressable>
          </View>
          <View className="gap-2">
            <View className="w-full aspect-[21/9] rounded-xl overflow-hidden shadow-sm">
              <Image
                source={{ uri: galleryImage0 }}
                className="h-full w-full"
                resizeMode="cover"
              />
            </View>
            <View className="flex-row gap-3 my-2">
              <Pressable className="h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white">
                <MaterialIcons name="chat-bubble" size={20} color="#6B7280" />
              </Pressable>
            </View>
            <View className="flex-row gap-2">
              <View className="flex-1 aspect-square rounded-xl overflow-hidden shadow-sm">
                <Image
                  source={{ uri: galleryImage1 }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              </View>
              <View className="flex-1 aspect-square rounded-xl overflow-hidden shadow-sm">
                <Image
                  source={{ uri: galleryImage2 }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
                {extraCount > 0 && (
                  <View className="absolute inset-0 items-center justify-center bg-black/40">
                    <Text className="text-white font-bold text-xl">+{extraCount}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* ── Recent Reviews ────────────────────────────────────────────────── */}
        <View className="px-4 py-6 bg-white mt-2">
          <View className="flex-row justify-between items-baseline mb-4">
            <View className="flex-row items-center gap-2">
              <Text className="text-lg font-bold text-[#181114]">Recent Reviews</Text>
              <Text className="text-xs text-gray-400 font-medium">
                {reviews.length} total
              </Text>
            </View>
            <Text className="text-primary text-sm font-bold">View All</Text>
          </View>

          {reviews.length === 0 ? (
            <View className="items-center py-8">
              <MaterialIcons name="rate-review" size={36} color="#d1d5db" />
              <Text className="text-gray-400 mt-2 text-sm">No reviews yet</Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-4 pb-4"
            >
              {reviews.map((review) => (
                <View
                  key={review.id}
                  className="w-80 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
                >
                  <View className="flex-row items-center gap-3 mb-3">
                    <Image
                      source={{ uri: review.reviewerAvatarUrl }}
                      className="h-10 w-10 rounded-full"
                      resizeMode="cover"
                    />
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-[#181114]">
                        {review.reviewerName}
                      </Text>
                      <Text className="text-[10px] text-gray-400">{review.date}</Text>
                    </View>
                    <View className="flex-row gap-0.5">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <MaterialIcons
                          key={`${review.id}-${index}`}
                          name="star"
                          size={14}
                          color={index < review.rating ? "#facc15" : "#e5e7eb"}
                        />
                      ))}
                    </View>
                  </View>
                  <Text className="text-sm text-gray-600 leading-relaxed italic">
                    "{review.quote}"
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </ScrollView>

      {/* ── Gallery Modal ─────────────────────────────────────────────────── */}
      <Modal
        visible={showGallery}
        animationType="slide"
        onRequestClose={() => setShowGallery(false)}
      >
        <SafeAreaView className="flex-1 bg-[#f5f5f5]">
          <View className="flex-row items-center justify-between px-4 py-3 bg-[#f5f5f5]">
            <Text className="text-lg font-bold text-[#181114]">Gallery</Text>
            <Pressable
              onPress={() => setShowGallery(false)}
              className="h-8 w-8 items-center justify-center rounded-full bg-gray-200"
            >
              <MaterialIcons name="close" size={20} color="#181114" />
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-grow-0"
            contentContainerClassName="px-4 pb-3 gap-2 flex-row"
          >
            {galleryFilters.map((filter) => (
              <Pressable
                key={filter}
                onPress={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full border ${
                  activeFilter === filter
                    ? "bg-primary border-primary"
                    : "bg-white border-gray-200"
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    activeFilter === filter ? "text-white" : "text-gray-500"
                  }`}
                >
                  {filter}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <FlatList
            data={
              activeFilter === "All Photos"
                ? galleryData
                : galleryData.filter((item) => item.category === activeFilter)
            }
            numColumns={2}
            keyExtractor={(_, index) => String(index)}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
            columnWrapperStyle={{ gap: 8 }}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item.uri }}
                style={{ width: TILE_SIZE, height: TILE_SIZE, borderRadius: 16 }}
                resizeMode="cover"
              />
            )}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}
