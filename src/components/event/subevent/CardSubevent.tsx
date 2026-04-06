import { SubEvent } from "@/src/constants/event";
import { formatDate, formatTimeRange, shadowStyle } from "@/src/utils/helper";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

type SubEventCardProps = {
  item: SubEvent;
  index: number;
  total: number;
  eventId: string;
};

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
  const start = item.startDateTime;
  const endRaw = item.endDateTime ?? start;
  if (!start) return "upcoming";

  const now = new Date().getTime();
  const startTime = new Date(start).getTime();
  const endTime = new Date(endRaw).getTime();

  if (!Number.isFinite(startTime) || !Number.isFinite(endTime)) {
    return item.status || "upcoming";
  }

  if (endTime < now) return "completed";
  if (startTime <= now && now <= endTime) return "ongoing";
  return "upcoming";
};

const getStatusMeta = (status: string) => {
  const normalized = status?.toLowerCase?.() ?? "upcoming";

  if (normalized === "ongoing") {
    return {
      label: "Happening now",
      badgeClassName: "bg-pink-500 text-white",
      dotClassName:
        "bg-pink-500 text-white ring-1 ring-pink-200 border-2 border-[#f8f6f7]",
      cardClassName: "border-2 border-pink-500 shadow-sm",
    };
  }

  if (normalized === "completed") {
    return {
      label: "Done",
      badgeClassName: "bg-gray-800 text-white",
      dotClassName: "bg-gray-100 text-gray-500 border-2 border-[#f8f6f7]",
      cardClassName: "border border-transparent opacity-60",
    };
  }

  if (normalized === "cancelled") {
    return {
      label: "Cancelled",
      badgeClassName: "bg-red-700 text-white",
      dotClassName: "bg-red-100 text-red-600 border-2 border-[#f8f6f7]",
      cardClassName: "border border-red-100 opacity-80",
    };
  }

  return {
    label: "Upcoming",
    badgeClassName: "bg-green-500 text-white",
    dotClassName: "bg-white text-[#181114] border-2 border-[#f8f6f7]",
    cardClassName: "border border-[#e6dbe0]",
  };
};

export default function SubEventCard({
  item,
  index,
  total,
  eventId,
}: SubEventCardProps) {
  const router = useRouter();
  const derivedStatus = getDerivedStatus(item);
  const statusMeta = getStatusMeta(derivedStatus);
  const timeRange = formatTimeRange(item.startDateTime, item.endDateTime);
  const statusIcon = getStatusIcon(derivedStatus);
  const statusIconColor = getStatusIconColor(derivedStatus);
  const statusCircleStyle = getStatusCircleStyle(derivedStatus);
  const isFirst = index === 0;
  const isLast = index === total - 1;
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
            className={`w-11 h-11 rounded-md items-center justify-center border ${statusMeta.dotClassName}`}
            style={statusCircleStyle}
          >
            <Ionicons name={statusIcon} size={18} color={statusIconColor} />
          </View>
        </View>

      <Pressable
      style={shadowStyle}
        className={`flex-1 bg-white rounded-md p-4 ${statusMeta.cardClassName}`}
        onPress={() => {
          router.push({
            pathname:
              "/(protected)/(client-stack)/events/[eventId]/(organizer)/(subevent)/[subEventId]/sub-event-detail",
            params: {
              eventId,
              subEventId: String(item.id),
            },
          });
        }}
      >
          <View className="flex-row items-start justify-between mb-1">
            <Text className="text-xs font-bold text-primary uppercase tracking-widest">
              {timeRange}
            </Text>
            <View className={`px-2 py-1 rounded-md  ${statusMeta.badgeClassName} `}>
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
                {(() => {
                  const startValue = item.startDateTime;
                  const endValue = item.endDateTime;
                  if (startValue && endValue && endValue !== startValue) {
                    return `${formatDate(startValue)} - ${formatDate(endValue)}`;
                  }
                  return formatDate(startValue || "");
                })()}
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
      </Pressable>
    </View>
  );
}