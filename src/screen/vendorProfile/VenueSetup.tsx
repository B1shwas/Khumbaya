/**
 * Venue Vendor Setup
 * Complete setup wizard for venue owners - Airbnb style
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
  SelectOption,
} from "./shared/VendorFormComponents";
import { VENDOR_TYPES, STORAGE_KEYS, getVendorStorageKey } from "./VendorTypeConfig";

// ============================================================================
// Types
// ============================================================================

interface VenueData {
  // Step 1: Basic Identity
  venueName: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  
  // Step 2: Capacity & Space
  seatedCapacity: number;
  standingCapacity: number;
  numberOfHalls: number;
  indoorOutdoor: "indoor" | "outdoor" | "both";
  carpetArea: string;
  
  // Step 3: Amenities
  amenities: string[];
  parkingCapacity: number;
  roomsCount: number;
  
  // Step 4: Pricing
  pricingType: "per_day" | "per_hour" | "per_plate" | "package";
  basePrice: number;
  weekendPrice: number;
  peakSeasonPrice: number;
  securityDeposit: number;
  cleaningCharges: number;
  overtimePerHour: number;
  
  // Step 5: Availability
  openingTime: string;
  closingTime: string;
  minimumBookingHours: number;
  availableDays: string[];
  
  // Step 6: Services
  inHouseCatering: boolean;
  outsideCateringAllowed: boolean;
  decorationIncluded: boolean;
  outsideDecorAllowed: boolean;
  djIncluded: boolean;
  outsideDjAllowed: boolean;
  alcoholAllowed: boolean;
  soundRestrictions: string;
  
  // Step 7: Event Types
  allowedEventTypes: string[];
  
  // Step 8: Rules
  cancellationPolicy: string;
  advancePaymentPercent: number;
  noiseRestrictions: string;
  
  // Step 9: Booking Settings
  autoAcceptBookings: boolean;
  requireFullPayment: boolean;
  
  // Step 10: Verification
  businessRegistrationNumber: string;
  idProofNumber: string;
  bankAccountNumber: string;
  ifscCode: string;
  
  setupComplete: boolean;
  updatedAt: string;
}

const DEFAULT_DATA: VenueData = {
  venueName: "",
  ownerName: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  seatedCapacity: 0,
  standingCapacity: 0,
  numberOfHalls: 1,
  indoorOutdoor: "both",
  carpetArea: "",
  amenities: [],
  parkingCapacity: 0,
  roomsCount: 0,
  pricingType: "per_day",
  basePrice: 0,
  weekendPrice: 0,
  peakSeasonPrice: 0,
  securityDeposit: 0,
  cleaningCharges: 0,
  overtimePerHour: 0,
  openingTime: "08:00",
  closingTime: "23:00",
  minimumBookingHours: 6,
  availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  inHouseCatering: false,
  outsideCateringAllowed: true,
  decorationIncluded: false,
  outsideDecorAllowed: true,
  djIncluded: false,
  outsideDjAllowed: true,
  alcoholAllowed: true,
  soundRestrictions: "No loud music after 10 PM",
  allowedEventTypes: ["wedding", "engagement"],
  cancellationPolicy: "moderate",
  advancePaymentPercent: 50,
  noiseRestrictions: "No loud music after 10 PM",
  autoAcceptBookings: false,
  requireFullPayment: false,
  businessRegistrationNumber: "",
  idProofNumber: "",
  bankAccountNumber: "",
  ifscCode: "",
  setupComplete: false,
  updatedAt: "",
};

// ============================================================================
// Options
// ============================================================================

const VENUE_AMENITIES = [
  { id: "parking", label: "Parking" },
  { id: "valet", label: "Valet Parking" },
  { id: "ac", label: "Air Conditioning" },
  { id: "heater", label: "Heating" },
  { id: "rooms", label: "Guest Rooms" },
  { id: "suites", label: "Bridal Suite" },
  { id: "stage", label: "Stage" },
  { id: "dance_floor", label: "Dance Floor" },
  { id: "dj", label: "DJ / Sound" },
  { id: "projector", label: "Projector" },
  { id: "wifi", label: "WiFi" },
  { id: "catering_kitchen", label: "Catering Kitchen" },
  { id: "bar", label: "Bar" },
  { id: "power_backup", label: "Power Backup" },
  { id: "garden", label: "Garden / Lawn" },
  { id: "pool", label: "Pool Area" },
];

const EVENT_TYPES = [
  { id: "wedding", label: "Wedding" },
  { id: "engagement", label: "Engagement" },
  { id: "birthday", label: "Birthday" },
  { id: "corporate", label: "Corporate" },
  { id: "religious", label: "Religious" },
  { id: "party", label: "Party" },
];

// ============================================================================
// Component
// ============================================================================

export default function VenueSetup() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<VenueData>(DEFAULT_DATA);
  const router = useRouter();

  const vendorConfig = VENDOR_TYPES.venue;
  const totalSteps = vendorConfig.steps.length;
  const steps = [...vendorConfig.steps];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const storageKey = getVendorStorageKey("venue");
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

  const updateData = (field: keyof VenueData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (arrayField: keyof VenueData, item: string) => {
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
      const storageKey = getVendorStorageKey("venue");
      const updatedData = { ...data, setupComplete: true, updatedAt: new Date().toISOString() };
      await AsyncStorage.setItem(storageKey, JSON.stringify(updatedData));
      await AsyncStorage.setItem(STORAGE_KEYS.VENDOR_SETUP_COMPLETE, "true");
      
      Alert.alert("Success!", "Your venue profile has been set up successfully!", [
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
      case 1: return renderBasicIdentity();
      case 2: return renderCapacity();
      case 3: return renderAmenities();
      case 4: return renderPricing();
      case 5: return renderAvailability();
      case 6: return renderServices();
      case 7: return renderEventTypes();
      case 8: return renderRules();
      case 9: return renderBookingSettings();
      case 10: return renderVerification();
      default: return null;
    }
  };

  const renderBasicIdentity = () => (
    <Card>
      <SectionHeader step={1} title="🏢 Basic Identity" subtitle="Your venue details" icon="castle" />
      <InputField label="Venue Name" value={data.venueName} onChangeText={(v) => updateData("venueName", v)} placeholder="e.g., Grand Ballroom Resort" icon="storefront" required />
      <InputField label="Owner Name" value={data.ownerName} onChangeText={(v) => updateData("ownerName", v)} placeholder="Your name" icon="person" required />
      <View className="flex-row gap-3">
        <View className="flex-1"><InputField label="Phone" value={data.phone} onChangeText={(v) => updateData("phone", v)} placeholder="10-digit" icon="phone" keyboardType="phone-pad" /></View>
        <View className="flex-1"><InputField label="Email" value={data.email} onChangeText={(v) => updateData("email", v)} placeholder="email@com" icon="email" keyboardType="email-address" /></View>
      </View>
      <InputField label="Full Address" value={data.address} onChangeText={(v) => updateData("address", v)} placeholder="Street address" icon="location-on" required />
      <View className="flex-row gap-3">
        <View className="flex-1"><InputField label="City" value={data.city} onChangeText={(v) => updateData("city", v)} placeholder="City" icon="location-city" /></View>
        <View className="flex-1"><InputField label="State" value={data.state} onChangeText={(v) => updateData("state", v)} placeholder="State" icon="map" /></View>
      </View>
      <InputField label="Pincode" value={data.pincode} onChangeText={(v) => updateData("pincode", v)} placeholder="6-digit" icon="markunread-mailbox" keyboardType="numeric" />
    </Card>
  );

  const renderCapacity = () => (
    <Card>
      <SectionHeader step={2} title="👥 Capacity & Space" subtitle="How many guests can you host?" icon="people" />
      <View className="flex-row gap-3">
        <View className="flex-1"><InputField label="Seated Capacity" value={data.seatedCapacity ? data.seatedCapacity.toString() : ""} onChangeText={(v) => updateData("seatedCapacity", parseInt(v) || 0)} placeholder="e.g., 500" icon="event-seat" keyboardType="numeric" /></View>
        <View className="flex-1"><InputField label="Standing Capacity" value={data.standingCapacity ? data.standingCapacity.toString() : ""} onChangeText={(v) => updateData("standingCapacity", parseInt(v) || 0)} placeholder="e.g., 750" icon="groups" keyboardType="numeric" /></View>
      </View>
      <InputField label="Number of Halls" value={data.numberOfHalls ? data.numberOfHalls.toString() : ""} onChangeText={(v) => updateData("numberOfHalls", parseInt(v) || 1)} placeholder="e.g., 2" icon="meeting-room" keyboardType="numeric" />
      <InputField label="Carpet Area (sq ft)" value={data.carpetArea} onChangeText={(v) => updateData("carpetArea", v)} placeholder="e.g., 5000 sq ft" icon="square-foot" />
      <Text className="text-sm font-semibold text-gray-800 mb-3 mt-2">Space Type</Text>
      <View className="flex-row gap-3">
        {(["indoor", "outdoor", "both"] as const).map((type) => (
          <TouchableOpacity key={type} onPress={() => updateData("indoorOutdoor", type)} className={`flex-1 p-3 rounded-xl border ${data.indoorOutdoor === type ? "border-pink-500 bg-pink-50" : "border-gray-200"}`}>
            <Text className={`text-center font-medium ${data.indoorOutdoor === type ? "text-pink-600" : "text-gray-600"}`}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Card>
  );

  const renderAmenities = () => (
    <Card>
      <SectionHeader step={3} title="✨ Amenities" subtitle="What facilities do you offer?" icon="star" />
      <ChipGroup options={VENUE_AMENITIES} selected={data.amenities} onToggle={(id) => toggleArrayItem("amenities", id)} className="mb-4" />
      <View className="flex-row gap-3">
        <View className="flex-1"><InputField label="Parking Capacity" value={data.parkingCapacity ? data.parkingCapacity.toString() : ""} onChangeText={(v) => updateData("parkingCapacity", parseInt(v) || 0)} placeholder="e.g., 100" icon="local-parking" keyboardType="numeric" /></View>
        <View className="flex-1"><InputField label="Guest Rooms" value={data.roomsCount ? data.roomsCount.toString() : ""} onChangeText={(v) => updateData("roomsCount", parseInt(v) || 0)} placeholder="e.g., 10" icon="hotel" keyboardType="numeric" /></View>
      </View>
    </Card>
  );

  const renderPricing = () => (
    <Card>
      <SectionHeader step={4} title="💰 Pricing" subtitle="How do you charge?" icon="attach-money" />
      <Text className="text-sm font-semibold text-gray-800 mb-3">Pricing Type</Text>
      <View className="flex-row flex-wrap gap-2 mb-4">
        {[{ id: "per_day", label: "Per Day" }, { id: "per_hour", label: "Per Hour" }, { id: "per_plate", label: "Per Plate" }, { id: "package", label: "Package" }].map((type) => (
          <TouchableOpacity key={type.id} onPress={() => updateData("pricingType", type.id)} className={`px-4 py-2 rounded-full border ${data.pricingType === type.id ? "border-pink-500 bg-pink-50" : "border-gray-200"}`}>
            <Text className={data.pricingType === type.id ? "text-pink-600 font-medium" : "text-gray-600"}>{type.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <InputField label="Base Price (₹)" value={data.basePrice ? data.basePrice.toString() : ""} onChangeText={(v) => updateData("basePrice", parseInt(v) || 0)} placeholder="e.g., 50000" icon="attach-money" keyboardType="numeric" />
      <InputField label="Weekend Price (₹)" value={data.weekendPrice ? data.weekendPrice.toString() : ""} onChangeText={(v) => updateData("weekendPrice", parseInt(v) || 0)} placeholder="e.g., 75000" icon="event" keyboardType="numeric" />
      <InputField label="Security Deposit (₹)" value={data.securityDeposit ? data.securityDeposit.toString() : ""} onChangeText={(v) => updateData("securityDeposit", parseInt(v) || 0)} placeholder="e.g., 10000" icon="security" keyboardType="numeric" />
    </Card>
  );

  const renderAvailability = () => (
    <Card>
      <SectionHeader step={5} title="📅 Availability" subtitle="When can guests book?" icon="schedule" />
      <View className="flex-row gap-3 mb-4">
        <View className="flex-1">
          <InputField label="Opening Time" value={data.openingTime} onChangeText={(v) => updateData("openingTime", v)} placeholder="08:00" icon="schedule" />
        </View>
        <View className="flex-1">
          <InputField label="Closing Time" value={data.closingTime} onChangeText={(v) => updateData("closingTime", v)} placeholder="23:00" icon="schedule" />
        </View>
      </View>
      <InputField label="Minimum Booking (hours)" value={data.minimumBookingHours ? data.minimumBookingHours.toString() : ""} onChangeText={(v) => updateData("minimumBookingHours", parseInt(v) || 0)} placeholder="e.g., 6" icon="hourglass-empty" keyboardType="numeric" />
      <Text className="text-sm font-semibold text-gray-800 mb-3 mt-2">Available Days</Text>
      <ChipGroup options={[{ id: "Mon", label: "Mon" }, { id: "Tue", label: "Tue" }, { id: "Wed", label: "Wed" }, { id: "Thu", label: "Thu" }, { id: "Fri", label: "Fri" }, { id: "Sat", label: "Sat" }, { id: "Sun", label: "Sun" }]} selected={data.availableDays} onToggle={(id) => toggleArrayItem("availableDays", id)} />
    </Card>
  );

  const renderServices = () => (
    <Card>
      <SectionHeader step={6} title="🍽️ Services" subtitle="What's included and allowed?" icon="room-service" />
      <ToggleRow label="In-house Catering" value={data.inHouseCatering} onValueChange={(v) => updateData("inHouseCatering", v)} description="You provide catering" icon="restaurant" />
      <ToggleRow label="Outside Catering Allowed" value={data.outsideCateringAllowed} onValueChange={(v) => updateData("outsideCateringAllowed", v)} description="Guests can bring caterers" icon="restaurant-menu" />
      <ToggleRow label="Decoration Included" value={data.decorationIncluded} onValueChange={(v) => updateData("decorationIncluded", v)} icon="auto-awesome" />
      <ToggleRow label="Outside Decor Allowed" value={data.outsideDecorAllowed} onValueChange={(v) => updateData("outsideDecorAllowed", v)} description="Guests can hire decorators" icon="brush" />
      <ToggleRow label="DJ Included" value={data.djIncluded} onValueChange={(v) => updateData("djIncluded", v)} icon="music-note" />
      <ToggleRow label="Alcohol Allowed" value={data.alcoholAllowed} onValueChange={(v) => updateData("alcoholAllowed", v)} icon="local-bar" />
    </Card>
  );

  const renderEventTypes = () => (
    <Card>
      <SectionHeader step={7} title="💒 Event Types" subtitle="What events do you host?" icon="celebration" />
      <ChipGroup options={EVENT_TYPES} selected={data.allowedEventTypes} onToggle={(id) => toggleArrayItem("allowedEventTypes", id)} />
    </Card>
  );

  const renderRules = () => (
    <Card>
      <SectionHeader step={8} title="📋 Rules & Policies" subtitle="Cancellation and terms" icon="policy" />
      <Text className="text-sm font-semibold text-gray-800 mb-3">Cancellation Policy</Text>
      {["flexible", "moderate", "strict", "non_refundable"].map((policy) => (
        <SelectOption key={policy} label={policy.charAt(0).toUpperCase() + policy.slice(1).replace("_", " ")} selected={data.cancellationPolicy === policy} onPress={() => updateData("cancellationPolicy", policy)} icon="policy" />
      ))}
      <InputField label="Advance Payment (%)" value={data.advancePaymentPercent ? data.advancePaymentPercent.toString() : ""} onChangeText={(v) => updateData("advancePaymentPercent", parseInt(v) || 0)} placeholder="e.g., 50" icon="percent" keyboardType="numeric" />
      <InputField label="Sound Restrictions" value={data.soundRestrictions} onChangeText={(v) => updateData("soundRestrictions", v)} placeholder="e.g., No loud music after 10 PM" icon="volume-off" />
    </Card>
  );

  const renderBookingSettings = () => (
    <Card>
      <SectionHeader step={9} title="⚙️ Booking Settings" subtitle="How do you accept bookings?" icon="event-available" />
      <ToggleRow label="Auto-accept Bookings" value={data.autoAcceptBookings} onValueChange={(v) => updateData("autoAcceptBookings", v)} description="Automatically accept requests" icon="check-circle" />
      <ToggleRow label="Require Full Payment" value={data.requireFullPayment} onValueChange={(v) => updateData("requireFullPayment", v)} description="100% payment before event" icon="payment" />
    </Card>
  );

  const renderVerification = () => (
    <Card>
      <SectionHeader step={10} title="🧾 Verification" subtitle="Verify your business" icon="verified" />
      <InputField label="Business Registration" value={data.businessRegistrationNumber} onChangeText={(v) => updateData("businessRegistrationNumber", v)} placeholder="GST / Registration" icon="business" />
      <InputField label="ID Proof" value={data.idProofNumber} onChangeText={(v) => updateData("idProofNumber", v)} placeholder="Aadhaar / Passport" icon="badge" />
      <InputField label="Bank Account" value={data.bankAccountNumber} onChangeText={(v) => updateData("bankAccountNumber", v)} placeholder="Account number" icon="account-balance" keyboardType="numeric" />
      <InputField label="IFSC Code" value={data.ifscCode} onChangeText={(v) => updateData("ifscCode", v)} placeholder="e.g., SBIN0001234" icon="code" />
      <View className="bg-green-50 rounded-xl p-4 mt-4">
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="verified" size={20} color="#22c55e" />
          <Text className="text-green-800 font-medium">Verification Status</Text>
        </View>
        <Text className="text-green-600 text-sm mt-1">Documents verified within 2-3 business days.</Text>
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
            <Text className="font-bold text-gray-900">Venue Setup</Text>
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
