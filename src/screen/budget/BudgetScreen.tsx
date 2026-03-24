import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AdviceCard,
  BudgetHeroCard,
  CategorySection,
  ExpenseCategory,
  StatCard,
} from "../../components/budget";

const CATEGORIES: ExpenseCategory[] = [
  {
    id: "venue",
    label: "Venue & Site",
    icon: "location-on",
    total: 14800,
    items: [
      {
        id: "v1",
        name: "Grand Ballroom",
        vendor: "Majestic Hotel",
        estimated: 12000,
        actual: 12000,
      },
      {
        id: "v2",
        name: "Ceremony Garden",
        vendor: "Botanical Gardens",
        estimated: 3000,
        actual: 2800,
      },
    ],
  },
  {
    id: "catering",
    label: "Catering",
    icon: "restaurant",
    items: [
      {
        id: "c1",
        name: "Plated Dinner",
        vendor: "Artisan Eats",
        estimated: 10000,
        actual: 9200,
      },
    ],
  },
  {
    id: "apparel",
    label: "Apparel",
    icon: "checkroom",
    items: [
      {
        id: "a1",
        name: "Bridal Gown",
        vendor: "Vera Wang",
        estimated: 4500,
        actual: 4200,
      },
      {
        id: "a2",
        name: "Groom Tuxedo",
        vendor: "The Black Tux",
        estimated: 800,
        actual: 0,
        pending: true,
      },
    ],
  },
  {
    id: "flowers",
    label: "Flowers & Decor",
    icon: "local-florist",
    items: [
      {
        id: "f1",
        name: "Floral Arches",
        vendor: "Wild Bloom",
        estimated: 2200,
        actual: 2000,
      },
    ],
  },
];

const TOTAL_BUDGET = 45000;
const SPENT = 18240;
const PENDING = 4500;
const REMAINING = TOTAL_BUDGET - SPENT - PENDING;
const SPENT_PCT = (SPENT / TOTAL_BUDGET) * 100;

const fmt = (n: number) => (n === 0 ? "$0" : `$${n.toLocaleString("en-US")}`);

export default function EventBudgetScreen() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const params = useLocalSearchParams<{ eventId?: string | string[] }>();
  const eventId = Array.isArray(params.eventId)
    ? params.eventId[0]
    : params.eventId;

  const filteredCategories = CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.vendor.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0 || search === "");

  const handleAddPress = () => {
    // Navigate to add budget item screen within the current stack
    if (eventId) {
      router.push(
        `/(protected)/(client-stack)/events/${eventId}/(organizer)/addBudgetItem`
      );
    } else {
      router.push(
        `/(protected)/(client-stack)/events/unknown/(organizer)/addBudgetItem`
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f8f6f7]">
      <StatusBar barStyle="dark-content" backgroundColor="#f8f6f7" />

      {/* ── Scrollable Content ── */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-6 pb-32"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Budget Card */}
        <BudgetHeroCard
          totalBudget={TOTAL_BUDGET}
          spent={SPENT}
          spentPercentage={SPENT_PCT}
        />

        {/* Stats Row */}
        <View className="flex-row -mx-0.5 mb-4">
          <StatCard
            label="Spent"
            value={fmt(SPENT)}
            iconName="payments"
            accent="#ee2b8c"
          />
          <StatCard
            label="Pending"
            value={fmt(PENDING)}
            iconName="pending-actions"
            accent="#d97706"
          />
          <StatCard
            label="Remaining"
            value={fmt(REMAINING)}
            iconName="account-balance-wallet"
            accent="#059669"
            valueCls="text-emerald-600"
          />
        </View>

        {/* Search Bar */}
        <View className="mb-8">
          <View className="flex-row items-center bg-white rounded-2xl px-4 h-14 shadow-sm border border-gray-100">
            <MaterialIcons name="search" size={20} color="#9ca3af" />
            <TextInput
              className="flex-1 ml-2 text-sm font-medium text-[#181114]"
              placeholder="Search expenses or vendors..."
              placeholderTextColor="#9ca3af"
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        {/* Category Sections */}
        {filteredCategories.map((cat) => (
          <CategorySection
            key={cat.id}
            cat={cat}
            onPress={() => {
              if (eventId) {
                router.push(
                  `/(protected)/(client-stack)/events/${eventId}/(organizer)/editCategoryBudget`
                );
              } else {
                router.push(
                  `/(protected)/(client-stack)/events/unknown/(organizer)/editCategoryBudget`
                );
              }
            }}
          />
        ))}

        {/* Advice Card */}
        <AdviceCard />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute right-5 bottom-8 w-14 h-14 rounded-full bg-[#ee2b8c] items-center justify-center shadow-lg"
        activeOpacity={0.8}
        onPress={handleAddPress}
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
