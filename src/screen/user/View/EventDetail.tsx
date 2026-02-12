import NavigateComponent from "@/src/components/ui/event/NavigateComponent";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, type RelativePathString } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EventDetail = ({ eventId, isInvitedGuest = false }: { eventId?: string, isInvitedGuest?: boolean }) => {
  const event = {
    id: "1",
    title: "Sarah & Mike's Wedding",
    date: "August 24, 2024",
    location: "San Francisco, CA",
    venue: "Grand Plaza Hotel",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDeW7ylSiob80ww9XoAOOV3fReuakm7CdifvgqSXNruTM_9zAafkSATg54Dmx3H7FAZ5KXTRd39NLDkX59Y3q3sxo1tkE7A7izp0iVgffzw7wQD1ZGNTwh0GVaKomwXQ9aAgwXmkYiHuyLVXHjwPa43pqfUwcXAnj00ohS22F1JIFaI0gqlP4ljcXEqU0-A1ZjuQLfYmk0FeUhi3kPIuFPTGwNPv_HTUqTqGaOGf9I_Hr5lb4N45xrwpUyAvH3ZVxD2I2QRXr3HmhQ",
    status: "Upcoming",
    days: 124,
    hours: 8,
    minutes: 45,
    guests: { confirmed: 150, total: 200 },
    budget: { spent: 12000, total: 30000 },
    tasks: { pending: 12 },
    vendors: { booked: 6, pending: 2 },
    nextTask: "Cake Tasting @ 2 PM",
  };

  const manageActions = [
    {
      id: "timeline",
      name: "Timeline",
      icon: "time",
      color: "#F59E0B",
      route: `/(protected)/(client-stack)/events/${eventId || event.id}/timeline`,
    },
    {
      id: "guests",
      name: "Guest List",
      icon: "people",
      color: "#8B5CF6",
      route: `/(protected)/(client-stack)/events/${eventId || event.id}/guests`,
    },
    {
      id: "vendors",
      name: "Vendors",
      icon: "business",
      color: "#3B82F6",
      route: `/(protected)/(client-stack)/events/${eventId || event.id}/vendors`,
    },
    {
      id: "budget",
      name: "Budget",
      icon: "wallet",
      color: "#10B981",
      route: `/(protected)/(client-stack)/events/${eventId || event.id}/budget`,
    },
  ];

  const budgetRemaining = event.budget.total - event.budget.spent;

  return (
    <SafeAreaView className="flex-1 bg-background-light">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="relative w-full h-[38vh] min-h-[300px] ">
          <Image
            source={{ uri: event.imageUrl }}
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
          />
          {/* NOTE: NativeWind doesn't support bg-gradient-to-* in RN. */}
          <LinearGradient
            colors={["rgba(0,0,0,1)", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.3)"]}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0.5, y: 0 }}
            className="absolute inset-0"
          />

          {/* Top Navigation notification and three dots */}
          <View className="absolute top-0 left-0 w-full p-4 pt-6 flex-row justify-between items-start z-10">

            <TouchableOpacity
              className="p-2 rounded-full bg-white/20 backdrop-blur-sm"
              onPress={() => router.replace("/(protected)/(client-tabs)/events")}
            >
              <Ionicons name="arrow-back" size={26} color="white" />
            </TouchableOpacity>
            <View className="flex-row gap-3">
              <TouchableOpacity className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
                <Ionicons name="notifications" size={26} color="white" />
              </TouchableOpacity>
              <TouchableOpacity className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
                <Ionicons name="ellipsis-vertical" size={26} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Hero Content */}
          <View className="absolute bottom-10 left-0 w-full px-6 z-10 mb-4">
            <View className="flex-col gap-1 items-center justify-center">
              <Text className="px-4 py-2 bg-primary/90 text-white text-sm font-bold rounded mb-2 tracking-wide text-center">
                {event.status}
              </Text>
              <Text className="text-3xl font-extrabold text-white leading-tight tracking-tight text-center">
                {event.title}
              </Text>
              <View className="flex-row items-center gap-2 text-white/90 mt-1">
                <Ionicons name="calendar" size={18} color="white" />
                <Text className="text-sm font-medium text-white">{event.date}</Text>
                <Text className="mx-1 opacity-50">•</Text>
                <Ionicons name="location" size={18} color="white" />
                <Text className="text-sm font-medium text-white">{event.location}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Countdown Timer */}
        <View className="px-4 -mt-10 z-20">

          {/* dark:border-gray-800 removed */}
          {/* surface light */}
          <View className="bg-background-light rounded-2xl shadow-sm shadow-black p-5 flex-row justify-between items-center border border-gray-100">
            <View className="flex-col items-center flex-1">
              <Text className="text-2xl font-black text-primary">
                {event.days}
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                Days
              </Text>
            </View>
            {/* dark:bg-gray-700 */}
            <View className="h-8 w-[1px] bg-gray-200 " />
            <View className="flex-col items-center flex-1">
              <Text className="text-2xl font-black text-primary">
                {String(event.hours).padStart(2, "0")}
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                Hrs
              </Text>
            </View>
            {/* dark:bg-gray-700 removed */}
            <View className="h-8 w-[1px] bg-gray-200" />
            <View className="flex-col items-center flex-1">
              <Text className="text-2xl font-black text-primary">
                {String(event.minutes).padStart(2, "0")}
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                Mins
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Stats Row */}
        <View className="mt-6 px-4">
          <View className="flex-row items-center justify-between mb-3">
            {/* dark:text-white removed */}
            <Text className="text-lg font-bold">Quick Stats</Text>
            <TouchableOpacity>
              <Text className="text-sm font-semibold text-primary">
                View All
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {/* Guests Card */}
            {/* dark:bg-surface-dark and dark:border-gray-800 removed */}
            <View className="min-w-[160px] flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-50 flex-col items-center justify-center gap-2">
              <View className="relative w-16 h-16">
                {/* dark:border-gray-700 removed */}
                <View className="absolute inset-0 rounded-full border-4 border-gray-100" />
                <View
                  className="absolute inset-0 rounded-full border-4 border-primary"
                  style={{ borderBottomColor: 'transparent', borderRightColor: 'transparent', transform: [{ rotate: '270deg' }] }}
                />
                <View className="absolute inset-0 flex items-center justify-center">
                  {/* dark:text-white removed */}
                  <Text className="text-xs font-bold text-gray-700">75%</Text>
                </View>
              </View>
              <View className="text-center">
                {/* dark:text-white removed */}
                <Text className="text-sm font-bold text-gray-900">Guests</Text>
                <Text className="text-xs text-gray-500">150/200 Yes</Text>
              </View>
            </View>

            {/* Budget Card */}
            {/* dark:bg-surface-dark and dark:border-gray-800 removed */}
            <View className="min-w-[160px] flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-50 flex-col justify-between">
              <View>
                {/* dark:bg-green-900/30 and dark:text-green-400 removed */}
                <View className="p-1.5 bg-green-100 text-green-600 rounded-lg w-fit">
                  <Ionicons name="pricetag" size={20} color="#16A34A" />
                </View>
                {/* dark:text-white removed */}
                <Text className="text-sm font-bold mt-2 text-gray-900">Budget</Text>
                <Text className="text-xs text-gray-500">$12k / $30k</Text>
              </View>
              {/* dark:bg-gray-700 removed */}
              <View className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
                <View className="bg-primary h-1.5 rounded-full" style={{ width: '40%' }} />
              </View>
            </View>

            {/* Tasks Card */}
            {/* dark:bg-surface-dark and dark:border-gray-800 removed */}
            <View className="min-w-[160px] flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-50 flex-col justify-between">
              <View>
                {/* dark:bg-orange-900/30 and dark:text-orange-400 removed */}
                <View className="p-1.5 bg-orange-100 text-orange-600 rounded-lg w-fit">
                  <Ionicons name="checkmark-circle" size={20} color="#EA580C" />
                </View>
                {/* dark:text-white removed */}
                <Text className="text-sm font-bold mt-2 text-gray-900">Tasks</Text>
                <Text className="text-xs text-gray-500">12 Pending</Text>
              </View>
              {/* dark:bg-gray-700 removed */}
              <View className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
                <View className="bg-orange-500 h-1.5 rounded-full" style={{ width: '65%' }} />
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Main Navigation Grid */}
        <View className="  mt-6 px-4 pb-4">
          {/* dark:text-white removed */}
          <Text className="text-lg font-bold mb-3">Manage Event</Text>
          <View className="flex-row flex-wrap gap-3 justify-center">
            {manageActions.map((action) => (
              <NavigateComponent key={action.id} {...action} />
            ))}

            {/* Gallery - Full Width */}
            <TouchableOpacity
              className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 active:scale-[0.98] transition-transform flex-row items-center gap-4"
              onPress={() =>
                router.push("/events/gallery" as RelativePathString)
              }
            >
              <View className="p-2.5 bg-primary/10 rounded-full shrink-0">
                <Ionicons name="images" size={20} color="#ee2b8c" />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-gray-900 text-base">
                  Gallery
                </Text>
                <Text className="text-xs text-gray-500">
                  Upload & Share Photos
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Invited Guest Notice */}
        {isInvitedGuest && (
          <View className="mx-4 mb-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <View className="flex-row items-center gap-2">
              <Ionicons name="information-circle" size={20} color="#3B82F6" />
              <Text className="text-sm text-blue-700">
                You're viewing this event as a guest. Some features like budget
                management are only available to the event organizer.
              </Text>
            </View>
          </View>
        )}

        {/* Bottom spacer */}
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
};
export default EventDetail;