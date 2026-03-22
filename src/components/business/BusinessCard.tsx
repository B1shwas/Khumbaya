import { Business } from "@/src/constants/business";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface BusinessCardProps {
  business: Business;
  onPress?: () => void;
  onMorePress?: () => void;
}

const BusinessCard = React.memo(function BusinessCard({
  business,
  onPress,
  onMorePress,
}: BusinessCardProps) {
  const isActive = business.status === "active";

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      className="bg-white rounded-xl overflow-hidden shadow-sm"
      onPress={onPress}
    >
      {/* Image + overlay */}
      <View className="w-full aspect-video">
        <Image
          source={{ uri: business.imageUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />
        <View className="absolute inset-0 bg-black/45" />

        {/* Status badge */}
        <View
          className={`absolute top-3 right-3 flex-row items-center gap-1 px-2.5 py-1 rounded-full ${
            isActive ? "bg-emerald-500/90" : "bg-amber-500/90"
          }`}
        >
          {isActive && <View className="w-1.5 h-1.5 rounded-full bg-white" />}
          <Text className="text-white text-[10px] font-bold tracking-wide">
            {isActive ? "Active" : "Pending Verification"}
          </Text>
        </View>
      </View>

      {/* Body */}
      <View className="p-4">
        {/* Name + more button */}
        <View className="flex-row items-start justify-between mb-3.5">
          <View className="flex-1">
            <Text className="text-base font-bold text-[#181114] tracking-tight">
              {business.name}
            </Text>

            <View className="flex-row items-center mt-1 gap-1">
              <MaterialIcons
                name="star"
                size={14}
                color={business.rating ? "#ee2b8c" : "#d1d5db"}
              />
              {business.rating ? (
                <>
                  <Text className="text-xs font-bold text-[#181114]">
                    {business.rating}
                  </Text>
                  <Text className="text-xs text-[#594048]"> / 5.0</Text>
                </>
              ) : (
                <Text className="text-xs text-gray-400 italic">
                  Rating: N/A
                </Text>
              )}
            </View>
          </View>

          <TouchableOpacity className="p-1 -mt-0.5" hitSlop={8} onPress={onMorePress}>
            <MaterialIcons name="more-vert" size={22} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Upcoming events row */}
        <View
          className={`flex-row items-center justify-between px-3 py-2.5 rounded-lg ${
            isActive ? "bg-primary-container" : "bg-outline-variant"
          }`}
        >
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-full bg-white items-center justify-center">
              <MaterialIcons
                name="calendar-today"
                size={20}
                color={isActive ? "#ee2b8c" : "#9ca3af"}
              />
            </View>
            <View>
              <Text
                className={`text-[9px] font-bold tracking-widest ${
                  isActive ? "text-primary" : "text-gray-400"
                }`}
              >
                UPCOMING EVENTS
              </Text>
              <Text
                className={`text-xl font-extrabold ${
                  isActive ? "text-[#181114]" : "text-gray-500 opacity-60"
                }`}
              >
                {business.upcomingEvents}
              </Text>
            </View>
          </View>
          <MaterialIcons
            name="chevron-right"
            size={22}
            color={isActive ? "#181114" : "#9ca3af"}
            style={{ opacity: isActive ? 1 : 0.6 }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default BusinessCard;
