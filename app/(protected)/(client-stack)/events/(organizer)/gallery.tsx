import { photos } from "@/src/constants/gallery";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function GalleryScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background-light">
      {/* Header */}
      <View className="px-4 py-3 bg-white border-b border-gray-100 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900">Gallery</Text>
        <TouchableOpacity className="p-2">
          <Ionicons name="add" size={24} color="#ee2b8c" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap gap-2">
          {photos.map((photo) => (
            <TouchableOpacity key={photo.id} className="w-[calc(33.33%-6px)] aspect-square rounded-lg overflow-hidden">
              <Image
                source={{ uri: photo.url }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>

        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
