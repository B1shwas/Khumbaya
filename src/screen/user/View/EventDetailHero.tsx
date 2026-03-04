import { Ionicons } from "@expo/vector-icons";

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

interface EventDetailHeroProps {
  imageUrl?: string;
  status?: string;
  title?: string;
  date?: string;
  location?: string;
  days?: number;
  hours?: number;
  minutes?: number;
}

const FALLBACK_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDeW7ylSiob80ww9XoAOOV3fReuakm7CdifvgqSXNruTM_9zAafkSATg54Dmx3H7FAZ5KXTRd39NLDkX59Y3q3sxo1tkE7A7izp0iVgffzw7wQD1ZGNTwh0GVaKomwXQ9aAgwXmkYiHuyLVXHjwPa43pqfUwcXAnj00ohS22F1JIFaI0gqlP4ljcXEqU0-A1ZjuQLfYmk0FeUhi3kPIuFPTGwNPv_HTUqTqGaOGf9I_Hr5lb4N45xrwpUyAvH3ZVxD2I2QRXr3HmhQ";

const EventDetailHero = ({
  imageUrl,
  status = "upcoming",
  title = "Event Details",
  date = "—",
  location = "—",
  days = 0,
  hours = 0,
  minutes = 0,
}: EventDetailHeroProps) => {
  const router = useRouter();
  const event = {
    imageUrl: imageUrl || FALLBACK_IMAGE,
    status,
    title,
    date,
    location,
    days,
    hours,
    minutes,
  };

  return (
    <View>
      <View className="relative w-full h-[38vh] min-h-[300px] rounded-full ">
        <Image
          source={{ uri: event.imageUrl }}
          className="absolute inset-0 w-full h-full rounded-3xl "
          resizeMode="cover"
        />
        {/* Dark overlay gradient */}
        <View className="absolute inset-0 rounded-3xl overflow-hidden z-10">
          <LinearGradient
            colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.3)", "transparent"]}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0.5, y: 0 }}
            style={{ flex: 1 }}
          />
        </View>

        {/* Top Navigation notification and three dots */}
        <View className="absolute top-0 left-0 w-full p-4 pt-6 flex-row justify-between items-start z-10">
          <Pressable
            className="p-2 rounded-full bg-white/20 backdrop-blur-sm"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={26} color="white" />
          </Pressable>
          <View className="flex-row gap-3">
            <Pressable className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
              <Ionicons name="notifications" size={26} color="white" />
            </Pressable>
            <Pressable className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
              <Ionicons name="ellipsis-vertical" size={26} color="white" />
            </Pressable>
          </View>
        </View>

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
              <Text className="text-sm font-medium text-white">
                {event.date}
              </Text>
              <Text className="mx-1 opacity-50">•</Text>
              <Ionicons name="location" size={18} color="white" />
              <Text className="text-sm font-medium text-white">
                {event.location}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="px-4 -mt-10 z-20">
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
    </View>
  );
};

export default EventDetailHero;
