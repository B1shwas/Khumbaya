import { Business } from "@/src/features/business/types";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { Text } from "../../ui/Text";

import { getBusinessIcon } from "@/src/constants/business-icons";
export function HeroSection({
  business,
  onEditPress,
}: {
  business: Business;
  onEditPress: () => void;
}) {
  const [locationText, setLocationText] = useState(
    business.location ?? "Location not pinned"
  );

  useEffect(() => {
    if (business.latitude == null || business.longitude == null) return;
    Location.reverseGeocodeAsync({
      latitude: Number(business.latitude),
      longitude: Number(business.longitude),
    }).then((results) => {
      const r = results[0];
      if (!r) return;
      const parts = [r.name, r.district, r.city, r.region, r.country].filter(Boolean);
      const label = parts.slice(0, 3).join(", ");
      if (label) setLocationText(label);
    }).catch(() => {});
  }, [business.latitude, business.longitude]);

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
                {locationText}
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
