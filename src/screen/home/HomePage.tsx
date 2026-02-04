import { Link, router } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function HomePage() {
  const explorevendorclick =()=> {
    router.push('/explore');
  }
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="flex-1 px-6 pt-8">
          {/* Hero Image */}
          <View className="mb-8">
            <View className="relative">
              <Image
                source={require("@/assets/images/home.png")}
                className="w-full h-[50vh] rounded-3xl"
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Title */}
          <Text className="text-2xl font-bold text-gray-900 text-center mb-4">
            Find Top Vendors
          </Text>

          {/* Description */}
          <Text className="text-base text-gray-500 text-center mb-8 px-2 leading-6">
            Discover and book the best photographers, caterers, and decorators
            for your big day.
          </Text>

          {/* Create Event Button */}
          <TouchableOpacity
            className="bg-primary py-4 rounded-md mb-4 shadow-lg"
            style={{ shadowColor: "#ee2b8c", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.3, shadowRadius: 4 }}
            activeOpacity={0.8}
          >
            <Text className="text-white text-center text-lg font-semibold">
              Create Event
            </Text>
          </TouchableOpacity>

          {/* Explore Vendors Button */}
          <TouchableOpacity
            className="bg-primary/10  py-4 rounded-md mb-6 shadow-lg"
            onPress={explorevendorclick}
            activeOpacity={0.8}
          >
            <Text className="text-primary text-center text-lg font-semibold ">
              Explore Vendors
            </Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View className="flex-row justify-center items-center">
            <Text className="text-muted-light text-base">
              Already have an account?{" "}
            </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text className="text-primary text-base font-semibold underline">
                  Login
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
