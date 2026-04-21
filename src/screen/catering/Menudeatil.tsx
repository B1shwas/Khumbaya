import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Types ────────────────────────────────────────────────────────────────────
interface MenuItem {
  id: string;
  name: string;
}

interface MenuCategory {
  id: string;
  title: string;
  icon: string; // emoji placeholder — swap for vector icons
  items: MenuItem[];
}

// ─── Static Data ──────────────────────────────────────────────────────────────
const INITIAL_MENU: MenuCategory[] = [
  {
    id: 'bakery',
    title: 'Bakery Selection',
    icon: '🥐',
    items: [
      { id: 'b1', name: 'Assorted Butter Croissants' },
      { id: 'b2', name: 'Artisanal Sourdough Toast' },
      { id: 'b3', name: 'Blueberry & Bran Muffins' },
    ],
  },
  {
    id: 'hot',
    title: 'Hot Selections',
    icon: '🔥',
    items: [
      { id: 'h1', name: 'Truffle Scrambled Eggs' },
      { id: 'h2', name: 'Smoked Salmon Benedict' },
      { id: 'h3', name: 'Herb-Roasted Fingerling Potatoes' },
    ],
  },
  {
    id: 'beverages',
    title: 'Beverage Bar',
    icon: '☕',
    items: [
      { id: 'bv1', name: 'Single-Origin Espresso' },
      { id: 'bv2', name: 'Freshly Squeezed Orange Juice' },
      { id: 'bv3', name: 'Selection of Artisanal Teas' },
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function MenuCategoryCard({
  category,
  onAdd,
}: {
  category: MenuCategory;
  onAdd: (categoryId: string) => void;
}) {
  return (
    <View className="mb-8">
      {/* Category Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-2">
          <Text className="text-xl">{category.icon}</Text>
          <Text className="text-[17px] font-bold text-[#181114]">{category.title}</Text>
        </View>
        <TouchableOpacity
          onPress={() => onAdd(category.id)}
          className="flex-row items-center gap-1 bg-[#ee2b8c]/10 px-3 py-1.5 rounded-md active:opacity-70"
          activeOpacity={0.7}
        >
          <Text className="text-[#ee2b8c] font-bold text-sm">+  Add</Text>
        </TouchableOpacity>
      </View>

      {/* Items */}
      <View className="pl-8 gap-3">
        {category.items.map((item) => (
          <View key={item.id} className="flex-row items-start gap-3">
            <View className="w-1.5 h-1.5 rounded-full bg-[#ee2b8c] mt-1.5" />
            <Text className="flex-1 text-sm text-[#594048] font-medium">{item.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function MenuManagementScreen({
  onBack,
  onMoreOptions,
}: {
  onBack?: () => void;
  onMoreOptions?: () => void;
}) {
  const [menuCategories] = useState<MenuCategory[]>(INITIAL_MENU);

  const handleAdd = (categoryId: string) => {
    // Navigate to Add Menu Item screen or open a modal
    console.log('Add to category:', categoryId);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fdf2f8]">
      <StatusBar barStyle="dark-content" backgroundColor="rgba(253,242,248,0.85)" />

      {/* ── Top App Bar ───────────────────────────────────────────────────── */}
      <View
        className="flex-row items-center justify-between px-4 h-16 bg-[#fdf2f8]/80 border-b border-white/40"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        {/* Back */}
        <TouchableOpacity
          onPress={onBack}
          className="w-10 h-10 rounded-full items-center justify-center hover:bg-white/50 active:opacity-70"
          activeOpacity={0.7}
          accessibilityLabel="Go back"
        >
          <Text className="text-[#ee2b8c] text-xl">←</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text className="text-[#ee2b8c] font-bold text-lg tracking-tight">
          Menu Management
        </Text>

        {/* More */}
        <TouchableOpacity
          onPress={onMoreOptions}
          className="w-10 h-10 rounded-full items-center justify-center active:opacity-70"
          activeOpacity={0.7}
          accessibilityLabel="More options"
        >
          <Text className="text-[#ee2b8c] text-xl">⋮</Text>
        </TouchableOpacity>
      </View>

      {/* ── Scrollable Body ───────────────────────────────────────────────── */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero / Overview ─────────────────────────────────────────── */}
        <View className="mb-8 gap-3">
          {/* Tag pill */}
          <View className="self-start flex-row items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-[#ee2b8c]/10"
            style={{
              shadowColor: '#000',
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

          {/* Heading */}
          <Text className="text-[28px] font-extrabold tracking-tight text-[#181114] leading-tight">
            Morning Culinary{'\n'}Experience
          </Text>

          {/* Sub-heading */}
          <Text className="text-[#594048] font-medium text-[15px]">
            Provided by{' '}
            <Text className="font-bold text-[#ee2b8c]">Luminary Pastries & Coffee</Text>
          </Text>
        </View>

        {/* ── Curated Menu Card ────────────────────────────────────────── */}
        <View
          className="bg-white rounded-md p-6 mb-8 border border-[#f3f4f6]"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          {/* Card Header */}
          <View className="border-b border-[#f3f4f6] pb-4 mb-6">
            <Text className="text-xl font-extrabold text-[#181114]">Curated Menu</Text>
          </View>

          {/* Categories */}
          {menuCategories.map((category, index) => (
            <View key={category.id}>
              <MenuCategoryCard category={category} onAdd={handleAdd} />
              {/* Divider between categories (not after last) */}
              {index < menuCategories.length - 1 && (
                <View className="border-b border-[#f3f4f6] mb-8 -mt-4" />
              )}
            </View>
          ))}
        </View>

        {/* ── Operational / Dietary Notes ──────────────────────────────── */}
        <View
          className="bg-red-50/60 rounded-md p-5 border border-red-100 mb-4"
        >
          <View className="flex-row items-start gap-3">
            {/* Icon circle */}
            <View className="w-8 h-8 rounded-full bg-red-500/20 items-center justify-center flex-shrink-0 mt-0.5">
              <Text className="text-red-500 text-sm font-bold">ℹ</Text>
            </View>

            <View className="flex-1">
              <Text className="text-[15px] font-bold text-red-800 mb-1">
                Special Dietary Notes
              </Text>
              <Text className="text-sm text-[#594048] font-medium leading-relaxed">
                15 Gluten-Free options required. Ensure separate plating and labeling to avoid
                cross-contamination.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}