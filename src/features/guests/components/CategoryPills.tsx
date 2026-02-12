// CategoryPills Component
// ============================================

import { ScrollView, Text, TouchableOpacity } from "react-native";
import type { CategoryType } from "../types";

interface CategoryPillsProps {
  categories: CategoryType[];
  selected: CategoryType;
  onSelect: (cat: CategoryType) => void;
}

interface RelationChipProps {
  relation: string;
  isSelected: boolean;
  onPress: () => void;
}

const RelationChip = ({ relation, isSelected, onPress }: RelationChipProps) => (
  <TouchableOpacity
    className={`px-3 py-1.5 rounded-full border ${
      isSelected ? "bg-primary border-primary" : "bg-white border-gray-200"
    }`}
    onPress={onPress}
    accessibilityLabel={`${relation} category${isSelected ? ", selected" : ""}`}
    accessibilityRole="button"
    accessibilityState={{ selected: isSelected }}
  >
    <Text
      className={`text-xs font-medium ${
        isSelected ? "text-white" : "text-gray-600"
      }`}
    >
      {relation}
    </Text>
  </TouchableOpacity>
);

const CategoryPills = ({
  categories,
  selected,
  onSelect,
}: CategoryPillsProps) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
    accessibilityLabel="Category filters"
  >
    {categories.map((cat) => (
      <RelationChip
        key={cat === "All" ? "all" : cat}
        relation={cat === "All" ? "All" : cat}
        isSelected={selected === cat}
        onPress={() => onSelect(cat)}
      />
    ))}
  </ScrollView>
);

export default CategoryPills;
