import { CategoryChip } from "@/src/components/onboarding/CategoryChip";
import { FloatLoginBanner } from "@/src/components/onboarding/FloatLoginBanner";
import { HeaderExploreVendor } from "@/src/components/onboarding/HeaderExploreVendor";
import { VendorCard } from "@/src/components/onboarding/VendorCard";
import { ONBOARDING_VENDORS } from "@/src/constants/vendors";

const CATEGORIES = [
  "Venues", "Photographers", "Makeup", "Planning & Decor",
  "Music & Dance", "Invites & Gifts", "Food", "Pre Wedding Shoot",
  "Bridal Wear", "Jewelry & Accessories", "Bridal Grooming", "Security",
];
import { useAuthStore } from "@/src/store/AuthStore";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExploreVendors() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuthStore();

  const filteredVendors = ONBOARDING_VENDORS.filter((vendor) => {
    const matchesSearch = vendor.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || vendor.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-50 px-4">
      <HeaderExploreVendor
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <View className="py-3">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-3 px-4"
          style={{ overflow: "visible" }}
        >
          <CategoryChip
            label="All"
            isActive={activeCategory === "All"}
            onPress={() => setActiveCategory("All")}
          />
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
        {filteredVendors.map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor} />
        ))}
      </ScrollView>

      {!user && <FloatLoginBanner />}
    </SafeAreaView>
  );
}
