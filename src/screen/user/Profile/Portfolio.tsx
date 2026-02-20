import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Storage keys for business profile
const STORAGE_KEYS = {
  BUSINESS_INFO: "business_info",
  SERVICES_PRICING: "services_pricing",
  PORTFOLIO: "portfolio",
  VERIFICATION: "vendor_verification",
};

type PortfolioItem = {
  id: string;
  uri: string;
  title?: string;
  category?: string;
};

// Default portfolio for new users
const DEFAULT_PORTFOLIO: PortfolioItem[] = [
  {
    id: "1",
    uri: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
    title: "Pre-Wedding Shoot",
    category: "Pre-Wedding",
  },
  {
    id: "2",
    uri: "https://images.unsplash.com/photo-1511285560982-1351cdeb9821?w=800",
    title: "Wedding Day",
    category: "Wedding",
  },
  {
    id: "3",
    uri: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800",
    title: "Reception",
    category: "Reception",
  },
  {
    id: "4",
    uri: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800",
    title: "Couple Portrait",
    category: "Portrait",
  },
];

// Portfolio Categories
const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "pre-wedding", label: "Pre-Wedding" },
  { id: "wedding", label: "Wedding" },
  { id: "reception", label: "Reception" },
  { id: "portrait", label: "Portrait" },
  { id: "other", label: "Other" },
];

// Reusable Card Component (DRY)
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <View
    className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 ${className}`}
  >
    {children}
  </View>
);

// Reusable Section Header (DRY)
const SectionHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <View className="mb-4">
    <Text className="text-lg font-bold text-gray-900">{title}</Text>
    {subtitle && <Text className="text-sm text-gray-500 mt-1">{subtitle}</Text>}
  </View>
);

// Portfolio Item Card (DRY)
const PortfolioCard = ({
  item,
  onDelete,
  onEdit,
}: {
  item: PortfolioItem;
  onDelete: () => void;
  onEdit?: () => void;
}) => (
  <View className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-4">
    <View className="relative">
      <Image
        source={{ uri: item.uri }}
        className="w-full aspect-[4/3]"
        resizeMode="cover"
      />
      <View className="absolute top-3 right-3 flex-row gap-2">
        {onEdit && (
          <TouchableOpacity
            onPress={onEdit}
            className="bg-white/90 p-2 rounded-full shadow-md"
          >
            <MaterialIcons name="edit" size={16} color="#374151" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={onDelete}
          className="bg-white/90 p-2 rounded-full shadow-md"
        >
          <MaterialIcons name="delete" size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>
      {item.category && (
        <View className="absolute bottom-3 left-3 bg-black/50 px-3 py-1 rounded-full">
          <Text className="text-white text-xs font-medium">
            {item.category}
          </Text>
        </View>
      )}
    </View>
    {item.title && (
      <View className="p-3">
        <Text className="font-semibold text-gray-900">{item.title}</Text>
      </View>
    )}
  </View>
);

// Empty State (DRY)
const EmptyState = ({ onAdd }: { onAdd: () => void }) => (
  <View className="items-center py-12">
    <View className="w-20 h-20 bg-pink-50 rounded-full items-center justify-center mb-4">
      <MaterialIcons name="photo-library" size={40} color="#ee2b8c" />
    </View>
    <Text className="text-lg font-semibold text-gray-900 mb-2">
      No Portfolio Images
    </Text>
    <Text className="text-gray-500 text-center mb-6 px-8">
      Add photos of your past work to showcase your style and expertise to
      potential clients.
    </Text>
    <TouchableOpacity
      onPress={onAdd}
      className="bg-pink-500 px-6 py-3 rounded-xl flex-row items-center gap-2"
      activeOpacity={0.9}
    >
      <MaterialIcons name="add-a-photo" size={20} color="#ffffff" />
      <Text className="text-white font-semibold">Add Your First Photo</Text>
    </TouchableOpacity>
  </View>
);

export default function PortfolioScreen() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Load data from local storage
  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      setIsLoading(true);
      const storedPortfolio = await AsyncStorage.getItem(
        STORAGE_KEYS.PORTFOLIO,
      );
      if (storedPortfolio) {
        setPortfolio(JSON.parse(storedPortfolio));
      } else {
        setPortfolio(DEFAULT_PORTFOLIO);
      }
    } catch (error) {
      console.error("Error loading portfolio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePortfolio = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.setItem(
        STORAGE_KEYS.PORTFOLIO,
        JSON.stringify(portfolio),
      );
      router.back();
    } catch (error) {
      console.error("Error saving portfolio:", error);
      Alert.alert("Error", "Failed to save portfolio. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPhoto = () => {
    // TODO: Implement image picker or camera functionality
    // For now, we'll add a placeholder
    const newItem: PortfolioItem = {
      id: Date.now().toString(),
      uri: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
      title: "New Work",
      category: "Other",
    };
    setPortfolio([...portfolio, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    Alert.alert(
      "Delete Photo",
      "Are you sure you want to remove this photo from your portfolio?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            setPortfolio(portfolio.filter((item) => item.id !== id)),
        },
      ],
    );
  };

  // Filter portfolio by category
  const filteredPortfolio =
    selectedCategory === "all"
      ? portfolio
      : portfolio.filter(
          (item) =>
            item.category?.toLowerCase() === selectedCategory.toLowerCase(),
        );

  return (
    <View className="flex-1 bg-gray-50">
      <SafeAreaView className="flex-1">
        {/* Professional Top App Bar */}
        <View className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
          <View className="flex-row items-center justify-between px-4 py-4">
            <TouchableOpacity
              className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
              accessibilityRole="button"
              onPress={() => router.back()}
            >
              <MaterialIcons
                name="arrow-back-ios-new"
                size={20}
                color="#374151"
              />
            </TouchableOpacity>
            <View className="flex-1 items-center">
              <Text className="text-lg font-bold text-gray-900">Portfolio</Text>
              <Text className="text-xs text-gray-500">
                {portfolio.length} photos
              </Text>
            </View>
            <TouchableOpacity
              className="w-10 h-10 items-center justify-center rounded-full bg-pink-50"
              accessibilityRole="button"
              onPress={savePortfolio}
              disabled={isLoading}
            >
              <MaterialIcons
                name={isLoading ? "hourglass-empty" : "check"}
                size={20}
                color="#ee2b8c"
              />
            </TouchableOpacity>
          </View>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            className="flex-1 px-4 pt-6 pb-20"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View className="mb-6">
              <Text className="text-2xl font-bold text-gray-900 mb-2">
                Your Work
              </Text>
              <Text className="text-base text-gray-600 leading-relaxed">
                Showcase your best work to attract potential clients. Add photos
                from past events.
              </Text>
            </View>

            {/* Add Photo Button */}
            <TouchableOpacity
              onPress={handleAddPhoto}
              className="w-full h-14 bg-pink-500 rounded-xl flex-row items-center justify-center gap-2 mb-6 shadow-lg shadow-pink-200"
              activeOpacity={0.9}
            >
              <MaterialIcons name="add-a-photo" size={20} color="#ffffff" />
              <Text className="text-white font-bold text-lg">Add Photo</Text>
            </TouchableOpacity>

            {/* Category Filter */}
            {portfolio.length > 0 && (
              <View className="mb-6">
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="gap-2"
                >
                  {CATEGORIES.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      onPress={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-full ${
                        selectedCategory === category.id
                          ? "bg-pink-500"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          selectedCategory === category.id
                            ? "text-white"
                            : "text-gray-600"
                        }`}
                      >
                        {category.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Portfolio Grid */}
            {portfolio.length === 0 ? (
              <EmptyState onAdd={handleAddPhoto} />
            ) : filteredPortfolio.length === 0 ? (
              <View className="items-center py-8">
                <MaterialIcons
                  name="image-not-supported"
                  size={48}
                  color="#d1d5db"
                />
                <Text className="text-gray-500 mt-2">
                  No photos in this category
                </Text>
              </View>
            ) : (
              <>
                <SectionHeader
                  title={`Your Photos (${filteredPortfolio.length})`}
                  subtitle={
                    selectedCategory !== "all"
                      ? `Showing ${CATEGORIES.find((c) => c.id === selectedCategory)?.label} photos`
                      : undefined
                  }
                />

                {filteredPortfolio.map((item) => (
                  <PortfolioCard
                    key={item.id}
                    item={item}
                    onDelete={() => handleDeleteItem(item.id)}
                  />
                ))}
              </>
            )}

            {/* Tips Card */}
            <View className="bg-amber-50 rounded-xl p-4 border border-amber-100 mt-6">
              <View className="flex-row items-start gap-3">
                <MaterialIcons name="lightbulb" size={24} color="#f59e0b" />
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-amber-800 mb-1">
                    Portfolio Tips
                  </Text>
                  <Text className="text-xs text-amber-700 leading-relaxed">
                    • Use high-quality, well-lit photos{"\n"}• Show variety in
                    your work{"\n"}• Include different types of events{"\n"}•
                    Update your portfolio regularly
                  </Text>
                </View>
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              onPress={savePortfolio}
              disabled={isLoading}
              className={`w-full h-14 bg-pink-500 rounded-xl flex-row items-center justify-center shadow-lg shadow-pink-200 mt-6 
                ${isLoading ? "opacity-70" : ""}`}
              activeOpacity={0.9}
            >
              <MaterialIcons
                name="save"
                size={18}
                color="#ffffff"
                className="mr-2"
              />
              <Text className="text-white font-bold text-lg">
                {isLoading ? "Saving..." : "Save Changes"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
