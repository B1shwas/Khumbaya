import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const profileImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDxi8KI9kHEMPIQromCouPW5vwq-JGGn4jbMsiK6s-Upw9xHDOZUOB39BQ3ERugp--PSi3MMdwEa0lTMpk-sc27gxLNC9AUNuScdtYeAEMNUDb6uB4LMfu2olNGS9zM2RvWB-ulugtUDR1nTygKq5i0ejMmNQiZWDcCdO98uRteiiiWBmRBgBXO8KU-hoAcmnz9fMEscF-JELOx2fs8mBtDQK1QNemQMM5Pcl1EJTzcD0H_bHef1db4GOW6SuZ0DKyFE5_MjAd3SxA";

const invites = [
  {
    id: "invite-1",
    title: "Priya & Raj Sangeet",
    date: "Dec 12",
    location: "Grand Hyatt",
    category: "Catering",
    price: "$2,500",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDut9a-3NpbSX7B07V6MmC_Ry1P2MVefOUv9SJmKalIp141f42ugJwFo1_syCAHzsrbnnoF-rwLWrP5llvoCbXfMepgdE8MwdRe0UzfjqugoGPe0fc2hZ5i6ThIXPO2DQVqxXela4xO_Z4tYKKbBh2SJuypR2MiI0T2EbDIx26WBIbgzKyRzX4pvK85f9UcTDzS_V8MrWJukealkSO1iYvj6cU3a4773xxnb6XrGuOG-wAavPrWy_PSNjkmHvUDPay4P-XWtbFrKH8",
  },
  {
    id: "invite-2",
    title: "Smith Wedding Reception",
    date: "Dec 15",
    location: "The Manor",
    category: "DJ Services",
    price: "$1,800",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAYb8n7VxUge98n9NdfW2tiG4i7_ECGtXI440dUF4T8x4EpVJPzOtLPPwWppJCQFKEJC1EHAHMhxAqM7Kdmm0p6n4pFqIZgrJUcZVh6a6AIctR6th7hRn9IIFx1z2D9l4o7E3ioaBW1GRnJSbP6m-WkKRQxXlD4X8yEszMf0JVMsl1pcSvFt09mm_Ta218jvoqMFvbjvGNLscwW7znWO3vx8lQ9I3yoZqI8HnIhJNUGM6kQDrwxoKGJk8Y8xqo2DUIYyhbUFlPy0e0",
  },
];

const schedule = [
  {
    id: "today",
    label: "Today",
    time: "14:00",
    title: "Client Meeting",
    subtitle: "Video Call (Zoom)",
    // dark:bg-blue-900/30
    accent: "bg-blue-50 ",
    text: "text-blue-600 ",
    // dark:text-blue-300
    border: "border-primary",
    labelColor: "text-primary",
  },
  {
    id: "tomorrow",
    label: "Tomorrow",
    time: "17:00",
    title: "Setup: Gold Banquet",
    subtitle: "Hilton Downtown",
    // dark:bg-orange-900/30
    accent: "bg-orange-50 ",
    // dark:text-orange-300
    text: "text-orange-600 ",
    // dark:border-white/10
    border: "border-gray-200 ",
    // dark:text-gray-400
    labelColor: "text-gray-500 ",
  },
  {
    id: "wednesday",
    label: "Wednesday",
    time: "10:00",
    title: "Deposit Due",
    subtitle: "Sarah & Mike Wedding",
    // dark:bg-purple-900/30
    accent: "bg-purple-50 ",
    // dark:text-purple-300
    text: "text-purple-600 ",
    // dark:border-white/10
    border: "border-gray-200 ",
    // dark:text-gray-400
    labelColor: "text-gray-500 ",
  },
];

const VendorHomeScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  // Edge case: on very small devices, keep cards readable by capping max width.
  const cardWidth = Math.min(320, Math.round(width * 0.85));
  const cardSpacing = 16;

  return (
    // dark:bg-background-dark
    <SafeAreaView className="flex-1 bg-background-light" edges={["top"]}>
      <ScrollView
        className="flex-1"
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* dark:bg-background-dark/95 */}
        <View className="flex-row items-center px-4 py-3 justify-between bg-background-light/95  border-b border-transparent">
          <View className="flex-row items-center gap-3">
            <View className="relative">
              <Image
                source={{ uri: profileImage }}
                //  dark:border-white/10
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              {/* dark:border-[#221019] */}
              <View className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
            </View>
            <View>
              {/* dark:text-gray-400 */}
              <Text className="text-xs font-medium text-gray-500 ">Welcome back,</Text>
              {/* dark:text-white */}
              <Text className="text-[#181114]  text-lg font-bold tracking-tight">
                Radiant Events
              </Text>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            // dark:bg-white/5
            // dark:border-white/10
            className="relative w-10 h-10 items-center justify-center rounded-full bg-white border border-gray-100"
          >
            <MaterialIcons name="notifications" size={24} color="#181114" />
            <View className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
          </TouchableOpacity>
        </View>

        <View className="px-4 py-2">
          <View className="flex-row flex-wrap gap-3">
            {/* dark:bg-white/5 */}
            {/* dark:border-white/10 */}
            <View className="flex-1 min-w-[140px] rounded-xl p-4 bg-white border border-transparent" style={{ elevation: 2 }}>
              <View className="flex-row items-center gap-2 mb-1">
                {/* dark:bg-green-500/20 */}
                <View className="p-1.5 rounded-lg bg-green-50">
                  <MaterialIcons name="attach-money" size={20} color="#16a34a" />
                </View>
                {/* dark:text-gray-400 */}
                <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                  Earnings
                </Text>
              </View>
              {/* dark:text-white */}
              <Text className="text-[#181114] text-2xl font-bold tracking-tight">$4,250</Text>
              {/* dark:text-green-400 */}
              <Text className="text-xs text-green-600 font-medium">+12% vs last month</Text>
            </View>

            {/* dark:bg-white/5 */}
            {/* dark:border-white/10 */}
            <View className="flex-1 min-w-[140px] rounded-xl p-4 bg-white border border-transparent" style={{ elevation: 2 }}>
              <View className="flex-row items-center gap-2 mb-1">
                <View className="p-1.5 rounded-lg bg-primary/10">
                  <MaterialIcons name="calendar-month" size={20} color="#ee2b8c" />
                </View>
                {/* dark:text-gray-400 */}
                <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                  Active
                </Text>
              </View>
              {/* dark:text-white */}
              <Text className="text-[#181114] text-2xl font-bold tracking-tight">8</Text>
              {/* dark:text-gray-500 */}
              <Text className="text-xs text-gray-400 font-medium">2 pending actions</Text>
            </View>
          </View>

          {/* dark:bg-white/5 */}
          {/* dark:border-white/10 */}
          <View className="mt-3 w-full rounded-xl p-4 bg-white border border-transparent" style={{ elevation: 2 }}>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                {/* dark:bg-yellow-500/20 */}
                <View className="p-1.5 rounded-lg bg-yellow-50">
                  <MaterialIcons name="star" size={20} color="#eab308" />
                </View>
                {/* dark:text-gray-400 */}
                <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                  Rating
                </Text>
              </View>
              {/* dark:text-white */}
              <Text className="text-[#181114] text-lg font-bold tracking-tight">
                4.9 <Text className="text-sm font-normal text-gray-400">/ 5.0</Text>
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-6">
          <View className="flex-row items-center justify-between px-4 pb-3">
            {/* dark:text-white */}
            <Text className="text-[#181114] text-lg font-bold tracking-tight">New Invites</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text className="text-primary text-sm font-semibold">See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={cardWidth + cardSpacing}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          >
            {invites.map((invite, index) => (
              <View
                key={invite.id}
                // dark:bg-white/5
                // dark:border-white/10
                className="rounded-xl bg-white border border-gray-100 overflow-hidden mr-4"
                style={{ width: cardWidth, elevation: 3, marginRight: index === invites.length - 1 ? 0 : cardSpacing }}
              >
                <ImageBackground source={{ uri: invite.image }} className="h-36 w-full">
                  <View className="absolute inset-0 bg-black/50" />
                  <View className="absolute bottom-3 left-3 flex-row">
                    <View className="px-2 py-1 rounded-md bg-white/20">
                      <Text className="text-xs font-medium text-white">{invite.category}</Text>
                    </View>
                    <View className="ml-2 px-2 py-1 rounded-md bg-white/20">
                      <Text className="text-xs font-medium text-white">{invite.price}</Text>
                    </View>
                  </View>
                </ImageBackground>

                <View className="p-4">
                  {/* dark:text-white */}
                  <Text className="text-[#181114] text-lg font-bold leading-snug">
                    {invite.title}
                  </Text>
                  <View className="flex-row items-center gap-1 mt-1">
                    <MaterialIcons name="calendar-today" size={16} color="#6b7280" />
                    {/* dark:text-gray-400 */}
                    <Text className="text-gray-500 text-sm">{invite.date}</Text>
                    <Text className="text-gray-400 mx-1">•</Text>
                    <MaterialIcons name="location-on" size={16} color="#6b7280" />
                    {/* dark:text-gray-400 */}
                    <Text className="text-gray-500 text-sm">{invite.location}</Text>
                  </View>

                  <View className="flex-row gap-3 mt-4">
                    <TouchableOpacity
                      activeOpacity={0.7}
                      // dark:border-white/20
                      className="flex-1 h-10 rounded-lg border border-gray-200 items-center justify-center"
                    >
                      {/* dark:text-white */}
                      <Text className="text-[#181114] text-sm font-bold">Decline</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      className="flex-1 h-10 rounded-lg bg-primary items-center justify-center"
                    >
                      <Text className="text-white text-sm font-bold">Accept</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View className="mt-2 px-4">
          <View className="flex-row items-center justify-between pb-4 pt-4">
            {/* dark:text-white */}
            <Text className="text-[#181114] text-lg font-bold">Your Schedule</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text className="text-primary text-sm font-semibold">View Calendar</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-col gap-3">
            {schedule.map((item) => (
              <View key={item.id} className={`relative pl-4 border-l-2 ${item.border}`}>
                <Text className={`${item.labelColor} text-xs font-bold uppercase tracking-wider mb-2`}>
                  {item.label}
                </Text>
                {/* dark:bg-white/5 */}
                {/* dark:border-white/10 */}
                <View className="flex-row items-center p-3 bg-white rounded-lg border border-gray-100" style={{ elevation: 2 }}>
                  <View className={`h-12 w-12 rounded-lg items-center justify-center mr-4 ${item.accent}`}>
                    <Text className={`text-xs font-bold ${item.text}`}>{item.time}</Text>
                  </View>
                  <View className="flex-1">
                    {/* dark:text-white */}
                    <Text className="font-bold text-[#181114] text-base">{item.title}</Text>
                    {/* dark:text-gray-400 */}
                    <Text className="text-sm text-gray-500">{item.subtitle}</Text>
                  </View>
                  <TouchableOpacity activeOpacity={0.7} className="p-2">
                    <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Tabs render via app/(protected)/(vendor-tabs)/_layout.tsx; avoid duplicating a bottom bar here. */}
    </SafeAreaView>
  );
};

export default VendorHomeScreen;