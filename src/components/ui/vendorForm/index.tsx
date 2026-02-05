import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BusinessDetail from "./BuisnessDetail";
import CategorySelection from "./CategorySelection";
import MakeOfficial from "./MakeOfficial";
import TellUs from "./TellUs";
import VendorContacts from "./VendorContacts";
type BusinessType = "company" | "individual" | null;

export default function VendorFormFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Contacts
    fullName: "",
    email: "",
    countryCode: "US +1",
    phone: "",
    password: "",
    
    // Step 2: Business Type
    businessType: null as BusinessType,
    
    // Step 3: Categories
    selectedCategories: [] as string[],
    
    // Step 4: Business Details
    businessName: "",
    websiteOrLink: "",
    serviceableCities: [] as string[],
    bio: "",
    
    // Step 5: Documents (placeholder)
  });

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(20)).current;

  const progress = (currentStep / 5) * 100;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const handleNext = useCallback(() => {
    setCurrentStep((prev) => {
      const nextStep = prev + 1;
      if (nextStep < 5) {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }).start(() => {
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();
        });
      }
      return nextStep;
    });
  }, [fadeAnim]);

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev > 1) {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }).start(() => {
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();
        });
        return prev - 1;
      }
      return prev;
    });
  }, [fadeAnim]);

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  // Map of step IDs to components
  const steps: Record<number, React.ReactNode> = {
    1: (
      <VendorContacts
        onBack={handleBack}
        onNext={handleNext} 
      />
    ),
    2: (
      <TellUs
        selectedType={formData.businessType}
        onChange={(type) => updateFormData({ businessType: type })}
        onBack={handleBack}
        onNext={handleNext}
      />
    ),
    3: (
      <CategorySelection
        selectedCategories={formData.selectedCategories}
        onChange={(categories) => updateFormData({ selectedCategories: categories })}
        onBack={handleBack}
        onNext={handleNext}
      />
    ),
    4: (
      <BusinessDetail
        data={{
          businessName: formData.businessName,
          websiteOrLink: formData.websiteOrLink,
          serviceableCities: formData.serviceableCities,
          bio: formData.bio,
        }}
        onChange={(updates) => updateFormData(updates)}
        onBack={handleBack}
        onNext={handleNext}
      />
    ),
    5: (
      <MakeOfficial  
        onBack={handleBack}
        onNext={handleNext}
      />
    ),
  };

  return (  
     <View className="flex-1 bg-background-light dark:bg-background-dark">
      <SafeAreaView className="flex-1">
        {steps[currentStep]}
      </SafeAreaView>
    </View>
  );
}