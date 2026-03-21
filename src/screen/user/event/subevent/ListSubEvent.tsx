import { Event } from "@/src/constants/event";
import { useSubEventsOfEvent } from "@/src/features/events/hooks/use-event";
import {
  formatDate,
  formatTimeRange,
  getDateKey,
  getSubEventStatusMeta,
  sortByDateTime,
} from "@/src/utils/helper";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type SubEvent = Event;

export default function ListSubEvent() {
  const router = useRouter();

  const { eventId } = useLocalSearchParams();
  const {
    data: subEventsResponse,
    isLoading,
    refetch,
  } = useSubEventsOfEvent(Number(eventId));

  const subEvents = (subEventsResponse ?? []) as SubEvent[];

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);

  const dayGroups = useMemo(() => {
    if (subEvents.length === 0) return [];

    const grouped = new Map<
      string,
      { key: string; dateValue: string; items: SubEvent[]; label: string }
    >();

    subEvents.forEach((item) => {
      const dateValue = item.startDateTime || item.date;
      const key = getDateKey(dateValue);
      if (!key) return;

      if (!grouped.has(key)) {
        grouped.set(key, {
          key,
          dateValue,
          items: [],
          label: "",
        });
      }

      grouped.get(key)?.items.push(item);
    });

    return Array.from(grouped.values())
      .sort((a, b) => new Date(a.key).getTime() - new Date(b.key).getTime())
      .map((group, index) => ({
        ...group,
        label: `Day ${index + 1}`,
      }));
  }, [subEvents]);

  useEffect(() => {
    if (!selectedDayKey && dayGroups.length > 0) {
      setSelectedDayKey(dayGroups[0].key);
    }
  }, [dayGroups, selectedDayKey]);

  const filteredSubEvents = useMemo(() => {
    const scopedItems = selectedDayKey
      ? dayGroups.find((group) => group.key === selectedDayKey)?.items ?? []
      : subEvents;

    return sortByDateTime(scopedItems, (item) =>
      item.startDateTime || item.date ? item.startDateTime || item.date : null
    );
  }, [dayGroups, selectedDayKey, subEvents]);

  const getStatusIcon = (status: string) => {
    const normalized = status?.toLowerCase?.() ?? "upcoming";
    if (normalized === "completed") return "checkmark-circle";
    if (normalized === "ongoing") return "heart";
    if (normalized === "cancelled") return "close-circle";
    return "calendar-outline";
  };

  const getStatusIconColor = (status: string) => {
    const normalized = status?.toLowerCase?.() ?? "upcoming";
    if (normalized === "completed") return "#16A34A";
    if (normalized === "ongoing") return "#C026D3";
    if (normalized === "cancelled") return "#DC2626";
    return "#5a2c3e";
  };

  const getStatusCircleStyle = (status: string) => {
    const normalized = status?.toLowerCase?.() ?? "upcoming";
    if (normalized === "completed") {
      return { borderColor: "#16A34A", backgroundColor: "#DCFCE7" };
    }
    if (normalized === "ongoing") {
      return { borderColor: "#C026D3", backgroundColor: "#F5D0FE" };
    }
    if (normalized === "cancelled") {
      return { borderColor: "#DC2626", backgroundColor: "#FEE2E2" };
    }
    return { borderColor: "#5a2c3e", backgroundColor: "#F3E8EE" };
  };

  const getDerivedStatus = (item: SubEvent) => {
    const start = item.startDateTime || item.date;
    const end = item.endDateTime || item.startDateTime || item.date;
    if (!start) return "upcoming";

    const now = new Date().getTime();
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();

    if (!Number.isFinite(startTime) || !Number.isFinite(endTime)) {
      return item.status || "upcoming";
    }

    if (endTime < now) return "completed";
    if (startTime <= now && now <= endTime) return "ongoing";
    return "upcoming";
  };

  const renderSubEventCard = ({
    item,
    index,
  }: {
    item: SubEvent;
    index: number;
  }) => {
    const derivedStatus = getDerivedStatus(item);
    const statusMeta = getSubEventStatusMeta(derivedStatus);
    const timeRange = formatTimeRange(item.startDateTime, item.endDateTime);
    const statusIcon = getStatusIcon(derivedStatus);
    const statusIconColor = getStatusIconColor(derivedStatus);
    const statusCircleStyle = getStatusCircleStyle(derivedStatus);
    const isFirst = index === 0;
    const isLast = index === filteredSubEvents.length - 1;
    const iconCenterOffset = 22;

    return (
      <View className="relative flex-row gap-4 pb-6">
        {!isFirst ? (
          <View
            className="absolute z-0 w-0.5 bg-[#e6dbe0]"
            style={{ left: 20, top: 0, height: iconCenterOffset }}
          />
        ) : null}
        {!isLast ? (
          <View
            className="absolute z-0 w-0.5 bg-[#e6dbe0]"
            style={{ left: 20, top: iconCenterOffset, bottom: 0 }}
          />
        ) : null}
        <View className="flex-col items-center z-10">
          <View
            className={`w-11 h-11 rounded-full items-center justify-center border ${statusMeta.dotClassName}`}
            style={statusCircleStyle}
          >
            <Ionicons name={statusIcon} size={18} color={statusIconColor} />
          </View>
        </View>

        <TouchableOpacity
          className={`flex-1 bg-white rounded-2xl p-4 ${statusMeta.cardClassName}`}
          activeOpacity={0.85}
          onPress={() => {
            router.push({
              pathname:
                "/(protected)/(client-stack)/events/[eventId]/(organizer)/(subevent)/[subEventId]/subevntdetail",
              params: {
                eventId: eventId as string,
                subEventId: String(item.id),
              },
            });
          }}
        >
          <View className="flex-row items-start justify-between mb-1">
            <Text className="text-xs font-bold text-primary uppercase tracking-widest">
              {timeRange}
            </Text>
            <View className={`px-2 py-1 rounded-lg  ${statusMeta.badgeClassName} `}>
              <Text className="text-[10px] font-bold uppercase text-white">
                {statusMeta.label}
              </Text>
            </View>
          </View>

          <Text className="text-base font-bold text-gray-900 mb-3">
            {item.title}
          </Text>

          <View className="flex-row items-center gap-3 mb-3">
            {item.imageUrl ? (
              <View className="w-12 h-12 rounded-xl overflow-hidden bg-gray-200">
                <Image
                  source={{ uri: item.imageUrl }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            ) : (
              <View className="w-12 h-12 rounded-xl bg-gray-100 items-center justify-center">
                <Ionicons name="image-outline" size={20} color="#9CA3AF" />
              </View>
            )}

            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-900">
                {item.location && item.location !== "TBD"
                  ? item.location
                  : "Location TBD"}
              </Text>
              <Text className="text-xs text-[#896175]">
                {formatDate(item.startDateTime || item.date)}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between">
            {item.theme ? (
              <Text className="text-xs text-gray-500">
                Theme: <Text className="text-gray-700">{item.theme}</Text>
              </Text>
            ) : (
              <View />
            )}
            <Text className="text-sm font-semibold text-primary">
              ₹{item.budget?.toLocaleString()}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center py-20">
      <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-4">
        <Ionicons name="layers-outline" size={40} color="#9CA3AF" />
      </View>
      <Text className="text-lg font-semibold text-gray-900 mb-2">
        No Sub-Events Yet
      </Text>
      <Text className="text-sm text-gray-500 text-center px-8">
        Create your first sub-event to get started
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-[#f8f6f7] p-2">
      <View className="bg-white/80 border-b border-[#e6dbe0]">
      

        {dayGroups.length > 1 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          >
            {dayGroups.map((group) => {
              const isActive = selectedDayKey === group.key;
              return (
                <TouchableOpacity
                  key={group.key}
                  onPress={() => setSelectedDayKey(group.key)}
                  className={`mr-3 px-5 py-2.5 rounded-2xl border ${
                    isActive
                      ? "bg-primary border-transparent"
                      : "bg-white border-[#e6dbe0]"
                  }`}
                >
                  <Text
                    className={`text-xs uppercase tracking-wider mb-1 ${
                      isActive ? "text-white/70" : "text-[#896175]"
                    }`}
                  >
                    {formatDate(group.dateValue)}
                  </Text>
                  <Text
                    className={`text-sm font-semibold ${
                      isActive ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {group.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        ) : null}
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Loading...</Text>
        </View>
      ) : filteredSubEvents.length === 0 ? (
        renderEmptyState()
      ) : (
        <View className="flex-1 px-4 pb-24">
<View
>
  </View>
          <FlatList
            data={filteredSubEvents}
            renderItem={renderSubEventCard}
            keyExtractor={(item) => String(item.id)}
            contentContainerClassName="pt-4 pb-24"
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname:
              "/(protected)/(client-stack)/events/[eventId]/(organizer)/subevent-create",
            params: { eventId: eventId as string },
          });
        }}
        className="absolute bottom-6 right-6 flex-row items-center gap-2 bg-primary px-5 py-3 rounded-full shadow-2xl"
      >
        <Ionicons name="add-circle" size={20} color="white" />
        <Text className="text-white font-bold tracking-wide">Add Activity</Text>
      </TouchableOpacity>
    </View>
  );
}
