import SubEventCard from "@/src/components/event/subevent/CardSubevent";
import { SubEvent } from "@/src/constants/event";
import { useSubEventsOfEvent } from "@/src/features/events/hooks/use-event";
import { formatDayOnly, formatShort, sortByDateTime } from "@/src/utils/helper";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ParsedSubEvent = {
  item: SubEvent;
  startTime: number;
  endTime: number;
};

type MergedGroup = {
  key: string;
  dateValue: string;
  items: SubEvent[];
  label: string;
  startTime: number;
  endTime: number;
};

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

  const parseSubEvent = (item: SubEvent): ParsedSubEvent | null => {
    const start = item.startDateTime;
    if (!start) return null;
    const startTime = new Date(start).getTime();
    if (!Number.isFinite(startTime)) return null;

    const endRaw = item.endDateTime ?? start;
    const endTime = new Date(endRaw).getTime();
    if (!Number.isFinite(endTime)) return null;

    return { item, startTime, endTime };
  };

  const groupByDate = (entries: ParsedSubEvent[]): MergedGroup[] => {
    if (entries.length === 0) return [];

    const sorted = [...entries].sort((a, b) => a.startTime - b.startTime);
    const groupsMap = new Map<string, MergedGroup>();

    sorted.forEach((entry) => {
      const dateValue = new Date(entry.startTime).toISOString().slice(0, 10);
      const existingGroup = groupsMap.get(dateValue);

      if (existingGroup) {
        existingGroup.items.push(entry.item);
        existingGroup.startTime = Math.min(
          existingGroup.startTime,
          entry.startTime
        );
        existingGroup.endTime = Math.max(existingGroup.endTime, entry.endTime);
        return;
      }

      groupsMap.set(dateValue, {
        key: dateValue,
        dateValue,
        items: [entry.item],
        label: "",
        startTime: entry.startTime,
        endTime: entry.endTime,
      });
    });

    return Array.from(groupsMap.values());
  };

  const dayGroups = useMemo(() => {
    if (subEvents.length === 0) return [];

    const parsedItems = subEvents
      .map(parseSubEvent)
      .filter((entry): entry is ParsedSubEvent => entry !== null);

    if (parsedItems.length === 0) return [];

    const groupedByDate = groupByDate(parsedItems);

    return groupedByDate.map((group, index) => ({
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
      ? (dayGroups.find((group) => group.key === selectedDayKey)?.items ?? [])
      : subEvents;

    return sortByDateTime(scopedItems, (item) => item.startDateTime);
  }, [dayGroups, selectedDayKey, subEvents]);

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center py-20">
      <View className="w-20 h-20 rounded-md bg-gray-100 items-center justify-center mb-4">
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
      <View className="pt-2">
        {dayGroups.length > 1 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          >
            {dayGroups.map((group) => {
              const isActive = selectedDayKey === group.key;
              const startValue = group.items[0]?.startDateTime;
              const parsedDate = startValue ? new Date(startValue) : null;
              const isValidDate =
                parsedDate !== null && !Number.isNaN(parsedDate.getTime());
              const baseYear = isValidDate ? parsedDate.getFullYear() : null;
              const groupDateValues = group.items
                .map((item) => {
                  const start = item.startDateTime;
                  const end = item.endDateTime || start;
                  return { start, end };
                })
                .filter((value) => value.start || value.end);

              const startTimes = groupDateValues
                .map((value) => value.start)
                .filter(Boolean)
                .map((value) => new Date(value).getTime())
                .filter((time) => Number.isFinite(time));

              const endTimes = groupDateValues
                .map((value) => value.end)
                .filter(Boolean)
                .map((value) => new Date(value).getTime())
                .filter((time) => Number.isFinite(time));

              const minStart = startTimes.length
                ? new Date(Math.min(...startTimes))
                : null;
              const maxEnd = endTimes.length
                ? new Date(Math.max(...endTimes))
                : null;

              const displayYear =
                typeof baseYear === "number" ? String(baseYear) : "";

              const rangeText = minStart
                ? maxEnd && maxEnd.getTime() !== minStart.getTime()
                  ? minStart.getMonth() === maxEnd.getMonth()
                    ? `${formatShort(minStart)} - ${formatDayOnly(maxEnd)}`
                    : `${formatShort(minStart)} - ${formatShort(maxEnd)}`
                  : formatShort(minStart)
                : "";

              return (
                <TouchableOpacity
                  key={group.key}
                  onPress={() => setSelectedDayKey(group.key)}
                  className={`mr-3 px-5 py-2.5 rounded-md border ${
                    isActive
                      ? "bg-primary border-transparent"
                      : "bg-white border-[#e6dbe0]"
                  }`}
                >
                  <View className="flex-col items-start">
                    {displayYear ? (
                      <Text
                        className={`text-[11px] uppercase tracking-wide ${
                          isActive ? "text-white/70" : "text-[#896175]"
                        }`}
                      >
                        {displayYear}
                      </Text>
                    ) : null}
                  </View>
                  <Text
                    className={`text-sm font-semibold mt-1 ${
                      isActive ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {rangeText}
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
          <FlatList
            data={filteredSubEvents}
            keyExtractor={(item) => String(item.id)}
            contentContainerClassName="pt-4 pb-24"
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <SubEventCard
                item={item}
                index={index}
                total={filteredSubEvents.length}
                eventId={eventId as string}
              />
            )}
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
        className="absolute bottom-6 right-6 flex-row items-center gap-2 bg-primary px-5 py-3 rounded-md shadow-2xl"
      >
        <Ionicons name="add-circle" size={20} color="white" />
        <Text className="text-white font-bold tracking-wide">Add Activity</Text>
      </TouchableOpacity>
    </View>
  );
}
