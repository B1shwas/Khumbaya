import { Text } from "@/src/components/ui/Text";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Dimensions, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Progress value (in percent)
const PROGRESS = 40; // TODO: derive from state/flow

// Calculate card width for 2-column grid
const SCREEN_WIDTH = Dimensions.get("window").width;
const PADDING = 24; // px-6 = 24px
const GAP = 16;
const CARD_WIDTH = (SCREEN_WIDTH - PADDING * 2 - GAP) / 2;

type Category = {
  key: string;
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

// Categories data (Photography and Music & DJ selected per reference) This will be fetched from API later
const CATEGORIES: Category[] = [
  { key: "catering", title: "Catering", icon: "restaurant" },
  { key: "photography", title: "Photography", icon: "photo-camera" },
  { key: "decor", title: "Decor", icon: "local-florist" },
  { key: "music", title: "Music & DJ", icon: "music-note" },
  { key: "venue", title: "Venue", icon: "castle" },
  { key: "makeup", title: "Makeup & Hair", icon: "face-retouching-natural" },
  { key: "planning", title: "Planning", icon: "edit-note" },
  { key: "transport", title: "Transport", icon: "directions-car" },
];

export default function VendorLoginFlowScreen() {
  // Single selection state; default to "music" to match reference design
  const [selectedKey, setSelectedKey] = useState<string | null>("music");
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <SafeAreaView className="flex-1">
        {/* Top App Bar */}
        <View className="flex-row items-center px-4 pt-6 pb-2 justify-between">
          <TouchableOpacity
            className="items-center justify-center rounded-full"
            // TODO: hover not applicable on mobile; keeping minimal touch feedback
            accessibilityRole="button"
          >
            {/* text-light = #181114 (commented for reference); dark text is white */}
            {/* TODO: Add text-light to tailwind config as #181114 */}
            <MaterialIcons
              name="arrow-back-ios-new"
              size={24}
              color="#181114"
            />
          </TouchableOpacity>
          <Text
            className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10 text-white dark:text-white"
            style={{ color: "#181114" }}
          >
            Vendor Onboarding
          </Text>
        </View>

        {/* Progress Bar */}

        {/* Scrollable Content */}
        <ScrollView
          className="flex-1 px-6 pb-32"
          showsVerticalScrollIndicator={false}
        >
          {/* Headline */}
          <Text
            className="text-[28px] font-bold leading-tight pt-2 pb-3 text-white"
            style={{ color: "#181114" }}
          >
            What services do you offer?
          </Text>
          {/* Body Text */}
          {/* gray-600 = #4B5563; dark: gray-400 = #9CA3AF */}
          <Text
            className="text-base font-normal leading-relaxed"
            style={{ color: "#4B5563" }}
          >
            Choose one or more categories that best describe your business. This
            helps couples find you easily.
          </Text>

          {/* Categories Grid */}
          <View
            className="mt-6 flex-row flex-wrap justify-between"
            style={{ gap: 16 }}
          >
            {CATEGORIES.map((item) => (
              <CategoryCard
                key={item.key}
                item={item}
                selected={selectedKey === item.key}
                onSelect={() => setSelectedKey(item.key)}
              />
            ))}
          </View>
        </ScrollView>

        {/* Sticky Footer with subtle gradient from background */}
        <LinearGradient
          colors={["#f8f6f7", "#f8f6f7", "transparent"]}
          // background-light = #f8f6f7
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          className="absolute bottom-0 w-full p-4 pt-12"
        >
          <TouchableOpacity
            className="w-full rounded-full bg-primary py-4 px-6 flex-row items-center justify-center gap-2"
            activeOpacity={0.9}
            onPress={() => {
              // TODO: navigate to next onboarding step
            }}
          >
            <Text className="text-white text-base font-bold leading-tight">
              Continue
            </Text>
            {/* text-sm not available for icons; using size prop */}
            {/* primary = #ee2b8c (button bg) */}
            <MaterialIcons name="arrow-forward" size={18} color="#ffffff" />
          </TouchableOpacity>
        </LinearGradient>
      </SafeAreaView>
    </View>
  );
}

function CategoryCard({
  item,
  selected,
  onSelect,
}: {
  item: Category;
  selected: boolean;
  onSelect: () => void;
}) {
  const isSelected = selected;
  return (
    <TouchableOpacity
      className={`relative rounded-2xl p-5 items-center justify-center shadow-sm ${
        isSelected
          ? "border-2 border-primary bg-primary/5"
          : "border-2 border-transparent bg-white"
      }`}
      style={{ width: CARD_WIDTH }}
      activeOpacity={0.9}
      onPress={onSelect}
    >
      {/* Icon circle */}
      {/* Unselected bg = #fcebf4; selected uses white bg */}
      <View
        className={`items-center justify-center rounded-full`}
        style={{
          width: 48,
          height: 48,
          backgroundColor: isSelected ? "#ffffff" : "#fcebf4",
        }}
      >
        {/* text-primary = #ee2b8c; dark text white */}
        <MaterialIcons
          name={item.icon}
          size={28}
          color={isSelected ? "#ee2b8c" : "#ee2b8c"}
        />
      </View>

      {/* Title */}
      <Text
        className={`${isSelected ? "text-primary" : "text-white"} text-sm font-bold leading-tight mt-3`}
        style={!isSelected ? { color: "#181114" } : undefined}
      >
        {item.title}
      </Text>

      {/* Checkmark */}
      <View className="absolute top-3 right-3">
        {isSelected ? (
          <MaterialIcons name="check-circle" size={20} color="#ee2b8c" />
        ) : (
          // Hidden placeholder in design; omit when not selected
          <View style={{ width: 20, height: 20, opacity: 0 }} />
        )}
      </View>
    </TouchableOpacity>
  );
}
