import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
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

// Vendor categories with predefined service templates
const VENDOR_CATEGORIES = [
  {
    id: "photography",
    name: "Photography",
    icon: "camera-alt",
    serviceTemplates: [
      {
        title: "Pre-Wedding Shoot",
        description:
          "4-hour session, 2 locations, 50 edited photos, and 1 highlight reel.",
        price: "$500",
        badge: "POPULAR",
      },
      {
        title: "Full Wedding Day",
        description:
          "12-hour coverage, candid & traditional, 500+ photos, full cinematic film.",
        price: "$2,500",
        badge: "BEST VALUE",
      },
      {
        title: "Album Design",
        description:
          "Premium album design with 100+ pages, custom layout, and digital copy.",
        price: "$300",
        badge: "ADD-ON",
      },
    ],
    specialties: ["Wedding", "Pre-Wedding", "Portrait", "Event"],
  },
  {
    id: "catering",
    name: "Catering",
    icon: "restaurant",
    serviceTemplates: [
      {
        title: "Veg Menu",
        description:
          "Complete vegetarian menu with 5 main dishes, 3 sides, and dessert.",
        price: "$30 per plate",
        badge: "POPULAR",
      },
      {
        title: "Non-Veg Menu",
        description:
          "Delicious non-vegetarian menu with 5 main dishes, 3 sides, and dessert.",
        price: "$35 per plate",
        badge: "BEST VALUE",
      },
      {
        title: "Premium Menu",
        description:
          "Luxury menu with premium ingredients, chef's specials, and signature dishes.",
        price: "$50 per plate",
        badge: "PREMIUM",
      },
    ],
    specialties: ["Vegetarian", "Non-Vegetarian", "Vegan", "Fusion"],
  },
  {
    id: "decoration",
    name: "Decoration",
    icon: "palette",
    serviceTemplates: [
      {
        title: "Basic Decoration",
        description:
          "Elegant decoration with flowers, drapes, and basic lighting.",
        price: "$1,500",
        badge: "POPULAR",
      },
      {
        title: "Premium Decoration",
        description:
          "Luxury decoration with premium flowers, custom drapes, and advanced lighting.",
        price: "$3,000",
        badge: "BEST VALUE",
      },
      {
        title: "Theme-Based Decoration",
        description:
          "Custom theme-based decoration with personalized elements and props.",
        price: "$5,000",
        badge: "PREMIUM",
      },
    ],
    specialties: ["Floral", "Traditional", "Modern", "Theme-Based"],
  },
  {
    id: "music",
    name: "Music & Entertainment",
    icon: "music-note",
    serviceTemplates: [
      {
        title: "DJ Service",
        description:
          "Professional DJ with complete sound system and lighting setup.",
        price: "$1,000",
        badge: "POPULAR",
      },
      {
        title: "Live Band",
        description:
          "Professional live band with 4-5 musicians performing popular songs.",
        price: "$2,500",
        badge: "BEST VALUE",
      },
      {
        title: "Complete Entertainment",
        description:
          "DJ + Live Band + Dancers for a complete entertainment package.",
        price: "$5,000",
        badge: "PREMIUM",
      },
    ],
    specialties: ["DJ", "Live Band", "Classical", "Bollywood"],
  },
  {
    id: "venue",
    name: "Venue",
    icon: "home",
    serviceTemplates: [
      {
        title: "Banquet Hall",
        description: "Elegant banquet hall with capacity for 200-300 guests.",
        price: "$2,000 per day",
        badge: "POPULAR",
      },
      {
        title: "Lawn Venue",
        description:
          "Beautiful outdoor lawn venue with capacity for 500+ guests.",
        price: "$3,000 per day",
        badge: "BEST VALUE",
      },
      {
        title: "Premium Venue",
        description:
          "Luxury 5-star venue with all amenities and services included.",
        price: "$10,000 per day",
        badge: "PREMIUM",
      },
    ],
    specialties: ["Banquet Hall", "Lawn", "Beach", "Heritage"],
  },
];

type Service = {
  id: string;
  title: string;
  price: string;
  description: string;
  badge?: string;
  category?: string;
};

export default function ServicesAndPricingScreen() {
  const [services, setServices] = useState<Service[]>([]);
  const [newServiceTitle, setNewServiceTitle] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("");
  const [newServiceDescription, setNewServiceDescription] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<string>("photography");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Load data from local storage
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setIsLoading(true);
      const storedServices = await AsyncStorage.getItem(
        STORAGE_KEYS.SERVICES_PRICING,
      );
      if (storedServices) {
        setServices(JSON.parse(storedServices));
      } else {
        // Load default services based on selected category
        const category = VENDOR_CATEGORIES.find(
          (cat) => cat.id === selectedCategory,
        );
        if (category) {
          setServices(
            category.serviceTemplates.map((template, index) => ({
              ...template,
              id: index.toString(),
            })),
          );
          setSpecialties(category.specialties);
        }
      }
    } catch (error) {
      console.error("Error loading services:", error);
      Alert.alert("Error", "Failed to load services");
    } finally {
      setIsLoading(false);
    }
  };

  const saveServices = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.setItem(
        STORAGE_KEYS.SERVICES_PRICING,
        JSON.stringify(services),
      );

      // TODO: Backend integration
      // await api.post('/api/services-pricing', { services });

      Alert.alert("Success", "Services saved successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error saving services:", error);
      Alert.alert("Error", "Failed to save services");
    } finally {
      setIsLoading(false);
    }
  };

  const addService = () => {
    if (!newServiceTitle.trim() || !newServicePrice.trim()) {
      Alert.alert("Error", "Service title and price are required");
      return;
    }

    const newService: Service = {
      id: Date.now().toString(),
      title: newServiceTitle.trim(),
      price: newServicePrice.trim(),
      description: newServiceDescription.trim(),
      category: selectedCategory,
    };

    setServices([...services, newService]);
    setNewServiceTitle("");
    setNewServicePrice("");
    setNewServiceDescription("");
  };

  const deleteService = (id: string) => {
    Alert.alert(
      "Delete Service",
      "Are you sure you want to delete this service?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setServices(services.filter((service) => service.id !== id));
          },
        },
      ],
    );
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const category = VENDOR_CATEGORIES.find((cat) => cat.id === categoryId);
    if (category) {
      // Load template services for selected category
      setServices(
        category.serviceTemplates.map((template, index) => ({
          ...template,
          id: index.toString(),
        })),
      );
      setSpecialties(category.specialties);
    }
  };

  const addSpecialty = (specialty: string) => {
    if (!specialties.includes(specialty)) {
      setSpecialties([...specialties, specialty]);
    }
  };

  const removeSpecialty = (specialty: string) => {
    setSpecialties(specialties.filter((s) => s !== specialty));
  };

  const currentCategory = VENDOR_CATEGORIES.find(
    (cat) => cat.id === selectedCategory,
  );

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
          <Text className="text-lg font-bold text-gray-900">
            Services & Pricing
          </Text>
          <TouchableOpacity
            className="size-10 items-center justify-center rounded-full"
            accessibilityRole="button"
            onPress={saveServices}
            disabled={isLoading}
          >
            <MaterialIcons
              name={isLoading ? "hourglass-empty" : "check"}
              size={24}
              color={isLoading ? "#9ca3af" : "#ee2b8c"}
            />
          </TouchableOpacity>
        </View>

        {/* Vendor Category Selection */}
        <View className="bg-white px-4 py-4 mb-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Vendor Category
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-3"
          >
            {VENDOR_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                className={`flex-row items-center gap-2 px-4 py-2 rounded-full ${
                  selectedCategory === category.id
                    ? "bg-pink-500"
                    : "bg-gray-100"
                }`}
                onPress={() => handleCategoryChange(category.id)}
                disabled={isLoading}
              >
                <MaterialIcons
                  name={category.icon as any}
                  size={16}
                  color={
                    selectedCategory === category.id ? "#ffffff" : "#0f172a"
                  }
                />
                <Text
                  className={`text-sm font-medium ${
                    selectedCategory === category.id
                      ? "text-white"
                      : "text-gray-600"
                  }`}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Specialties */}
        {currentCategory && (
          <View className="bg-white px-4 py-4 mb-6 shadow-sm">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Specialties
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {currentCategory.specialties.map((specialty) => (
                <TouchableOpacity
                  key={specialty}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    specialties.includes(specialty)
                      ? "bg-pink-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                  onPress={() =>
                    specialties.includes(specialty)
                      ? removeSpecialty(specialty)
                      : addSpecialty(specialty)
                  }
                  disabled={isLoading}
                >
                  {specialty}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Main Content */}
        {isLoading && !services.length ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500">Loading...</Text>
          </View>
        ) : (
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
                  editable={!isLoading}
                />
                <TextInput
                  value={newServicePrice}
                  onChangeText={setNewServicePrice}
                  placeholder="Price (e.g., $500)"
                  className="w-full rounded-xl h-14 px-4 bg-gray-50"
                  placeholderTextColor="#9ca3af"
                  editable={!isLoading}
                />
                <TextInput
                  value={newServiceDescription}
                  onChangeText={setNewServiceDescription}
                  placeholder="Description"
                  className="w-full rounded-xl p-4 min-h-[80px] bg-gray-50"
                  multiline
                  placeholderTextColor="#9ca3af"
                  editable={!isLoading}
                />
                <TouchableOpacity
                  className="w-full h-14 bg-pink-500 rounded-xl flex-row items-center justify-center gap-2"
                  activeOpacity={0.9}
                  onPress={addService}
                  disabled={isLoading}
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
                    className="absolute top-4 right-4 bg-black/50 rounded-full p-2"
                    onPress={() => deleteService(service.id)}
                    disabled={isLoading}
                  >
                    <MaterialIcons name="delete" size={16} color="#ffffff" />
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
                  {service.category && (
                    <View className="flex-row items-center gap-2">
                      <View className="w-2 h-2 bg-pink-500 rounded-full" />
                      <Text className="text-xs text-gray-500">
                        {currentCategory?.name}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>

            {/* Empty State */}
            {services.length === 0 && (
              <View className="mt-16 items-center justify-center">
                <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                  <MaterialIcons name="store" size={40} color="#d1d5db" />
                </View>
                <Text className="text-gray-500 text-sm">
                  No services added yet. Add services to showcase your
                  offerings!
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}
