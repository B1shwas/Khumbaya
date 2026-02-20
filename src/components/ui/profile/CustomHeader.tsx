import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface CustomHeaderProps {
  title: string;
  showSaveButton?: boolean;
  onSave?: () => void;
  isLoading?: boolean;
  saveIcon?: keyof typeof MaterialIcons.glyphMap;
}

export default function CustomHeader({
  title,
  showSaveButton = false,
  onSave,
  isLoading = false,
  saveIcon = "check",
}: CustomHeaderProps) {
  const router = useRouter();

  return (
    <View className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
      <View className="flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
          accessibilityRole="button"
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back-ios-new" size={20} color="#374151" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-lg font-bold text-gray-900">{title}</Text>
        </View>
        {showSaveButton ? (
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-full bg-pink-50"
            accessibilityRole="button"
            onPress={onSave}
            disabled={isLoading}
          >
            <MaterialIcons
              name={isLoading ? "hourglass-empty" : saveIcon}
              size={20}
              color="#ee2b8c"
            />
          </TouchableOpacity>
        ) : (
          <View className="w-10" />
        )}
      </View>
    </View>
  );
}
