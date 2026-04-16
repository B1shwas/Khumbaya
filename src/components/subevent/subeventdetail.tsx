import { Text } from "@/src/components/ui/Text";
import { useEventById } from "@/src/features/events/hooks/use-event";
import { formatTime } from "@/src/utils/helper";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#ee2b8c";

/* ---------------- HERO SECTION ---------------- */
const HeroSection = ({
  status,
  imageUrl,
  startDateTime,
  location,
}: any) => (
  <View className="w-full h-80">
    <View className="relative w-full h-full">
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-full bg-pink-50 items-center justify-center">
          <Ionicons name="image-outline" size={64} color="#f9a8d4" />
        </View>
      )}

      {/* overlay */}
      <View className="absolute inset-0 bg-black/40" />

      {/* content */}
      <View className="absolute bottom-0 left-0 right-0 p-4 items-center">
        <View className="flex-row items-center gap-2 mb-2">
          <View className="bg-[#ee2b8c] px-3 py-1 rounded-full">
            <Text className="text-white text-xs font-semibold uppercase">
              {status || "Upcoming"}
            </Text>
          </View>
        </View>

        {startDateTime && (
          <Text className="text-gray-200 text-xs">
            {formatTime(startDateTime)}
            {location && ` • ${location}`}
          </Text>
        )}
      </View>
    </View>
  </View>
);

/* ---------------- INFO ROW ---------------- */
const InfoRow = ({
  icon,
  label,
  primary,
  secondary,
}: {
  icon: string;
  label: string;
  primary: string;
  secondary?: string;
}) => (
  <View className="flex-row items-start gap-3 flex-1">
    <View className="bg-[#ee2b8c]/10 p-2.5 rounded-xl">
      <MaterialIcons name={icon as any} size={20} color={PRIMARY} />
    </View>
    <View className="flex-1">
      <Text className="text-[10px] font-bold text-gray-400 uppercase mb-1">
        {label}
      </Text>
      <Text className="text-[#181114] font-semibold">{primary}</Text>
      {secondary && <Text className="text-gray-500 text-xs">{secondary}</Text>}
    </View>
  </View>
);

/* ---------------- MAIN CARD ---------------- */
const MainInfoCard = ({ subEvent }: { subEvent: any }) => {
  const { budget, startDateTime, endDateTime, location, theme, role } =
    subEvent || {};

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTimeRange = (start: string, end: string) => {
    if (!start || !end) return "";
    const startTime = new Date(start);
    const endTime = new Date(end);
    const formatTime = (d: Date) =>
      d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    return `${formatTime(startTime)} – ${formatTime(endTime)}`;
  };

  return (
    <View className="bg-white rounded-md p-4 shadow-sm border border-slate-100 mb-4 mt-4">
      <View className="flex-row gap-4 mb-6">
        <InfoRow
          icon="calendar-today"
          label="Date & Time"
          primary={startDateTime ? formatDate(startDateTime) : "TBD"}
          secondary={
            startDateTime && endDateTime
              ? formatTimeRange(startDateTime, endDateTime)
              : undefined
          }
        />
        <InfoRow icon="location-on" label="Venue" primary={location || "TBD"} />
      </View>

      <View className="flex-row gap-4 mb-4">
        <InfoRow icon="palette" label="Theme" primary={theme || "N/A"} />
        <InfoRow icon="person" label="Role" primary={role || "Organizer"} />
      </View>

      {budget && budget > 0 && (
        <>
          <View className="h-px bg-slate-100 mb-5" />

          <View className="bg-gray-50 p-4 rounded-xl">
            <Text className="text-xs text-gray-500">Budget</Text>
            <Text className="text-xl font-bold text-[#ee2b8c]">
              ₹{budget.toLocaleString()}
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

/* ---------------- DESCRIPTION ---------------- */
const DescriptionCard = ({ description }: { description?: string }) => {
  if (!description) return null;

  return (
    <View className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-4">
      <View className="flex-row items-center gap-2 mb-3">
        <MaterialIcons name="description" size={18} color={PRIMARY} />
        <Text className="text-base font-bold">Description</Text>
      </View>

       
      <Text className="text-gray-600 text-sm leading-relaxed">
        {description}
      </Text>
    </View>
  );
};

export default function SubEventDetailScreen() {
  const router = useRouter();
  const { subEventId, eventId } = useLocalSearchParams<{
    subEventId: string;
    eventId: string;
  }>();

  const parsedId = Number(subEventId);
  const parsedEventId = Number(eventId);
  const { data: subEvent, isLoading } = useEventById(parsedId);

  const handleEditEvent = () => {
    if (!parsedEventId) return;
    router.push(
      `/(protected)/(client-stack)/events/${parsedEventId}/(organizer)/edit-event`
    );
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={PRIMARY} />
        <Text className="mt-3 text-gray-500">Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!subEvent) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center px-6">
        <Text className="text-lg font-bold">Not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 py-3 border-b border-slate-100 flex-row items-center">
        <TouchableOpacity
          onPress={handleBack}
          className="w-10 h-10 rounded-full  items-center justify-center"
          activeOpacity={0.85}
        >
          <Ionicons name="arrow-back" size={18} color="#181114" />
        </TouchableOpacity>

        <Text
          className="text-base font-extrabold text-[#181114] flex-1 mx-3 text-center"
          numberOfLines={1}
        >
          {subEvent.title || "Sub Event"}
        </Text>

        <TouchableOpacity
          onPress={handleEditEvent}
          className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center"
          activeOpacity={0.85}
          disabled={!parsedEventId}
        >
          <Ionicons name="create-outline" size={18} color={PRIMARY} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <HeroSection
          status={subEvent.status}
          imageUrl={subEvent.imageUrl}
          startDateTime={subEvent.startDateTime}
          location={subEvent.location}
        />
        <View className="px-4">
          <MainInfoCard subEvent={subEvent} />
          <DescriptionCard description={subEvent.description} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
