import { Business, BusinessCategory } from "@/src/constants/business";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Image, Platform, Text, TouchableOpacity, View } from "react-native";
import { shadowStyle } from "@/src/utils/helper";
interface BusinessCardProps {
  business: Business;
  onPress?: () => void;
  onMorePress?: () => void;
}



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

function getIcon(
  category?: BusinessCategory
): keyof typeof MaterialIcons.glyphMap {
  if (!category) return "storefront";
  return CATEGORY_ICONS[category];
}

function formatViews(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

const BusinessCard = React.memo(function BusinessCard({
  business,
  onPress,
  onMorePress,
}: BusinessCardProps) {
  const isActive = business.status === "active";
  const coverUri = business.coverImageUrl ?? business.imageUrl;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      className="bg-white rounded-2xl overflow-hidden"
      style={shadowStyle}
      onPress={onPress}
    >
      {/* ── Cover image ── */}
      <View style={{ aspectRatio: 16 / 7 }}>
        <Image
          source={{ uri: coverUri }}
          className="w-full h-full"
          resizeMode="cover"
        />
        <View className="absolute inset-0 bg-black/35" />

        {/* Status badge */}
        <View
          className={`absolute top-3 right-3 flex-row items-center gap-1 px-2.5 py-1 rounded-full ${
            isActive ? "bg-emerald-500/90" : "bg-amber-500/90"
          }`}
        >
          {isActive && (
            <View className="w-1.5 h-1.5 rounded-full bg-white" />
          )}
          <Text className="text-white text-[10px] font-bold tracking-wide">
            {isActive ? "Active" : "Pending Verification"}
          </Text>
        </View>
      </View>

      {/* ── Body ── */}
      <View className="px-4 pt-3.5 pb-4">
        {/* Row 1 — icon + name + more */}
        <View className="flex-row items-center gap-2.5 mb-1.5">
          <View className="w-8 h-8 rounded-lg bg-primary/10 items-center justify-center">
            <MaterialIcons
              name={getIcon(business.category)}
              size={16}
              color="#ee2b8c"
            />
          </View>
          <Text
            className="flex-1 text-base font-bold text-[#181114] tracking-tight"
            numberOfLines={1}
          >
            {business.name}
          </Text>
          <TouchableOpacity
            className="p-1"
            hitSlop={8}
            onPress={onMorePress}
          >
            <MaterialIcons name="more-vert" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Row 2 — location + price tier */}
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center gap-1 flex-1">
            <MaterialIcons name="location-on" size={12} color="#9ca3af" />
            <Text
              className="text-xs text-[#594048] flex-1"
              numberOfLines={1}
            >
              {business.location ?? "Location not set"}
            </Text>
          </View>
          {business.priceTier && (
            <View className="bg-gray-100 rounded-full px-2.5 py-0.5 ml-2">
              <Text className="text-[11px] font-bold text-[#594048]">
                {business.priceTier}
              </Text>
            </View>
          )}
        </View>

        {/* Row 3 — rating */}
        <View className="flex-row items-center gap-1 mb-3">
          <MaterialIcons
            name="star"
            size={13}
            color={business.rating ? "#ee2b8c" : "#d1d5db"}
          />
          {business.rating ? (
            <>
              <Text className="text-xs font-bold text-[#181114]">
                {business.rating}
              </Text>
              <Text className="text-xs text-gray-400">/ 5.0</Text>
            </>
          ) : (
            <Text className="text-xs text-gray-400 italic">No rating yet</Text>
          )}
        </View>

        {/* Row 4 — stats strip */}
        <View className="flex-row border-t border-gray-100 pt-3 gap-0">
          {/* Upcoming Events */}
          <View className="flex-1 items-center">
            <Text
              className={`text-base font-extrabold ${
                isActive ? "text-[#181114]" : "text-gray-400"
              }`}
            >
              {business.upcomingEvents}
            </Text>
            <Text className="text-[9px] font-semibold text-gray-400 mt-0.5 uppercase tracking-wide">
              Events
            </Text>
          </View>

          <View className="w-px bg-gray-100" />

          {/* Total Bookings */}
          <View className="flex-1 items-center">
            <Text
              className={`text-base font-extrabold ${
                isActive ? "text-[#181114]" : "text-gray-400"
              }`}
            >
              {business.totalBookings ?? 0}
            </Text>
            <Text className="text-[9px] font-semibold text-gray-400 mt-0.5 uppercase tracking-wide">
              Bookings
            </Text>
          </View>

          <View className="w-px bg-gray-100" />

          {/* Profile Views */}
          <View className="flex-1 items-center">
            <Text
              className={`text-base font-extrabold ${
                isActive ? "text-[#181114]" : "text-gray-400"
              }`}
            >
              {formatViews(business.profileViews ?? 0)}
            </Text>
            <Text className="text-[9px] font-semibold text-gray-400 mt-0.5 uppercase tracking-wide">
              Views
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default BusinessCard;
