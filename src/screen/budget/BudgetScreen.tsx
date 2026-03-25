import { Text } from "@/src/components/ui/Text";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { CategorySection, ExpenseCategory } from "../../components/budget";

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
    router.push(
      `/(protected)/(client-stack)/events/${eventId}/(organizer)/addBudgetItem`
    );
  };

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-32"
        showsVerticalScrollIndicator={false}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4 -mx-5 px-5 bg-white py-5 border-b-[1px] border-gray-200"
          contentContainerClassName="gap-4 pr-8"
        >
          {[
            { title: "Total Budget", value: "10,000" },
            { title: "Pending", value: "10,000" },
            { title: "Spent", value: "10,000" },
            { title: "Remaining", value: "10,000" },
          ].map((i, index) => (
            <View
              key={i.title}
              className="gap-2 px-4 border-r-[1px] border-gray-200"
            >
              <Text
                variant="h2"
                className="text-xs text-gray-500 tracking-widest"
              >
                {i.title.toUpperCase()}
              </Text>
              <Text
                variant="h1"
                className={`text-xl text-background-dark ${index === 0 && "text-teal-600"}`}
              >{`Rs. ${i.value}`}</Text>
            </View>
          ))}
        </ScrollView>
        <View className="mb-8 px-5">
          <View className="flex-row items-center bg-white rounded-md px-4 h-14 shadow-sm border border-gray-100">
            <MaterialIcons name="search" size={20} color="#9ca3af" />
            <TextInput
              className="flex-1 ml-2 text-sm text-[#181114]"
              placeholder="Search expenses or vendors..."
              placeholderTextColor="#9ca3af"
              placeholderClassName="font-jakarta"
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        {filteredCategories.map((cat) => (
          <CategorySection
            key={cat.id}
            cat={cat}
            onItemPress={(item) => {
              const categoryData = JSON.stringify(cat);
              const paramsQuery = `category=${encodeURIComponent(categoryData)}&itemId=${encodeURIComponent(item.id)}`;
              router.push(
                `/(protected)/(client-stack)/events/${eventId}/(organizer)/editCategoryBudget?${paramsQuery}`
              );
            }}
          />
        ))}
      </ScrollView>

      <TouchableOpacity
        className="absolute right-5 bottom-8 w-14 h-14 rounded-full bg-[#ee2b8c] items-center justify-center shadow-lg"
        activeOpacity={0.8}
        onPress={handleAddPress}
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
