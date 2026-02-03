import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomePage() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Hero Section */}
          <View className="mb-8">
            <Text className="font-display text-5xl font-bold text-text-primary mb-4">
              Welcome to Khumbaya
            </Text>
            <Text className="font-sans text-lg text-text-secondary">
              Your celebration planning platform
            </Text>
          </View>

          {/* Feature Cards */}
          <View className="space-y-4">
            <View className="bg-primary-50 p-6 rounded-xl border border-primary-200">
              <Text className="font-display text-2xl font-semibold text-primary-700 mb-2">
                Plan Events
              </Text>
              <Text className="font-sans text-base text-text-secondary">
                Organize your celebrations with ease
              </Text>
            </View>

            <View className="bg-secondary-50 p-6 rounded-xl border border-secondary-200">
              <Text className="font-display text-2xl font-semibold text-secondary-700 mb-2">
                Connect Vendors
              </Text>
              <Text className="font-sans text-base text-text-secondary">
                Find the perfect vendors for your event
              </Text>
            </View>

            <View className="bg-accent-50 p-6 rounded-xl border border-accent-200">
              <Text className="font-display text-2xl font-semibold text-accent-700 mb-2">
                Manage Guests
              </Text>
              <Text className="font-sans text-base text-text-secondary">
                Keep track of your guest list effortlessly
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
