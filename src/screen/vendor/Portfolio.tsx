import { Text } from "@/src/components/ui/Text";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Dimensions, Image, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Progress value (percent)
const PROGRESS = 80; // TODO: derive from onboarding state
const MAX_PHOTOS = 9;

// Mock uploaded photos (replace with actual state/API data)
const INITIAL_PHOTOS = [
  {
    id: "1",
    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5f9MvEWh81PBSahwzhmh4NPVSQW-OGjoZF5gwOCHW1wEXc8H9GnAMwxyO0fY5vm-du-bBGvg10Yc4opCRFjon-YssI2W5WJcKOtr5OicuAktvX1yjOQtZI2LFZKUkm_4iswDATUEKhjlQidFssxMNbnvt4YoddGXH6om6dD0TWi1a3TKw7VVbf4jWdnibZjJ0JzQZXcCK1DNO8gCD0qJLgJhHQ5YLCxwU9pde_5YjjlCywoA6RJG1SNSM4EU35fP-HNG5ArJlUIs",
    isCover: true,
  },
  {
    id: "2",
    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4PfNMYwdim6tvI-uXpxwPbWIKzxzQERxIUp1eQxvGOqBOlllBlqnCSy0vsfWP3eR7nwWYEA1owkEWv0K4Yw2pchWPZe8qvZa520IdBo_k_uTPi0BW6IOEGfpKk9Akt293gM5xFmNdRW8zh4YMwUrrrN1jB0n6hCNCU5dhsJWhgrdTxMjR6muzD6WRexph814-piegk14DMxFA8UaJdZtrEFC3OiRBMYCXL0Xql_Q2e4N3j7N6T6TaFUR1_4w54e3oFideH6-U7rU",
    isCover: false,
  },
  {
    id: "3",
    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBERDbzStYDRQ9robqX3rY0WEvkKFYZ-UZRv7pms4dykJI5yEA08sLaLLWjEeoednsnkTXhMYaLuzeISAzGQDV8aeQADpfzcUDRHfeHbmFPbSarIqKmcn58Z6dVjWKvURIDsY2Inl3WKRvD6dM6R-W_E3ekfyDpFFjNIGwKPjdoC3ochjtxJkVcE960Tw8nJHAE5efpW2kYbdoUDqUf21sy1YHRoFw1EtseMKA3T1aDAtt9bgN8BA9fQKeTrMDpUZIOBS38lqxjGBY",
    isCover: false,
  },
];

type Photo = {
  id: string;
  uri: string;
  isCover: boolean;
};

// Calculate grid item size (3 columns with gap)
const SCREEN_WIDTH = Dimensions.get("window").width;
const GAP = 12;
const PADDING = 16;
const ITEM_SIZE = (SCREEN_WIDTH - PADDING * 2 - GAP * 2) / 3;

export default function PortfolioScreen() {
  const [photos, setPhotos] = useState<Photo[]>(INITIAL_PHOTOS);

  const handleRemovePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpload = () => {
    // TODO: Open image picker and add photo to state
  };

  // Build grid data: uploaded photos + empty slots
  const gridData: (Photo | { id: string; empty: true; slot: number })[] = [
    ...photos,
    ...Array.from({ length: MAX_PHOTOS - photos.length }, (_, i) => ({
      id: `empty-${i + photos.length + 1}`,
      empty: true as const,
      slot: photos.length + i + 1,
    })),
  ];

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <SafeAreaView className="flex-1">
        {/* Top App Bar */}
        <View className="flex-row items-center justify-between px-4 py-4">
          <TouchableOpacity
            className="size-10 items-center justify-center rounded-full"
            accessibilityRole="button"
          >
            {/* text-light = #181114; dark text is white */}
            <MaterialIcons name="arrow-back" size={24} color="#181114" /> 
          </TouchableOpacity>
          <Text className="text-lg font-bold leading-tight tracking-tight flex-1 text-center" style={{ color: "#181114" }}>
            Portfolio
          </Text>
          <TouchableOpacity className="px-2 py-1">
            {/* primary = #ee2b8c */}
            <Text className="text-primary text-sm font-bold">Skip for now</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View className="px-4 pb-2">
          <View className="flex-row justify-between items-center mb-1">
            {/* gray-500 = #6b7280 */}
            <Text className="text-xs font-medium" style={{ color: "#6b7280" }}>Profile Completion</Text>
            <Text className="text-xs font-bold text-primary">{PROGRESS}%</Text>
          </View>
          {/* Track: #e6dbe0; dark: white/10 */}
          <View className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: "#e6dbe0" }}>
            <View className="h-full rounded-full bg-primary" style={{ width: `${PROGRESS}%` }} />
          </View>
        </View>

        {/* Header Text */}
        <View className="px-4 pt-6 pb-2">
          <Text className="text-[28px] font-bold leading-tight tracking-tight mb-2" style={{ color: "#181114" }}>
            Showcase Your Work
          </Text>
          {/* gray-600 = #4b5563 */}
          <Text className="text-base leading-relaxed" style={{ color: "#4b5563" }}>
            Add up to 9 photos of your best work. Couples love seeing real examples!
          </Text>
        </View>

        {/* Scrollable Content */}
        <ScrollView className="flex-1 px-4 pb-32" showsVerticalScrollIndicator={false}>
          {/* Main Upload Button */}
          <TouchableOpacity
            className="w-full flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed py-10 px-6 mt-4"
            style={{ borderColor: "rgba(238, 43, 140, 0.4)", backgroundColor: "rgba(238, 43, 140, 0.05)" }}
            activeOpacity={0.8}
            onPress={handleUpload}
          >
            <View
              className="size-16 items-center justify-center rounded-full shadow-sm"
              style={{ backgroundColor: "#ffffff" }}
            >
              {/* primary = #ee2b8c */}
              <MaterialIcons name="add-a-photo" size={32} color="#ee2b8c" />
            </View>
            <View className="items-center">
              <Text className="text-lg font-bold text-primary">Tap to Upload</Text>
              {/* gray-500 = #6b7280 */}
              <Text className="text-sm mt-1" style={{ color: "#6b7280" }}>or browse your gallery</Text>
            </View>
          </TouchableOpacity>

          {/* Image Grid Section */}
          <View className="mt-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="font-bold text-lg" style={{ color: "#181114" }}>Your Photos</Text>
              {/* gray-500 = #6b7280 */}
              <Text className="text-sm font-medium" style={{ color: "#6b7280" }}>
                {photos.length} of {MAX_PHOTOS}
              </Text>
            </View>

            {/* 3-column grid */}
            <View className="flex-row flex-wrap" style={{ gap: GAP }}>
              {gridData.map((item, index) => {
                if ("empty" in item) {
                  // Empty slot
                  return (
                    <View
                      key={item.id}
                      className="rounded-lg border-2 border-dashed items-center justify-center"
                      style={{
                        width: ITEM_SIZE,
                        height: ITEM_SIZE,
                        borderColor: "#e5e7eb", // gray-200
                        backgroundColor: "#ffffff",
                      }}
                    >
                      {/* gray-300 = #d1d5db */}
                      <Text className="text-sm font-bold" style={{ color: "#d1d5db" }}>
                        {item.slot}
                      </Text>
                    </View>
                  );
                }

                // Uploaded photo
                return (
                  <View
                    key={item.id}
                    className="rounded-lg overflow-hidden shadow-sm"
                    style={{ width: ITEM_SIZE, height: ITEM_SIZE, backgroundColor: "#f3f4f6" }}
                  >
                    <Image source={{ uri: item.uri }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                    {/* Remove button */}
                    <TouchableOpacity
                      className="absolute top-1 right-1 size-6 items-center justify-center rounded-full"
                      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                      onPress={() => handleRemovePhoto(item.id)}
                    >
                      <MaterialIcons name="close" size={16} color="#ffffff" />
                    </TouchableOpacity>
                    {/* Cover badge */}
                    {item.isCover && (
                      <LinearGradient
                        colors={["transparent", "rgba(0,0,0,0.6)"]}
                        className="absolute bottom-0 left-0 right-0 p-2"
                      >
                        <Text className="text-[10px] font-bold text-white uppercase tracking-wider">Cover</Text>
                      </LinearGradient>
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          {/* Bottom spacing for sticky footer */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Sticky Footer */}
        <View
          className="absolute bottom-0 left-0 right-0 p-4 pb-8"
          style={{ backgroundColor: "rgba(255,255,255,0.9)", borderTopWidth: 1, borderTopColor: "#f3f4f6" }}
        >
          <TouchableOpacity
            className="w-full bg-primary py-4 rounded-xl items-center justify-center shadow-lg"
            activeOpacity={0.9}
            onPress={() => {
              // TODO: Navigate to next step
            }}
          >
            <Text className="text-white font-bold text-lg">Continue</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}