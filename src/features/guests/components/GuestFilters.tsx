import { Ionicons } from "@expo/vector-icons";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import type { CategoryType, RSVPStatus, SortOption } from "../hooks/useGuests";

interface GuestFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
  activeTab: RSVPStatus;
  onTabChange: (tab: RSVPStatus) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const categories: CategoryType[] = [
  "All",
  "Family",
  "Friend",
  "Colleague",
  "Relative",
  "Neighbor",
];

const tabs: RSVPStatus[] = ["All", "Confirmed", "Pending", "Not Invited"];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "name", label: "Name" },
  { value: "recent", label: "Recent" },
  { value: "status", label: "Status" },
];

export default function GuestFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  activeTab,
  onTabChange,
  sortBy,
  onSortChange,
}: GuestFiltersProps) {
  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
      {/* Search Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#F3F4F6",
          borderRadius: 12,
          paddingHorizontal: 12,
          marginBottom: 16,
        }}
      >
        <Ionicons name="search" size={20} color="#9CA3AF" />
        <TextInput
          placeholder="Search guests..."
          value={searchQuery}
          onChangeText={onSearchChange}
          style={{
            flex: 1,
            paddingVertical: 12,
            paddingHorizontal: 8,
            fontSize: 14,
            color: "#111827",
          }}
          placeholderTextColor="#9CA3AF"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange("")}>
            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* RSVP Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 12 }}
        contentContainerStyle={{ gap: 8 }}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: activeTab === tab ? "#EE2B8C" : "#fff",
              borderWidth: 1,
              borderColor: activeTab === tab ? "#EE2B8C" : "#E5E7EB",
            }}
            onPress={() => onTabChange(tab)}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: activeTab === tab ? "#fff" : "#6B7280",
              }}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Category Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 12 }}
        contentContainerStyle={{ gap: 8 }}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 16,
              backgroundColor:
                selectedCategory === cat
                  ? "rgba(238, 43, 140, 0.1)"
                  : "#F3F4F6",
              borderWidth: 1,
              borderColor:
                selectedCategory === cat
                  ? "rgba(238, 43, 140, 0.3)"
                  : "transparent",
            }}
            onPress={() => onCategoryChange(cat)}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: "500",
                color: selectedCategory === cat ? "#EE2B8C" : "#6B7280",
              }}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sort Options */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Ionicons name="swap-vertical" size={16} color="#6B7280" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 12,
                backgroundColor:
                  sortBy === option.value ? "#111827" : "transparent",
              }}
              onPress={() => onSortChange(option.value)}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: sortBy === option.value ? "#fff" : "#6B7280",
                }}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
