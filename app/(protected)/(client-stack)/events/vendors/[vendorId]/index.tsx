import { useLocalSearchParams } from "expo-router";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const VendorDetailScreen = () => {
  const { vendorId } = useLocalSearchParams<{ vendorId?: string }>();

  return (
    <SafeAreaView className="flex-1 bg-background-light">
      <ScrollView contentContainerClassName="p-4">
        <View className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <Text className="text-xl font-bold text-slate-900">
            Vendor Detail
          </Text>
          <Text className="mt-2 text-sm text-gray-500">
            Vendor ID: {vendorId || "Not provided"}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VendorDetailScreen;
