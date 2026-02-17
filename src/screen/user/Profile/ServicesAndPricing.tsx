import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Storage keys for business profile
const STORAGE_KEYS = {
  BUSINESS_INFO: "business_info",
  SERVICES_PRICING: "services_pricing",
  PORTFOLIO: "portfolio",
  VERIFICATION: "vendor_verification",
};

type Service = {
  id: string;
  title: string;
  price: string;
  description: string;
  badge?: string;
};

export default function ServicesAndPricingScreen() {
  const [services, setServices] = useState<Service[]>([]);
  const [newServiceTitle, setNewServiceTitle] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("");
  const [newServiceDescription, setNewServiceDescription] = useState("");
  const router = useRouter();

  // Load data from local storage
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const storedServices = await AsyncStorage.getItem(
        STORAGE_KEYS.SERVICES_PRICING,
      );
      if (storedServices) {
        setServices(JSON.parse(storedServices));
      } else {
        // Default services if no data exists
        setServices([
          {
            id: "1",
            title: "Pre-Wedding Shoot",
            price: "$500",
            description:
              "4-hour session, 2 locations, 50 edited photos, and 1 highlight reel.",
          },
          {
            id: "2",
            title: "Full Wedding Day",
            price: "$2,500",
            description:
              "12-hour coverage, candid & traditional, 500+ photos, full cinematic film.",
            badge: "POPULAR",
          },
        ]);
      }
    } catch (error) {
      console.error("Error loading services:", error);
    }
  };

  const saveServices = async () => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SERVICES_PRICING,
        JSON.stringify(services),
      );

      // TODO: Backend integration
      // await api.post('/api/services-pricing', { services });

      router.back();
    } catch (error) {
      console.error("Error saving services:", error);
    }
  };

  const addService = () => {
    if (!newServiceTitle.trim() || !newServicePrice.trim()) {
      return;
    }

    const newService: Service = {
      id: Date.now().toString(),
      title: newServiceTitle.trim(),
      price: newServicePrice.trim(),
      description: newServiceDescription.trim(),
    };

    setServices([...services, newService]);
    setNewServiceTitle("");
    setNewServicePrice("");
    setNewServiceDescription("");
  };

  const deleteService = (id: string) => {
    setServices(services.filter((service) => service.id !== id));
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
          <Text className="text-lg font-bold text-gray-900">
            Services & Pricing
          </Text>
          <TouchableOpacity
            className="size-10 items-center justify-center rounded-full"
            accessibilityRole="button"
            onPress={saveServices}
          >
            <MaterialIcons name="check" size={24} color="#ee2b8c" />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <ScrollView
          className="flex-1 px-4 pt-4 pb-32"
          showsVerticalScrollIndicator={false}
        >
          {/* Add New Service */}
          <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Add New Service
            </Text>
            <View className="gap-4">
              <TextInput
                value={newServiceTitle}
                onChangeText={setNewServiceTitle}
                placeholder="Service title"
                className="w-full rounded-xl h-14 px-4 bg-gray-50"
                placeholderTextColor="#9ca3af"
              />
              <TextInput
                value={newServicePrice}
                onChangeText={setNewServicePrice}
                placeholder="Price (e.g., $500)"
                className="w-full rounded-xl h-14 px-4 bg-gray-50"
                placeholderTextColor="#9ca3af"
              />
              <TextInput
                value={newServiceDescription}
                onChangeText={setNewServiceDescription}
                placeholder="Description"
                className="w-full rounded-xl p-4 min-h-[80px] bg-gray-50"
                multiline
                placeholderTextColor="#9ca3af"
              />
              <TouchableOpacity
                className="w-full h-14 bg-pink-500 rounded-xl flex-row items-center justify-center gap-2"
                activeOpacity={0.9}
                onPress={addService}
              >
                <MaterialIcons name="add" size={20} color="#ffffff" />
                <Text className="text-white font-bold text-lg">
                  Add Service
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Services List */}
          <View className="gap-4">
            {services.map((service) => (
              <View
                key={service.id}
                className="bg-white rounded-2xl p-4 shadow-sm relative"
              >
                {service.badge ? (
                  <View className="absolute top-0 right-4 -translate-y-1/2 bg-pink-500 px-3 py-1 rounded-full shadow-sm">
                    <Text className="text-white text-[9px] font-bold">
                      {service.badge}
                    </Text>
                  </View>
                ) : null}

                <TouchableOpacity
                  className="absolute top-4 right-4"
                  onPress={() => deleteService(service.id)}
                >
                  <MaterialIcons name="delete" size={20} color="#ef4444" />
                </TouchableOpacity>

                <View className="flex-row justify-between items-start mb-2">
                  <Text className="font-bold text-gray-900">
                    {service.title}
                  </Text>
                  <Text className="text-pink-500 font-bold text-sm">
                    {service.price}
                  </Text>
                </View>
                <Text className="text-gray-500 text-xs mb-4 leading-relaxed">
                  {service.description}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
