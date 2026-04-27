import LocationPicker from "@/src/components/ui/LocationPicker";
import { Text } from "@/src/components/ui/Text";
import { useGetBusinessById, useUpdateBusiness } from "@/src/features/business";
import { useBusinessDraftStore } from "@/src/features/business/store/useBusiness";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CATEGORY_FIELDS,
  CATEGORY_OPTIONS,
  VENDOR_CATEGORIES,
  type FieldConfig,
  type FormState,
} from "./business-form-constants";

export default function EditBusinessScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { businessId } = useLocalSearchParams<{ businessId: string }>();
  const { data: business, isLoading } = useGetBusinessById(businessId ?? "");
  const updateBusiness = useUpdateBusiness();
  const draftBusiness = useBusinessDraftStore((state) => state.business);
  const clearBusinessDraft = useBusinessDraftStore((state) => state.clearBusiness);
  const businessInfo = draftBusiness ?? business?.business_information ?? null;

  const [form, setForm] = useState<FormState>({
    businessName: "",
    description: "",
    city: "",
    country: "",
    latitude: "",
    longitude: "",
    vendorType: "",
    vendorCategoryId: "",
    categoryDetails: {},
    email: "",
    contactPhone: "",
  });
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    return () => {
      clearBusinessDraft();
    };
  }, [clearBusinessDraft]);

  // Pre-populate form when business data loads
  useEffect(() => {
    if (businessInfo && !initialized) {

      setForm({
        businessName: businessInfo.business_name ?? "",
        description: businessInfo.description ?? "",
        city: businessInfo.city ?? "",
        country: businessInfo.country ?? "",
        latitude: businessInfo.latitude != null ? String(businessInfo.latitude) : "",
        longitude: businessInfo.longitude != null ? String(businessInfo.longitude) : "",
        vendorType: "",
        vendorCategoryId: businessInfo.category ?? "",
        categoryDetails: {},
        email: businessInfo.email ?? "",
        contactPhone: businessInfo.contact_phone ?? "",
      });
      setCoverImage(businessInfo.cover ?? null);
      setInitialized(true);
    }
  }, [businessInfo, initialized]);

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
    if (!form.vendorCategoryId) {
      Alert.alert("Required", "Please select a vendor type.");
      return;
    }

    updateBusiness.mutate(
      {
        id: businessId!,
        payload: {
          business_name: form.businessName.trim(),
          description: form.description.trim() || undefined,
          category: form.vendorCategoryId || undefined,
          cover: coverImage ?? undefined,
          city: form.city.trim() || undefined,
          country: form.country.trim() || undefined,
          latitude: form.latitude ? parseFloat(form.latitude) : undefined,
          longitude: form.longitude ? parseFloat(form.longitude) : undefined,
          categoryDetails: Object.keys(form.categoryDetails).length > 0
            ? form.categoryDetails
            : undefined,
          email: form.email.trim() || undefined,
          contact_phone: form.contactPhone.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          Alert.alert("Success", "Business updated!", [
            { text: "OK", onPress: () => router.back() },
          ]);
        },
        onError: () => {
          Alert.alert("Error", "Failed to update business. Please try again.");
        },
      }
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={updateBusiness.isPending}
          style={{
            backgroundColor: "#ee2b8c",
            paddingHorizontal: 18,
            paddingVertical: 8,
            borderRadius: 50,
            marginRight: 12,
            opacity: updateBusiness.isPending ? 0.6 : 1,
          }}
        >
          <Text className="text-white font-bold text-[15px]">
            {updateBusiness.isPending ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleSubmit, updateBusiness.isPending]);

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

  // ─── Loading state ─────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#f8f6f7] items-center justify-center">
        <ActivityIndicator color="#ee2b8c" />
      </SafeAreaView>
    );
  }

  if (!businessInfo) {
    return (
      <SafeAreaView className="flex-1 bg-[#f8f6f7] items-center justify-center">
        <MaterialIcons name="storefront" size={48} color="#d1d5db" />
        <Text variant="h2" className="text-[#594048] mt-3 text-base">
          Business not found
        </Text>
      </SafeAreaView>
    );
  }

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
          paddingTop: 12,
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

          {/* Email */}
          <View>
            <Text variant="h1" className="text-[11px] text-[#594048] uppercase tracking-widest ml-1 mb-1.5">
              Email(Optional)
            </Text>
            <View className="flex-row items-center bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
              <MaterialIcons name="email" size={18} color="#9ca3af" style={{ marginLeft: 14 }} />
              <TextInput
                className="flex-1 px-2.5 py-4 text-[#181114] font-semibold text-[15px]"
                placeholder="contact@example.com"
                placeholderTextColor="#d1d5db"
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
              />
            </View>
          </View>

          {/* Phone Number */}
          <View>
            <Text variant="h1" className="text-[11px] text-[#594048] uppercase tracking-widest ml-1 mb-1.5">
              Phone Number(Optional)
            </Text>
            <View className="flex-row items-center bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
              <MaterialIcons name="phone" size={18} color="#9ca3af" style={{ marginLeft: 14 }} />
              <TextInput
                className="flex-1 px-2.5 py-4 text-[#181114] font-semibold text-[15px]"
                placeholder="+977 98XXXXXXXX"
                placeholderTextColor="#d1d5db"
                keyboardType="phone-pad"
                value={form.contactPhone}
                onChangeText={(text) => setForm((prev) => ({ ...prev, contactPhone: text }))}
              />
            </View>
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

          {/* Category-specific fields */}
          {activeFields && activeFields.length > 0 && (
            <View className="gap-6">
              {activeFields.map(renderCategoryField)}
            </View>
          )}

          {/* City + Country */}
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

          {/* Location Pin — map picker */}
          <LocationPicker
            latitude={form.latitude}
            longitude={form.longitude}
            onChange={(lat, lng) =>
              setForm((prev) => ({ ...prev, latitude: lat, longitude: lng }))
            }
          />
        </View>
      </ScrollView>

    </KeyboardAvoidingView>
  );
}
