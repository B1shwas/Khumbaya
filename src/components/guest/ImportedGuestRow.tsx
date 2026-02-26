import { Text, View } from "react-native";
import type { Guest } from "../../features/guests/hooks/useGuests";

interface ImportedGuestRowProps {
  guest: Guest;
}

export default function ImportedGuestRow({ guest }: ImportedGuestRowProps) {
  return (
    <View className="flex-row items-center py-2 border-b border-gray-100">
      <View className="w-8 h-8 rounded-full bg-pink-500 items-center justify-center mr-3">
        <Text className="text-white text-xs font-semibold">
          {guest.initials}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="text-sm font-medium text-gray-900">{guest.name}</Text>
        <Text className="text-xs text-gray-500">
          {guest.phone} • {guest.relation}
        </Text>
      </View>
    </View>
  );
}
