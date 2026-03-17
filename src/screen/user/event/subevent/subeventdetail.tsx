import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Settings } from "lucide-react-native";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SubEventData {
  id: number;
  title: string;
  type: string;
  description: string;
  imageUrl: string;
  date: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  budget: number;
  theme: string;
  status: string;
}

interface Props {
  subEvent: SubEventData;
}

export default function subeventdetail({ subEvent }: Props) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "TBD";
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatShortDate = (dateString: string) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "TBD";
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900 flex-1 text-center pr-8">
          {subEvent?.title || "Sub-Event"}
        </Text>
        <TouchableOpacity
          className="p-2 -mr-2"
          onPress={() => {
            // Navigate to settings
          }}
        >
          <Settings size={20} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View className="relative">
          {subEvent?.imageUrl ? (
            <Image
              source={{ uri: subEvent.imageUrl }}
              className="w-full h-56"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-56 bg-pink-50 items-center justify-center">
              <Ionicons name="image-outline" size={64} color="#f9a8d4" />
            </View>
          )}
          <View className="absolute bottom-3 left-4">
            <Text className="text-white text-xl font-bold">
              {formatShortDate(subEvent?.date || subEvent?.startDateTime)}
            </Text>
            <Text className="text-white/80 text-sm">
              {formatTime(subEvent?.startDateTime)} •{" "}
              {subEvent?.location || "Location TBD"}
            </Text>
          </View>
        </View>

        <View className="p-4">
          {/* Title & Type */}
          <View className="mb-4">
            <Text className="text-2xl font-bold text-gray-900">
              {subEvent?.title || "Sub-Event"}
            </Text>
            <View className="flex-row items-center gap-2 mt-1">
              <View className="px-2 py-0.5 bg-pink-100 rounded-full">
                <Text className="text-xs text-pink-600 font-medium">
                  {subEvent?.type || "Sub-Event"}
                </Text>
              </View>
              {subEvent?.status && (
                <View
                  className={`px-2 py-0.5 rounded-full ${
                    subEvent.status === "upcoming"
                      ? "bg-blue-100"
                      : subEvent.status === "ongoing"
                        ? "bg-green-100"
                        : subEvent.status === "completed"
                          ? "bg-gray-100"
                          : "bg-red-100"
                  }`}
                >
                  <Text
                    className={`text-xs font-medium capitalize ${
                      subEvent.status === "upcoming"
                        ? "text-blue-600"
                        : subEvent.status === "ongoing"
                          ? "text-green-600"
                          : subEvent.status === "completed"
                            ? "text-gray-600"
                            : "text-red-600"
                    }`}
                  >
                    {subEvent.status}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Description */}
          {subEvent?.description && (
            <View className="mb-4">
              <Text className="text-sm text-gray-600">
                {subEvent.description}
              </Text>
            </View>
          )}

          {/* Budget Card */}
          {subEvent?.budget !== undefined && (
            <View className="bg-gray-50 p-4 rounded-xl mb-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-sm text-gray-500">Budget</Text>
                <Text className="text-lg font-bold text-pink-600">
                  ₹{subEvent.budget.toLocaleString()}
                </Text>
              </View>
              {subEvent.budget > 0 && (
                <View className="h-2 bg-pink-100 rounded-full overflow-hidden">
                  <View className="bg-pink-500 w-[72%] h-full" />
                </View>
              )}
            </View>
          )}

          {/* Details Card */}
          <View className="bg-gray-50 p-4 rounded-xl space-y-3 mb-4">
            {subEvent?.startDateTime && (
              <View className="flex-row items-center gap-3">
                <View className="w-8 h-8 bg-pink-100 rounded-full items-center justify-center">
                  <Ionicons name="calendar-outline" size={16} color="#ec4899" />
                </View>
                <View>
                  <Text className="text-xs text-gray-500">Date & Time</Text>
                  <Text className="text-sm font-medium">
                    {formatDate(subEvent.startDateTime)}
                  </Text>
                </View>
              </View>
            )}

            {subEvent?.endDateTime && (
              <View className="flex-row items-center gap-3">
                <View className="w-8 h-8 bg-pink-100 rounded-full items-center justify-center">
                  <Ionicons name="time-outline" size={16} color="#ec4899" />
                </View>
                <View>
                  <Text className="text-xs text-gray-500">End Time</Text>
                  <Text className="text-sm font-medium">
                    {formatDate(subEvent.endDateTime)}
                  </Text>
                </View>
              </View>
            )}

            {subEvent?.location && (
              <View className="flex-row items-center gap-3">
                <View className="w-8 h-8 bg-pink-100 rounded-full items-center justify-center">
                  <Ionicons name="location-outline" size={16} color="#ec4899" />
                </View>
                <View>
                  <Text className="text-xs text-gray-500">Location</Text>
                  <Text className="text-sm font-medium">
                    {subEvent.location}
                  </Text>
                </View>
              </View>
            )}

            {subEvent?.theme && (
              <View className="flex-row items-center gap-3">
                <View className="w-8 h-8 bg-pink-100 rounded-full items-center justify-center">
                  <Ionicons
                    name="color-palette-outline"
                    size={16}
                    color="#ec4899"
                  />
                </View>
                <View>
                  <Text className="text-xs text-gray-500">Theme</Text>
                  <Text className="text-sm font-medium">{subEvent.theme}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Settings Button */}
          <TouchableOpacity
            className="bg-primary p-4 rounded-xl flex-row justify-between items-center"
            onPress={() => {
              // Navigate to settings
            }}
          >
            <Text className="text-white font-semibold">Sub-Event Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
