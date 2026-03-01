import { CategoryChip } from "@/src/components/onboarding/CaegoryChip";
import { FloatLoginBanner } from "@/src/components/onboarding/FloatLoginBanner";
import { HeaderExploreVendor } from "@/src/components/onboarding/HeaderExploreVendor";
import { VendorCard } from "@/src/components/onboarding/VendorCard";
import { ONBOARDING_VENDORS } from "@/src/constants/vendors";
import { useAuthStore } from "@/src/store/AuthStore";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CATEGORIES = [
  "All",
  "Venues",
  "Catering",
  "Decoration",
  "Photography",
  "Planners",
];

export default function ExploreVendors() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { user } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 px-4">
      <HeaderExploreVendor />
      <View className="py-3">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-3 px-4"
          style={{ overflow: "visible" }}
        >
          {CATEGORIES.map((category) => (
            <CategoryChip
              key={category}
              label={category}
              isActive={activeCategory === category}
              onPress={() => setActiveCategory(category)}
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-2 gap-5 pt-2 pb-32"
        showsVerticalScrollIndicator={false}
      >
        {ONBOARDING_VENDORS.map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor} />
        ))}
      </ScrollView>

      {!user && <FloatLoginBanner />}
    </SafeAreaView>
  );
}
