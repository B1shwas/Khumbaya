import { Ionicons } from "@expo/vector-icons";
import { router, type RelativePathString } from "expo-router";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";

const HeroCard = () => {
  return (
    <View className="px-4 mt-2">
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
        }}
        imageStyle={{ borderRadius: 20 }}
        className="h-48 justify-end overflow-hidden"
      >
        {/* Dark overlay */}
        <View className="absolute inset-0 bg-black/40 rounded-2xl" />

        <View className="p-4">
          <Text className="text-white text-xl font-bold">
            Plan your dream celebration.
          </Text>

          <Text className="text-white/90 mt-1">
            Start organizing your wedding or cultural event today with our new
            AI tools.
          </Text>

          <TouchableOpacity
            onPress={() =>
              router.push(
                "/(protected)/(client-stack)/events/createevent" as RelativePathString
              )
            }
            className="bg-pink-500 mt-3 px-4 py-2 rounded-full self-start flex-row items-center"
          >
            <Ionicons name="add" size={18} color="white" />
            <Text className="text-white ml-2 font-semibold">
              Create New Event
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default HeroCard;
