import { Text } from "@/src/components/ui/Text";
import { useGuestTransportation } from "@/src/features/logistics/hooks/use-transport";
import { formatDate, formatTime } from "@/src/utils/helper";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function TravelBlock({
  type,
  isRequired,
  date,
  time,
  location,
}: {
  type: "arrival" | "departure";
  isRequired: boolean;
  date: string;
  time: string;
  location: string;
}) {
  const isArrival = type === "arrival";
  const color = isArrival ? "#10b981" : "#f59e0b";
  const bgColor = isArrival ? "bg-emerald-50" : "bg-amber-50";
  const textColor = isArrival ? "text-emerald-600" : "text-amber-600";
  const borderColor = isArrival ? "border-emerald-100" : "border-amber-100";
  const icon: React.ComponentProps<typeof Ionicons>["name"] = isArrival
    ? "arrow-down-circle"
    : "arrow-up-circle";

  return (
    <View className={`flex-1 rounded-2xl ${bgColor} border ${borderColor} p-4`}>
      <View className="flex-row items-center gap-1.5 mb-3">
        <Ionicons name={icon} size={14} color={color} />
        <Text className={`text-[10px] uppercase tracking-[1.5px] font-jakarta-semibold ${textColor}`}>
          {isArrival ? "Arrival" : "Departure"}
        </Text>
      </View>

      <View
        className={`self-start rounded-full px-2.5 py-0.5 mb-3 ${
          isRequired ? bgColor : "bg-slate-100"
        } border ${isRequired ? borderColor : "border-slate-200"}`}
      >
        <Text
          className={`text-[10px] font-jakarta-semibold ${
            isRequired ? textColor : "text-slate-400"
          }`}
        >
          {isRequired ? "Pickup required" : "Not required"}
        </Text>
      </View>

      <Text className="text-sm font-jakarta-bold text-slate-900">{date}</Text>
      <Text className="text-xs text-slate-500 mt-0.5">{time}</Text>
      <View className="h-px bg-black/5 my-2.5" />
      <View className="flex-row items-start gap-1.5">
        <Ionicons name="location-outline" size={12} color="#94a3b8" style={{ marginTop: 1 }} />
        <Text className="text-xs text-slate-500 leading-relaxed flex-1">
          {location}
        </Text>
      </View>
    </View>
  );
}

function EmptyState({ icon, title, subtitle }: { icon: React.ComponentProps<typeof Ionicons>["name"]; title: string; subtitle: string }) {
  return (
    <View className="bg-white rounded-3xl border border-slate-100 p-8 items-center">
      <View className="w-12 h-12 rounded-full bg-slate-50 items-center justify-center mb-3">
        <Ionicons name={icon} size={22} color="#cbd5e1" />
      </View>
      <Text className="text-sm font-jakarta-bold text-slate-800 text-center">{title}</Text>
      <Text className="text-xs text-slate-400 mt-1.5 text-center leading-relaxed">{subtitle}</Text>
    </View>
  );
}

export default function Logistic() {
  const params = useLocalSearchParams();
  const eventId = Array.isArray(params.eventId) ? params.eventId[0] : params.eventId;

  const { data: transportData, isLoading, error, refetch } = useGuestTransportation(
    String(eventId ?? "")
  );

  const hasTransport = useMemo(
    () => Array.isArray(transportData) && transportData.length > 0,
    [transportData]
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-20"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#ee2b8c" />
        }
      >
        {/* Header */}
        <View className="pt-6 pb-5">
          <View className="flex-row items-center gap-2 mb-1">
            <View className="w-1.5 h-5 rounded-full bg-pink-500" />
            <Text className="text-[11px] uppercase tracking-[2px] text-pink-400 font-jakarta-semibold">
              Logistics
            </Text>
          </View>
          <Text className="text-2xl font-jakarta-bold text-slate-900 mt-1">
            Transport Details
          </Text>
          <Text className="text-sm text-slate-400 mt-1 leading-relaxed">
            Your arrival and departure transportation preferences.
          </Text>
        </View>

        {isLoading ? (
          <View className="items-center justify-center py-20 gap-3">
            <ActivityIndicator size="large" color="#ee2b8c" />
            <Text className="text-xs text-slate-400 tracking-wide">Loading transport…</Text>
          </View>
        ) : error ? (
          <EmptyState
            icon="alert-circle-outline"
            title="Could not load transport details"
            subtitle="Pull down to refresh or try again later."
          />
        ) : !hasTransport ? (
          <EmptyState
            icon="car-outline"
            title="No transport information"
            subtitle="Your event does not currently have transport details assigned."
          />
        ) : (
          transportData.map((item, index) => (
            <View key={item.id} className="mb-4">
              {/* Card header */}
              <View className="bg-pink-500 rounded-t-3xl px-5 py-4 flex-row items-center gap-3">
                <View className="w-9 h-9 rounded-xl bg-white/20 items-center justify-center">
                  <Ionicons name="car-outline" size={17} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-jakarta-bold text-white">
                    {item.invitation_name || "Guest Transport"}
                  </Text>
                  <Text className="text-xs text-pink-200 mt-0.5">
                    Transport #{index + 1}
                  </Text>
                </View>
                <View className="bg-white/20 rounded-full px-2.5 py-1">
                  <Ionicons name="navigate-outline" size={13} color="white" />
                </View>
              </View>

              {/* Travel blocks */}
              <View className="bg-white border-x border-b border-slate-100 rounded-b-3xl p-4">
                <View className="flex-row gap-3">
                  <TravelBlock
                    type="arrival"
                    isRequired={!!item.isArrivalPickupRequired}
                    date={formatDate(item.arrival_date_time)}
                    time={formatTime(item.arrival_date_time)}
                    location={item.arrival_info || "Not provided"}
                  />
                  <TravelBlock
                    type="departure"
                    isRequired={!!item.isDeparturePickupRequired}
                    date={formatDate(item.departure_date_time)}
                    time={formatTime(item.departure_date_time)}
                    location={item.departure_info || "Not provided"}
                  />
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}