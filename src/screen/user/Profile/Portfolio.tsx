import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
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
};

export default function PortfolioScreen() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const router = useRouter();

  // Load data from local storage
  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
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
          },
          {
            id: "2",
            uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYeV71hF5lCTG2Rs3fVfHbHj6xW0lLMJjeKIT5t2oFNQvMQCsyn9LQwEaTDjwe7KKiPSpkxWI_anv_EQNgNuL76Rhc5BRTzg_y6bKvLDVLhYudAbzBBN38BIv74wdSXaHgS-h175YWOIdPF3mVUI0iDu9dSS4A3AdFm8XNt7FnpAIOjEBKI2LLO-tOdnvsj3GaxdBJd0Fv7IXUUqIHS4nJ0Aq_17FmXfQTIKfipCWpCcaiAcxN4UCEn66V3UtdBbiL2qun6mk6UyE",
            title: "Wedding Day",
          },
          {
            id: "3",
            uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDpp51MGdcz2CaS_-F_SFIuK3aVZ7OXvsVVPqCvX7ehi1wfAm0fu52s3HOa5lTBmal9m9zwFDRL7eWZLoAQtcVWnYGLr4BmuBovXDqMNoqp-fmiQaw7P7Qby6ftrwPBK-2bQQDjvHk6viUHa1utnrhN8z88x3-BmmzDvd9_O59ZQtyCjRNNgX1yF6iLvPi9IiGmPwoIRnt48r8eoTfOwqfJkgeHrhNcdWgDX74rELXlJaXEI5CrgqS-VACXj2LzM7xIQ4KP311BeaI",
            title: "Reception",
          },
        ]);
      }
    } catch (error) {
      console.error("Error loading portfolio:", error);
    }
  };

  const savePortfolio = async () => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.PORTFOLIO,
        JSON.stringify(portfolio),
      );

      // TODO: Backend integration
      // await api.post('/api/portfolio', { portfolio });

      router.back();
    } catch (error) {
      console.error("Error saving portfolio:", error);
    }
  };

  const addPortfolioItem = () => {
    // TODO: Implement image picker or camera functionality
    const newItem: PortfolioItem = {
      id: Date.now().toString(),
      uri: "https://via.placeholder.com/400x400/ee2b8c/ffffff?text=New+Image",
      title: "New Photo",
    };
    setPortfolio([...portfolio, newItem]);
  };

  const deletePortfolioItem = (id: string) => {
    setPortfolio(portfolio.filter((item) => item.id !== id));
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
          >
            <MaterialIcons name="check" size={24} color="#ee2b8c" />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <ScrollView
          className="flex-1 px-4 pt-4 pb-32"
          showsVerticalScrollIndicator={false}
        >
          {/* Add Button */}
          <TouchableOpacity
            className="w-full h-16 bg-pink-500 rounded-xl flex-row items-center justify-center gap-2 mb-6 shadow-sm"
            activeOpacity={0.9}
            onPress={addPortfolioItem}
          >
            <MaterialIcons name="add-a-photo" size={20} color="#ffffff" />
            <Text className="text-white font-bold text-lg">Add Photo</Text>
          </TouchableOpacity>

          {/* Portfolio Grid */}
          <View className="gap-4">
            {portfolio.map((item) => (
              <View
                key={item.id}
                className="bg-white rounded-2xl p-4 shadow-sm relative"
              >
                <TouchableOpacity
                  className="absolute top-4 right-4 bg-black/50 rounded-full p-2"
                  onPress={() => deletePortfolioItem(item.id)}
                >
                  <MaterialIcons name="delete" size={16} color="#ffffff" />
                </TouchableOpacity>

                <Image
                  source={{ uri: item.uri }}
                  className="w-full aspect-square rounded-xl mb-3"
                  resizeMode="cover"
                />

                {item.title && (
                  <Text className="font-semibold text-gray-900 text-sm">
                    {item.title}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
