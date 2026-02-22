/**
 * Photographer Vendor Setup
 * Complete setup wizard for photographers
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
  SelectField,
  ToggleRow,
  SelectOption,
  ChipGroup,
  StepIndicator,
  NavigationButtons,
  EXPERIENCE_OPTIONS,
} from "./shared/VendorFormComponents";
import { VENDOR_TYPES, STORAGE_KEYS, getVendorStorageKey } from "./VendorTypeConfig";

// ============================================================================
// Types
// ============================================================================

interface PhotographerData {
  // Step 1: Basic Info
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  pincode: string;
  
  // Step 2: Equipment
  cameraBrands: string[];
  cameraBodies: number;
  lenses: number;
  lightingEquipments: string[];
  drone: boolean;
  secondShooter: boolean;
  
  // Step 3: Style
  shootingStyles: string[];
  specializations: string[];
  
  // Step 4: Packages
  packages: Array<{
    id: string;
    name: string;
    price: string;
    hours: string;
    deliverables: string[];
    description: string;
  }>;
  
  // Step 5: Portfolio
  portfolio: string[];
  coverPhoto: string;
  
  // Step 6: Team
  teamSize: number;
  teamDescription: string;
  
  // Step 7: Availability
  availableDays: string[];
  minimumAdvance: string;
  travelWilling: boolean;
  travelStates: string[];
  
  // Step 8: Terms
  cancellationPolicy: string;
  rushBooking: boolean;
  overtimeCharges: string;
  
  // Step 9: Booking
  autoAccept: boolean;
  requireAdvance: boolean;
  advancePercent: number;
  
  // Step 10: Verification
  idNumber: string;
  gstNumber: string;
  bankAccount: string;
  ifscCode: string;
  
  setupComplete: boolean;
  updatedAt: string;
}

const DEFAULT_DATA: PhotographerData = {
  businessName: "",
  ownerName: "",
  phone: "",
  email: "",
  city: "",
  state: "",
  pincode: "",
  cameraBrands: [],
  cameraBodies: 1,
  lenses: 1,
  lightingEquipments: [],
  drone: false,
  secondShooter: false,
  shootingStyles: [],
  specializations: [],
  packages: [
    { id: "1", name: "Basic", price: "", hours: "8", deliverables: [], description: "" },
    { id: "2", name: "Standard", price: "", hours: "12", deliverables: [], description: "" },
    { id: "3", name: "Premium", price: "", hours: "24", deliverables: [], description: "" },
  ],
  portfolio: [],
  coverPhoto: "",
  teamSize: 1,
  teamDescription: "",
  availableDays: ["Sat", "Sun"],
  minimumAdvance: "15",
  travelWilling: false,
  travelStates: [],
  cancellationPolicy: "moderate",
  rushBooking: false,
  overtimeCharges: "",
  autoAccept: false,
  requireAdvance: true,
  advancePercent: 25,
  idNumber: "",
  gstNumber: "",
  bankAccount: "",
  ifscCode: "",
  setupComplete: false,
  updatedAt: "",
};

// ============================================================================
// Options
// ============================================================================

const CAMERA_BRANDS = [
  { id: "canon", label: "Canon" },
  { id: "nikon", label: "Nikon" },
  { id: "sony", label: "Sony" },
  { id: "fuji", label: "Fujifilm" },
  { id: "leica", label: "Leica" },
  { id: "other", label: "Other" },
];

const SHOOTING_STYLES = [
  { id: "candid", label: "Candid" },
  { id: "traditional", label: "Traditional" },
  { id: "fine_art", label: "Fine Art" },
  { id: "photojournalistic", label: "Photojournalistic" },
  { id: "portrait", label: "Portrait" },
  { id: "fashion", label: "Fashion" },
  { id: "cinematic", label: "Cinematic" },
];

const SPECIALIZATIONS = [
  { id: "wedding", label: "Wedding" },
  { id: "pre_wedding", label: "Pre-Wedding" },
  { id: "engagement", label: "Engagement" },
  { id: "maternity", label: "Maternity" },
  { id: "newborn", label: "Newborn" },
  { id: "portrait", label: "Portrait" },
  { id: "corporate", label: "Corporate" },
  { id: "product", label: "Product" },
];

const DELIVERABLES = [
  { id: "edited_photos", label: "Edited Photos" },
  { id: "raw_photos", label: "Raw Photos" },
  { id: "album", label: "Photo Album" },
  { id: "prints", label: "Prints" },
  { id: "video", label: "Highlight Video" },
  { id: "drone", label: "Drone Shots" },
  { id: "photobook", label: "Photo Book" },
  { id: "cdn", label: "Online Gallery" },
];

const LIGHTING_EQUIPMENTS = [
  { id: "strobies", label: "Strobes" },
  { id: "speedlights", label: "Speedlights" },
  { id: "continuous", label: "Continuous Lights" },
  { id: "reflectors", label: "Reflectors" },
  { id: "softboxes", label: "Softboxes" },
  { id: "umbrellas", label: "Umbrellas" },
];

// ============================================================================
// Component
// ============================================================================

export default function PhotographerSetup() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<PhotographerData>(DEFAULT_DATA);
  const router = useRouter();

  const vendorConfig = VENDOR_TYPES.photographer;
  const totalSteps = vendorConfig.steps.length;
  const steps = [...vendorConfig.steps]; // Create mutable copy

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const storageKey = getVendorStorageKey("photographer");
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

  const updateData = (field: keyof PhotographerData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (arrayField: keyof PhotographerData, item: string) => {
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
      const storageKey = getVendorStorageKey("photographer");
      const updatedData = { ...data, setupComplete: true, updatedAt: new Date().toISOString() };
      await AsyncStorage.setItem(storageKey, JSON.stringify(updatedData));
      await AsyncStorage.setItem(STORAGE_KEYS.VENDOR_SETUP_COMPLETE, "true");
      
      Alert.alert("Success!", "Your photographer profile has been set up successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error saving data:", error);
      Alert.alert("Error", "Failed to save. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step rendering
  const renderStep = () => {
    switch (step) {
      case 1:
        return renderBasicInfo();
      case 2:
        return renderEquipment();
      case 3:
        return renderStyle();
      case 4:
        return renderPackages();
      case 5:
        return renderPortfolio();
      case 6:
        return renderTeam();
      case 7:
        return renderAvailability();
      case 8:
        return renderTerms();
      case 9:
        return renderBooking();
      case 10:
        return renderVerification();
      default:
        return null;
    }
  };

  const renderBasicInfo = () => (
    <Card>
      <SectionHeader step={1} title="📸 Basic Information" subtitle="Your business details" icon="business" />
      
      <InputField
        label="Business Name"
        value={data.businessName}
        onChangeText={(v) => updateData("businessName", v)}
        placeholder="e.g., Dreamy Moments Photography"
        icon="storefront"
        required
      />
      
      <InputField
        label="Owner Name"
        value={data.ownerName}
        onChangeText={(v) => updateData("ownerName", v)}
        placeholder="Your full name"
        icon="person"
        required
      />
      
      <View className="flex-row gap-3">
        <View className="flex-1">
          <InputField
            label="Phone"
            value={data.phone}
            onChangeText={(v) => updateData("phone", v)}
            placeholder="10-digit number"
            icon="phone"
            keyboardType="phone-pad"
          />
        </View>
        <View className="flex-1">
          <InputField
            label="Email"
            value={data.email}
            onChangeText={(v) => updateData("email", v)}
            placeholder="your@email.com"
            icon="email"
            keyboardType="email-address"
          />
        </View>
      </View>
      
      <View className="flex-row gap-3">
        <View className="flex-1">
          <InputField
            label="City"
            value={data.city}
            onChangeText={(v) => updateData("city", v)}
            placeholder="City"
            icon="location-city"
          />
        </View>
        <View className="flex-1">
          <InputField
            label="State"
            value={data.state}
            onChangeText={(v) => updateData("state", v)}
            placeholder="State"
            icon="map"
          />
        </View>
      </View>
      
      <InputField
        label="Pincode"
        value={data.pincode}
        onChangeText={(v) => updateData("pincode", v)}
        placeholder="6-digit pincode"
        icon="markunread-mailbox"
        keyboardType="numeric"
      />
    </Card>
  );

  const renderEquipment = () => (
    <Card>
      <SectionHeader step={2} title="📷 Equipment" subtitle="What gear do you use?" icon="camera" />
      
      <Text className="text-sm font-semibold text-gray-800 mb-3">Camera Brands</Text>
      <ChipGroup
        options={CAMERA_BRANDS}
        selected={data.cameraBrands}
        onToggle={(id) => toggleArrayItem("cameraBrands", id)}
        className="mb-4"
      />
      
      <View className="flex-row gap-3">
        <View className="flex-1">
          <InputField
            label="Camera Bodies"
            value={data.cameraBodies.toString()}
            onChangeText={(v) => updateData("cameraBodies", parseInt(v) || 1)}
            placeholder="1"
            icon="camera"
            keyboardType="numeric"
          />
        </View>
        <View className="flex-1">
          <InputField
            label="Lenses"
            value={data.lenses.toString()}
            onChangeText={(v) => updateData("lenses", parseInt(v) || 1)}
            placeholder="1"
            icon="camera-roll"
            keyboardType="numeric"
          />
        </View>
      </View>
      
      <Text className="text-sm font-semibold text-gray-800 mb-3 mt-2">Lighting Equipment</Text>
      <ChipGroup
        options={LIGHTING_EQUIPMENTS}
        selected={data.lightingEquipments}
        onToggle={(id) => toggleArrayItem("lightingEquipments", id)}
        className="mb-4"
      />
      
      <ToggleRow
        label="Drone / Aerial Photography"
        value={data.drone}
        onValueChange={(v) => updateData("drone", v)}
        description="Can capture aerial shots"
        icon="flight"
      />
      
      <ToggleRow
        label="Second Shooter Available"
        value={data.secondShooter}
        onValueChange={(v) => updateData("secondShooter", v)}
        description="Can provide additional photographer"
        icon="groups"
      />
    </Card>
  );

  const renderStyle = () => (
    <Card>
      <SectionHeader step={3} title="🎨 Style & Specialization" subtitle="Your photography style" icon="brush" />
      
      <Text className="text-sm font-semibold text-gray-800 mb-3">Shooting Styles</Text>
      <ChipGroup
        options={SHOOTING_STYLES}
        selected={data.shootingStyles}
        onToggle={(id) => toggleArrayItem("shootingStyles", id)}
        className="mb-4"
      />
      
      <Text className="text-sm font-semibold text-gray-800 mb-3">Specializations</Text>
      <ChipGroup
        options={SPECIALIZATIONS}
        selected={data.specializations}
        onToggle={(id) => toggleArrayItem("specializations", id)}
      />
    </Card>
  );

  const renderPackages = () => (
    <Card>
      <SectionHeader step={4} title="💼 Packages" subtitle="Your service packages" icon="sell" />
      
      {data.packages.map((pkg, index) => (
        <View key={pkg.id} className="mb-4 p-4 bg-gray-50 rounded-xl">
          <Text className="font-bold text-gray-900 mb-3">{pkg.name} Package</Text>
          
          <View className="flex-row gap-3">
            <View className="flex-1">
              <InputField
                label="Price (₹)"
                value={pkg.price}
                onChangeText={(v) => {
                  const newPackages = [...data.packages];
                  newPackages[index].price = v;
                  updateData("packages", newPackages);
                }}
                placeholder="25000"
                icon="attach-money"
              />
            </View>
            <View className="flex-1">
              <InputField
                label="Hours"
                value={pkg.hours}
                onChangeText={(v) => {
                  const newPackages = [...data.packages];
                  newPackages[index].hours = v;
                  updateData("packages", newPackages);
                }}
                placeholder="8"
                icon="schedule"
                keyboardType="numeric"
              />
            </View>
          </View>
          
          <InputField
            label="Description"
            value={pkg.description}
            onChangeText={(v) => {
              const newPackages = [...data.packages];
              newPackages[index].description = v;
              updateData("packages", newPackages);
            }}
            placeholder="What's included..."
            icon="description"
            multiline
          />
        </View>
      ))}
    </Card>
  );

  const renderPortfolio = () => (
    <Card>
      <SectionHeader step={5} title="🖼️ Portfolio" subtitle="Showcase your best work" icon="photo-library" />
      
      <View className="bg-gray-50 rounded-xl p-8 items-center justify-center">
        <MaterialIcons name="add-photo-alternate" size={48} color="#9ca3af" />
        <Text className="text-gray-500 mt-2">Add your best photographs</Text>
        <Text className="text-gray-400 text-sm">Minimum 5 photos recommended</Text>
      </View>
      
      <View className="mt-4">
        <InputField
          label="Cover Photo URL (optional)"
          value={data.coverPhoto}
          onChangeText={(v) => updateData("coverPhoto", v)}
          placeholder="https://..."
          icon="image"
        />
      </View>
    </Card>
  );

  const renderTeam = () => (
    <Card>
      <SectionHeader step={6} title="👥 Team" subtitle="About your photography team" icon="groups" />
      
      <InputField
        label="Team Size"
        value={data.teamSize.toString()}
        onChangeText={(v) => updateData("teamSize", parseInt(v) || 1)}
        placeholder="Number of team members"
        icon="people"
        keyboardType="numeric"
      />
      
      <InputField
        label="Team Description"
        value={data.teamDescription}
        onChangeText={(v) => updateData("teamDescription", v)}
        placeholder="Describe your team and their expertise..."
        icon="description"
        multiline
      />
    </Card>
  );

  const renderAvailability = () => (
    <Card>
      <SectionHeader step={7} title="📅 Availability" subtitle="When are you available?" icon="schedule" />
      
      <Text className="text-sm font-semibold text-gray-800 mb-3">Available Days</Text>
      <ChipGroup
        options={[
          { id: "Mon", label: "Mon" },
          { id: "Tue", label: "Tue" },
          { id: "Wed", label: "Wed" },
          { id: "Thu", label: "Thu" },
          { id: "Fri", label: "Fri" },
          { id: "Sat", label: "Sat" },
          { id: "Sun", label: "Sun" },
        ]}
        selected={data.availableDays}
        onToggle={(id) => toggleArrayItem("availableDays", id)}
        className="mb-4"
      />
      
      <InputField
        label="Minimum Advance Booking"
        value={data.minimumAdvance}
        onChangeText={(v) => updateData("minimumAdvance", v)}
        placeholder="e.g., 15 days"
        icon="event"
      />
      
      <ToggleRow
        label="Willing to Travel"
        value={data.travelWilling}
        onValueChange={(v) => updateData("travelWilling", v)}
        description="Available for destination weddings"
        icon="flight"
      />
    </Card>
  );

  const renderTerms = () => (
    <Card>
      <SectionHeader step={8} title="📋 Terms & Conditions" subtitle="Your booking policies" icon="policy" />
      
      <Text className="text-sm font-semibold text-gray-800 mb-3">Cancellation Policy</Text>
      {["flexible", "moderate", "strict", "non_refundable"].map((policy) => (
        <SelectOption
          key={policy}
          label={policy.charAt(0).toUpperCase() + policy.slice(1).replace("_", " ")}
          selected={data.cancellationPolicy === policy}
          onPress={() => updateData("cancellationPolicy", policy)}
          icon="policy"
        />
      ))}
      
      <View className="mt-4">
        <ToggleRow
          label="Rush Booking Available"
          value={data.rushBooking}
          onValueChange={(v) => updateData("rushBooking", v)}
          description="Can accept last-minute bookings"
          icon="flash-on"
        />
      </View>
      
      <InputField
        label="Overtime Charges (per hour)"
        value={data.overtimeCharges}
        onChangeText={(v) => updateData("overtimeCharges", v)}
        placeholder="e.g., 3000"
        icon="timer"
        keyboardType="numeric"
      />
    </Card>
  );

  const renderBooking = () => (
    <Card>
      <SectionHeader step={9} title="⚙️ Booking Settings" subtitle="How you accept bookings" icon="event-available" />
      
      <ToggleRow
        label="Auto-accept Bookings"
        value={data.autoAccept}
        onValueChange={(v) => updateData("autoAccept", v)}
        description="Automatically accept booking requests"
        icon="check-circle"
      />
      
      <ToggleRow
        label="Require Advance Payment"
        value={data.requireAdvance}
        onValueChange={(v) => updateData("requireAdvance", v)}
        description="Require payment before service"
        icon="payment"
      />
      
      {data.requireAdvance && (
        <InputField
          label="Advance Payment (%)"
          value={data.advancePercent.toString()}
          onChangeText={(v) => updateData("advancePercent", parseInt(v) || 0)}
          placeholder="25"
          icon="percent"
          keyboardType="numeric"
        />
      )}
    </Card>
  );

  const renderVerification = () => (
    <Card>
      <SectionHeader step={10} title="🧾 Verification" subtitle="Verify your business" icon="verified" />
      
      <InputField
        label="ID Proof Number"
        value={data.idNumber}
        onChangeText={(v) => updateData("idNumber", v)}
        placeholder="Aadhaar / PAN / Passport"
        icon="badge"
      />
      
      <InputField
        label="GST Number (optional)"
        value={data.gstNumber}
        onChangeText={(v) => updateData("gstNumber", v)}
        placeholder="GSTIN"
        icon="business"
      />
      
      <InputField
        label="Bank Account Number"
        value={data.bankAccount}
        onChangeText={(v) => updateData("bankAccount", v)}
        placeholder="For receiving payments"
        icon="account-balance"
        keyboardType="numeric"
      />
      
      <InputField
        label="IFSC Code"
        value={data.ifscCode}
        onChangeText={(v) => updateData("ifscCode", v)}
        placeholder="e.g., SBIN0001234"
        icon="code"
      />
      
      <View className="bg-green-50 rounded-xl p-4 mt-4">
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="verified" size={20} color="#22c55e" />
          <Text className="text-green-800 font-medium">Verification Status</Text>
        </View>
        <Text className="text-green-600 text-sm mt-1">
          Documents will be verified within 2-3 business days.
        </Text>
      </View>
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
            <Text className="font-bold text-gray-900">Photographer Setup</Text>
            <Text className="text-xs text-gray-500">Step {step} of {totalSteps}</Text>
          </View>
          <View className="w-8" />
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
        <StepIndicator steps={steps as any} currentStep={step} />
        {renderStep()}
        <NavigationButtons
          isFirstStep={step === 1}
          isLastStep={step === totalSteps}
          onBack={() => setStep(step - 1)}
          onNext={() => setStep(step + 1)}
          onSave={saveData}
          isLoading={isLoading}
        />
      </ScrollView>
    </View>
  );
}
