import { BudgetStatsGrid, CategoryCard } from "@/src/components/budget";
import { Text } from "@/src/components/ui/Text";
import { useBudgetSummary } from "@/src/features/budget/hooks/use-budget";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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

  const totalBudget = data.summary?.totalBudget || 0;
  const totalAllocated = data.summary?.totalAllocated || 0;
  const totalSpent = data.summary?.totalSpent || 0;
  const totalPending = data.summary?.totalPending || 0;
  const totalEstimated = data.summary?.totalEstimated || 0;
  const totalRemaining = data.summary?.totalRemaining || 0;

  const filteredCategories = data.categories.filter((cat: any) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View className="flex-1 bg-[#f8f6f7]">
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-32"
        showsVerticalScrollIndicator={false}
      >
        <View className="mx-5 mt-5 rounded-md overflow-hidden shadow-lg">
          <LinearGradient
            colors={["#ee2b8c", "#d71f7a"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-8 gap-6"
          >
            <View>
              <Text
                className="text-white text-xs opacity-80 tracking-widest mb-2"
                variant="h1"
              >
                TOTAL BUDGET
              </Text>
              <Text className="text-white text-4xl" variant="h1">
                Rs. {totalBudget.toLocaleString()}
              </Text>
            </View>

            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-white text-xs opacity-80" variant="h1">
                  Allocated
                </Text>
                <Text className="text-white text-xs opacity-80" variant="h2">
                  {totalBudget > 0
                    ? Math.round((totalAllocated / totalBudget) * 100)
                    : 0}
                  %
                </Text>
              </View>
              <View
                className="h-2.5 bg-white rounded-sm overflow-hidden"
                style={{ opacity: 0.2 }}
              >
                <View
                  className="h-full bg-white rounded-sm"
                  style={{
                    width: `${Math.min((totalAllocated / totalBudget) * 100, 100)}%`,
                  }}
                />
              </View>
            </View>

            <BudgetStatsGrid
              stats={[
                { label: "Estimated", value: totalEstimated },
                { label: "Spent", value: totalSpent },
                { label: "Pending", value: totalPending },
                { label: "Remaining", value: totalRemaining },
              ]}
            />
          </LinearGradient>
        </View>

        <View className="mx-5 mt-6 mb-6">
          <View className="flex-row items-center bg-white rounded-md px-4 py-2 shadow-sm border border-gray-100">
            <MaterialIcons name="search" size={20} color="#9ca3af" />
            <TextInput
              className="flex-1 ml-3 text-sm text-[#181114]"
              placeholder="Search categories..."
              placeholderTextColor="#9ca3af"
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        {filteredCategories.length === 0 ? (
          <View className="mx-5 bg-white rounded-2xl p-8 items-center gap-3">
            <MaterialIcons name="folder-open" size={40} color="#d1d5db" />
            <Text className="text-gray-500 font-semibold text-center">
              No categories yet
            </Text>
            <Text className="text-xs text-gray-400 text-center">
              Start by adding your first budget category
            </Text>
          </View>
        ) : (
          <View className="px-5 gap-4">
            {filteredCategories.map((cat: any) => (
              <CategoryCard
                key={cat.id}
                id={cat.id}
                name={cat.name}
                allocatedBudget={cat.allocatedBudget}
                spend={cat.spend}
                onPress={() => {
                  const categoryData = JSON.stringify(cat);
                  const paramsQuery = `category=${encodeURIComponent(categoryData)}`;
                  router.push(
                    `/(protected)/(client-stack)/events/${eventId}/(organizer)/editCategoryBudget?${paramsQuery}`
                  );
                }}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        className="absolute right-5 bottom-8 flex-row items-center gap-2 px-6 py-3 rounded-full bg-[#ee2b8c] shadow-lg active:opacity-80"
        activeOpacity={0.8}
        onPress={handleAddPress}
      >
        <MaterialIcons name="add" size={24} color="#fff" />
        <Text className="text-white text-xs font-bold tracking-tight">
          Add Category
        </Text>
      </TouchableOpacity>
    </View>
  );
}
