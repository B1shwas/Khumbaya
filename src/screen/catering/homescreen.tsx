import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddMenuItemScreen from "./AddMenuform";

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  courseType?: string;
  isVegetarian?: boolean;
}

interface MenuCategory {
  id: string;
  title: string;
  icon: string;
  items: MenuItem[];
}

const INITIAL_MENU: MenuCategory[] = [
  {
    id: "bakery",
    title: "Bakery Selection",
    icon: "🥐",
    items: [
      {
        id: "b1",
        name: "Assorted Butter Croissants",
        description: "Freshly baked and flaky, served warm with butter.",
      },
      {
        id: "b2",
        name: "Artisanal Sourdough Toast",
        description: "Stone-milled sourdough with herb butter.",
      },
      {
        id: "b3",
        name: "Blueberry & Bran Muffins",
        description: "Lightly sweetened with seasonal blueberries.",
      },
    ],
  },
  {
    id: "hot",
    title: "Hot Selections",
    icon: "🔥",
    items: [
      {
        id: "h1",
        name: "Truffle Scrambled Eggs",
        description: "Silky eggs finished with fresh chives.",
      },
      {
        id: "h2",
        name: "Smoked Salmon Benedict",
        description: "Poached eggs, hollandaise, and crisp muffin.",
      },
      {
        id: "h3",
        name: "Herb-Roasted Fingerling Potatoes",
        description: "Crispy potatoes tossed in rosemary and garlic.",
      },
    ],
  },
  {
    id: "beverages",
    title: "Beverage Bar",
    icon: "☕",
    items: [
      {
        id: "bv1",
        name: "Single-Origin Espresso",
        description: "Rich, dark roast pulled to perfection.",
      },
      {
        id: "bv2",
        name: "Freshly Squeezed Orange Juice",
        description: "Cold-pressed oranges for bright citrus notes.",
      },
      {
        id: "bv3",
        name: "Selection of Artisanal Teas",
        description: "Curated teas served hot or iced.",
      },
    ],
  },
];

function MenuCategoryCard({
  category,
  onEditItem,
}: {
  category: MenuCategory;
  onEditItem: (categoryId: string, item: MenuItem) => void;
}) {
  return (
    <View className="mb-8">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-2">
          <Text className="text-xl">{category.icon}</Text>
          <Text className="text-[17px] font-bold text-[#181114]">
            {category.title}
          </Text>
        </View>
      </View>

      <View className="pl-8 gap-3">
        {category.items.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.7}
            onPress={() => onEditItem(category.id, item)}
            className="flex-row items-start gap-3"
          >
            <View className="w-1.5 h-1.5 rounded-full bg-[#ee2b8c] mt-1.5" />
            <View className="flex-1">
              <Text className="text-sm text-[#594048] font-medium">
                {item.name}
              </Text>
              {item.description ? (
                <Text className="text-xs text-[#8b7281] mt-1">
                  {item.description}
                </Text>
              ) : null}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default function MenuManagementScreen() {
  const router = useRouter();
  const [menuCategories] = useState<MenuCategory[]>(INITIAL_MENU);
  const [isAddMenuModalVisible, setIsAddMenuModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const handleOpenAddMenu = () => {
    setEditingItem(null);
    setIsAddMenuModalVisible(true);
  };

  const handleCloseAddMenu = () => {
    setIsAddMenuModalVisible(false);
    setEditingItem(null);
  };

  const handleSaveMenuItem = (data: {
    itemName: string;
    courseType: string;
    description: string;
    isVegetarian: boolean;
  }) => {
    console.log("Menu item saved:", data);
    setIsAddMenuModalVisible(false);
  };

  const handleEditItem = (categoryId: string, item: MenuItem) => {
    setEditingItem(item);
    setIsAddMenuModalVisible(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fdf2f8]">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="rgba(253,242,248,0.85)"
      />

      <View
        className="flex-row items-center justify-between px-4 h-16 bg-[#fdf2f8]/80 border-b border-white/40"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full items-center justify-center active:opacity-70"
          activeOpacity={0.7}
        >
          <Text className="text-[#ee2b8c] text-xl">←</Text>
        </TouchableOpacity>

        <Text className="text-[#ee2b8c] font-bold text-lg tracking-tight">
          Menu Management
        </Text>

        <TouchableOpacity
          onPress={handleOpenAddMenu}
          className="flex-row items-center bg-[#ee2b8c] px-4 py-2.5 rounded-md gap-2"
          activeOpacity={0.7}
        >
          <Text className="text-white font-black text-[15px] tracking-tight">
            Add
          </Text>
          <Text className="text-white text-xl">＋</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 24,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-8 gap-3">
          <View
            className="self-start flex-row items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-[#ee2b8c]/10"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 3,
              elevation: 2,
            }}
          >
            <Text className="text-[14px]">🍽️</Text>
            <Text className="text-[#ee2b8c] text-xs font-bold uppercase tracking-wider">
              Executive Breakfast Briefing
            </Text>
          </View>

          <Text className="text-[28px] font-extrabold tracking-tight text-[#181114] leading-tight">
            Morning Culinary Experience
          </Text>

          <Text className="text-[#594048] font-medium text-[15px]">
            Provided by{" "}
            <Text className="font-bold text-[#ee2b8c]">
              Luminary Pastries & Coffee
            </Text>
          </Text>
        </View>

        <View
          className="bg-white rounded-md p-6 mb-8 border border-[#f3f4f6]"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <View className="border-b border-[#f3f4f6] pb-4 mb-6">
            <Text className="text-xl font-extrabold text-[#181114]">
              Curated Menu
            </Text>
          </View>

          {menuCategories.map((category, index) => (
            <View key={category.id}>
              <MenuCategoryCard
                category={category}
                onEditItem={handleEditItem}
              />
              {index < menuCategories.length - 1 && (
                <View className="border-b border-[#f3f4f6] mb-8 -mt-4" />
              )}
            </View>
          ))}
        </View>

        <View className="bg-red-50/60 rounded-md p-5 border border-red-100 mb-4">
          <View className="flex-row items-start gap-3">
            <View className="w-8 h-8 rounded-full bg-red-500/20 items-center justify-center flex-shrink-0 mt-0.5">
              <Text className="text-red-500 text-sm font-bold">ℹ</Text>
            </View>
            <View className="flex-1">
              <Text className="text-[15px] font-bold text-red-800 mb-1">
                Special Dietary Notes
              </Text>
              <Text className="text-sm text-[#594048] font-medium leading-relaxed">
                15 Gluten-Free options required. Ensure separate plating and
                labeling to avoid cross-contamination.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={isAddMenuModalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCloseAddMenu}
      >
        <View className="flex-1 bg-black/35">
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleCloseAddMenu}
            className="absolute inset-0"
          />
          <AddMenuItemScreen
            onBack={handleCloseAddMenu}
            onSave={handleSaveMenuItem}
            initialData={
              editingItem
                ? {
                    itemName: editingItem.name,
                    courseType: (editingItem.courseType as any) || "starter",
                    description: editingItem.description || "",
                    isVegetarian: editingItem.isVegetarian ?? true,
                  }
                : undefined
            }
            isEditing={!!editingItem}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}
