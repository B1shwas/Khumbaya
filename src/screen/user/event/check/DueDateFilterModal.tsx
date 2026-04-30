import { CategoryChip } from "@/src/components/onboarding/CategoryChip";
import { TODO_ALL_CATEGORY, TODO_CATEGORIES, type TodoCategoryFilter } from "@/src/constants/todo";
import type { DueDateFilter } from "@/src/utils/dateFilters";
import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";

interface DueDateFilterModalProps {
  selectedFilter: DueDateFilter;
  onSelectFilter: (filter: DueDateFilter) => void;
  showAssignedToMe: boolean;
  onToggleAssignedToMe: () => void;
  selectedCategory: TodoCategoryFilter;
  onSelectCategory: (category: TodoCategoryFilter) => void;
  onClose: () => void;
}

const DUE_DATE_OPTIONS = [
  { label: 'Today', value: 'today' as const },
  { label: 'Next 3 days', value: 'next3days' as const },
  { label: 'Next 7 days', value: 'next7days' as const },
  { label: 'Next 15 days', value: 'next15days' as const },
  { label: 'Next 30 days', value: 'next30days' as const },
];

const CATEGORY_OPTIONS = [TODO_ALL_CATEGORY, ...TODO_CATEGORIES] as TodoCategoryFilter[];

export function DueDateFilterModal({
  selectedFilter,
  onSelectFilter,
  showAssignedToMe,
  onToggleAssignedToMe,
  selectedCategory,
  onSelectCategory,
  onClose,
}: DueDateFilterModalProps) {
  return (
    <View className="bg-white rounded-t-2xl p-6">
      {/* Header */}
      <View className="flex-row justify-between items-center pb-4 border-b border-border mb-4">
        <Text className="text-lg font-bold text-text-primary">Filters</Text>
        <Pressable onPress={onClose}>
          <MaterialIcons name="close" size={24} color="#333" />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="max-h-96">
        {/* Category Section */}
        <View className="gap-2 mb-5">
          <Text className="text-sm font-semibold text-text-secondary">Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 8 }}>
            {CATEGORY_OPTIONS.map((category) => (
              <CategoryChip
                key={category}
                label={category}
                isActive={selectedCategory === category}
                onPress={() => onSelectCategory(category)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Due Date Section */}
        <View className="gap-2 mb-5">
          <Text className="text-sm font-semibold text-text-secondary">Due Date</Text>
          <View className="flex-row flex-wrap gap-2">
            <Pressable
              onPress={() => onSelectFilter(null)}
              className={`h-9 px-5 rounded-full items-center justify-center flex-row gap-2 ${
                selectedFilter === null
                  ? 'bg-primary'
                  : 'bg-gray-200/90 border border-gray-100'
              }`}
            >
              <Text className={`text-sm ${
                selectedFilter === null ? 'text-white' : 'text-text-primary'
              }`}>
                All
              </Text>
              {selectedFilter === null && (
                <MaterialIcons name="check" size={16} color="white" />
              )}
            </Pressable>

            {DUE_DATE_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => onSelectFilter(option.value)}
                className={`h-9 px-5 rounded-full items-center justify-center flex-row gap-2 ${
                  selectedFilter === option.value
                    ? 'bg-primary'
                    : 'bg-gray-200/90 border border-gray-100'
                }`}
              >
                <Text className={`text-sm ${
                  selectedFilter === option.value ? 'text-white' : 'text-text-primary'
                }`}>
                  {option.label}
                </Text>
                {selectedFilter === option.value && (
                  <MaterialIcons name="check" size={16} color="white" />
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Assigned To Me Section */}
        <View className="gap-2 mb-2">
          <Text className="text-sm font-semibold text-text-secondary">Assignment</Text>
          <Pressable
            onPress={onToggleAssignedToMe}
            className={`h-9 px-5 rounded-full items-center justify-center flex-row gap-2 ${
              showAssignedToMe
                ? 'bg-primary'
                : 'bg-gray-200/90 border border-gray-100'
            }`}
          >
            <Text className={`text-sm ${
              showAssignedToMe ? 'text-white' : 'text-text-primary'
            }`}>
              Assigned to me
            </Text>
            <View className={`w-4 h-4 rounded border flex items-center justify-center ${
              showAssignedToMe ? 'bg-white border-white' : 'border-border'
            }`}>
              {showAssignedToMe && (
                <MaterialIcons name="check" size={12} color="#f472b6" />
              )}
            </View>
          </Pressable>
        </View>
      </ScrollView>

      {/* Clear All Button */}
      <Pressable
        onPress={() => {
          onSelectFilter(null);
          onSelectCategory(TODO_ALL_CATEGORY);
          if (showAssignedToMe) onToggleAssignedToMe();
        }}
        className="mt-6 px-3 py-2 rounded-full bg-error/10"
      >
        <Text className="text-center text-sm font-medium text-error">Clear All Filters</Text>
      </Pressable>
    </View>
  );
}
