import {
  Business,
  BusinessCategory,
} from "@/src/constants/business";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text } from "@/src/components/ui/Text";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dropdown } from "react-native-element-dropdown";



// ─── Vendor → BusinessCategory mapping ───────────────────────────────────────

const VENDOR_TO_CATEGORY: Record<string, BusinessCategory> = {
  venues: "venue",
  photographers: "photography",
  makeup: "makeup",
  "planning-decor": "decor",
  "music-dance": "music",
  food: "catering",
  "pre-wedding": "photography",
  "bridal-wear": "other",
  jewelry: "other",
  "bridal-grooming": "makeup",
  security: "other",
  "invites-gifts": "other",
};

// ─── Vendor category data ────────────────────────────────────────────────────

interface VendorCategory {
  value: string;
  name: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  subtypes?: string[];
}

const VENDOR_CATEGORIES: VendorCategory[] = [
  {
    value: "venues",
    name: "Venues",
    icon: "location-city",
    subtypes: [
      "Banquet Halls",
      "Marriage Garden / Lawns",
      "Wedding Resorts",
      "Small Function / Party Halls",
      "Destination Wedding Venues",
      "Kalyana Mandapams",
      "4 Star & Above Wedding Hotels",
      "Wedding Farmhouses",
    ],
  },
  {
    value: "photographers",
    name: "Photographers",
    icon: "photo-camera",
  },
  {
    value: "makeup",
    name: "Makeup / Bridal Makeup Artists",
    icon: "face",
  },
  {
    value: "planning-decor",
    name: "Planning & Decor",
    icon: "auto-awesome",
    subtypes: ["Wedding Planners", "Decorators", "Mehendi Artists"],
  },
  {
    value: "music-dance",
    name: "Music & Dance",
    icon: "music-note",
    subtypes: ["DJs", "Wedding Entertainment"],
  },
  {
    value: "invites-gifts",
    name: "Invites & Gifts",
    icon: "card-giftcard",
    subtypes: [
      "Invitations",
      "Favors",
      "Invitation Gifts",
      "Mehndi Favors",
    ],
  },
  {
    value: "food",
    name: "Food",
    icon: "restaurant",
    subtypes: ["Catering Services", "Cake", "Chaat & Food Stalls"],
  },
  {
    value: "pre-wedding",
    name: "Pre Wedding Shoot",
    icon: "camera-roll",
  },
  {
    value: "bridal-wear",
    name: "Bridal Wear",
    icon: "checkroom",
    subtypes: [
      "Bridal Lehengas",
      "Kanjeevaram / Silk Sarees",
      "Cocktail Gowns",
      "Trousseau Sarees",
      "Bridal Lehenga on Rent",
    ],
  },
  {
    value: "jewelry",
    name: "Jewelry & Accessories",
    icon: "diamond",
    subtypes: [
      "Jewelry",
      "Flower Jewelry",
      "Bridal Jewelry on Rent",
      "Accessories",
    ],
  },
  {
    value: "bridal-grooming",
    name: "Bridal Grooming",
    icon: "spa",
  },
  {
    value: "security",
    name: "Security Guard",
    icon: "security",
  },
];

// ─── Category dropdown options (top-level only) ──────────────────────────────

const CATEGORY_OPTIONS = VENDOR_CATEGORIES.map((cat) => ({
  label: cat.name,
  value: cat.value,
}));

// ─── Category-specific field definitions ─────────────────────────────────────

type FieldType = "text" | "number" | "toggle" | "dropdown";

interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
  unit?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
}

const CATEGORY_FIELDS: Record<string, FieldConfig[]> = {
  security: [
    { key: "guardsRequired", label: "Number of Guards Required", type: "number", placeholder: "e.g. 5", unit: "guards", icon: "security" },
    { key: "securityFor", label: "Security Required For", type: "dropdown", options: ["VVIP / International Guests", "Politician / Public Figure", "General Event Security"], icon: "security" },
    { key: "guardType", label: "Guard Type", type: "dropdown", options: ["Unarmed", "Armed", "Both Armed & Unarmed"], icon: "security" },
  ],
};

// ─── Form state ───────────────────────────────────────────────────────────────

interface FormState {
  businessName: string;
  description: string;
  city: string;
  country: string;
  vendorType: string;
  vendorCategoryId: string;
  categoryDetails: Record<string, string | boolean>;
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function CreateBusinessScreen() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    businessName: "",
    description: "",
    city: "",
    country: "",
    vendorType: "",
    vendorCategoryId: "",
    categoryDetails: {},
  });
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const updateCategoryDetail = (key: string, value: string | boolean) =>
    setForm((prev) => ({
      ...prev,
      categoryDetails: { ...prev.categoryDetails, [key]: value },
    }));

  const handleSubmit = () => {
    if (!form.businessName.trim()) {
      Alert.alert("Required", "Please enter a business name.");
      return;
    }
    if (!form.vendorType) {
      Alert.alert("Required", "Please select a vendor type.");
      return;
    }

    const location = [form.city.trim(), form.country.trim()]
      .filter(Boolean)
      .join(", ");

    const newBusiness: Business = {
      id: Date.now().toString(),
      name: form.businessName.trim(),
      description: form.description.trim() || undefined,
      category: VENDOR_TO_CATEGORY[form.vendorCategoryId] ?? "other",
      imageUrl: "",
      coverImageUrl: coverImage ?? undefined,
      status: "pending",
      rating: null,
      upcomingEvents: 0,
      location: location || undefined,
      totalBookings: 0,
      totalEarnings: "$0",
      profileViews: 0,
      services: [],
      portfolio: [],
      requests: [],
      reviews: [],
      availabilityDates: { booked: [], pending: [] },
    };

    // TODO: call API with newBusiness + form.categoryDetails
    console.log("Creating business:", newBusiness);
    console.log("Category details:", form.categoryDetails);
    Alert.alert("Success", "Business created!", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  const pickImage = async (
    setter: (uri: string) => void,
    aspect: [number, number]
  ) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setter(result.assets[0].uri);
    }
  };

  // ─── Category-specific field renderer ───────────────────────────────────────

  const renderCategoryField = (field: FieldConfig) => {
    const value = form.categoryDetails[field.key];

    if (field.type === "toggle") {
      return (
        <View
          key={field.key}
          className="flex-row items-center justify-between bg-white border border-gray-100 rounded-xl px-5 py-4 shadow-sm"
        >
          <View className="flex-row items-center gap-3 flex-1 mr-4">
            {field.icon && (
              <MaterialIcons name={field.icon} size={18} color="#9ca3af" />
            )}
            <Text className="text-[#181114] font-medium text-[14px] flex-1">
              {field.label}
            </Text>
          </View>
          <Switch
            value={!!value}
            onValueChange={(val) => updateCategoryDetail(field.key, val)}
            trackColor={{ false: "#e5e7eb", true: "#ee2b8c" }}
            thumbColor="white"
          />
        </View>
      );
    }

    if (field.type === "dropdown") {
      const dropdownData = (field.options ?? []).map((o) => ({
        label: o,
        value: o,
      }));
      return (
        <View key={field.key}>
          <Text
            variant="h1"
            className="text-[11px] text-[#594048] uppercase tracking-widest ml-1 mb-1.5"
          >
            {field.label}
          </Text>
          <Dropdown
            style={{
              height: 50,
              borderWidth: 1,
              borderColor: "#e5e7eb",
              borderRadius: 12,
              paddingHorizontal: 16,
              backgroundColor: "white",
            }}
            placeholderStyle={{ color: "#d1d5db", fontSize: 15 }}
            selectedTextStyle={{
              color: "#181114",
              fontSize: 15,
              fontWeight: "600",
            }}
            data={dropdownData}
            labelField="label"
            valueField="value"
            placeholder={`Select ${field.label.toLowerCase()}`}
            value={(value as string) ?? null}
            onChange={(item) => updateCategoryDetail(field.key, item.value)}
            renderItem={(item, selected) => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  backgroundColor: selected ? "#fdf2f8" : "white",
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: selected ? "#ee2b8c" : "#181114",
                    fontWeight: selected ? "600" : "400",
                  }}
                >
                  {item.label}
                </Text>
                {selected && (
                  <MaterialIcons
                    name="check-circle"
                    size={16}
                    color="#ee2b8c"
                  />
                )}
              </View>
            )}
          />
        </View>
      );
    }

    // text or number
    return (
      <View key={field.key}>
        <Text
          variant="h1"
          className="text-[11px] text-[#594048] uppercase tracking-widest ml-1 mb-1.5"
        >
          {field.label}
        </Text>
        <View className="flex-row items-center bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          {field.icon && (
            <MaterialIcons
              name={field.icon}
              size={18}
              color="#9ca3af"
              style={{ marginLeft: 14 }}
            />
          )}
          <TextInput
            className="flex-1 px-2.5 py-4 text-[#181114] font-semibold text-[15px]"
            placeholder={field.placeholder}
            placeholderTextColor="#d1d5db"
            keyboardType={field.type === "number" ? "numeric" : "default"}
            value={(value as string) ?? ""}
            onChangeText={(text) => updateCategoryDetail(field.key, text)}
          />
          {field.unit && (
            <Text className="text-gray-400 text-[13px] pr-4">{field.unit}</Text>
          )}
        </View>
      </View>
    );
  };

  // ─── JSX ──────────────────────────────────────────────────────────────────────

  const activeCategory = VENDOR_CATEGORIES.find(
    (c) => c.value === form.vendorCategoryId
  );
  const activeFields = form.vendorCategoryId
    ? CATEGORY_FIELDS[form.vendorCategoryId]
    : null;

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 bg-[#f8f6f7]">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Visual Assets */}
        <View className="mb-8 gap-5">
          {/* Cover Image */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => pickImage(setCoverImage, [16, 7])}
            className="w-full rounded-xl overflow-hidden border-2 border-dashed border-gray-200 bg-[#f0edee]"
            style={{ aspectRatio: 16 / 7 }}
          >
            {coverImage ? (
              <Image
                source={{ uri: coverImage }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="flex-1 items-center justify-center gap-1">
                <MaterialIcons name="add-a-photo" size={28} color="#9ca3af" />
                <Text variant="h1" className="text-[10px] text-gray-400 uppercase tracking-widest">
                  Upload Cover
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Form fields */}
        <View className="gap-6">
          {/* Business Name */}
          <View>
            <Text variant="h1" className="text-[11px] text-[#594048] uppercase tracking-widest ml-1 mb-1.5">
              Business Name
            </Text>
            <TextInput
              className="w-full bg-white border border-gray-100 rounded-xl px-5 py-4 text-[#181114] font-semibold text-[15px] shadow-sm"
              placeholder="e.g. Velvet Atelier"
              placeholderTextColor="#d1d5db"
              value={form.businessName}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, businessName: text }))
              }
            />
          </View>

          {/* Description */}
          <View>
            <Text variant="h1" className="text-[11px] text-[#594048] uppercase tracking-widest ml-1 mb-1.5">
              Description
            </Text>
            <TextInput
              className="w-full bg-white border border-gray-100 rounded-xl px-5 py-4 text-[#181114] font-medium text-[15px] shadow-sm"
              placeholder="Tell the world about your unique brand..."
              placeholderTextColor="#d1d5db"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={{ minHeight: 110 }}
              value={form.description}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, description: text }))
              }
            />
          </View>

          {/* Category */}
          <View>
            <Text variant="h1" className="text-[11px] text-[#594048] uppercase tracking-widest ml-1 mb-1.5">
              Category
            </Text>
            <Dropdown
              style={{
                height: 50,
                borderWidth: 1,
                borderColor: "#e5e7eb",
                borderRadius: 12,
                paddingHorizontal: 16,
                backgroundColor: "white",
              }}
              placeholderStyle={{ color: "#d1d5db", fontSize: 15 }}
              selectedTextStyle={{ color: "#181114", fontSize: 15, fontWeight: "600" }}
              data={CATEGORY_OPTIONS}
              labelField="label"
              valueField="value"
              placeholder="Select category"
              value={form.vendorCategoryId || null}
              onChange={(item) => {
                setForm((prev) => ({
                  ...prev,
                  vendorCategoryId: item.value,
                  vendorType: "",
                  categoryDetails: {},
                }));
              }}
              renderItem={(item, selected) => (
                <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, backgroundColor: selected ? "#fdf2f8" : "white" }}>
                  <Text style={{ flex: 1, fontSize: 15, color: selected ? "#ee2b8c" : "#181114", fontWeight: selected ? "600" : "400" }}>
                    {item.label}
                  </Text>
                  {selected && <MaterialIcons name="check-circle" size={16} color="#ee2b8c" />}
                </View>
              )}
            />
          </View>

          {/* Sub-type — shown only if selected category has subtypes */}
          {activeCategory?.subtypes && activeCategory.subtypes.length > 0 && (
            <View>
              <Text variant="h1" className="text-[11px] text-[#594048] uppercase tracking-widest ml-1 mb-1.5">
                {activeCategory.name} Type
              </Text>
              <Dropdown
                style={{
                  height: 50,
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  backgroundColor: "white",
                }}
                placeholderStyle={{ color: "#d1d5db", fontSize: 15 }}
                selectedTextStyle={{ color: "#181114", fontSize: 15, fontWeight: "600" }}
                data={activeCategory.subtypes.map((s) => ({ label: s, value: s }))}
                labelField="label"
                valueField="value"
                placeholder={`Select type`}
                value={form.vendorType || null}
                onChange={(item) =>
                  setForm((prev) => ({ ...prev, vendorType: item.value }))
                }
                renderItem={(item, selected) => (
                  <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, backgroundColor: selected ? "#fdf2f8" : "white" }}>
                    <Text style={{ flex: 1, fontSize: 15, color: selected ? "#ee2b8c" : "#181114", fontWeight: selected ? "600" : "400" }}>
                      {item.label}
                    </Text>
                    {selected && <MaterialIcons name="check-circle" size={16} color="#ee2b8c" />}
                  </View>
                )}
              />
            </View>
          )}

          {/* Security-specific fields */}
          {activeFields && activeFields.length > 0 && (
            <View className="gap-6">
              {activeFields.map(renderCategoryField)}
            </View>
          )}

          {/* City + Country — at the bottom */}
          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text variant="h1" className="text-[11px] text-[#594048] uppercase tracking-widest ml-1 mb-1.5">
                City
              </Text>
              <View className="flex-row items-center bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                <MaterialIcons
                  name="location-city"
                  size={18}
                  color="#9ca3af"
                  style={{ marginLeft: 14 }}
                />
                <TextInput
                  className="flex-1 px-2.5 py-4 text-[#181114] font-semibold text-[15px]"
                  placeholder="Kathmandu"
                  placeholderTextColor="#d1d5db"
                  value={form.city}
                  onChangeText={(text) =>
                    setForm((prev) => ({ ...prev, city: text }))
                  }
                />
              </View>
            </View>

            <View className="flex-1">
              <Text variant="h1" className="text-[11px] text-[#594048] uppercase tracking-widest ml-1 mb-1.5">
                Country
              </Text>
              <View className="flex-row items-center bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                <MaterialIcons
                  name="public"
                  size={18}
                  color="#9ca3af"
                  style={{ marginLeft: 14 }}
                />
                <TextInput
                  className="flex-1 px-2.5 py-4 text-[#181114] font-semibold text-[15px]"
                  placeholder="Nepal"
                  placeholderTextColor="#d1d5db"
                  value={form.country}
                  onChangeText={(text) =>
                    setForm((prev) => ({ ...prev, country: text }))
                  }
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Submit */}
      <SafeAreaView edges={["bottom"]} className="px-6 pb-4 bg-[#f8f6f7]/95">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSubmit}
          className="w-full bg-[#ee2b8c] rounded-2xl py-5 flex-row items-center justify-center gap-3"
          style={{
            shadowColor: "#ee2b8c",
            shadowOpacity: 0.25,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
            elevation: 6,
          }}
        >
          <Text className="text-white font-extrabold text-[18px] tracking-tight">
            Create Business
          </Text>
          <MaterialIcons name="arrow-forward" size={22} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
