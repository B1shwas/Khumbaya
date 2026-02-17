import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Extended vendor type for comparison (based on base Vendor interface)
interface VendorComparison {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  priceLevel: string;
  location: string;
  image: string;
  // Extended fields for comparison
  startingPrice: number;
  pricePackage: string;
  primaryStyle: string;
  deliveryTimeWeeks: string;
  services: {
    highlightReel: boolean;
    rawFootage: boolean;
    droneShots: boolean;
    fourKQuality: boolean;
  };
  isTopChoice?: boolean;
}

// Sample comparison data
const VENDOR_A: VendorComparison = {
  id: "1",
  name: "Radiant Moments",
  category: "Photography",
  rating: 4.9,
  reviews: 120,
  priceLevel: "$$$",
  location: "Delhi, India",
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCkAYir1uyaMJpHYxd3cTDm5UEx_lcVJTxtNY2aX-7SjfphxWwmRyzcN_I9jAgIIpqkB_WoA3q32x9izN6Kr_lfZk_2h8e2QgTa8ySCVzEuaPyt5iGLXvBLYh3Zmyzj9cd9ehQAy-8AIflmKb745Ui3-jn0RoRfgnaTlQuf-Ma27foOExZUSdI-ngacDOkkK56JuW_U6PfIPZug2LybUCfyo33uKUW6vcSNo2nbtsj91MFuVaVvo5d1GpzvmPpd9hv1643KT_ec4KM",
  startingPrice: 2500,
  pricePackage: "Standard Package",
  primaryStyle: "Candid & Art",
  deliveryTimeWeeks: "8-10 Weeks",
  services: {
    highlightReel: true,
    rawFootage: true,
    droneShots: true,
    fourKQuality: true,
  },
  isTopChoice: true,
};

const VENDOR_B: VendorComparison = {
  id: "2",
  name: "Focus Studio",
  category: "Photography",
  rating: 4.5,
  reviews: 85,
  priceLevel: "$$",
  location: "Mumbai, India",
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCYeV71hF5lCTG2Rs3fVfHbHj6xW0lLMJjeKIT5t2oFNQvMQCsyn9LQwEaTDjwe7KKiPSpkxWI_anv_EQNgNuL76Rhc5BRTzg_y6bKvLDVLhYudAbzBBN38BIv74wdSXaHgS-h175YWOIdPF3mVUI0iDu9dSS4A3AdFm8XNt7FnpAIOjEBKI2LLO-tOdnvsj3GaxdBJd0Fv7IXUUqIHS4nJ0Aq_17FmXfQTIKfipCWpCcaiAcxN4UCEn66V3UtdBbiL2qun6mk6UyE",
  startingPrice: 1800,
  pricePackage: "Basic Package",
  primaryStyle: "Traditional",
  deliveryTimeWeeks: "4-6 Weeks",
  services: {
    highlightReel: true,
    rawFootage: false,
    droneShots: true,
    fourKQuality: false,
  },
  isTopChoice: false,
};

interface ComparisonSectionProps {
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
  iconBgColor: string;
  children: React.ReactNode;
}

function ComparisonSection({
  title,
  icon,
  iconColor,
  iconBgColor,
  children,
}: ComparisonSectionProps) {
  return (
    <View className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50">
      <View className="flex-row items-center gap-2 mb-4">
        <View className={`p-1.5 ${iconBgColor} rounded-lg`}>
          <MaterialIcons name={icon} size={20} color={iconColor} />
        </View>
        <Text className="text-xs font-bold uppercase tracking-widest text-gray-500">
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
}

interface VendorComparisonScreenProps {
  vendorA?: VendorComparison;
  vendorB?: VendorComparison;
  onChangeVendors?: () => void;
  onBookVendor?: (vendorId: string) => void;
}

export default function VendorComparisonScreen({
  vendorA = VENDOR_A,
  vendorB = VENDOR_B,
  onChangeVendors,
  onBookVendor,
}: VendorComparisonScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    router.back();
  };

  const handleChangeVendors = () => {
    onChangeVendors?.();
  };

  const handleBookVendor = (vendorId: string) => {
    if (onBookVendor) {
      onBookVendor(vendorId);
    } else {
      // Default navigation to enquiry form
      router.push(`/(shared)/explore/${vendorId}/enquiryform` as any);
    }
  };

  return (
    <View className="flex-1 bg-background-light">
      {/* Fixed Header */}
      <View className="bg-white/80 backdrop-blur-md border-b border-pink-100 px-4 pt-3 pb-4">
        <View className="flex-row justify-between items-center">
          <Pressable
            onPress={handleBack}
            className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm active:bg-gray-50"
          >
            <MaterialIcons name="arrow-back" size={20} color="#181114" />
          </Pressable>

          <Text className="text-lg  font-bold text-gray-900">
            Compare Vendors
          </Text>

          <Pressable
            onPress={handleChangeVendors}
            className="flex-row items-center gap-1 bg-pink-50 px-3 py-1.5 rounded-full active:bg-pink-100"
          >
            <MaterialIcons name="sync-alt" size={16} color="#ee2b8c" />
            <Text className="text-primary font-bold text-xs uppercase tracking-wide">
              Change
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-6 pb-32"
        showsVerticalScrollIndicator={false}
      >
        {/* Vendor Cards */}
        <View className="flex-row gap-3 mb-6">
          {/* Vendor A Card */}
          <View className="flex-1">
            <View
              className={`w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-lg relative ${
                vendorA.isTopChoice ? "border-2 border-primary" : "border border-gray-200"
              }`}
            >
              <Image
                source={{ uri: vendorA.image }}
                className="w-full h-full"
                resizeMode="cover"
              />
              <View className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <View className="absolute bottom-3 left-3 right-3">
                {vendorA.isTopChoice && (
                  <View className="bg-primary text-white px-2 py-0.5 rounded-full w-fit mb-1 shadow-sm">
                    <Text className="text-[10px] font-bold text-white">
                      Top Choice
                    </Text>
                  </View>
                )}
                <Text className="font-serif font-bold text-lg leading-tight mb-0.5 text-white">
                  {vendorA.name}
                </Text>
                <View className="flex-row items-center gap-1">
                  <MaterialIcons name="location-on" size={12} color="#ffffff" />
                  <Text className="text-[10px] text-white opacity-90">
                    {vendorA.location}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Vendor B Card */}
          <View className="flex-1">
            <View
              className={`w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-md relative ${
                vendorB.isTopChoice ? "border-2 border-primary" : "border border-gray-200"
              }`}
            >
              <Image
                source={{ uri: vendorB.image }}
                className="w-full h-full"
                resizeMode="cover"
              />
              <View className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <View className="absolute bottom-3 left-3 right-3">
                {vendorB.isTopChoice && (
                  <View className="bg-primary px-2 py-0.5 rounded-full w-fit mb-1 shadow-sm">
                    <Text className="text-[10px] font-bold text-white">
                      Top Choice
                    </Text>
                  </View>
                )}
                <Text className="font-serif font-bold text-lg leading-tight mb-0.5 text-white">
                  {vendorB.name}
                </Text>
                <View className="flex-row items-center gap-1">
                  <MaterialIcons name="location-on" size={12} color="#ffffff" />
                  <Text className="text-[10px] text-white opacity-90">
                    {vendorB.location}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Comparison Sections */}
        <View className="gap-4">
          {/* Starting Price */}
          <ComparisonSection
            title="Starting Price"
            icon="payments"
            iconColor="#D4AF37"
            iconBgColor="bg-yellow-50"
          >
            <View className="flex-row gap-4">
              <View className="flex-1 items-center border-r border-gray-100 pr-4">
                <Text className="text-xl font-bold text-secondary">
                  ${vendorA.startingPrice.toLocaleString()}
                </Text>
                <Text className="text-[10px] text-gray-400 font-medium text-center mt-1">
                  {vendorA.pricePackage}
                </Text>
              </View>
              <View className="flex-1 items-center pl-4">
                <Text className="text-xl font-bold text-secondary">
                  ${vendorB.startingPrice.toLocaleString()}
                </Text>
                <Text className="text-[10px] text-gray-400 font-medium text-center mt-1">
                  {vendorB.pricePackage}
                </Text>
              </View>
            </View>
          </ComparisonSection>

          {/* Primary Style */}
          <ComparisonSection
            title="Primary Style"
            icon="style"
            iconColor="#a855f7"
            iconBgColor="bg-purple-50"
          >
            <View className="flex-row gap-4">
              <View className="flex-1 items-center">
                <View className="px-4 py-1.5 bg-purple-50 rounded-xl border border-purple-100">
                  <Text className="text-xs font-bold text-purple-700 text-center">
                    {vendorA.primaryStyle}
                  </Text>
                </View>
              </View>
              <View className="flex-1 items-center">
                <View className="px-4 py-1.5 bg-blue-50 rounded-xl border border-blue-100">
                  <Text className="text-xs font-bold text-blue-700 text-center">
                    {vendorB.primaryStyle}
                  </Text>
                </View>
              </View>
            </View>
          </ComparisonSection>

          {/* Ratings */}
          <ComparisonSection
            title="Ratings"
            icon="star"
            iconColor="#F59E0B"
            iconBgColor="bg-orange-50"
          >
            <View className="flex-row gap-4">
              <View className="flex-1 items-center gap-1 border-r border-gray-100 pr-4">
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-2xl font-bold text-gray-900">
                    {vendorA.rating}
                  </Text>
                  <MaterialIcons name="star" size={20} color="#F59E0B" />
                </View>
                <Text className="text-[11px] text-gray-500 font-medium">
                  {vendorA.reviews} Reviews
                </Text>
              </View>
              <View className="flex-1 items-center gap-1 pl-4">
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-2xl font-bold text-gray-900">
                    {vendorB.rating}
                  </Text>
                  <MaterialIcons
                    name="star"
                    size={20}
                    color={vendorB.rating >= 4.7 ? "#F59E0B" : "#D1D5DB"}
                  />
                </View>
                <Text className="text-[11px] text-gray-500 font-medium">
                  {vendorB.reviews} Reviews
                </Text>
              </View>
            </View>
          </ComparisonSection>

          {/* Delivery Time */}
          <ComparisonSection
            title="Delivery Time"
            icon="schedule"
            iconColor="#14b8a6"
            iconBgColor="bg-teal-50"
          >
            <View className="flex-row gap-4">
              <View className="flex-1">
                <View className="bg-gray-50 py-2 rounded-lg">
                  <Text className="text-sm font-semibold text-gray-700 text-center">
                    {vendorA.deliveryTimeWeeks}
                  </Text>
                </View>
              </View>
              <View className="flex-1">
                <View className="bg-gray-50 py-2 rounded-lg">
                  <Text className="text-sm font-semibold text-gray-700 text-center">
                    {vendorB.deliveryTimeWeeks}
                  </Text>
                </View>
              </View>
            </View>
          </ComparisonSection>

          {/* Services Included */}
          <ComparisonSection
            title="Services Included"
            icon="verified"
            iconColor="#16a34a"
            iconBgColor="bg-green-50"
          >
            <View className="gap-4">
              {/* Highlight Reel */}
              <View className="flex-row gap-4 items-center border-b border-dashed border-gray-100 pb-3">
                <View className="flex-1 flex-row items-center gap-2">
                  <MaterialIcons
                    name={vendorA.services.highlightReel ? "check-circle" : "cancel"}
                    size={18}
                    color={vendorA.services.highlightReel ? "#16a34a" : "#9ca3af"}
                  />
                  <Text
                    className={`text-xs font-medium ${
                      vendorA.services.highlightReel
                        ? "text-gray-600"
                        : "text-gray-400 line-through"
                    }`}
                  >
                    Highlight Reel
                  </Text>
                </View>
                <View className="flex-1 flex-row items-center gap-2">
                  <MaterialIcons
                    name={vendorB.services.highlightReel ? "check-circle" : "cancel"}
                    size={18}
                    color={vendorB.services.highlightReel ? "#16a34a" : "#9ca3af"}
                  />
                  <Text
                    className={`text-xs font-medium ${
                      vendorB.services.highlightReel
                        ? "text-gray-600"
                        : "text-gray-400 line-through"
                    }`}
                  >
                    Highlight Reel
                  </Text>
                </View>
              </View>

              {/* Raw Footage */}
              <View className="flex-row gap-4 items-center border-b border-dashed border-gray-100 pb-3">
                <View className="flex-1 flex-row items-center gap-2">
                  <MaterialIcons
                    name={vendorA.services.rawFootage ? "check-circle" : "cancel"}
                    size={18}
                    color={vendorA.services.rawFootage ? "#16a34a" : "#9ca3af"}
                  />
                  <Text
                    className={`text-xs font-medium ${
                      vendorA.services.rawFootage
                        ? "text-gray-600"
                        : "text-gray-400 line-through"
                    }`}
                  >
                    Raw Footage
                  </Text>
                </View>
                <View className="flex-1 flex-row items-center gap-2">
                  <MaterialIcons
                    name={vendorB.services.rawFootage ? "check-circle" : "cancel"}
                    size={18}
                    color={vendorB.services.rawFootage ? "#16a34a" : "#9ca3af"}
                  />
                  <Text
                    className={`text-xs font-medium ${
                      vendorB.services.rawFootage
                        ? "text-gray-600"
                        : "text-gray-400 line-through"
                    }`}
                  >
                    Raw Footage
                  </Text>
                </View>
              </View>

              {/* Drone Shots */}
              <View className="flex-row gap-4 items-center border-b border-dashed border-gray-100 pb-3">
                <View className="flex-1 flex-row items-center gap-2">
                  <MaterialIcons
                    name={vendorA.services.droneShots ? "check-circle" : "cancel"}
                    size={18}
                    color={vendorA.services.droneShots ? "#16a34a" : "#9ca3af"}
                  />
                  <Text
                    className={`text-xs font-medium ${
                      vendorA.services.droneShots
                        ? "text-gray-600"
                        : "text-gray-400 line-through"
                    }`}
                  >
                    Drone Shots
                  </Text>
                </View>
                <View className="flex-1 flex-row items-center gap-2">
                  <MaterialIcons
                    name={vendorB.services.droneShots ? "check-circle" : "cancel"}
                    size={18}
                    color={vendorB.services.droneShots ? "#16a34a" : "#9ca3af"}
                  />
                  <Text
                    className={`text-xs font-medium ${
                      vendorB.services.droneShots
                        ? "text-gray-600"
                        : "text-gray-400 line-through"
                    }`}
                  >
                    Drone Shots
                  </Text>
                </View>
              </View>

              {/* 4K Quality */}
              <View className="flex-row gap-4 items-center">
                <View className="flex-1 flex-row items-center gap-2">
                  <MaterialIcons
                    name={vendorA.services.fourKQuality ? "check-circle" : "cancel"}
                    size={18}
                    color={vendorA.services.fourKQuality ? "#16a34a" : "#9ca3af"}
                  />
                  <Text
                    className={`text-xs font-medium ${
                      vendorA.services.fourKQuality
                        ? "text-gray-600"
                        : "text-gray-400 line-through"
                    }`}
                  >
                    4K Quality
                  </Text>
                </View>
                <View className="flex-1 flex-row items-center gap-2">
                  <MaterialIcons
                    name={vendorB.services.fourKQuality ? "check-circle" : "cancel"}
                    size={18}
                    color={vendorB.services.fourKQuality ? "#16a34a" : "#9ca3af"}
                  />
                  <Text
                    className={`text-xs font-medium ${
                      vendorB.services.fourKQuality
                        ? "text-gray-600"
                        : "text-gray-400 line-through"
                    }`}
                  >
                    4K Quality
                  </Text>
                </View>
              </View>
            </View>
          </ComparisonSection>
        </View>
      </ScrollView>

      {/* Fixed Bottom Actions */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 pb-8 pt-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]"
        style={{ paddingBottom: Math.max(insets.bottom + 16, 32) }}
      >
        <View className="flex-row gap-4">
          {/* Vendor A Book Button */}
          <Pressable
            onPress={() => handleBookVendor(vendorA.id)}
            className="flex-1 bg-primary rounded-xl py-3.5 px-2 shadow-xl shadow-primary/20 active:scale-95"
          >
            <View className="items-center">
              <Text className="text-[10px] font-bold text-white uppercase tracking-wider mb-0.5">
                Book Now
              </Text>
              <Text className="text-sm font-bold text-white font-serif" numberOfLines={1}>
                {vendorA.name}
              </Text>
            </View>
          </Pressable>

          {/* Vendor B Book Button */}
          <Pressable
            onPress={() => handleBookVendor(vendorB.id)}
            className="flex-1 bg-white border border-black rounded-xl py-3.5 px-2 shadow-lg shadow-black/40 active:scale-95"
          >
            <View className="items-center">
              <Text className="text-[10px] font-bold text-accent uppercase tracking-wider mb-0.5 opacity-90">
                Book Now
              </Text>
              <Text className="text-sm font-bold text-accent font-serif" numberOfLines={1}>
                {vendorB.name}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
