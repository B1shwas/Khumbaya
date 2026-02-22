import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { VENDOR_TYPES, STORAGE_KEYS, VendorTypeId } from "../../vendorProfile/VendorTypeConfig";

export default function BusinessInformationScreen() {
  const [vendorType, setVendorType] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadVendorInfo();
  }, []);

  const loadVendorInfo = async () => {
    try {
      setIsLoading(true);
      const storedInfo = await AsyncStorage.getItem(STORAGE_KEYS.BUSINESS_INFO);
      if (storedInfo) {
        const data = JSON.parse(storedInfo);
        setVendorType(data.vendorType || "");
        setIsSetupComplete(data.setupComplete || false);
      }
    } catch (error) {
      console.error("Error loading vendor info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVendorTypeSelect = async (typeId: string) => {
    try {
      setIsSaving(true);
      
      // Clear any previous vendor-specific data if changing type
      const currentInfo = await AsyncStorage.getItem(STORAGE_KEYS.BUSINESS_INFO);
      const existingData = currentInfo ? JSON.parse(currentInfo) : {};
      
      // Only reset if changing to a different type
      const isTypeChanged = existingData.vendorType && existingData.vendorType !== typeId;
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.BUSINESS_INFO,
        JSON.stringify({
          ...existingData,
          vendorType: typeId,
          setupComplete: isTypeChanged ? false : (existingData.setupComplete || false),
          updatedAt: new Date().toISOString(),
        })
      );
      
      // Clear vendor-specific storage if type changed
      if (isTypeChanged) {
        const vendorKeys = [
          "venue_data",
          "photographer_data",
          "caterer_data",
          "decorator_data",
          "makeup_data",
          "dj_data",
          "planner_data",
          "transport_data",
        ];
        for (const key of vendorKeys) {
          await AsyncStorage.removeItem(key);
        }
      }
      
      setVendorType(typeId);
      setIsSetupComplete(isTypeChanged ? false : (existingData.setupComplete || false));
      
      Alert.alert(
        "Vendor Type Selected",
        `You selected ${VENDOR_TYPES[typeId as VendorTypeId]?.label}. Tap "Continue Setup" to complete your profile.`,
        [
          { 
            text: "Continue Setup", 
            onPress: () => router.push(`/profile/vendor-setup?vendorType=${typeId}`)
          },
          { text: "Later", style: "cancel" }
        ]
      );
    } catch (error) {
      console.error("Error saving vendor type:", error);
      Alert.alert("Error", "Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleContinueSetup = () => {
    if (vendorType) {
      router.push(`/profile/vendor-setup?vendorType=${vendorType}`);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#ec4899" />
        <Text className="text-gray-500 mt-2">Loading...</Text>
      </View>
    );
  }

  // If vendor type is selected - show status card (NOT auto-navigation)
  if (vendorType) {
    return (
      <View className="flex-1 bg-gray-50">
        <SafeAreaView className="flex-1">
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-4 bg-white border-b border-gray-100">
            <TouchableOpacity
              className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
              onPress={() => router.back()}
            >
              <MaterialIcons name="arrow-back-ios-new" size={20} color="#374151" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-gray-900">Business Profile</Text>
            <View className="w-10" />
          </View>

          <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
            {/* Vendor Status Card */}
            <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-14 h-14 rounded-full bg-pink-100 items-center justify-center">
                    <MaterialIcons 
                      name={VENDOR_TYPES[vendorType as VendorTypeId]?.icon as any || "storefront"} 
                      size={28} 
                      color="#ec4899" 
                    />
                  </View>
                  <View>
                    <Text className="text-xl font-bold text-gray-900">
                      {VENDOR_TYPES[vendorType as VendorTypeId]?.label}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      {VENDOR_TYPES[vendorType as VendorTypeId]?.description}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Status Badge */}
              <View className={`px-4 py-2 rounded-full ${isSetupComplete ? "bg-green-100" : "bg-yellow-100"} self-start mb-4`}>
                <View className="flex-row items-center gap-2">
                  <MaterialIcons 
                    name={isSetupComplete ? "check-circle" : "hourglass-empty"} 
                    size={16} 
                    color={isSetupComplete ? "#22c55e" : "#eab308"} 
                  />
                  <Text className={`font-semibold ${isSetupComplete ? "text-green-700" : "text-yellow-700"}`}>
                    {isSetupComplete ? "Profile Complete" : "Setup Incomplete"}
                  </Text>
                </View>
              </View>

              {/* Action Button */}
              <TouchableOpacity
                onPress={handleContinueSetup}
                disabled={isSaving}
                className="bg-pink-500 py-3 rounded-xl"
              >
                <Text className="text-white font-bold text-center">
                  {isSaving ? "Saving..." : isSetupComplete ? "Edit Profile" : "Continue Setup"}
                </Text>
              </TouchableOpacity>

              {/* Change Vendor Type */}
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Change Vendor Type",
                    "Are you sure you want to change your vendor type?",
                    [
                      { text: "Cancel", style: "cancel" },
                      { 
                        text: "Change", 
                        onPress: async () => {
                          setVendorType("");
                          setIsSetupComplete(false);
                          await AsyncStorage.removeItem(STORAGE_KEYS.BUSINESS_INFO);
                        }
                      },
                    ]
                  );
                }}
                className="mt-4"
              >
                <Text className="text-pink-500 text-center text-sm">Change Vendor Type</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  // No vendor type selected - show selection screen
  return (
    <View className="flex-1 bg-gray-50">
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4 bg-white border-b border-gray-100">
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back-ios-new" size={20} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-900">Select Vendor Type</Text>
          <View className="w-10" />
        </View>

        <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
          <Text className="text-gray-600 mb-6">
            Choose the type of vendor service you provide. This will determine your profile setup.
          </Text>

          {/* Vendor Type Grid */}
          <View className="grid grid-cols-2 gap-4">
            {Object.entries(VENDOR_TYPES).map(([typeId, typeConfig]) => (
              <TouchableOpacity
                key={typeId}
                onPress={() => handleVendorTypeSelect(typeId)}
                disabled={isSaving}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 active:scale-[0.98]"
              >
                <View 
                  className="w-12 h-12 rounded-full items-center justify-center mb-3"
                  style={{ backgroundColor: `${typeConfig.color}20` }}
                >
                  <MaterialIcons 
                    name={typeConfig.icon as any} 
                    size={24} 
                    color={typeConfig.color} 
                  />
                </View>
                <Text className="font-bold text-gray-900">{typeConfig.label}</Text>
                <Text className="text-xs text-gray-500 mt-1" numberOfLines={2}>{typeConfig.description}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Info Box */}
          <View className="mt-6 bg-blue-50 rounded-xl p-4">
            <View className="flex-row items-start gap-3">
              <MaterialIcons name="info" size={20} color="#3b82f6" />
              <View>
                <Text className="text-blue-800 font-medium text-sm">Select Your Vendor Type</Text>
                <Text className="text-blue-600 text-xs mt-1">
                  Tap on a vendor type to select it. You'll then be able to complete your profile setup.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
