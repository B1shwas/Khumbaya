import { getBusinessIcon } from "@/src/constants/business-icons";
import { Business } from "@/src/features/business/types/index";
import { shadowStyle } from "@/src/utils/helper";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface BusinessCardProps {
  business: Business;
  onPress?: () => void;
  onMorePress?: () => void;
}

function formatViews(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

const BusinessCard = React.memo(function BusinessCard({
  business,
  onPress,
  onMorePress,
}: BusinessCardProps) {
  const isActive = business.isVerified;
  const coverUri = business.cover ?? business.avatar ?? undefined;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      className="bg-white rounded-md overflow-hidden"
      style={shadowStyle}
      onPress={onPress}
    >
      {/* ── Cover image ── */}
      <View className="w-full bg-black">
        <Image
          source={coverUri ? { uri: coverUri } : require("@/assets/images/screen.png")}
          className="w-full h-32"
          resizeMode="cover"
        />
        <View className="absolute inset-0 bg-black/20" />

        {/* Status badge */}
        <View
          className={`absolute top-3 right-3 flex-row items-center gap-1 px-2.5 py-1 rounded-full ${
            isActive ? "bg-emerald-500/90" : "bg-amber-500/90"
          }`}
        >
          {isActive && <View className="w-1.5 h-1.5 rounded-full bg-white" />}
          <Text className="text-white text-[10px] font-bold tracking-wide">
            {isActive ? "Verified" : "Pending Verification"}
          </Text>
        </View>
      </View>

      {/* ── Body ── */}
      <View className="px-4 pt-3.5 pb-4">
        {/* Row 1 — icon + name + more */}
        <View className="flex-row items-center gap-2.5 mb-1.5">
          <View className="w-8 h-8 rounded-lg bg-primary/10 items-center justify-center">
            <MaterialIcons
              name={getBusinessIcon(business.category as any ?? undefined)}
              size={16}
              color="#ee2b8c"
            />
          </View>
          <Text
            className="flex-1 text-base font-bold text-[#181114] tracking-tight"
            numberOfLines={1}
          >
            {business.businessName}
          </Text>
          <TouchableOpacity className="p-1" hitSlop={8} onPress={onMorePress}>
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
              {business.city && business.country
                ? `${business.city}, ${business.country}`
                : business.city ?? business.country ?? business.location ?? "Location not set"}
            </Text>
          </View>
          {business.priceStartingFrom != null && (
            <View className="bg-gray-100 rounded-full px-2.5 py-0.5 ml-2">
              <Text className="text-[11px] font-bold text-[#594048]">
                From {business.priceStartingFrom.toLocaleString()}
              </Text>
            </View>
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
              {business.upcomingEvents ?? 0}
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
