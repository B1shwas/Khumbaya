// FilterSidebar Component
// ============================================

import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { InvitationStatus, SortOption, CategoryType } from "../types";
import { INVITATION_FILTERS, SORT_OPTIONS } from "../constants";

interface FilterSidebarProps {
  visible: boolean;
  selectedInvitation: InvitationStatus;
  selectedCategory: CategoryType;
  sortBy: SortOption;
  guestCounts: {
    total: number;
    invited: number;
    notInvited: number;
  };
  onInvitationChange: (status: InvitationStatus) => void;
  onSortChange: (sort: SortOption) => void;
  onCategoryChange: (category: CategoryType) => void;
  onClearFilters: () => void;
  onClose: () => void;
}

const FilterSidebar = ({
  visible,
  selectedInvitation,
  selectedCategory,
  sortBy,
  guestCounts,
  onInvitationChange,
  onSortChange,
  onClearFilters,
  onClose,
}: FilterSidebarProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 flex-row">
        <Pressable
          className="flex-1 bg-black/30"
          onPress={onClose}
          accessibilityLabel="Close filter sidebar"
        />
        <View 
          className="w-72 bg-white shadow-2xl p-4 pt-12"
          accessibilityLabel="Filter sidebar"
        >
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold text-gray-900">Filters</Text>
            <TouchableOpacity
              onPress={onClose}
              className="p-2"
              accessibilityLabel="Close filters"
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="mb-6">
              <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Invitation Status
              </Text>
              <View className="flex-col gap-2">
                {INVITATION_FILTERS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    className={`flex-row items-center justify-between px-3 py-2 rounded-lg ${
                      selectedInvitation === option.value
                        ? "bg-primary/10"
                        : ""
                    }`}
                    onPress={() =>
                      onInvitationChange(option.value as InvitationStatus)
                    }
                    accessibilityLabel={`${option.label}`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: selectedInvitation === option.value }}
                  >
                    <View className="flex-row items-center gap-2">
                      <View
                        className={`w-4 h-4 rounded-full border-2 ${
                          selectedInvitation === option.value
                            ? "border-primary bg-primary"
                            : "border-gray-300"
                        }`}
                      />
                      <Text
                        className={`text-sm font-medium ${
                          selectedInvitation === option.value
                            ? "text-primary"
                            : "text-gray-700"
                        }`}
                      >
                        {option.label}
                      </Text>
                    </View>
                    <Text className="text-xs text-gray-400">
                      {option.value === "All"
                        ? guestCounts.total
                        : option.value === "Invited"
                        ? guestCounts.invited
                        : guestCounts.notInvited}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Sort By
              </Text>
              <View className="flex-col gap-2">
                {SORT_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    className={`flex-row items-center justify-between px-3 py-2 rounded-lg ${
                      sortBy === option.value ? "bg-primary/10" : ""
                    }`}
                    onPress={() => {
                      onSortChange(option.value);
                      onClose();
                    }}
                    accessibilityLabel={`Sort by ${option.label}`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: sortBy === option.value }}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        sortBy === option.value
                          ? "text-primary"
                          : "text-gray-700"
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
            </View>

            <TouchableOpacity
              className="mt-4 py-3 px-4 rounded-lg bg-gray-100 items-center"
              onPress={onClearFilters}
              accessibilityLabel="Clear all filters"
              accessibilityRole="button"
            >
              <Text className="text-sm font-semibold text-gray-600">
                Clear All Filters
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default FilterSidebar;
