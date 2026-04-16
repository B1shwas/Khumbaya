import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import KPICard from "@/src/components/catering/KPICard";
import PrepIntensityChart from "@/src/components/catering/PrepIntensityChart";
import ServiceQueueTable from "@/src/components/catering/ServiceQueueTable";
import StaffStatusCard from "@/src/components/catering/StaffStatusCard";

const KPI_ITEMS = [
  {
    id: "1",
    label: "Next Service",
    value: "10:30 AM",
    icon: "⏰",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-500",
  },
  {
    id: "2",
    label: "Total Guests",
    value: "1,240",
    icon: "👥",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    id: "3",
    label: "Active Queues",
    value: "14",
    icon: "🍽️",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-500",
  },
  {
    id: "4",
    label: "Served Today",
    value: "82%",
    icon: "✅",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-500",
  },
];

export default function CateringDashboard() {
  return (
    <SafeAreaView className="flex-1 bg-zinc-50" edges={["top", "bottom"]}>
      <View className="bg-white border-b border-zinc-100 px-4 py-3 items-center justify-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute left-4 w-8 h-8 rounded-md items-center justify-center"
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text className="text-[17px] font-extrabold text-black tracking-tight text-center">
          Catering Dashboard
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row gap-3 mb-4 flex-wrap">
          {KPI_ITEMS.map((k) => (
            <View key={k.id} style={{ width: "47.5%" }}>
              <KPICard
                label={k.label}
                value={k.value}
                icon={k.icon}
                iconBg={k.iconBg}
                iconColor={k.iconColor}
              />
            </View>
          ))}
        </View>

        <ServiceQueueTable />

        <View className="gap-4">
          <PrepIntensityChart />
          <StaffStatusCard />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
