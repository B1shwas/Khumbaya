import { MaterialIcons } from "@expo/vector-icons";
import { TextInput, View } from "react-native";
import { Text } from "../ui/Text";

export function HeaderExploreVendor() {
  return (
    <View className="px-4 pt-6 pb-2 bg-gray-50 ">
      <Text className="text-2xl mb-4 px-1 text-gray-900" variant="h1">
        Find your dream team
      </Text>

      <View className="flex-row items-center h-12 bg-white rounded-xl px-4">
        <MaterialIcons name="search" size={24} className="text-primary" />
        <TextInput
          className="flex-1 h-full px-3 text-base text-gray-900"
          placeholder="Search for photographers, venues..."
          placeholderTextColor="#9CA3AF"
          // value={searchQuery}
          // onChangeText={setSearchQuery}
        />
      </View>
    </View>
  );
}
