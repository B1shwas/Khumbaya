import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
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
  description?: string;
  category?: string;
};

export default function PortfolioScreen() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [showPreview, setShowPreview] = useState(false);
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
        // Default portfolio if no data exists
        setPortfolio([
          {
            id: "1",
            uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDl1WMOA-FGsUYEo4NC3d-GP8U8IPst7R9ffefFCrImLzEXvVQhpjyl1XVqKmXYO3nWx6tb0bWpmfNuGvZhiUUJmY8csevYr7Pov0XjJskRdf1wnNtHoLTnWvXfbk5fTOTLBxZ9gEcYNOyevxjhFExMz0x_9dnhY-JwCMcd9gLxinxUBoYlhHyf6Y72ASivvCVZZm4O8MhgLe7gmOvumPyOLEHUyyQVQkg7gk6jqw1Gb9wYnah9neKBND8Sp1LIosywjXyTzHhU-XY",
            title: "Pre-Wedding Shoot",
            description: "Romantic pre-wedding photoshoot in natural settings",
            category: "Pre-Wedding",
          },
          {
            id: "2",
            uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYeV71hF5lCTG2Rs3fVfHbHj6xW0lLMJjeKIT5t2oFNQvMQCsyn9LQwEaTDjwe7KKiPSpkxWI_anv_EQNgNuL76Rhc5BRTzg_y6bKvLDVLhYudAbzBBN38BIv74wdSXaHgS-h175YWOIdPF3mVUI0iDu9dSS4A3AdFm8XNt7FnpAIOjEBKI2LLO-tOdnvsj3GaxdBJd0Fv7IXUUqIHS4nJ0Aq_17FmXfQTIKfipCWpCcaiAcxN4UCEn66V3UtdBbiL2qun6mk6UyE",
            title: "Wedding Day",
            description: "Candid moments from the wedding ceremony",
            category: "Wedding",
          },
          {
            id: "3",
            uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDpp51MGdcz2CaS_-F_SFIuK3aVZ7OXvsVVPqCvX7ehi1wfAm0fu52s3HOa5lTBmal9m9zwFDRL7eWZLoAQtcVWnYGLr4BmuBovXDqMNoqp-fmiQaw7P7Qby6ftrwPBK-2bQQDjvHk6viUHa1utnrhN8z88x3-BmmzDvd9_O59ZQtyCjRNNgX1yF6iLvPi9IiGmPwoIRnt48r8eoTfOwqfJkgeHrhNcdWgDX74rELXlJaXEI5CrgqS-VACXj2LzM7xIQ4KP311BeaI",
            title: "Reception",
            description: "Elegant reception photos with family and friends",
            category: "Reception",
          },
        ]);
      }
    } catch (error) {
      console.error("Error loading portfolio:", error);
      Alert.alert("Error", "Failed to load portfolio");
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

      // TODO: Backend integration
      // await api.post('/api/portfolio', { portfolio });

      Alert.alert("Success", "Portfolio saved successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error saving portfolio:", error);
      Alert.alert("Error", "Failed to save portfolio");
    } finally {
      setIsLoading(false);
    }
  };

  const addPortfolioItem = () => {
    // TODO: Implement image picker or camera functionality
    const newItem: PortfolioItem = {
      id: Date.now().toString(),
      uri: "https://via.placeholder.com/400x400/ee2b8c/ffffff?text=New+Image",
      title: "New Photo",
      description: "Add a description for this photo",
      category: "Wedding",
    };
    setPortfolio([...portfolio, newItem]);
  };

  const deletePortfolioItem = (id: string) => {
    Alert.alert(
      "Delete Photo",
      "Are you sure you want to delete this photo from your portfolio?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setPortfolio(portfolio.filter((item) => item.id !== id));
          },
        },
      ],
    );
  };

  const handleItemPress = (item: PortfolioItem) => {
    setSelectedItem(item);
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
    setSelectedItem(null);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <SafeAreaView className="flex-1">
        {/* Top App Bar */}
        <View className="sticky top-0 z-10 flex-row items-center justify-between px-4 py-4 bg-white shadow-sm">
          <TouchableOpacity
            className="size-10 items-center justify-center rounded-full"
            accessibilityRole="button"
            onPress={() => router.back()}
            disabled={isLoading}
          >
            <MaterialIcons
              name="arrow-back-ios-new"
              size={24}
              color="#0f172a"
            />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-900">Portfolio</Text>
          <TouchableOpacity
            className="size-10 items-center justify-center rounded-full"
            accessibilityRole="button"
            onPress={savePortfolio}
            disabled={isLoading}
          >
            <MaterialIcons
              name={isLoading ? "hourglass-empty" : "check"}
              size={24}
              color={isLoading ? "#9ca3af" : "#ee2b8c"}
            />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        {isLoading && !portfolio.length ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500">Loading...</Text>
          </View>
        ) : (
          <ScrollView
            className="flex-1 px-4 pt-4 pb-32"
            showsVerticalScrollIndicator={false}
          >
            {/* Stats Header */}
            <View className="bg-pink-50 rounded-2xl p-4 mb-6">
              <Text className="text-sm text-pink-600 font-semibold mb-1">
                Portfolio Statistics
              </Text>
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-2xl font-bold text-pink-900">
                    {portfolio.length}
                  </Text>
                  <Text className="text-sm text-pink-600">Photos</Text>
                </View>
                <View className="h-10 w-px bg-pink-200" />
                <View className="flex-1 items-center">
                  <Text className="text-2xl font-bold text-pink-900">3</Text>
                  <Text className="text-sm text-pink-600">Categories</Text>
                </View>
              </View>
            </View>

            {/* Add Button */}
            <TouchableOpacity
              className="w-full h-16 bg-pink-500 rounded-xl flex-row items-center justify-center gap-2 mb-6 shadow-md"
              activeOpacity={0.9}
              onPress={addPortfolioItem}
              disabled={isLoading}
            >
              <MaterialIcons name="add-a-photo" size={20} color="#ffffff" />
              <Text className="text-white font-bold text-lg">Add Photo</Text>
            </TouchableOpacity>

            {/* Portfolio Grid */}
            <View className="gap-4">
              {portfolio.map((item) => (
                <View
                  key={item.id}
                  className="bg-white rounded-2xl p-4 shadow-sm relative overflow-hidden"
                >
                  <TouchableOpacity
                    className="absolute top-4 right-4 bg-black/50 rounded-full p-2"
                    onPress={() => deletePortfolioItem(item.id)}
                    disabled={isLoading}
                  >
                    <MaterialIcons name="delete" size={16} color="#ffffff" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleItemPress(item)}
                    disabled={isLoading}
                  >
                    <Image
                      source={{ uri: item.uri }}
                      className="w-full aspect-square rounded-xl mb-3"
                      resizeMode="cover"
                    />
                  </TouchableOpacity>

                  <Text className="font-semibold text-gray-900 text-sm mb-1">
                    {item.title}
                  </Text>

                  {item.description && (
                    <Text className="text-gray-500 text-xs mb-2">
                      {item.description}
                    </Text>
                  )}

                  {item.category && (
                    <View className="flex-row items-center gap-2">
                      <View className="w-2 h-2 bg-pink-500 rounded-full" />
                      <Text className="text-xs text-gray-500">
                        {item.category}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>

            {/* Empty State */}
            {portfolio.length === 0 && (
              <View className="mt-16 items-center justify-center">
                <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                  <MaterialIcons
                    name="photo-library"
                    size={40}
                    color="#d1d5db"
                  />
                </View>
                <Text className="text-gray-500 text-sm">
                  Your portfolio is empty. Add photos to showcase your work!
                </Text>
              </View>
            )}
          </ScrollView>
        )}

        {/* Image Preview */}
        {showPreview && selectedItem && (
          <View className="absolute inset-0 bg-black/90 z-50 justify-center items-center p-4">
            <TouchableOpacity
              className="absolute top-4 right-4 bg-white/20 rounded-full p-2"
              onPress={closePreview}
            >
              <MaterialIcons name="close" size={24} color="white" />
            </TouchableOpacity>

            <Image
              source={{ uri: selectedItem.uri }}
              className="w-full h-[70%] rounded-2xl"
              resizeMode="contain"
            />

            <View className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Text className="text-white font-bold text-lg mb-2">
                {selectedItem.title}
              </Text>
              {selectedItem.description && (
                <Text className="text-white/80 text-sm mb-3">
                  {selectedItem.description}
                </Text>
              )}
              {selectedItem.category && (
                <View className="flex-row items-center gap-2">
                  <View className="w-2 h-2 bg-pink-500 rounded-full" />
                  <Text className="text-white/80 text-xs">
                    {selectedItem.category}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}
