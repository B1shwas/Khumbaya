/**
 * Vendor Setup Factory
 * Routes to the correct vendor setup based on vendor type
 * Uses DRY principle - central routing for all vendor types
 */

import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";

import PhotographerSetup from "./PhotographerSetup";
import CatererSetup from "./CatererSetup";
import VenueSetup from "./VenueSetup";

import { STORAGE_KEYS, VENDOR_TYPES } from "./VendorTypeConfig";

// ============================================================================
// Types
// ============================================================================

interface VendorSetupFactoryProps {
  vendorType?: string;
}

// Component map - only import components that exist
const VENDOR_SETUP_COMPONENTS: Record<string, React.ComponentType<any>> = {
  venue: VenueSetup,
  photographer: PhotographerSetup,
  caterer: CatererSetup,
  // decorator: DecoratorSetup, // Coming soon
  // makeup: MakeupSetup,      // Coming soon
  // dj: DJSetup,              // Coming soon
  // planner: PlannerSetup,    // Coming soon
  // transport: TransportSetup, // Coming soon
};

// ============================================================================
// Component
// ============================================================================

export default function VendorSetupFactory({ vendorType: propVendorType }: VendorSetupFactoryProps) {
  const params = useLocalSearchParams<{ vendorType?: string }>();
  const [vendorType, setVendorType] = useState<string | undefined>(propVendorType || params.vendorType);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.vendorType) {
      setVendorType(params.vendorType);
      setIsLoading(false);
      return;
    }
    loadVendorType();
  }, [params.vendorType]);

  const loadVendorType = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.BUSINESS_INFO);
      if (stored) {
        const data = JSON.parse(stored);
        setVendorType(data.vendorType);
      }
    } catch (error) {
      console.error("Error loading vendor type:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#ec4899" />
        <Text className="text-gray-500 mt-2">Loading...</Text>
      </View>
    );
  }

  if (!vendorType) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-6">
        <Text className="text-xl font-bold text-gray-900 mb-2">No Vendor Type Selected</Text>
        <Text className="text-gray-500 text-center">
          Please select a vendor type from your profile to set up your business.
        </Text>
      </View>
    );
  }

  const VendorComponent = VENDOR_SETUP_COMPONENTS[vendorType];

  if (!VendorComponent) {
    // Show coming soon for unavailable vendor types
    const vendorLabel = VENDOR_TYPES[vendorType as keyof typeof VENDOR_TYPES]?.label || vendorType;
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-6">
        <Text className="text-2xl mb-4">🚧</Text>
        <Text className="text-xl font-bold text-gray-900 mb-2">Coming Soon</Text>
        <Text className="text-gray-500 text-center mb-4">
          The setup for "{vendorLabel}" is being developed.
        </Text>
        <Text className="text-sm text-gray-400">
          Available: Venue, Photographer, Caterer
        </Text>
      </View>
    );
  }

  return <VendorComponent />;
}

// ============================================================================
// Exports
// ============================================================================

export const hasVendorSetup = (vendorType: string): boolean => {
  return vendorType in VENDOR_SETUP_COMPONENTS;
};

export const getAvailableVendorSetups = (): string[] => {
  return Object.keys(VENDOR_SETUP_COMPONENTS);
};

export const getVendorTypeLabel = (vendorType: string): string => {
  return VENDOR_TYPES[vendorType as keyof typeof VENDOR_TYPES]?.label || vendorType;
};
