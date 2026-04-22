import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EventSuccessPage() {
  const handleCreateSubEvent = () => {
    router.push("/event/subevent-create");
  };

  const handleViewEvents = () => {
    router.replace("/(protected)/(client-tabs)/events");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f8f6f7]">
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow p-5 pt-10"
        showsVerticalScrollIndicator={false}
      >
        {/* Success Hero */}
        <View className="w-[200px] h-[200px] rounded-full bg-primary self-center mt-5 mb-8 relative items-center justify-center shadow-lg">
          <View className="w-40 h-40 rounded-full bg-primary items-center justify-center border-4 border-white/30">
            <View className="w-20 h-20 rounded-full bg-white items-center justify-center">
              <Ionicons name="checkmark" size={48} color="#ee2b8c" />
            </View>
          </View>
          <View className="absolute -top-2.5 -right-2.5 w-12 h-12 rounded-full bg-white items-center justify-center shadow">
            <Ionicons name="heart" size={24} color="#ee2b8c" />
          </View>
          <View className="absolute bottom-7 -left-5 w-12 h-12 rounded-full bg-white items-center justify-center shadow">
            <Ionicons name="star" size={20} color="#F59E0B" />
          </View>
          <View className="absolute -bottom-1 right-7 w-12 h-12 rounded-full bg-white items-center justify-center shadow">
            <Ionicons name="sparkles" size={18} color="#9333EA" />
          </View>
        </View>

        {/* Text */}
        <View className="items-center mb-8">
          <Text className="text-[28px] font-bold text-[#181114] mb-3 text-center">
            🎉 Congratulations!
          </Text>
          <Text className="text-lg font-semibold text-[#181114] mb-2 text-center">
            Your event has been created successfully!
          </Text>
          <Text className="text-sm text-gray-500 text-center max-w-[280px]">
            Your dream celebration is now set up. What's next?
          </Text>
        </View>

        {/* Action Options */}
        <View className="gap-4 mb-8">
          <TouchableOpacity
            className="flex-row items-center bg-white rounded-2xl p-4 shadow-sm"
            onPress={handleCreateSubEvent}
            activeOpacity={0.8}
          >
            <View className="w-14 h-14 rounded-full bg-violet-100 items-center justify-center mr-4">
              <Ionicons name="sparkles" size={28} color="#9333EA" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-[#181114] mb-1">
                Create Sub Event
              </Text>
              <Text className="text-xs text-gray-500">
                Sangeet, Mehendi, Reception
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#D1D5DB" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center bg-white rounded-2xl p-4 shadow-sm"
            onPress={handleViewEvents}
            activeOpacity={0.8}
          >
            <View className="w-14 h-14 rounded-full bg-primary/10 items-center justify-center mr-4">
              <Ionicons name="calendar" size={28} color="#ee2b8c" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-[#181114] mb-1">
                View My Events
              </Text>
              <Text className="text-xs text-gray-500">See all your events</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#D1D5DB" />
          </TouchableOpacity>
        </View>

        {/* Next Steps */}
        <View className="bg-white rounded-2xl p-5 shadow-sm">
          <Text className="text-sm font-semibold text-[#181114] mb-4">
            Next Steps
          </Text>
          <View className="flex-row items-center gap-3 py-2">
            <Ionicons name="people" size={20} color="#6B7280" />
            <Text className="text-sm text-gray-500">Invite your guests</Text>
          </View>
          <View className="flex-row items-center gap-3 py-2">
            <Ionicons name="storefront" size={20} color="#6B7280" />
            <Text className="text-sm text-gray-500">Book vendors</Text>
          </View>
          <View className="flex-row items-center gap-3 py-2">
            <Ionicons name="wallet" size={20} color="#6B7280" />
            <Text className="text-sm text-gray-500">Set up your budget</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
