import { Text } from "@/src/components/ui/Text";
import { useCateringList } from "@/src/features/catering";
import { useMenuList } from "@/src/features/catering/menu";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
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

const CATEGORY_ICONS: Record<string, React.ComponentProps<typeof Ionicons>["name"]> = {
  Starter: "leaf-outline",
  Appetizer: "restaurant-outline",
  "Main Course": "flame-outline",
  Beverage: "wine-outline",
  Dessert: "ice-cream-outline",
  Other: "ellipsis-horizontal-outline",
};

const MenuItemCard = ({ item }: { item: any }) => (
  <View className="bg-slate-50 rounded-2xl px-4 py-3.5 mb-2.5 flex-row items-start gap-3">
    <View className="flex-1">
      <View className="flex-row items-center gap-2 flex-wrap">
        <Text className="text-sm font-jakarta-semibold text-slate-900">
          {item.name}
        </Text>
        {item.isVegetarian && (
          <View className="bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5 flex-row items-center gap-1">
            <MaterialIcons name="eco" size={10} color="#16a34a" />
            <Text className="text-[9px] font-jakarta-semibold text-emerald-600 uppercase tracking-wide">
              Veg
            </Text>
          </View>
        )}
      </View>
      {item.description ? (
        <Text className="text-xs text-slate-400 mt-1 leading-relaxed">
          {item.description}
        </Text>
      ) : null}
    </View>
  </View>
);

function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View className="bg-white rounded-3xl border border-slate-100 p-8 items-center">
      <View className="w-12 h-12 rounded-full bg-slate-50 items-center justify-center mb-3">
        <Ionicons name="restaurant-outline" size={22} color="#cbd5e1" />
      </View>
      <Text className="text-sm font-jakarta-bold text-slate-800 text-center">
        {title}
      </Text>
      <Text className="text-xs text-slate-400 mt-1.5 text-center leading-relaxed">
        {subtitle}
      </Text>
    </View>
  );
}

export default function GuestFoodScreen() {
  const params = useLocalSearchParams();
  const eventId = Number(params.eventId);
  const [selectedCateringId, setSelectedCateringId] = useState<number | null>(null);

  const {
    data: cateringList,
    isLoading: isLoadingCatering,
    error: cateringError,
    refetch: refetchCatering,
  } = useCateringList(1, 50, eventId, { enabled: !!eventId });

  const selectedCatering = useMemo(() => {
    if (!cateringList?.items?.length) return null;
    if (selectedCateringId) {
      return cateringList.items.find((item: any) => item.id === selectedCateringId) ?? null;
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
    if (selectedCateringId) refetchMenu();
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
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
        {/* Header */}
        <View className="pt-6 pb-5">
          <View className="flex-row items-center gap-2 mb-1">
            <View className="w-1.5 h-5 rounded-full bg-pink-500" />
            <Text className="text-[11px] uppercase tracking-[2px] text-pink-400 font-jakarta-semibold">
              Catering
            </Text>
          </View>
          <Text className="text-2xl font-jakarta-bold text-slate-900 mt-1">
            Food Menu
          </Text>
          <Text className="text-sm text-slate-400 mt-1 leading-relaxed">
            Browse the food plans assigned to your event.
          </Text>
        </View>

        {isLoadingCatering ? (
          <View className="items-center justify-center py-20 gap-3">
            <ActivityIndicator size="large" color="#ee2b8c" />
            <Text className="text-xs text-slate-400 tracking-wide">
              Loading catering…
            </Text>
          </View>
        ) : cateringError ? (
          <EmptyState
            title="Unable to load catering"
            subtitle="Please pull down to refresh and try again."
          />
        ) : !cateringList?.items?.length ? (
          <EmptyState
            title="No catering available"
            subtitle="There is no food plan configured yet for this event."
          />
        ) : (
          <>
            {/* Plan Selector */}
            {cateringList.items.length > 1 && (
              <View className="mb-4">
                <Text className="text-[10px] uppercase tracking-[1.5px] text-slate-400 font-jakarta-semibold mb-2.5">
                  Choose a plan
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {cateringList.items.map((catering: any) => {
                    const isSelected = catering.id === selectedCatering?.id;
                    return (
                      <TouchableOpacity
                        key={catering.id}
                        onPress={() => setSelectedCateringId(catering.id)}
                        activeOpacity={0.7}
                        className={`rounded-2xl px-4 py-2.5 border ${
                          isSelected
                            ? "bg-pink-500 border-pink-500"
                            : "bg-white border-slate-100"
                        }`}
                      >
                        <Text
                          className={`text-xs font-jakarta-semibold ${
                            isSelected ? "text-white" : "text-slate-600"
                          }`}
                        >
                          {catering.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Selected Plan Info */}
            {selectedCatering && (
              <View className="bg-pink-500 rounded-3xl px-5 py-4 mb-5 flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-2xl bg-white/20 items-center justify-center">
                  <Ionicons name="restaurant" size={18} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-jakarta-bold text-white">
                    {selectedCatering.name}
                  </Text>
                   <Text className="text-xs text-pink-200 mt-0.5">
                     {selectedCatering.mealType
                       ? `Meal type: ${selectedCatering.mealType}`
                       : "Meal type not specified"}
                   </Text>
                </View>
                <View className="bg-white/20 rounded-full px-2.5 py-1">
                  <Text className="text-[10px] font-jakarta-semibold text-white">
                    {menuItems.length} items
                  </Text>
                </View>
              </View>
            )}

            {/* Menu Items */}
            {isLoadingMenu && !menuItems.length ? (
              <View className="items-center py-10">
                <ActivityIndicator size="small" color="#ee2b8c" />
              </View>
            ) : menuError ? (
              <View className="bg-red-50 rounded-2xl border border-red-100 p-4 flex-row items-center gap-3">
                <Ionicons name="alert-circle-outline" size={18} color="#ef4444" />
                <View className="flex-1">
                  <Text className="text-sm font-jakarta-semibold text-red-600">
                    Failed to load menu
                  </Text>
                  <Text className="text-xs text-red-400 mt-0.5">
                    Pull down to refresh.
                  </Text>
                </View>
              </View>
            ) : menuItems.length ? (
              sortedCategories.map((category) => {
                const icon = CATEGORY_ICONS[category] ?? "ellipsis-horizontal-outline";
                return (
                  <View key={category} className="mb-6">
                    <View className="flex-row items-center gap-2 mb-3">
                      <View className="w-7 h-7 rounded-xl bg-white border border-slate-100 items-center justify-center">
                        <Ionicons name={icon} size={13} color="#94a3b8" />
                      </View>
                      <Text className="text-sm font-jakarta-bold text-slate-800">
                        {category}
                      </Text>
                      <Text className="text-xs text-slate-400 ml-auto">
                        {groupedMenus[category].length}
                      </Text>
                    </View>
                    {groupedMenus[category].map((item) => (
                      <MenuItemCard key={item.id} item={item} />
                    ))}
                  </View>
                );
              })
            ) : (
              <EmptyState
                title="No menu items yet"
                subtitle="The selected catering plan doesn't have any food items configured."
              />
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}