import { Text } from "@/src/components/ui/Text";
import BusinessDetail from "@/src/components/ui/vendorForm/BuisnessDetail";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Image,
    ImageBackground,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- Constants & Types ---

const SCREEN_WIDTH = Dimensions.get("window").width;
const PADDING = 24;
const GAP = 16;
const CARD_WIDTH = (SCREEN_WIDTH - PADDING * 2 - GAP) / 2;
const PORTFOLIO_GAP = 12;
const PORTFOLIO_PADDING = 16;
const PORTFOLIO_ITEM_SIZE = (SCREEN_WIDTH - PORTFOLIO_PADDING * 2 - PORTFOLIO_GAP * 2) / 3;
const MAX_PHOTOS = 9;

type Category = {
  key: string;
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

const CATEGORIES: Category[] = [
  { key: "catering", title: "Catering", icon: "restaurant" },
  { key: "photography", title: "Photography", icon: "photo-camera" },
  { key: "decor", title: "Decor", icon: "local-florist" },
  { key: "music", title: "Music & DJ", icon: "music-note" },
  { key: "venue", title: "Venue", icon: "castle" },
  { key: "makeup", title: "Makeup & Hair", icon: "face-retouching-natural" },
  { key: "planning", title: "Planning", icon: "edit-note" },
  { key: "transport", title: "Transport", icon: "directions-car" },
];

type Photo = {
  id: string;
  uri: string;
  isCover: boolean;
};

const INITIAL_PHOTOS: Photo[] = [
  {
    id: "1",
    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5f9MvEWh81PBSahwzhmh4NPVSQW-OGjoZF5gwOCHW1wEXc8H9GnAMwxyO0fY5vm-du-bBGvg10Yc4opCRFjon-YssI2W5WJcKOtr5OicuAktvX1yjOQtZI2LFZKUkm_4iswDATUEKhjlQidFssxMNbnvt4YoddGXH6om6dD0TWi1a3TKw7VVbf4jWdnibZjJ0JzQZXcCK1DNO8gCD0qJLgJhHQ5YLCxwU9pde_5YjjlCywoA6RJG1SNSM4EU35fP-HNG5ArJlUIs",
    isCover: true,
  },
];

// --- Main Component ---

export default function VendorForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    selectedCategories: ["music"],
    businessName: "",
    bio: "",
    location: "",
    websiteOrLink: "",
    serviceableCities: [] as string[],
    experience: "",
    photos: INITIAL_PHOTOS,
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
    if (currentStep < 5) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        setCurrentStep(currentStep + 1);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [currentStep, fadeAnim]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        setCurrentStep(currentStep - 1);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [currentStep, fadeAnim]);

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <SafeAreaView className="flex-1">
        {/* Top App Bar */}
        <View className="flex-row items-center px-4 pt-6 pb-2 justify-between">
          <TouchableOpacity
            className="items-center justify-center rounded-full size-10"
            onPress={handleBack}
            disabled={currentStep === 1}
            style={{ opacity: currentStep === 1 ? 0.3 : 1 }}
          >
            <MaterialIcons name="arrow-back-ios-new" size={24} color="#181114" />
          </TouchableOpacity>
          <Text className="text-lg font-bold flex-1 text-center pr-10" style={{ color: "#181114" }}>
            Vendor Onboarding
          </Text>
        </View>

        {/* Progress Bar */}
        <View className="flex-col gap-3 px-6 pb-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-sm font-semibold" style={{ color: "#181113" }}>
              Step {currentStep} of 4
            </Text>
            <Text className="text-xs font-bold text-primary">{Math.round(progress)}%</Text>
          </View>
          <View className="h-3 w-full rounded-full overflow-hidden" style={{ backgroundColor: "#e6dbe0" }}>
            <Animated.View 
              className="h-full rounded-full bg-primary" 
              style={{ width: progressAnim.interpolate({
                inputRange: [-1, 100],
                outputRange: ['-1%', '100%']
              }) }} 
            />
          </View>
        </View>

        {/* Content */}
        <ScrollView className="flex-1 px-6 pb-32" showsVerticalScrollIndicator={false}>
          <Animated.View style={{ opacity: fadeAnim }}>
          {currentStep === 1 && (
            <StepCategories
              selectedKeys={formData.selectedCategories}
              onSelect={(key) => {
                const newSelection = formData.selectedCategories.includes(key)
                  ? formData.selectedCategories.filter((k) => k !== key)
                  : [...formData.selectedCategories, key];
                updateFormData({ selectedCategories: newSelection });
              }}
            />
          )}

          {currentStep === 2 && (
            <StepBusinessInfo
              data={formData}
              onChange={(updates) => updateFormData(updates)}
            />
          )}

          {currentStep === 3 && (
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
          )}

          {currentStep === 4 && (
            <StepPortfolio
              photos={formData.photos}
              onPhotosChange={(photos) => updateFormData({ photos })}
            />
          )}

          {currentStep === 5 && (
            <StepReview data={formData} />
          )}
          </Animated.View>

          {/* Bottom spacing */}
          <View className="h-24" />
        </ScrollView>

        {/* Sticky Footer */}
        <LinearGradient
          colors={["#f8f6f7", "#f8f6f7", "transparent"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          className="absolute bottom-0 w-full p-4 pt-12"
        >
          <TouchableOpacity
            className="w-full rounded-full bg-primary py-4 px-6 flex-row items-center justify-center gap-2"
            activeOpacity={0.9}
            onPress={currentStep === 5 ? () => console.log("Account Activated") : handleNext}
          >
            <Text className="text-white text-base font-bold">
              {currentStep === 5 ? "Activate My Profile" : "Continue"}
            </Text>
            <MaterialIcons
              name={currentStep === 5 ? "rocket-launch" : "arrow-forward"}
              size={18}
              color="#ffffff"
            />
          </TouchableOpacity>
        </LinearGradient>
      </SafeAreaView>
    </View>
  );
}

// --- Steps Components ---

function StepCategories({ selectedKeys, onSelect }: { selectedKeys: string[]; onSelect: (key: string) => void }) {
  return (
    <View>
      <Text className="text-[28px] font-bold leading-tight pt-2 pb-3" style={{ color: "#181114" }}>
        What services do you offer?
      </Text>
      <Text className="text-base font-normal leading-relaxed text-slate-500">
        Choose one or more categories that best describe your business.
      </Text>
      <View className="mt-6 flex-row flex-wrap justify-between" style={{ gap: GAP }}>
        {CATEGORIES.map((item) => (
          <CategoryCard
            key={item.key}
            item={item}
            selected={selectedKeys.includes(item.key)}
            onSelect={() => onSelect(item.key)}
          />
        ))}
      </View>
    </View>
  );
}

function CategoryCard({ item, selected, onSelect }: { item: Category; selected: boolean; onSelect: () => void }) {
  return (
    <TouchableOpacity
      className={`relative rounded-2xl p-5 items-center justify-center shadow-sm ${selected ? "border-2 border-primary bg-primary/5" : "border-2 border-transparent bg-white"
        }`}
      style={{ width: CARD_WIDTH }}
      activeOpacity={0.9}
      onPress={onSelect}
    >
      <View
        className="items-center justify-center rounded-full"
        style={{ width: 48, height: 48, backgroundColor: selected ? "#ffffff" : "#fcebf4" }}
      >
        <MaterialIcons name={item.icon} size={28} color="#ee2b8c" />
      </View>
      <Text className="text-sm font-bold mt-3" style={{ color: "#181114" }}>
        {item.title}
      </Text>
      {selected && (
        <View className="absolute top-3 right-3">
          <MaterialIcons name="check-circle" size={20} color="#ee2b8c" />
        </View>
      )}
    </TouchableOpacity>
  );
}

function StepBusinessInfo({ data, onChange }: { data: any; onChange: (updates: any) => void }) {
  return (
    <View>
      <Text className="text-[32px] font-bold leading-tight mb-2" style={{ color: "#181114" }}>
        Business Details
      </Text>
      <Text className="text-base font-normal leading-relaxed text-slate-500 mb-8">
        Let's start with the basics so couples can easily find and book you.
      </Text>
      <View className="gap-6">
        <View className="gap-2">
          <Text className="text-sm font-semibold" style={{ color: "#181114" }}>Business Name</Text>
          <TextInput
            value={data.businessName}
            onChangeText={(v) => onChange({ businessName: v })}
            placeholder="e.g., Dreamy Moments Photography"
            className="w-full rounded-xl h-14 px-4 bg-white border border-slate-200"
          />
        </View>
        <View className="gap-2">
          <Text className="text-sm font-semibold" style={{ color: "#181114" }}>About your services</Text>
          <TextInput
            value={data.bio}
            onChangeText={(v) => onChange({ bio: v })}
            placeholder="Describe your style..."
            className="w-full rounded-xl p-4 min-h-[120px] bg-white border border-slate-200"
            multiline
          />
        </View>
        <View className="gap-2">
          <Text className="text-sm font-semibold" style={{ color: "#181114" }}>Base Location</Text>
          <TextInput
            value={data.location}
            onChangeText={(v) => onChange({ location: v })}
            placeholder="City, State"
            className="w-full rounded-xl h-14 px-4 bg-white border border-slate-200"
          />
        </View>
      </View>
    </View>
  );
}

function StepAdditionalDetails() {
  return (
    <View>
      <Text className="text-[28px] font-bold leading-tight pt-2 pb-3" style={{ color: "#181114" }}>
        Almost there!
      </Text>
      <Text className="text-base font-normal leading-relaxed text-slate-500">
        Add more details to make your profile stand out. (Placeholder for Step 3)
      </Text>
    </View>
  );
}

function StepPortfolio({ photos, onPhotosChange }: { photos: Photo[]; onPhotosChange: (p: Photo[]) => void }) {
  const handleRemove = (id: string) => onPhotosChange(photos.filter((p) => p.id !== id));

  const gridData = useMemo(() => [
    ...photos,
    ...Array.from({ length: MAX_PHOTOS - photos.length }, (_, i) => ({
      id: `empty-${i + photos.length + 1}`,
      empty: true as const,
      slot: photos.length + i + 1,
    })),
  ], [photos]);

  return (
    <View>
      <Text className="text-[28px] font-bold leading-tight mb-2" style={{ color: "#181114" }}>
        Showcase Your Work
      </Text>
      <Text className="text-base text-slate-500 mb-6">
        Add up to 9 photos of your best work. Couples love seeing real examples!
      </Text>
      <View className="flex-row flex-wrap" style={{ gap: PORTFOLIO_GAP }}>
        {gridData.map((item: any) => (
          <View
            key={item.id}
            className="rounded-lg overflow-hidden bg-slate-100 items-center justify-center"
            style={{ width: PORTFOLIO_ITEM_SIZE, height: PORTFOLIO_ITEM_SIZE }}
          >
            {item.uri ? (
              <>
                <Image source={{ uri: item.uri }} style={{ width: "100%", height: "100%" }} />
                <TouchableOpacity
                  className="absolute top-1 right-1 size-6 items-center justify-center rounded-full bg-black/50"
                  onPress={() => handleRemove(item.id)}
                >
                  <MaterialIcons name="close" size={16} color="#ffffff" />
                </TouchableOpacity>
              </>
            ) : (
              <Text className="text-sm font-bold text-slate-300">{item.slot}</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

function StepReview({ data }: { data: any }) {
  return (
    <View>
      <View className="w-full aspect-[16/9] rounded-2xl overflow-hidden mb-6 bg-gray-200">
        <ImageBackground
          source={{ uri: data.photos[0]?.uri || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop" }}
          className="w-full h-full justify-end"
        >
          <View className="absolute inset-0 bg-black/20" />
          <View className="absolute bottom-3 right-3 bg-white/90 px-3 py-1 rounded-full">
            <Text className="text-xs font-bold text-green-700">✓ Ready to Review</Text>
          </View>
        </ImageBackground>
      </View>
      <View className="items-center mb-4">
        <Text className="text-2xl font-bold" style={{ color: "#181114" }}>You're all set!</Text>
        <Text className="text-slate-500 text-center mt-2">
          Once you activate, our team will verify your details within <Text className="text-primary font-bold">24 hours</Text>.
        </Text>
      </View>
      <View className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
        <Text className="text-lg font-bold mb-4">{data.businessName || "Your Business Name"}</Text>
        <View className="gap-3">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="category" size={16} color="#6b7280" />
            <Text className="text-sm text-slate-600">{data.selectedCategories.join(", ")}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="location-on" size={16} color="#6b7280" />
            <Text className="text-sm text-slate-600">{data.location || "Location not set"}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}