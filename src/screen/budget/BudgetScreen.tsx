import { Text } from "@/src/components/ui/Text";
import { useBudgetSummary } from "@/src/features/budget/hooks/use-budget";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CategorySection } from "../../components/budget";

export default function EventBudgetScreen() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { eventId } = useLocalSearchParams();
  const { data, isLoading } = useBudgetSummary(Number(eventId));

  const handleAddPress = () => {
    router.push(
      `/(protected)/(client-stack)/events/${eventId}/(organizer)/addBudgetItem`
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#ee2b8c" />
      </View>
    );
  }

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
            { title: "Total Budget", value: data.summary?.totalBudget },
            { title: "Pending", value: data.summary?.totalPending },
            { title: "Spent", value: data.summary?.totalSpent },
            { title: "Remaining", value: data.summary?.totalRemaining },
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

        {data.categories.map((cat: any) => (
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
