import { Text } from "@/src/components/ui/Text";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Pressable, ScrollView, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./styles/explorevendors.styles";
import {
  CATEGORIES,
  PINK_PRIMARY,
  VENDORS,
  type Vendor,
} from "./types/explorevendors";

// Category Chip Component
function CategoryChip({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.categoryChip,
        isActive ? styles.categoryChipActive : styles.categoryChipInactive,
      ]}
    >
      <Text
        style={[
          styles.categoryText,
          isActive ? styles.categoryTextActive : styles.categoryTextInactive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// Vendor Card Component
function VendorCard({ vendor }: { vendor: Vendor }) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <View style={styles.vendorCard}>
      <View style={styles.vendorImageContainer}>
        <Image
          source={{ uri: vendor.image }}
          style={styles.vendorImage}
          resizeMode="cover"
        />
        <Pressable
          style={styles.favoriteButton}
          onPress={() => setIsFavorite(!isFavorite)}
        >
          <MaterialIcons
            name={isFavorite ? "favorite" : "favorite-border"}
            size={20}
            color="white"
          />
        </Pressable>
        <View style={styles.ratingBadge}>
          <MaterialIcons name="star" size={16} color="#EAB308" />
          <Text style={{ fontSize: 12, fontWeight: "600", color: "#181114" }}>
            {vendor.rating}
          </Text>
          <Text style={{ fontSize: 12, color: "#6B7280" }}>
            ({vendor.reviews})
          </Text>
        </View>
      </View>

      <View style={styles.vendorInfo}>
        <View style={styles.vendorHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.vendorName}>{vendor.name}</Text>
            <Text style={styles.vendorCategory}>{vendor.category}</Text>
          </View>
          <View style={styles.priceLevel}>
            <Text style={styles.priceLevelText}>{vendor.priceLevel}</Text>
          </View>
        </View>

        <View style={styles.vendorLocation}>
          <MaterialIcons name="location-on" size={18} color="#6B7280" />
          <Text style={styles.locationText}>{vendor.location}</Text>
        </View>
      </View>
    </View>
  );
}

// Main Component
export default function ExploreVendors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <SafeAreaView style={styles.container}>
      {/* Header & Search */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find your dream team</Text>

        <View style={styles.searchContainer}>
          <MaterialIcons
            name="search"
            size={24}
            color={PINK_PRIMARY}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for photographers, venues..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Category Chips */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
        >
          {CATEGORIES.map((category) => (
            <CategoryChip
              key={category}
              label={category}
              isActive={activeCategory === category}
              onPress={() => setActiveCategory(category)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Vendor List */}
      <ScrollView
        style={styles.vendorList}
        showsVerticalScrollIndicator={false}
      >
        {VENDORS.map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor} />
        ))}
      </ScrollView>

      {/* Floating Bottom Banner */}
      <View style={styles.bottomBanner}>
        <View style={styles.bannerContent}>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Log in to save favorites</Text>
            <Text style={styles.bannerSubtitle}>
              Keep track of vendors you love
            </Text>
          </View>
          <Pressable style={styles.loginButton} onPress={() => {}}>
            <Text style={styles.loginButtonText}>Log In</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
