// SearchBar Component
// ============================================

import { Ionicons } from "@expo/vector-icons";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SORT_OPTIONS } from "../constants";
import type { SortOption } from "../types";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  showSortOptions: boolean;
  onToggleSort: () => void;
}

const SearchBar = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  showSortOptions,
  onToggleSort,
}: SearchBarProps) => {
  return (
    <View className="px-4 py-2">
      <View className="flex-row items-center h-12 rounded-xl bg-white px-3 shadow-sm border border-gray-100">
        <Ionicons name="search" size={20} color="#9CA3AF" />
        <TextInput
          className="flex-1 h-full px-3 text-base text-gray-900 placeholder:text-gray-400"
          placeholder="Search guests..."
          value={searchQuery}
          onChangeText={onSearchChange}
          accessibilityLabel="Search guests"
          placeholderTextColor="#9CA3AF"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => onSearchChange("")}
            accessibilityLabel="Clear search"
          >
            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          className="ml-2 p-2 rounded-lg bg-gray-50"
          onPress={onToggleSort}
          accessibilityLabel="Sort options"
        >
          <Ionicons
            name="funnel-outline"
            size={20}
            color={sortBy !== "name" ? "#ee2b8c" : "#6B7280"}
          />
        </TouchableOpacity>
      </View>

      {/* Sort Options Dropdown */}
      {showSortOptions && (
        <View
          className="absolute top-14 right-4 z-50 bg-white rounded-xl shadow-lg border border-gray-100 p-2 w-40"
          accessibilityLabel="Sort by menu"
        >
          {SORT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              className={`px-3 py-2 rounded-lg flex-row items-center justify-between ${
                sortBy === option.value ? "bg-primary/10" : ""
              }`}
              onPress={() => {
                onSortChange(option.value);
                onToggleSort();
              }}
              accessibilityLabel={`Sort by ${option.label}`}
              accessibilityRole="button"
            >
              <Text
                className={`text-sm font-medium ${
                  sortBy === option.value ? "text-primary" : "text-gray-700"
                }`}
              >
                {option.label}
              </Text>
              {sortBy === option.value && (
                <Ionicons name="checkmark" size={16} color="#ee2b8c" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default SearchBar;
