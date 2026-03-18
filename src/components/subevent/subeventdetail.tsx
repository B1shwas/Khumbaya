import { Text } from "@/src/components/ui/Text";
import { SubEvent } from "@/src/constants/event";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  subEvent: SubEvent;
  eventId: string | number; // ✅ IMPORTANT for navigation
}


export default function SubEventDetail({ subEvent, eventId }: Props) {
  const router = useRouter();


  const formatDate = (dateString?: string) => {
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

  const formatShortDate = (dateString?: string) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "TBD";

    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };


  const spent = subEvent?.budget ? subEvent.budget * 0.7 : 0; // TEMP: mock data - connect to real budget API
  const percent = subEvent?.budget
    ? Math.min((spent / subEvent.budget) * 100, 100)
    : 0;

  return (
    <SafeAreaView className="flex-1 bg-white">
   
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image Section */}
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

          {/* Date overlay on image */}
          <View className="absolute bottom-3 left-4 bg-white/90 px-3 py-2 rounded-lg">
            <Text className="text-dark text-base font-semibold">
              {formatShortDate(subEvent?.date || subEvent?.startDateTime)}
            </Text>
            <Text className="text-dark/70 text-sm">
              {formatTime(subEvent?.startDateTime)}
              {subEvent?.endDateTime &&
                ` - ${formatTime(subEvent.endDateTime)}`}
              {" • "}
              {subEvent?.location || "Location TBD"}
            </Text>
          </View>
        </View>

        <View className="p-4">
          {/* Title Section */}
          <Text className="text-2xl font-bold text-dark-900">
            {subEvent?.title}
          </Text>

          {/* Type + Status Badges */}
          <View className="flex-row items-center gap-2 mt-2 mb-4">
            <View className="px-3 py-1 bg-pink-100 rounded-full">
              <Text className="text-xs text-pink-600 font-medium">
                {subEvent?.type || "Sub-Event"}
              </Text>
            </View>

            {subEvent?.status && (
              <View className="px-3 py-1 rounded-full bg-green-100">
                <Text className="text-xs font-medium capitalize text-green-700">
                  {subEvent.status}
                </Text>
              </View>
            )}
          </View>

          {/* Description Section */}
          {subEvent?.description && (
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Description
              </Text>
              <Text className="text-sm text-gray-700 leading-relaxed">
                {subEvent.description}
              </Text>
            </View>
          )}

          {/* Budget Section */}
          {/* TODO: Connect to actual budget API - currently using mock calculation */}
          {subEvent?.budget && subEvent.budget > 0 && (
            <View className="bg-gray-50 p-4 rounded-xl mb-4">
              <View className="flex-row justify-between items-center mb-2">
                <View>
                  <Text className="text-sm text-gray-500">Budget</Text>
                  <Text className="text-xl font-bold text-pink-600">
                    ₹{subEvent.budget?.toLocaleString()}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-xs text-gray-500">Spent</Text>
                  <Text className="text-sm font-semibold text-gray-700">
                    ₹{spent.toLocaleString()}
                  </Text>
                </View>
              </View>

              <View className="h-2 bg-pink-100 rounded-full overflow-hidden">
                <View
                  className="bg-pink-500 h-full"
                  style={{ width: `${percent}%` }}
                />
              </View>
              {/* <Text className="text-xs text-gray-400 mt-1">
                {percent.toFixed(0)}% utilized
              </Text> */}
            </View>
          )}

          {/* Date & Time Details Section */}
          <View className="bg-gray-50 p-4 rounded-xl mb-4">
            <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              📅 Date & Time
            </Text>

            <View className="flex-row items-start gap-3">
              <Ionicons name="calendar-outline" size={20} color="#6b7280" />
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-800">
                  {formatDate(subEvent?.startDateTime)}
                </Text>
                {subEvent?.endDateTime && (
                  <Text className="text-sm text-gray-500 mt-0.5">
                    Ends: {formatDate(subEvent.endDateTime)}
                  </Text>
                )}
              </View>
            </View>

            
          </View>

        
          <View className="bg-gray-50 p-4 rounded-xl mb-4">
            <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              📍 Location
            </Text>

            {subEvent?.location ? (
              <View className="flex-row items-start gap-3">
                <Ionicons name="location-outline" size={20} color="#6b7280" />
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-800">
                    {subEvent.location}
                  </Text>
                  
                </View>
              </View>
            ) : (
              <Text className="text-sm text-gray-400 italic">
                Location not specified
              </Text>
            )}
          </View>

      
          <View className="mt-2 gap-3">
            {/* Sub-Event Settings */}
            <TouchableOpacity
              className="bg-gray-900 p-4 rounded-xl flex-row justify-between items-center"
              onPress={() =>
                router.push({
                  pathname:
                    "/(protected)/(client-stack)/events/[eventId]/(organizer)/settings",
                  params: { eventId },
                })
              }
            >
              <View className="flex-row items-center gap-3">
                <Ionicons name="settings-outline" size={20} color="white" />
                <Text className="text-white font-semibold">
                  Sub-Event Settings
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Metadata Footer */}
          <View className="mt-6 pt-4 border-t border-gray-100">
            <Text className="text-xs text-gray-400 text-center">
              Sub-Event ID: {subEvent?.id || "N/A"}
              {" • "}
              Created:{" "}
              {subEvent?.createdAt ? formatDate(subEvent.createdAt) : "Unknown"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
