import { useAuthStore } from "@/src/store/AuthStore";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Storage keys
const STORAGE_KEYS = {
  BUSINESS_INFO: "business_info",
  VENDOR_SETUP_COMPLETE: "vendor_setup_complete",
};

type ToggleButtonProps = {
  title: string;
  active: boolean;
  onPress: () => void;
};

type RowProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
};

export default function ProfileScreen() {
  const [tab, setTab] = useState<"account" | "info">("account");
  const { clearAuth: logout } = useAuthStore();
  
  // Vendor setup status
  const [isVendorSetupComplete, setIsVendorSetupComplete] = useState(false);
  const [vendorType, setVendorType] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");

  useEffect(() => {
    checkVendorSetupStatus();
  }, []);

  const checkVendorSetupStatus = async () => {
    try {
      const storedInfo = await AsyncStorage.getItem(STORAGE_KEYS.BUSINESS_INFO);
      if (storedInfo) {
        const data = JSON.parse(storedInfo);
        setIsVendorSetupComplete(data.setupComplete || false);
        setVendorType(data.vendorType || "");
        setBusinessName(data.businessName || "");
        setOwnerName(data.ownerName || "");
      }
    } catch (error) {
      console.error("Error checking vendor status:", error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out", style: "destructive", onPress: logout },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View className="flex-row justify-between items-center px-6 py-4 bg-white">
          <MaterialIcons name="arrow-back-ios" size={20} color="#1f2937" />
          <Text className="text-lg font-bold text-gray-900">Profile</Text>
          <MaterialIcons name="more-horiz" size={24} color="#1f2937" />
        </View>

        {/* PROFILE */}
        <View className="items-center mt-6 mb-2 bg-white py-6">
          <View className="bg-white p-1 rounded-full !bg-primary">
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8QYwLdrh7xjte39mVYvDpi053GDi8rf6uQT5uRehpkzgSaSUO1bU-gjQR3vC5rz0trs8aPuTJQ-NF-7EWhF0dW0Sncg_Vhq_mo8NftERtP4ZVATWyqgiFk4YEYtjMq-kH0vubWOCRAWN0iY_YzSfmg5zLdv55nlQE84xdxw-TTt-IVuBhKoAuBzCQypf1qEhxeHZNxVPFpTjsCytpO95l4FHsaMS3HtpB0dJJssJtnyKpr-sBd50Vrtk2mkFa_ESaiscwocjW8do",
              }}
              className="w-32 h-32 rounded-full"
            />
          </View>

          {/* camera */}
          <Pressable className="absolute bottom-[85px] right-[150px] bg-pink-500 p-2 rounded-full shadow-lg">
            <MaterialIcons name="photo-camera" size={18} color="white" />
          </Pressable>

          <Text className="text-2xl font-bold mt-4 text-gray-900">
            Sarah Mitchell
          </Text>

          <Text className="text-gray-500 text-sm">Premium Member</Text>
        </View>

        {/* SET UP BUSINESS BUTTON - After text, below premium member */}
        {!isVendorSetupComplete && (
          <View className="px-6 pb-4 bg-white">
            <Link href="/profile/business-information" asChild>
              <Pressable className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl p-4 shadow-lg shadow-pink-200 active:scale-[0.98]">
                <View className="flex-row items-center justify-center gap-2">
                  <MaterialIcons name="storefront" size={20} color="dark" />
                  <Text className="text-dark font-bold text-base">Set Up Business</Text>
                </View>
              </Pressable>
            </Link>
          </View>
        )}

        {/* Vendor Status Badge - Show when setup is complete */}
        {isVendorSetupComplete && (
          <View className="px-6 pb-4 bg-white">
            <View className="bg-green-50 rounded-xl p-3 border border-green-100">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="verified" size={18} color="#22c55e" />
                  <Text className="text-green-800 font-semibold text-sm">
                    {businessName || "Vendor Active"}
                  </Text>
                </View>
                <Link href="/profile/business-information" asChild>
                  <Pressable className="bg-green-500 px-3 py-1 rounded-full">
                    <Text className="text-white text-xs font-semibold">View</Text>
                  </Pressable>
                </Link>
              </View>
            </View>
          </View>
        )}

        {/* GLASS TOGGLE */}
        <View className="mx-6 mt-4 bg-white rounded-2xl p-1 flex-row shadow-sm">
          <ToggleButton
            title=" Business"
            active={tab === "account"}
            onPress={() => setTab("account")}
          />
          <ToggleButton
            title="Account"
            active={tab === "info"}
            onPress={() => setTab("info")}
          />
        </View>

        {/* CONTENT */}
        {tab === "account" ? (
          <Account 
            isVendorSetupComplete={isVendorSetupComplete} 
            vendorType={vendorType}
            businessName={businessName}
          />
        ) : (
          <Info />
        )}

        {/* LOGOUT */}
        <Pressable className="mx-6 mt-10 mb-20" onPress={handleLogout}>
          <View className="bg-pink-500 rounded-2xl py-4 items-center">
            <Text className="text-white font-bold text-lg">Log Out</Text>
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- Toggle ---------- */

const ToggleButton = ({ title, active, onPress }: ToggleButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: active ? "#ec4899" : "transparent",
        shadowColor: active ? "#000" : undefined,
        shadowOffset: active ? { width: 0, height: 1 } : undefined,
        shadowOpacity: active ? 0.1 : undefined,
        shadowRadius: active ? 2 : undefined,
        elevation: active ? 2 : undefined,
      }}
    >
      <Text
        style={{
          textAlign: "center",
          fontWeight: "600",
          color: active ? "#ffffff" : "#9ca3af",
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
};

/* ---------- Row ---------- */

const Row = ({ icon, title, href, subtitle, badge, badgeColor }: RowProps & { href: string }) => (
  <Link href={href as any} asChild>
    <Pressable className="flex-row items-center justify-between bg-white p-4 rounded-2xl mb-3 shadow-sm active:scale-[0.98]">
      <View className="flex-row items-center gap-3">
        <LinearGradient
          colors={["#ec489933", "#db277733"]}
          className="p-2 rounded-xl"
        >
          <MaterialIcons name={icon} size={20} color="#ec4899" />
        </LinearGradient>

        <View>
          <Text className="font-semibold text-gray-900">{title}</Text>
          {subtitle && <Text className="text-xs text-gray-500">{subtitle}</Text>}
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        {badge && (
          <View className={`px-2 py-1 rounded-full ${badgeColor || "bg-green-100"}`}>
            <Text className={`text-xs font-semibold ${badgeColor ? "text-white" : "text-green-700"}`}>
              {badge}
            </Text>
          </View>
        )}
        <MaterialIcons name="chevron-right" size={22} color="#9ca3af" />
      </View>
    </Pressable>
  </Link>
);

/* ---------- Sections ---------- */

const Account = ({ 
  isVendorSetupComplete, 
  vendorType, 
  businessName 
}: { 
  isVendorSetupComplete: boolean;
  vendorType: string;
  businessName: string;
}) => {
  // Get vendor type display name
  const getVendorTypeDisplay = () => {
    const types: Record<string, string> = {
      venue: "Venue",
      photographer: "Photographer",
      caterer: "Caterer",
      decorator: "Decorator",
      makeup: "Makeup Artist",
      dj: "DJ / Music",
      planner: "Planner",
      transport: "Transport",
    };
    return types[vendorType] || "Vendor";
  };

  return (
    <View className="mx-6 mt-8">
      <Text className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">
        BUSINESS
      </Text>

      <Row 
        icon="analytics" 
        title="Analytics" 
        href="/profile/analytics"
        subtitle="View your performance"
      />
      
      <Row
        icon="business"
        title="Business Information"
        href="/profile/business-information"
        subtitle={isVendorSetupComplete ? businessName : "Complete your profile"}
        badge={isVendorSetupComplete ? "Active" : "Required"}
        badgeColor={isVendorSetupComplete ? "bg-green-100" : "bg-yellow-100"}
      />
      
      <Row
        icon="sell"
        title="Services & Pricing"
        href="/profile/services-pricing"
        subtitle="Manage your packages"
      />
      
      <Row 
        icon="photo-library" 
        title="Portfolio" 
        href="/profile/portfolio"
        subtitle="Showcase your work"
      />
      
      <Row
        icon="verified"
        title="Vendor Verification"
        href="/profile/vendor-verification"
        subtitle={isVendorSetupComplete ? "Verified" : "Get verified"}
        badge={isVendorSetupComplete ? "✓" : "Pending"}
        badgeColor={isVendorSetupComplete ? "bg-green-100" : "bg-gray-100"}
      />
      
      {/* Quick Actions for Vendors */}
      {isVendorSetupComplete && (
        <>
          <Text className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider mt-6">
            QUICK ACTIONS
          </Text>
          
          <Row
            icon="calendar-month"
            title="Availability"
            href="/profile/availability"
            subtitle="Manage your calendar"
          />
          
          <Row
            icon="chat"
            title="Messages"
            href="/profile/messages"
            subtitle="View inquiries"
            badge="3 new"
            badgeColor="bg-pink-100"
          />
          
          <Row
            icon="receipt-long"
            title="Bookings"
            href="/profile/bookings"
            subtitle="Manage reservations"
          />
        </>
      )}
    </View>
  );
};

const Info = () => (
  <View className="mx-6 mt-8">
    <Text className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">
      PERSONAL
    </Text>

    <Row icon="person" title="Edit Profile" href="/profile/edit-profile" />
    <Row
      icon="notifications"
      title="Notifications"
      href="/profile/notifications"
    />
    <Row
      icon="lock"
      title="Privacy & Security"
      href="/profile/privacy-security"
    />
    <Row icon="settings" title="App Settings" href="/profile/app-settings" />
    
    <Text className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider mt-6">
      SUPPORT
    </Text>
    
    <Row icon="help" title="Help & FAQ" href="/profile/help" />
    <Row icon="info" title="About" href="/profile/about" />
  </View>
);
