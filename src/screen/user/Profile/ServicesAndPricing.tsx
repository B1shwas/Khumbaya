import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
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

type Service = {
  id: string;
  title: string;
  price: string;
  description: string;
  badge?: string;
};

// Default services for new users
const DEFAULT_SERVICES: Service[] = [
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
];

// Vendor Types with Offerings and Specialties
type VendorType = {
  id: string;
  name: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  offerings: string[];
  defaultSpecialties: string[];
};

const VENDOR_TYPES: VendorType[] = [
  {
    id: "chef",
    name: "Chef",
    icon: "restaurant",
    offerings: ["Breakfast", "Lunch", "Dinner", "Dessert", "Catering"],
    defaultSpecialties: [
      "Vegan",
      "Gluten-free",
      "Signature Dishes",
      "International Cuisine",
    ],
  },
  {
    id: "photographer",
    name: "Photographer",
    icon: "camera-alt",
    offerings: ["Wedding", "Event", "Portrait", "Candid", "Drone Shots"],
    defaultSpecialties: [
      "Studio Portraits",
      "Event Highlights",
      "Photo Editing",
      "Album Design",
    ],
  },
  {
    id: "bartender",
    name: "Bartender",
    icon: "local-bar",
    offerings: ["Cocktails", "Mocktails", "Themed Drinks", "Wine Service"],
    defaultSpecialties: [
      "Flair Bartending",
      "Signature Cocktails",
      "Mixology",
      "Bar Setup",
    ],
  },
  {
    id: "dancer",
    name: "Dancer",
    icon: "music-note",
    offerings: [
      "Salsa",
      "Hip-hop",
      "Ballet",
      "Performance Shows",
      "Choreography",
    ],
    defaultSpecialties: [
      "Group Performance",
      "Solo Acts",
      "Wedding Dance",
      "Cultural Dance",
    ],
  },
  {
    id: "musician",
    name: "Musician / Band",
    icon: "music-note",
    offerings: ["Live Music", "DJ", "Instrumental Performances", "Singing"],
    defaultSpecialties: [
      "Jazz",
      "Rock",
      "Classical",
      "Covers/Special Requests",
    ],
  },
  {
    id: "makeup",
    name: "Makeup Artist",
    icon: "face",
    offerings: ["Bridal", "Event", "Photoshoots", "Group Makeup"],
    defaultSpecialties: [
      "Special Effects",
      "Natural Look",
      "HD Makeup",
      "Airbrush",
    ],
  },
  {
    id: "decorator",
    name: "Decorator / Florist",
    icon: "local-florist",
    offerings: [
      "Venue Decoration",
      "Floral Arrangements",
      "Theme Decor",
      "Balloon Decor",
    ],
    defaultSpecialties: [
      "Eco-friendly",
      "Custom Designs",
      "Wedding Themes",
      "Corporate Events",
    ],
  },
  {
    id: "photobooth",
    name: "Photobooth",
    icon: "photo-camera",
    offerings: [
      "Booth Rental",
      "Event Props",
      "Instant Prints",
      "Digital Gallery",
    ],
    defaultSpecialties: [
      "Custom Themes",
      "GIFs",
      "Green Screen",
      "Unlimited Prints",
    ],
  },
  {
    id: "mc",
    name: "MC / Host",
    icon: "mic",
    offerings: ["Event Hosting", "Announcements", "Emceeing", "Game Hosting"],
    defaultSpecialties: [
      "Bilingual",
      "Humor",
      "Wedding MC",
      "Corporate Events",
    ],
  },
];

// Reusable InputField Component (DRY)
const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  multiline = false,
  required = false,
  error,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  multiline?: boolean;
  required?: boolean;
  error?: string;
}) => (
  <View className="mb-4">
    <View className="flex-row items-center mb-2">
      <Text className="text-sm font-semibold text-gray-800">{label}</Text>
      {required && <Text className="text-red-500 ml-1">*</Text>}
    </View>
    <View className="relative">
      {icon && (
        <View
          className={`absolute ${multiline ? "top-4 left-4" : "left-4"} z-10`}
        >
          <MaterialIcons
            name={icon}
            size={20}
            color={error ? "#ef4444" : "#9ca3af"}
          />
        </View>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        multiline={multiline}
        className={`w-full bg-gray-50 rounded-xl shadow-sm border ${error ? "border-red-300" : "border-gray-100"} 
          ${multiline ? "p-4 min-h-[80px]" : "h-14"} 
          ${icon ? (multiline ? "pl-12 pr-4" : "pl-12 pr-4") : "px-4"}
          text-gray-800 text-base`}
        style={multiline ? { textAlignVertical: "top" } : {}}
      />
    </View>
    {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
  </View>
);

// Reusable Card Component (DRY)
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <View
    className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 ${className}`}
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

// Service Card Component (DRY)
const ServiceCard = ({
  service,
  onDelete,
  onEdit,
}: {
  service: Service;
  onDelete: () => void;
  onEdit?: () => void;
}) => (
  <Card className="mb-4 relative">
    {service.badge && (
      <View className="absolute top-0 right-4 -translate-y-1/2 bg-pink-500 px-3 py-1 rounded-full shadow-sm z-10">
        <Text className="text-white text-[10px] font-bold tracking-wider">
          {service.badge}
        </Text>
      </View>
    )}

    <View className="flex-row justify-between items-start mb-3">
      <View className="flex-1 pr-8">
        <Text className="font-bold text-gray-900 text-lg">{service.title}</Text>
        <Text className="text-pink-600 font-bold text-xl mt-1">
          {service.price}
        </Text>
      </View>
      <View className="flex-row gap-2">
        {onEdit && (
          <TouchableOpacity
            onPress={onEdit}
            className="p-2 bg-gray-50 rounded-full"
          >
            <MaterialIcons name="edit" size={18} color="#6b7280" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={onDelete}
          className="p-2 bg-red-50 rounded-full"
        >
          <MaterialIcons name="delete" size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>

    <Text className="text-gray-500 text-sm leading-relaxed">
      {service.description}
    </Text>
  </Card>
);

// Empty State Component (DRY)
const EmptyState = ({ onAdd }: { onAdd: () => void }) => (
  <View className="items-center py-12">
    <View className="w-20 h-20 bg-pink-50 rounded-full items-center justify-center mb-4">
      <MaterialIcons name="add-shopping-cart" size={40} color="#ee2b8c" />
    </View>
    <Text className="text-lg font-semibold text-gray-900 mb-2">
      No Services Added
    </Text>
    <Text className="text-gray-500 text-center mb-6 px-8">
      Add your first service to showcase what you offer to potential clients.
    </Text>
    <TouchableOpacity
      onPress={onAdd}
      className="bg-pink-500 px-6 py-3 rounded-xl flex-row items-center gap-2"
      activeOpacity={0.9}
    >
      <MaterialIcons name="add" size={20} color="#ffffff" />
      <Text className="text-white font-semibold">Add Your First Service</Text>
    </TouchableOpacity>
  </View>
);

export default function ServicesAndPricingScreen() {
  const [services, setServices] = useState<Service[]>([]);
  const [newServiceTitle, setNewServiceTitle] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("");
  const [newServiceDescription, setNewServiceDescription] = useState("");
  const [isAddingService, setIsAddingService] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  // Vendor type state
  const [selectedVendorType, setSelectedVendorType] = useState<string>("");
  const [selectedOfferings, setSelectedOfferings] = useState<string[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [newSpecialty, setNewSpecialty] = useState("");
  const [showVendorTypePicker, setShowVendorTypePicker] = useState(false);

  // Get current vendor type data
  const currentVendorType = VENDOR_TYPES.find(
    (v) => v.id === selectedVendorType,
  );

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
        setServices(DEFAULT_SERVICES);
      }

      // Load vendor profile data
      const storedVendorProfile = await AsyncStorage.getItem(
        "vendor_profile_data",
      );
      if (storedVendorProfile) {
        const vendorProfile = JSON.parse(storedVendorProfile);
        setSelectedVendorType(vendorProfile.vendorType || "");
        setSelectedOfferings(vendorProfile.offerings || []);
        setSpecialties(vendorProfile.specialties || []);
      }
    } catch (error) {
      console.error("Error loading services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateService = () => {
    const newErrors: { [key: string]: string } = {};

    if (!newServiceTitle.trim()) {
      newErrors.title = "Service name is required";
    }

    if (!newServicePrice.trim()) {
      newErrors.price = "Price is required";
    }

    if (!newServiceDescription.trim()) {
      newErrors.description = "Description is required";
    } else if (newServiceDescription.length < 10) {
      newErrors.description = "Please provide at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveServices = async () => {
    try {
      setIsLoading(true);
      // Save services
      await AsyncStorage.setItem(
        STORAGE_KEYS.SERVICES_PRICING,
        JSON.stringify(services),
      );
      // Save vendor profile data (type, offerings, specialties)
      const vendorProfileData = {
        vendorType: selectedVendorType,
        offerings: selectedOfferings,
        specialties: specialties,
      };
      await AsyncStorage.setItem(
        "vendor_profile_data",
        JSON.stringify(vendorProfileData),
      );
      router.back();
    } catch (error) {
      console.error("Error saving services:", error);
      Alert.alert("Error", "Failed to save services. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddService = () => {
    if (!validateService()) return;

    const newService: Service = {
      id: Date.now().toString(),
      title: newServiceTitle.trim(),
      price: newServicePrice.trim(),
      description: newServiceDescription.trim(),
    };

    setServices([...services, newService]);
    resetForm();
  };

  const handleUpdateService = () => {
    if (!editingService || !validateService()) return;

    setServices(
      services.map((s) =>
        s.id === editingService.id
          ? {
              ...s,
              title: newServiceTitle.trim(),
              price: newServicePrice.trim(),
              description: newServiceDescription.trim(),
            }
          : s,
      ),
    );
    resetForm();
  };

  const handleDeleteService = (id: string) => {
    Alert.alert(
      "Delete Service",
      "Are you sure you want to delete this service?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => setServices(services.filter((s) => s.id !== id)),
        },
      ],
    );
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setNewServiceTitle(service.title);
    setNewServicePrice(service.price);
    setNewServiceDescription(service.description);
    setIsAddingService(true);
  };

  const resetForm = () => {
    setNewServiceTitle("");
    setNewServicePrice("");
    setNewServiceDescription("");
    setErrors({});
    setIsAddingService(false);
    setEditingService(null);
  };

  const toggleAddService = () => {
    if (isAddingService) {
      resetForm();
    } else {
      setIsAddingService(true);
    }
  };

  // Handler for selecting vendor type
  const handleSelectVendorType = (vendorTypeId: string) => {
    const vendorType = VENDOR_TYPES.find((v) => v.id === vendorTypeId);
    setSelectedVendorType(vendorTypeId);
    setSelectedOfferings(vendorType?.offerings || []);
    setSpecialties(vendorType?.defaultSpecialties || []);
    setShowVendorTypePicker(false);
  };

  // Handler for toggling an offering
  const toggleOffering = (offering: string) => {
    setSelectedOfferings((prev) =>
      prev.includes(offering)
        ? prev.filter((o) => o !== offering)
        : [...prev, offering],
    );
  };

  // Handler for adding a specialty
  const handleAddSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      setSpecialties([...specialties, newSpecialty.trim()]);
      setNewSpecialty("");
    }
  };

  // Handler for removing a specialty
  const removeSpecialty = (specialty: string) => {
    setSpecialties(specialties.filter((s) => s !== specialty));
  };

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
              <Text className="text-lg font-bold text-gray-900">
                Services & Pricing
              </Text>
              <Text className="text-xs text-gray-500">
                {services.length} services
              </Text>
            </View>
            <TouchableOpacity
              className="w-10 h-10 items-center justify-center rounded-full bg-pink-50"
              accessibilityRole="button"
              onPress={saveServices}
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
            className="flex-1 px-4 pt-6 pb-10"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View className="mb-6">
              <Text className="text-2xl font-bold text-gray-900 mb-2">
                Your Services
              </Text>
              <Text className="text-base text-gray-600 leading-relaxed">
                Showcase the services you offer. You can add, edit, or remove
                services at any time.
              </Text>
            </View>

            {/* Vendor Type Selection */}
            <Card className="mb-4">
              <Text className="text-lg font-bold text-gray-900 mb-4">
                Vendor Category
              </Text>
              <Text className="text-sm text-gray-600 mb-3">
                Select your vendor type to see relevant offerings
              </Text>

              {/* Vendor Type Selector */}
              <TouchableOpacity
                onPress={() => setShowVendorTypePicker(!showVendorTypePicker)}
                className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"
              >
                <View className="flex-row items-center">
                  {selectedVendorType ? (
                    <>
                      <View className="w-10 h-10 bg-pink-50 rounded-full items-center justify-center mr-3">
                        <MaterialIcons
                          name={currentVendorType?.icon || "category"}
                          size={20}
                          color="#ee2b8c"
                        />
                      </View>
                      <View>
                        <Text className="font-semibold text-gray-900">
                          {currentVendorType?.name}
                        </Text>
                        <Text className="text-xs text-gray-500">
                          {selectedOfferings.length} offerings selected
                        </Text>
                      </View>
                    </>
                  ) : (
                    <Text className="text-gray-500">
                      Select vendor category...
                    </Text>
                  )}
                </View>
                <MaterialIcons
                  name={showVendorTypePicker ? "expand-less" : "expand-more"}
                  size={24}
                  color="#6b7280"
                />
              </TouchableOpacity>

              {/* Vendor Type Picker */}
              {showVendorTypePicker && (
                <View className="mt-3 border-t border-gray-100 pt-3">
                  {VENDOR_TYPES.map((vendor) => (
                    <TouchableOpacity
                      key={vendor.id}
                      onPress={() => handleSelectVendorType(vendor.id)}
                      className={`flex-row items-center p-3 rounded-lg mb-1 ${
                        selectedVendorType === vendor.id ? "bg-pink-50" : ""
                      }`}
                    >
                      <View
                        className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                          selectedVendorType === vendor.id
                            ? "bg-pink-100"
                            : "bg-gray-100"
                        }`}
                      >
                        <MaterialIcons
                          name={vendor.icon}
                          size={20}
                          color={
                            selectedVendorType === vendor.id
                              ? "#ee2b8c"
                              : "#6b7280"
                          }
                        />
                      </View>
                      <View className="flex-1">
                        <Text
                          className={`font-medium ${
                            selectedVendorType === vendor.id
                              ? "text-pink-600"
                              : "text-gray-900"
                          }`}
                        >
                          {vendor.name}
                        </Text>
                      </View>
                      {selectedVendorType === vendor.id && (
                        <MaterialIcons name="check" size={20} color="#ee2b8c" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </Card>

            {/* Offerings Selection */}
            {selectedVendorType && (
              <Card className="mb-4">
                <Text className="text-lg font-bold text-gray-900 mb-2">
                  Offerings
                </Text>
                <Text className="text-sm text-gray-600 mb-4">
                  What services do you provide? (Select all that apply)
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {currentVendorType?.offerings.map((offering) => (
                    <TouchableOpacity
                      key={offering}
                      onPress={() => toggleOffering(offering)}
                      className={`px-4 py-2 rounded-full border ${
                        selectedOfferings.includes(offering)
                          ? "bg-pink-500 border-pink-500"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          selectedOfferings.includes(offering)
                            ? "text-white"
                            : "text-gray-700"
                        }`}
                      >
                        {offering}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Card>
            )}

            {/* Specialties */}
            {selectedVendorType && (
              <Card className="mb-4">
                <Text className="text-lg font-bold text-gray-900 mb-2">
                  Specialties
                </Text>
                <Text className="text-sm text-gray-600 mb-4">
                  Your unique skills and strengths
                </Text>

                {/* Existing Specialties */}
                <View className="flex-row flex-wrap gap-2 mb-3">
                  {specialties.map((specialty) => (
                    <View
                      key={specialty}
                      className="flex-row items-center bg-pink-50 px-3 py-2 rounded-full border border-pink-100"
                    >
                      <Text className="text-sm text-pink-700 font-medium">
                        {specialty}
                      </Text>
                      <TouchableOpacity
                        onPress={() => removeSpecialty(specialty)}
                        className="ml-2"
                      >
                        <MaterialIcons name="close" size={16} color="#ee2b8c" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>

                {/* Add Specialty Input */}
                <View className="flex-row items-center gap-2">
                  <TextInput
                    value={newSpecialty}
                    onChangeText={setNewSpecialty}
                    placeholder="Add a specialty..."
                    placeholderTextColor="#9ca3af"
                    className="flex-1 h-12 bg-gray-50 rounded-xl px-4 text-gray-800 border border-gray-100"
                    onSubmitEditing={handleAddSpecialty}
                  />
                  <TouchableOpacity
                    onPress={handleAddSpecialty}
                    className="w-12 h-12 bg-pink-500 rounded-xl items-center justify-center"
                  >
                    <MaterialIcons name="add" size={24} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              </Card>
            )}

            {/* Add/Edit Service Form */}
            {isAddingService && (
              <Card className="mb-6 border-pink-200">
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-lg font-bold text-gray-900">
                    {editingService ? "Edit Service" : "Add New Service"}
                  </Text>
                  <TouchableOpacity onPress={resetForm} className="p-2">
                    <MaterialIcons name="close" size={20} color="#6b7280" />
                  </TouchableOpacity>
                </View>

                <InputField
                  label="Service Name"
                  value={newServiceTitle}
                  onChangeText={(text) => {
                    setNewServiceTitle(text);
                    if (errors.title)
                      setErrors((prev) => ({ ...prev, title: "" }));
                  }}
                  placeholder="e.g., Pre-Wedding Shoot"
                  icon="work"
                  required
                  error={errors.title}
                />

                <InputField
                  label="Price"
                  value={newServicePrice}
                  onChangeText={(text) => {
                    setNewServicePrice(text);
                    if (errors.price)
                      setErrors((prev) => ({ ...prev, price: "" }));
                  }}
                  placeholder="e.g., $500 or From $500"
                  icon="attach-money"
                  required
                  error={errors.price}
                />

                <InputField
                  label="Description"
                  value={newServiceDescription}
                  onChangeText={(text) => {
                    setNewServiceDescription(text);
                    if (errors.description)
                      setErrors((prev) => ({ ...prev, description: "" }));
                  }}
                  placeholder="Describe what's included in this service..."
                  icon="description"
                  multiline
                  required
                  error={errors.description}
                />

                <View className="flex-row gap-3 mt-2">
                  <TouchableOpacity
                    onPress={
                      editingService ? handleUpdateService : handleAddService
                    }
                    className="flex-1 h-12 bg-pink-500 rounded-xl flex-row items-center justify-center gap-2 shadow-lg shadow-pink-200"
                    activeOpacity={0.9}
                  >
                    <MaterialIcons
                      name={editingService ? "save" : "add"}
                      size={20}
                      color="#ffffff"
                    />
                    <Text className="text-white font-bold">
                      {editingService ? "Update Service" : "Add Service"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={resetForm}
                    className="w-12 h-12 bg-gray-100 rounded-xl items-center justify-center"
                  >
                    <MaterialIcons name="close" size={20} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              </Card>
            )}

            {/* Add Service Button */}
            {!isAddingService && (
              <TouchableOpacity
                onPress={toggleAddService}
                className="w-full h-14 bg-white border-2 border-dashed border-pink-300 rounded-xl flex-row items-center justify-center gap-2 mb-6"
                activeOpacity={0.9}
              >
                <MaterialIcons
                  name="add-circle-outline"
                  size={24}
                  color="#ee2b8c"
                />
                <Text className="text-pink-600 font-semibold">
                  Add New Service
                </Text>
              </TouchableOpacity>
            )}

            {/* Services List */}
            {services.length === 0 ? (
              <EmptyState onAdd={() => setIsAddingService(true)} />
            ) : (
              <>
                <SectionHeader
                  title={`Your Packages (${services.length})`}
                  subtitle="Tap edit to modify a service"
                />

                {services.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onDelete={() => handleDeleteService(service.id)}
                    onEdit={() => handleEditService(service)}
                  />
                ))}

                {/* Add More Button */}
                <TouchableOpacity
                  onPress={() => setIsAddingService(true)}
                  className="w-full h-12 bg-white border border-dashed border-gray-300 rounded-xl flex-row items-center justify-center gap-2 mt-2"
                  activeOpacity={0.9}
                >
                  <MaterialIcons name="add" size={20} color="#9ca3af" />
                  <Text className="text-gray-500 font-medium">
                    Add Another Service
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* Tips Card */}
            <View className="bg-amber-50 rounded-xl p-4 border border-amber-100 mt-6">
              <View className="flex-row items-start gap-3">
                <MaterialIcons name="lightbulb" size={24} color="#f59e0b" />
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-amber-800 mb-1">
                    Pricing Tips
                  </Text>
                  <Text className="text-xs text-amber-700 leading-relaxed">
                    • Be transparent about what's included{"\n"}• Consider
                    offering packages at different price points{"\n"}• Highlight
                    your most popular service with a badge
                  </Text>
                </View>
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              onPress={saveServices}
              disabled={isLoading}
              className={`w-full h-14 bg-pink-500 rounded-xl flex-row items-center justify-center shadow-lg shadow-pink-200 mt-6 
                ${isLoading ? "opacity-70" : ""}`}
              activeOpacity={0.9}
            >
              <MaterialIcons
                name="save"
                size={20}
                color="#ffffff"
                className="mr-2"
              />
              <Text className="text-white font-bold text-lg">
                {isLoading ? "Saving..." : "Save All Changes"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
