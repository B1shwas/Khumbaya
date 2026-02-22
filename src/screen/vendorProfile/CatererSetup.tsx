/**
 * Caterer Vendor Setup
 * Complete setup wizard for catering services
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  Card,
  SectionHeader,
  InputField,
  ToggleRow,
  ChipGroup,
  StepIndicator,
  NavigationButtons,
} from "./shared/VendorFormComponents";
import { VENDOR_TYPES, STORAGE_KEYS, getVendorStorageKey } from "./VendorTypeConfig";

// ============================================================================
// Types
// ============================================================================

interface CatererData {
  // Step 1: Basic Info
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  
  // Step 2: Cuisine
  cuisineTypes: string[];
  specialty: string;
  tasteProfiles: string[];
  
  // Step 3: Services
  serviceTypes: string[];
  customMenu: boolean;
  tastingAvailable: boolean;
  
  // Step 4: Menu Highlights
  vegMenu: string[];
  nonVegMenu: string[];
  signatureDishes: string[];
  
  // Step 5: Pricing
  pricePerPlate: string;
  minOrderQuantity: string;
  serviceCharge: string;
  taxInclusive: boolean;
  
  // Step 6: Staff
  staffTypes: string[];
  staffIncluded: boolean;
  headCount: string;
  
  // Step 7: Equipment
  equipmentProvided: string[];
  setupRequired: boolean;
  
  // Step 8: Availability
  availableDays: string[];
  minimumAdvance: string;
  serviceArea: string[];
  
  // Step 9: Terms
  cancellationPolicy: string;
  advancePercent: number;
  
  // Step 10: Verification
  fssaiNumber: string;
  idNumber: string;
  bankAccount: string;
  ifscCode: string;
  
  setupComplete: boolean;
  updatedAt: string;
}

const DEFAULT_DATA: CatererData = {
  businessName: "",
  ownerName: "",
  phone: "",
  email: "",
  city: "",
  state: "",
  cuisineTypes: [],
  specialty: "",
  tasteProfiles: [],
  serviceTypes: [],
  customMenu: false,
  tastingAvailable: false,
  vegMenu: [],
  nonVegMenu: [],
  signatureDishes: [],
  pricePerPlate: "",
  minOrderQuantity: "100",
  serviceCharge: "",
  taxInclusive: false,
  staffTypes: [],
  staffIncluded: true,
  headCount: "5",
  equipmentProvided: [],
  setupRequired: false,
  availableDays: [],
  minimumAdvance: "15",
  serviceArea: [],
  cancellationPolicy: "moderate",
  advancePercent: 30,
  fssaiNumber: "",
  idNumber: "",
  bankAccount: "",
  ifscCode: "",
  setupComplete: false,
  updatedAt: "",
};

// ============================================================================
// Options
// ============================================================================

const CUISINE_TYPES = [
  { id: "north_indian", label: "North Indian" },
  { id: "south_indian", label: "South Indian" },
  { id: "chinese", label: "Chinese" },
  { id: "continental", label: "Continental" },
  { id: "italian", label: "Italian" },
  { id: "mexican", label: "Mexican" },
  { id: "thai", label: "Thai" },
  { id: "japanese", label: "Japanese" },
  { id: "fusion", label: "Fusion" },
  { id: "multi_cuisine", label: "Multi-cuisine" },
  { id: "traditional", label: "Traditional" },
];

const TASTE_PROFILES = [
  { id: "spicy", label: "Spicy" },
  { id: "mild", label: "Mild" },
  { id: "sweet", label: "Sweet" },
  { id: "sour", label: "Sour" },
  { id: "salty", label: "Salty" },
  { id: "authentic", label: "Authentic" },
];

const SERVICE_TYPES = [
  { id: "buffet", label: "Buffet" },
  { id: "plated", label: "Plated Service" },
  { id: "cocktail", label: "Cocktail" },
  { id: "live_counter", label: "Live Counters" },
  { id: "bbq", label: "BBQ" },
  { id: "dessert", label: "Dessert Station" },
  { id: "breakfast", label: "Breakfast/Lunch" },
];

const STAFF_TYPES = [
  { id: "cook", label: "Cooks" },
  { id: "helper", label: "Helpers" },
  { id: "waiter", label: "Waiters" },
  { id: "captain", label: "Captain" },
  { id: "bartender", label: "Bartender" },
];

const EQUIPMENT = [
  { id: "chafing_dishes", label: "Chafing Dishes" },
  { id: "cutlery", label: "Cutlery" },
  { id: "crockery", label: "Crockery" },
  { id: "glasses", label: "Glassware" },
  { id: "table_linen", label: "Table Linen" },
  { id: "trolleys", label: "Service Trolleys" },
  { id: "warmers", label: "Food Warmers" },
  { id: "gas", label: "Gas Cylinders" },
];

// ============================================================================
// Component
// ============================================================================

export default function CatererSetup() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<CatererData>(DEFAULT_DATA);
  const router = useRouter();

  const vendorConfig = VENDOR_TYPES.caterer;
  const totalSteps = vendorConfig.steps.length;
  const steps = [...vendorConfig.steps];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const storageKey = getVendorStorageKey("caterer");
      const stored = await AsyncStorage.getItem(storageKey);
      if (stored) {
        setData(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateData = (field: keyof CatererData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (arrayField: keyof CatererData, item: string) => {
    const currentArray = data[arrayField] as string[];
    if (currentArray.includes(item)) {
      updateData(arrayField, currentArray.filter((i) => i !== item));
    } else {
      updateData(arrayField, [...currentArray, item]);
    }
  };

  const saveData = async () => {
    try {
      setIsLoading(true);
      const storageKey = getVendorStorageKey("caterer");
      const updatedData = { ...data, setupComplete: true, updatedAt: new Date().toISOString() };
      await AsyncStorage.setItem(storageKey, JSON.stringify(updatedData));
      await AsyncStorage.setItem(STORAGE_KEYS.VENDOR_SETUP_COMPLETE, "true");
      
      Alert.alert("Success!", "Your caterer profile has been set up successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error saving data:", error);
      Alert.alert("Error", "Failed to save. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: return renderBasicInfo();
      case 2: return renderCuisine();
      case 3: return renderServices();
      case 4: return renderMenu();
      case 5: return renderPricing();
      case 6: return renderStaff();
      case 7: return renderEquipment();
      case 8: return renderAvailability();
      case 9: return renderTerms();
      case 10: return renderVerification();
      default: return null;
    }
  };

  const renderBasicInfo = () => (
    <Card>
      <SectionHeader step={1} title="🍽️ Basic Information" subtitle="Your catering business" icon="restaurant" />
      
      <InputField label="Business Name" value={data.businessName} onChangeText={(v) => updateData("businessName", v)} placeholder="e.g., Royal Caterers" icon="storefront" required />
      <InputField label="Owner Name" value={data.ownerName} onChangeText={(v) => updateData("ownerName", v)} placeholder="Your name" icon="person" required />
      
      <View className="flex-row gap-3">
        <View className="flex-1">
          <InputField label="Phone" value={data.phone} onChangeText={(v) => updateData("phone", v)} placeholder="10-digit" icon="phone" keyboardType="phone-pad" />
        </View>
        <View className="flex-1">
          <InputField label="Email" value={data.email} onChangeText={(v) => updateData("email", v)} placeholder="email@com" icon="email" keyboardType="email-address" />
        </View>
      </View>
      
      <View className="flex-row gap-3">
        <View className="flex-1">
          <InputField label="City" value={data.city} onChangeText={(v) => updateData("city", v)} placeholder="City" icon="location-city" />
        </View>
        <View className="flex-1">
          <InputField label="State" value={data.state} onChangeText={(v) => updateData("state", v)} placeholder="State" icon="map" />
        </View>
      </View>
    </Card>
  );

  const renderCuisine = () => (
    <Card>
      <SectionHeader step={2} title="🍛 Cuisine Specialization" subtitle="What cuisines do you serve?" icon="restaurant-menu" />
      
      <Text className="text-sm font-semibold text-gray-800 mb-3">Cuisine Types</Text>
      <ChipGroup options={CUISINE_TYPES} selected={data.cuisineTypes} onToggle={(id) => toggleArrayItem("cuisineTypes", id)} className="mb-4" />
      
      <InputField label="Specialty / Signature" value={data.specialty} onChangeText={(v) => updateData("specialty", v)} placeholder="Your specialty cuisine..." icon="star" />
      
      <Text className="text-sm font-semibold text-gray-800 mb-3 mt-2">Taste Profiles</Text>
      <ChipGroup options={TASTE_PROFILES} selected={data.tasteProfiles} onToggle={(id) => toggleArrayItem("tasteProfiles", id)} />
    </Card>
  );

  const renderServices = () => (
    <Card>
      <SectionHeader step={3} title="🛎️ Services Offered" subtitle="What services do you provide?" icon="room-service" />
      
      <Text className="text-sm font-semibold text-gray-800 mb-3">Service Types</Text>
      <ChipGroup options={SERVICE_TYPES} selected={data.serviceTypes} onToggle={(id) => toggleArrayItem("serviceTypes", id)} className="mb-4" />
      
      <ToggleRow label="Custom Menu Available" value={data.customMenu} onValueChange={(v) => updateData("customMenu", v)} description="Can create customized menu as per request" icon="edit" />
      <ToggleRow label="Tasting Available" value={data.tastingAvailable} onValueChange={(v) => updateData("tastingAvailable", v)} description="Food tasting before event" icon="restaurant" />
    </Card>
  );

  const renderMenu = () => (
    <Card>
      <SectionHeader step={4} title="📜 Menu Highlights" subtitle="Showcase your menu items" icon="menu-book" />
      
      <InputField label="Vegetarian Highlights (comma separated)" value={data.vegMenu.join(", ")} onChangeText={(v) => updateData("vegMenu", v.split(",").map(s => s.trim()))} placeholder="Paneer Tikka, Dal Makhani..." icon="eco" multiline />
      
      <InputField label="Non-Veg Highlights (comma separated)" value={data.nonVegMenu.join(", ")} onChangeText={(v) => updateData("nonVegMenu", v.split(",").map(s => s.trim()))} placeholder="Chicken Curry, Fish Fry..." icon="lunch-dining" multiline />
      
      <InputField label="Signature Dishes (comma separated)" value={data.signatureDishes.join(", ")} onChangeText={(v) => updateData("signatureDishes", v.split(",").map(s => s.trim()))} placeholder="Your signature preparations..." icon="workspace-premium" multiline />
    </Card>
  );

  const renderPricing = () => (
    <Card>
      <SectionHeader step={5} title="💰 Pricing" subtitle="Your pricing structure" icon="attach-money" />
      
      <InputField label="Price per Plate (₹)" value={data.pricePerPlate} onChangeText={(v) => updateData("pricePerPlate", v)} placeholder="e.g., 1500" icon="restaurant" keyboardType="numeric" required />
      
      <InputField label="Minimum Order Quantity" value={data.minOrderQuantity} onChangeText={(v) => updateData("minOrderQuantity", v)} placeholder="e.g., 100" icon="people" keyboardType="numeric" />
      
      <InputField label="Service Charge (%)" value={data.serviceCharge} onChangeText={(v) => updateData("serviceCharge", v)} placeholder="e.g., 10" icon="percent" keyboardType="numeric" />
      
      <ToggleRow label="Tax Inclusive" value={data.taxInclusive} onValueChange={(v) => updateData("taxInclusive", v)} description="GST inclusive in pricing" icon="check-circle" />
    </Card>
  );

  const renderStaff = () => (
    <Card>
      <SectionHeader step={6} title="👥 Staff" subtitle="Your service team" icon="groups" />
      
      <ToggleRow label="Staff Included in Price" value={data.staffIncluded} onValueChange={(v) => updateData("staffIncluded", v)} description="Service staff included" icon="groups" />
      
      <Text className="text-sm font-semibold text-gray-800 mb-3 mt-2">Staff Types Provided</Text>
      <ChipGroup options={STAFF_TYPES} selected={data.staffTypes} onToggle={(id) => toggleArrayItem("staffTypes", id)} className="mb-4" />
      
      <InputField label="Number of Staff" value={data.headCount} onChangeText={(v) => updateData("headCount", v)} placeholder="e.g., 10" icon="person" keyboardType="numeric" />
    </Card>
  );

  const renderEquipment = () => (
    <Card>
      <SectionHeader step={7} title="🍳 Equipment" subtitle="What equipment do you provide?" icon="kitchen" />
      
      <Text className="text-sm font-semibold text-gray-800 mb-3">Equipment Provided</Text>
      <ChipGroup options={EQUIPMENT} selected={data.equipmentProvided} onToggle={(id) => toggleArrayItem("equipmentProvided", id)} className="mb-4" />
      
      <ToggleRow label="Setup Required at Venue" value={data.setupRequired} onValueChange={(v) => updateData("setupRequired", v)} description="Need setup time at venue" icon="construction" />
    </Card>
  );

  const renderAvailability = () => (
    <Card>
      <SectionHeader step={8} title="📅 Availability" subtitle="When are you available?" icon="schedule" />
      
      <Text className="text-sm font-semibold text-gray-800 mb-3">Available Days</Text>
      <ChipGroup options={[{ id: "Mon", label: "Mon" }, { id: "Tue", label: "Tue" }, { id: "Wed", label: "Wed" }, { id: "Thu", label: "Thu" }, { id: "Fri", label: "Fri" }, { id: "Sat", label: "Sat" }, { id: "Sun", label: "Sun" }]} selected={data.availableDays} onToggle={(id) => toggleArrayItem("availableDays", id)} className="mb-4" />
      
      <InputField label="Minimum Advance Booking (days)" value={data.minimumAdvance} onChangeText={(v) => updateData("minimumAdvance", v)} placeholder="e.g., 15" icon="event" keyboardType="numeric" />
    </Card>
  );

  const renderTerms = () => (
    <Card>
      <SectionHeader step={9} title="📋 Terms" subtitle="Booking policies" icon="policy" />
      
      <Text className="text-sm font-semibold text-gray-800 mb-3">Cancellation Policy</Text>
      {["flexible", "moderate", "strict", "non_refundable"].map((policy) => (
        <TouchableOpacity key={policy} onPress={() => updateData("cancellationPolicy", policy)} className={`flex-row items-center gap-3 p-3 rounded-xl border mb-2 ${data.cancellationPolicy === policy ? "border-pink-500 bg-pink-50" : "border-gray-200"}`}>
          <Text className={data.cancellationPolicy === policy ? "text-pink-600 font-medium" : "text-gray-600"}>{policy.charAt(0).toUpperCase() + policy.slice(1).replace("_", " ")}</Text>
        </TouchableOpacity>
      ))}
      
      <InputField label="Advance Payment (%)" value={data.advancePercent.toString()} onChangeText={(v) => updateData("advancePercent", parseInt(v) || 0)} placeholder="30" icon="percent" keyboardType="numeric" />
    </Card>
  );

  const renderVerification = () => (
    <Card>
      <SectionHeader step={10} title="🧾 Verification" subtitle="Verify your business" icon="verified" />
      
      <InputField label="FSSAI License Number" value={data.fssaiNumber} onChangeText={(v) => updateData("fssaiNumber", v)} placeholder="FSSAI License" icon="verified-user" />
      <InputField label="ID Proof Number" value={data.idNumber} onChangeText={(v) => updateData("idNumber", v)} placeholder="Aadhaar / PAN" icon="badge" />
      <InputField label="Bank Account" value={data.bankAccount} onChangeText={(v) => updateData("bankAccount", v)} placeholder="Account number" icon="account-balance" keyboardType="numeric" />
      <InputField label="IFSC Code" value={data.ifscCode} onChangeText={(v) => updateData("ifscCode", v)} placeholder="SBIN0001234" icon="code" />
    </Card>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <View className="items-center">
            <Text className="font-bold text-gray-900">Caterer Setup</Text>
            <Text className="text-xs text-gray-500">Step {step} of {totalSteps}</Text>
          </View>
          <View className="w-8" />
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
        <StepIndicator steps={steps as any} currentStep={step} />
        {renderStep()}
        <NavigationButtons isFirstStep={step === 1} isLastStep={step === totalSteps} onBack={() => setStep(step - 1)} onNext={() => setStep(step + 1)} onSave={saveData} isLoading={isLoading} />
      </ScrollView>
    </View>
  );
}
