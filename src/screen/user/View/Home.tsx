 import ArticleCard from "@/src/features/home/components/ArticleCard";
import CoupleCard from "@/src/features/home/components/CoupleCard";
import EventCard from "@/src/features/home/components/EventCard";
import HotelCard from "@/src/features/home/components/HotelCard";
import QuickServiceButton from "@/src/features/home/components/QuickServiceButton";
import VendorCard from "@/src/features/home/components/VendorCard";
import VenueCard from "@/src/features/home/components/VenueCard";
import { useHomeData } from "@/src/features/home/hooks/useHomeData";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80";

export default function HomePage() {
  const router = useRouter();
  const { events, articles, venues, hotels, vendors, couples, quickServices } =
    useHomeData();

  const pulseScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseScale, {
          toValue: 1.08,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseScale, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, []);

  const SectionHeader = ({ title }: { title: string }) => (
    <View className="px-4 mt-8 mb-4">
      <Text className="text-xl font-bold text-gray-900 dark:text-black">
        {title}
      </Text>
      <View className="h-1 w-12 bg-primary mt-1 rounded" />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView>
        {/* Header */}
        <View className="px-4 py-4 bg-red dark:bg-surface-dark">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm text-dark-500 dark:text-dark-400">
                Hello
              </Text>
              <Text className="text-xl font-bold text-gray-900 dark:text-black">
                User
              </Text>
            </View>
            <TouchableOpacity
              className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full"
              onPress={() => router.push("/profile" as any)}
            >
              <Ionicons name="person-circle" size={32} color="#ee2b8c" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Banner */}
        <View className="mx-4 mt-4 h-48 rounded-2xl overflow-hidden">
          <Animated.Image
            source={{ uri: HERO_IMAGE }}
            className="w-full h-full"
            style={{ transform: [{ scale: pulseScale }] }}
          />
          <View className="absolute inset-0 bg-black/40" />
          <View className="absolute bottom-4 left-4">
            <Text className="text-black font-bold text-lg">
              Plan Your Dream Wedding
            </Text>
            <Text className="text-black/80 text-sm">
              Everything you need in one place
            </Text>
          </View>
        </View>

        {/* Quick Services */}
        <SectionHeader title="Quick Services" />
        <View className="px-4 flex-row flex-wrap justify-between">
          {quickServices.slice(0, 6).map((service) => (
            <QuickServiceButton key={service.id} {...service} />
          ))}
        </View>

        {/* Upcoming Events */}
        <SectionHeader title="Upcoming Events" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 16, paddingRight: 16 }}
        >
          {events.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </ScrollView>

        {/* Articles */}
        <SectionHeader title="Latest Articles" />
        <View className="px-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} {...article} />
          ))}
        </View>

        {/* Venues */}
        <SectionHeader title="Popular Venues" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 16, paddingRight: 16 }}
        >
          {venues.map((venue) => (
            <VenueCard key={venue.id} {...venue} />
          ))}
        </ScrollView>

        {/* Hotels */}
        <SectionHeader title="Recommended Hotels" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 16, paddingRight: 16 }}
        >
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} {...hotel} />
          ))}
        </ScrollView>

        {/* Vendors */}
        <SectionHeader title="Top Vendors" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 16, paddingRight: 16 }}
        >
          {vendors.map((vendor) => (
            <VendorCard key={vendor.id} {...vendor} />
          ))}
        </ScrollView>

        {/* Real Wedding Stories */}
        <SectionHeader title="Real Wedding Stories" />
        <View className="px-4 pb-8">
          {couples.map((couple) => (
            <CoupleCard key={couple.id} {...couple} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}