import { Text } from "@/src/components/ui/Text";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, TouchableOpacity, View } from "react-native";
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
    1: (<>
    <Header handleBack={handleBack} progress={progress} />
      <VendorContacts
        onBack={handleBack}
        onNext={handleNext} 
      />
    </>
    
    ),
    2: (
      <>
      <Header handleBack={handleBack} progress={progress} />
      <TellUs
        selectedType={formData.businessType}
        onChange={(type) => updateFormData({ businessType: type })}
        onBack={handleBack}
        onNext={handleNext}
      />
      </>
  
    ),
    3: (<>
    <Header handleBack={handleBack} progress={progress} />
    <CategorySelection
        selectedCategories={formData.selectedCategories}
        onChange={(categories) => updateFormData({ selectedCategories: categories })}
        onBack={handleBack}
        onNext={handleNext}
      />
    </>
  
    ),
    4: (
      <>
      <Header handleBack={handleBack} progress={progress} />
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
      </>
    
    ),
    5: (
      <>
         {/* Top App Bar */}
               <Header handleBack={handleBack} progress={progress} />
                <MakeOfficial  
        onBack={handleBack}
        onNext={handleNext}
      />
      </>
    
    ),
  };

  return (  
     <View className="flex-1 bg-background-light dark:bg-background-dark">
      <SafeAreaView className="flex-1">
        {/* Progress bar  */}
        {steps[currentStep]}
      </SafeAreaView>
      {/* Button to update the current or the submit based on the number of the steps */}
    </View>
  );
}

function Header({handleBack, progress}: {handleBack: () => void, progress: number}) {
    return(
      <>
       <View className="flex-row items-center px-4 pt-6 pb-2 justify-between">
                <TouchableOpacity
                  className="items-center justify-center rounded-full"
                  accessibilityRole="button"
                  onPress={handleBack}
                >
                  {/* text-light = #181114 (commented for reference); dark text is white */}
                  {/* TODO: Add text-light to tailwind config as #181114 */}
                  <MaterialIcons name="arrow-back-ios-new" size={24} color="#181114" />
                </TouchableOpacity>
                <Text className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10 text-white dark:text-white" style={{ color: "#181114" }}>
                  Vendor Onboarding
                </Text>
              </View>
      
              <View className="flex-col gap-2 px-6 pb-4">
                <View className="flex-row gap-6 justify-between items-center">
                  {/* text-light = #181114 */}
                  <Text className="text-sm font-semibold" style={{ color: "#181114" }}>
                    Step 5 of 5
                  </Text>
                  {/* primary = #ee2b8c */}
                  <Text className="text-xs font-bold text-primary">{progress}%</Text>
                </View>
                {/* Track background light = #e6dbe0 (not in config) */}
                <View className="h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: "#e6dbe0" }}>
                  {/* Fill primary = #ee2b8c */}
                  <View className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
                </View>
              </View>
      </>
   )
}
