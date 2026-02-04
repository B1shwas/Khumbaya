import { Text } from "@/src/components/ui/Text";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Pressable, ScrollView, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// TODO: Update these colors to match your app's theme (currently using HTML's pink #ee2b8c)
const PINK_PRIMARY = "#ee2b8c";

// Mock data - replace with actual data fetching
const CATEGORIES = [
  "All",
  "Venues",
  "Catering",
  "Decoration",
  "Photography",
  "Planners",
];

const VENDORS = [
  {
    id: "1",
    name: "Royal Palace Weddings",
    category: "Venue",
    rating: 4.9,
    reviews: 120,
    priceLevel: "$$$$",
    location: "Manhattan, NY",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAYtTzLRQz7BrZfq0tS2qrOfefnfcwCrHTEifBG4xNigaYOav65joOcdh27d3-JCVydPTEImmycDRAhop49JtNIRP3J0Wug1dEBdbcPR5InAwdT8bjFmGJbmiE6rz2IE1pwNuRYsu9VJC-gRS4yYZ2QcKqjf21WraWaNEPAA-VgY2-m6niNNf9Qh2jI48G9XtOwTnulf2if0os5TopuuLJq5UmwIebQoF5UXPNFuUfVktzG6AmLIwXS-DWBS1Sylpu926qox0_vicE",
  },
  {
    id: "2",
    name: "Aperture Photography",
    category: "Photography",
    rating: 4.7,
    reviews: 85,
    priceLevel: "$$",
    location: "Brooklyn, NY",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBFkFs3gMkYt9YZPAxte3M9V8lfrQHKSHytk5Uum7-Xh1k-fgp_z7QVUApiiZI8o2hOqZKZYYib8kCKmVtZSuQPTzMRHUSXBwe781PrBY9A22B7YliBuCrsTbO1L0-fOMP6DjilY6yrDaHPwgjMIYOlrSXgxpFRyN389s0uvcLzbGmR-jpOrzj_XGiW4hZopaaD_8PCLUMA1777j2x2K7_WrZsvZlxyb559Jtcfgt9JsWhblfdrfGFSEtyAW6OA9tVMscn173mciWA",
  },
  {
    id: "3",
    name: "Elegant Eats Catering",
    category: "Catering",
    rating: 4.8,
    reviews: 200,
    priceLevel: "$$$",
    location: "Queens, NY",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAvVZMXfDTrga8zlthrkGcE34uboSRvgDDcGLV4Zv05QfinRcbOcUhO7YxzJDSKoasGHbtFJH0UmnkG8X8UON89yrr6V4bGUfBVQlAUS3Yvl2ry003gX7zVTFcr8MpyGdQXOYELOepoGOdh8Co7cqFq4Pp9hITgiHCiyZ6sxn0oZ__JPXGJPDdNxtso9fIuDKFION8HWjPQK1EfcvmqcaD60ubDeRI4zSm4eUtGseLOtbvMSimHsbEAShXSiIUlQJY1YnUx6R2XOtY",
  },
  {
    id: "4",
    name: "Bloom & Wild Decor",
    category: "Decoration",
    rating: 4.9,
    reviews: 45,
    priceLevel: "$$$",
    location: "Staten Island, NY",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBC9La7FaYaWmrN3p7F2OnkUEEwBPZHRiGNa7O46CpMyG62MzfxvYlSK5kE_VKyRKEqJhBDU1Wy6bNK6rno2gVVpRDIxz0TfrfW1A8hJXZR7FVCjXQnJfqlt0bj7UhUByiHYI7Z90787lDMRIONhA-L1L5szOoK0YeoJSsHXzQX39EOUB-MXXPmSA8fxVyYQOeGZovNXJOCypE58rcE7nlTZlzbu3b_PM7LujfCuclSYkKNLqsHyo3wstxyWxmKbYqVyBwffkx2uF0",
  },
];

interface Vendor {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  priceLevel: string;
  location: string;
  image: string;
}

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
      className={`h-9 px-5 rounded-full items-center justify-center ${
        isActive ? "bg-primary" : "bg-white border border-gray-100"
      }`}
    >
      <Text className={`text-sm  ${isActive ? "text-white" : "text-gray-700"}`}>
        {label}
      </Text>
    </Pressable>
  );
}

// Vendor Card Component
function VendorCard({ vendor }: { vendor: Vendor }) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Pressable className="bg-white rounded-xl overflow-hidden shadow-sm">
      {/* Image Container */}
      <View className="relative w-full aspect-[4/3] bg-gray-200">
        <Image
          source={{ uri: vendor.image }}
          className="w-full h-full"
          resizeMode="cover"
        />

        {/* Favorite Button */}
        <Pressable
          onPress={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 bg-white/20 rounded-full p-2"
        >
          <MaterialIcons
            name={isFavorite ? "favorite" : "favorite-border"} // Asynchrounous api call in this
            size={20}
            color="white"
          />
        </Pressable>

        {/* Rating Badge */}
        <View className="absolute bottom-3 left-3 bg-white/90 rounded-lg px-2 py-1 flex-row items-center gap-1">
          <MaterialIcons name="star" size={16} color="#EAB308" />
          <Text variant="caption" className="font-bold text-gray-900">
            {vendor.rating}
          </Text>
          <Text variant="caption" className="text-xs text-gray-500">
            ({vendor.reviews})
          </Text>
        </View>
      </View>

      {/* Card Content */}
      <View className="p-4 gap-2">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-lg text-gray-900" variant="h1">
              {vendor.name}
            </Text>
            <Text
              variant="caption"
              className="text-primary/90 text-sm mt-1 shadow-[0_0_15px_5px_primary]"
            >
              {vendor.category}
            </Text>
          </View>
          <View className="bg-success-50 px-2 py-1 rounded">
            <Text variant="caption" className="text-success-700 font-semibold ">
              {vendor.priceLevel}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-1 mt-1">
          <MaterialIcons name="location-on" size={18} color="#6B7280" />
          <Text variant="caption" className="text-gray-500">
            {vendor.location}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

// Main Component
export default function ExploreVendors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header & Search - TODO: Make this sticky if needed */}
      <View className="px-4 pt-6 pb-2 bg-gray-50 ">
        <Text className="text-2xl mb-4 px-1 text-gray-900" variant="h1">
          Find your dream team
        </Text>

        {/* Search Input */}
        <View className="flex-row items-center h-12 bg-white rounded-xl px-4">
          {/* TODO: Change color to match your primary/pink */}
          <MaterialIcons name="search" size={24} color={PINK_PRIMARY} />
          <TextInput
            className="flex-1 h-full px-3 text-base text-gray-900"
            placeholder="Search for photographers, venues..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Category Chips */}
      <View className="pt-3 pb-4 bg-gray-50">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-4 gap-3 pb-2"
          style={{ overflow: "visible" }} // To show shadow
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
        className="flex-1"
        contentContainerClassName="px-4 gap-5 pt-2 pb-32"
        showsVerticalScrollIndicator={false}
      >
        {VENDORS.map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor} />
        ))}
      </ScrollView>

      {/* Floating Bottom Banner - TODO: Show only for unauthenticated users */}
      <View className="absolute bottom-6 left-4 right-4 p-2">
        <View className="bg-white rounded-xl p-4 flex-row items-center justify-between shadow-lg border border-gray-100">
          <View>
            <Text className="text-sm  text-gray-900" variant="h1">
              Log in to save favorites
            </Text>
            <Text className="text-xs text-gray-500" variant="body">
              Keep track of vendors you love
            </Text>
          </View>
          {/* TODO: Change bg-secondary-500 to your primary/pink color */}
          <Pressable className="bg-primary py-2.5 px-6 rounded-md">
            <Text className="text-white text-sm">Log In</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
