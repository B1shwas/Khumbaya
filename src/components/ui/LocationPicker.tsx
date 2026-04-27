import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useState } from "react";
import { ActivityIndicator, Alert, TextInput, TouchableOpacity, View } from "react-native";
import MapPicker from "./MapPicker";
import { Text } from "./Text";

interface LocationPickerProps {
  latitude: string;
  longitude: string;
  onChange: (lat: string, lng: string) => void;
  label?: string;
  mapHeight?: number;
}

export default function LocationPicker({
  latitude,
  longitude,
  onChange,
  label = "Location Pin (Optional)",
  mapHeight = 200,
}: LocationPickerProps) {
  const [fetching, setFetching] = useState(false);

  const handlePick = (lat: string, lng: string) => {
    onChange(lat, lng);
  };

  const useMyLocation = async () => {
    setFetching(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required to use this feature.");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const lat = loc.coords.latitude.toFixed(6);
      const lng = loc.coords.longitude.toFixed(6);
      onChange(lat, lng);
    } catch {
      Alert.alert("Error", "Could not fetch location. Please enter coordinates manually.");
    } finally {
      setFetching(false);
    }
  };

  return (
    <View>
      <View className="flex-row items-center justify-between ml-1 mb-1.5">
        <Text variant="h1" className="text-[11px] text-[#594048] uppercase tracking-widest">
          {label}
        </Text>
        <TouchableOpacity
          onPress={useMyLocation}
          activeOpacity={0.8}
          className="flex-row items-center gap-1 bg-[#fdf2f8] px-3 py-1.5 rounded-full"
        >
          {fetching ? (
            <ActivityIndicator size="small" color="#ee2b8c" />
          ) : (
            <MaterialIcons name="my-location" size={14} color="#ee2b8c" />
          )}
          <Text className="text-[#ee2b8c] text-[12px] font-semibold">
            {fetching ? "Locating…" : "Use My Location"}
          </Text>
        </TouchableOpacity>
      </View>

      <MapPicker
        latitude={latitude}
        longitude={longitude}
        onPick={handlePick}
        height={mapHeight}
      />

      <View className="flex-row gap-3 mt-3">
        <View className="flex-1">
          <Text className="text-[10px] text-gray-400 uppercase tracking-widest ml-1 mb-1">Latitude</Text>
          <View className="flex-row items-center bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            <MaterialIcons name="swap-vert" size={16} color="#9ca3af" style={{ marginLeft: 12 }} />
            <TextInput
              className="flex-1 px-2 py-3 text-[#181114] font-semibold text-[14px]"
              placeholder="27.7172"
              placeholderTextColor="#d1d5db"
              keyboardType="numeric"
              value={latitude}
              onChangeText={(text) => onChange(text, longitude)}
            />
          </View>
        </View>
        <View className="flex-1">
          <Text className="text-[10px] text-gray-400 uppercase tracking-widest ml-1 mb-1">Longitude</Text>
          <View className="flex-row items-center bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            <MaterialIcons name="swap-horiz" size={16} color="#9ca3af" style={{ marginLeft: 12 }} />
            <TextInput
              className="flex-1 px-2 py-3 text-[#181114] font-semibold text-[14px]"
              placeholder="85.3240"
              placeholderTextColor="#d1d5db"
              keyboardType="numeric"
              value={longitude}
              onChangeText={(text) => onChange(latitude, text)}
            />
          </View>
        </View>
      </View>
      <Text className="text-[11px] text-gray-400 mt-1.5 ml-1">
        Tap the map to drop a pin, or enter coordinates manually.
      </Text>
    </View>
  );
}
