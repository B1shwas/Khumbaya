import { Text } from "@/src/components/ui/Text";
import { useCateringList } from "@/src/features/catering";
import { useMenuList } from "@/src/features/catering/menu";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CATEGORY_ORDER = [
  "Starter",
  "Appetizer",
  "Main Course",
  "Beverage",
  "Dessert",
];

const MenuItemCard = ({ item }: { item: any }) => (
  <View className="bg-white rounded-3xl border border-gray-200 p-4 shadow-sm mb-3">
    <View className="flex-row items-start justify-between gap-3">
      <View className="flex-1">
        <Text className="text-sm font-semibold text-[#181114]">
          {item.name}
        </Text>
        {item.description ? (
          <Text className="text-xs text-gray-500 mt-1">{item.description}</Text>
        ) : null}
        <Text className="text-[11px] text-gray-400 mt-2">
          {item.type || "Food"}
        </Text>
      </View>
      {item.isVegetarian ? (
        <View className="w-6 h-6 rounded-full bg-emerald-50 items-center justify-center border border-emerald-200">
          <MaterialIcons name="eco" size={18} color="#16a34a" />
        </View>
      ) : null}
    </View>
  </View>
);

export default function GuestFoodScreen() {
  const params = useLocalSearchParams();
  const eventId = Number(params.eventId);
  const [selectedCateringId, setSelectedCateringId] = useState<number | null>(
    null
  );

  const {
    data: cateringList,
    isLoading: isLoadingCatering,
    error: cateringError,
    refetch: refetchCatering,
  } = useCateringList(1, 50, eventId, { enabled: !!eventId });

  const selectedCatering = useMemo(() => {
    if (!cateringList?.items?.length) {
      return null;
    }
    if (selectedCateringId) {
      return (
        cateringList.items.find(
          (item: any) => item.id === selectedCateringId
        ) ?? null
      );
    }
    return cateringList.items[0];
  }, [cateringList, selectedCateringId]);

  useEffect(() => {
    if (!selectedCateringId && cateringList?.items?.length) {
      setSelectedCateringId(cateringList.items[0].id);
    }
  }, [cateringList, selectedCateringId]);

  const {
    data: menuData,
    isLoading: isLoadingMenu,
    error: menuError,
    refetch: refetchMenu,
  } = useMenuList(selectedCateringId ?? 0, 1, 100, {
    enabled: !!selectedCateringId,
  });

  const menuItems = Array.isArray(menuData) ? menuData : [];

  const groupedMenus = useMemo(() => {
    return menuItems.reduce((acc: Record<string, any[]>, item: any) => {
      const key = item.menuType ?? "Other";
      (acc[key] ??= []).push(item);
      return acc;
    }, {});
  }, [menuItems]);

  const sortedCategories = useMemo(() => {
    return Object.keys(groupedMenus).sort((a, b) => {
      const indexA = CATEGORY_ORDER.indexOf(a);
      const indexB = CATEGORY_ORDER.indexOf(b);
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [groupedMenus]);

  const onRefresh = () => {
    refetchCatering();
    if (selectedCateringId) {
      refetchMenu();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f8f6f7]">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-20"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingCatering || isLoadingMenu}
            onRefresh={onRefresh}
            tintColor="#ee2b8c"
          />
        }
      >
        <View className="pt-6 pb-4">
          <Text className="text-2xl font-bold text-[#181114]">Food Menu</Text>
          <Text className="text-sm text-gray-500 mt-2">
            View the event menu for the food plans assigned to your event.
          </Text>
        </View>

        {isLoadingCatering ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#ee2b8c" />
          </View>
        ) : cateringError ? (
          <View className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
            <Text className="text-base font-semibold text-[#181114]">
              Unable to load event catering
            </Text>
            <Text className="text-sm text-gray-500 mt-2">
              Please pull down to refresh and try again.
            </Text>
          </View>
        ) : !cateringList?.items?.length ? (
          <View className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
            <Text className="text-base font-semibold text-[#181114]">
              No catering available
            </Text>
            <Text className="text-sm text-gray-500 mt-2">
              There is no food plan configured yet for this event.
            </Text>
          </View>
        ) : (
          <>
            <View className="mb-4">
              <Text className="text-sm text-gray-500 mb-2">
                Choose a catering plan
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {cateringList.items.map((catering: any) => {
                  const isSelected = catering.id === selectedCatering?.id;
                  return (
                    <TouchableOpacity
                      key={catering.id}
                      onPress={() => setSelectedCateringId(catering.id)}
                      className={`rounded-full px-4 py-2 border ${
                        isSelected
                          ? "border-[#ee2b8c] bg-[#fee2ec]"
                          : "border-gray-200 bg-white"
                      }`}
                      activeOpacity={0.8}
                    >
                      <Text
                        className={`${isSelected ? "text-[#b91c1c]" : "text-[#181114]"} text-xs font-semibold`}
                      >
                        {catering.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {selectedCatering ? (
              <View className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100 mb-5">
                <Text className="text-base font-semibold text-[#181114]">
                  {selectedCatering.name}
                </Text>
                <Text className="text-xs text-gray-500 mt-2">
                  Meal type: {selectedCatering.meal_type || "N/A"}
                </Text>
              </View>
            ) : null}

            <View className="mb-4">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-sm font-bold text-[#181114]">
                  Menu Items
                </Text>
                <Text className="text-xs text-gray-400">
                  {menuItems.length} item{menuItems.length === 1 ? "" : "s"}
                </Text>
              </View>

              {isLoadingMenu && !menuItems.length ? (
                <ActivityIndicator size="small" color="#ee2b8c" />
              ) : menuError ? (
                <View className="rounded-3xl bg-white p-4 border border-red-100">
                  <Text className="text-sm font-semibold text-[#b91c1c]">
                    Failed to load menu
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    Pull down to refresh and try again.
                  </Text>
                </View>
              ) : menuItems.length ? (
                sortedCategories.map((category) => (
                  <View key={category} className="mb-5">
                    <Text className="text-sm font-semibold text-[#181114] mb-3">
                      {category}
                    </Text>
                    {groupedMenus[category].map((item) => (
                      <MenuItemCard key={item.id} item={item} />
                    ))}
                  </View>
                ))
              ) : (
                <View className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                  <Text className="text-base font-semibold text-[#181114]">
                    No menu items available
                  </Text>
                  <Text className="text-sm text-gray-500 mt-2">
                    The selected catering plan does not have any food items yet.
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
