import { Text } from "@/src/components/ui/Text";
import { useCateringById } from "@/src/features/catering";
import { useMenuList } from "@/src/features/catering/menu";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CATEGORY_ICONS: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  Starter: "restaurant-menu",
  "Main Course": "local-dining",
  Dessert: "cake",
  Beverage: "local-drink",
  Appetizer: "dinner-dining",
};

const MenuItemCard = ({
  item,
  onPress,
}: {
  item: any;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="py-3 border-b border-outline-variant/20"
    activeOpacity={0.6}
  >
    <View className="flex-row items-center justify-between">
      <View className="flex-1 mr-3">
        <Text className="text-sm font-semibold text-on-surface">
          {item.name}
        </Text>
        {item.description ? (
          <Text className="text-xs text-muted-light mt-0.5" numberOfLines={1}>
            {item.description}
          </Text>
        ) : null}
      </View>
      <View className="flex-row items-center gap-2">
        {item.isVegetarian && (
          <View className="w-4 h-4 rounded-sm border border-green-500 items-center justify-center">
            <View className="w-2 h-2 rounded-full bg-green-500" />
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

const CategorySection = ({
  category,
  items,
  onItemPress,
}: {
  category: string;
  items: any[];
  onItemPress: (id: number) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const icon = CATEGORY_ICONS[category] || "restaurant-menu";

  return (
    <View className="mb-5">
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        className="flex-row items-center justify-between py-2"
        activeOpacity={0.6}
      >
        <View className="flex-row items-center gap-2">
          <MaterialIcons name={icon} size={16} color="#ee2b8c" />
          <Text className="text-sm font-bold text-on-surface">{category}</Text>
          <Text className="text-xs text-muted-light">({items.length})</Text>
        </View>
        <MaterialIcons
          name={isExpanded ? "expand-less" : "expand-more"}
          size={18}
          color="#999"
        />
      </TouchableOpacity>

      {isExpanded &&
        items.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            onPress={() => onItemPress(item.id)}
          />
        ))}
    </View>
  );
};

export default function CateringDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const eventId = Number(params.eventId);
  const cateringId = Number(params.cateringId);

  const [menuPage] = useState(1);

  const {
    data: catering,
    isLoading: isLoadingCatering,
    error: cateringError,
    refetch: refetchCatering,
  } = useCateringById(cateringId, { enabled: !!cateringId });

  const {
    data: menuData,
    isLoading: isLoadingMenu,
    error: menuError,
    refetch: refetchMenu,
  } = useMenuList(cateringId, menuPage, 100, { enabled: !!cateringId });

  const groupedMenus = useMemo(() => {
    return (menuData || []).reduce((acc: any, item: any) => {
      const key = item.menuType ?? "Other";
      (acc[key] ??= []).push(item);
      return acc;
    }, {});
  }, [menuData]);

  const categoryOrder = [
    "Starter",
    "Appetizer",
    "Main Course",
    "Beverage",
    "Dessert",
  ];
  const sortedCategories = useMemo(() => {
    return Object.keys(groupedMenus).sort((a, b) => {
      const indexA = categoryOrder.indexOf(a);
      const indexB = categoryOrder.indexOf(b);
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [groupedMenus]);

  const handleAddMenu = () => {
    router.push(
      `/(protected)/(client-stack)/events/${eventId}/(organizer)/catering/${cateringId}/add-menu`
    );
  };

  if (isLoadingCatering) {
    return (
      <SafeAreaView className="flex-1 bg-background-light items-center justify-center">
        <ActivityIndicator size="large" color="#ee2b8c" />
      </SafeAreaView>
    );
  }

  if (cateringError || !catering) {
    return (
      <SafeAreaView className="flex-1 bg-background-light px-4 items-center justify-center">
        <Text className="text-on-surface font-bold text-base mt-4">
          Failed to load catering details
        </Text>
        <TouchableOpacity
          onPress={() => refetchCatering()}
          className="mt-3 px-5 py-2 bg-primary rounded-md"
        >
          <Text className="text-white font-bold text-sm">Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 pt-4">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pb-10"
        refreshControl={
          <RefreshControl
            refreshing={isLoadingCatering || isLoadingMenu}
            onRefresh={() => {
              refetchCatering();
              refetchMenu();
            }}
            tintColor="#ee2b8c"
          />
        }
      >
        {/* Header */}
        <View className="pt-4 pb-5 border-b border-outline-variant/20">
          <Text className="text-xl font-black text-on-surface mb-3">
            {catering.name}
          </Text>
          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="schedule" size={14} color="#999" />
              <Text className="text-xs text-muted-light">
                {new Date(catering.startDateTime).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                –{" "}
                {new Date(catering.endDateTime).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="attach-money" size={14} color="#999" />
              <Text className="text-xs text-muted-light">
                ${catering.per_plate_price} / plate
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Section */}
        <View className="pt-5">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-sm font-bold text-on-surface">Menu</Text>
            <TouchableOpacity
              onPress={handleAddMenu}
              className="flex-row items-center gap-1"
              activeOpacity={0.7}
            >
              <MaterialIcons name="add" size={16} color="#ee2b8c" />
              <Text className="text-sm font-semibold text-primary">
                Add item
              </Text>
            </TouchableOpacity>
          </View>

          {isLoadingMenu && !menuData ? (
            <ActivityIndicator size="small" color="#ee2b8c" className="mt-6" />
          ) : menuError ? (
            <View className="py-4">
              <Text className="text-sm text-red-500">
                Failed to load menu items.
              </Text>
              <TouchableOpacity onPress={() => refetchMenu()} className="mt-2">
                <Text className="text-sm text-primary font-semibold">
                  Retry
                </Text>
              </TouchableOpacity>
            </View>
          ) : sortedCategories.length > 0 ? (
            <>
              {sortedCategories.map((category) => (
                <CategorySection
                  key={category}
                  category={category}
                  items={groupedMenus[category]}
                  onItemPress={() => {}}
                />
              ))}
              <Text className="text-xs text-muted-light mt-2">
                {menuData?.length || 0} items · {sortedCategories.length}{" "}
                categories
              </Text>
            </>
          ) : (
            <View className="items-center justify-center py-16">
              <Text className="text-sm text-muted-light">
                No menu items yet.
              </Text>
              <TouchableOpacity onPress={handleAddMenu} className="mt-3">
                <Text className="text-sm font-semibold text-primary">
                  + Add first item
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
