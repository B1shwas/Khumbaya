import ImageUpload from "@/src/components/ui/ImageUpload";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GalleryScreen() {
  const [images, setImages] = useState<string[]>([]);

  const handleImageAdd = (uri: string) => {
    if (uri) {
      setImages([...images, uri]);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light">
      {/* Header */}
      <View className="px-4 py-3 bg-white border-b border-gray-100 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900">Gallery</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        <ImageUpload
          label="Add Photo"
          placeholder="Tap to add image"
          hint="Take a photo or choose from gallery"
          value=""
          onChange={handleImageAdd}
        />

        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
