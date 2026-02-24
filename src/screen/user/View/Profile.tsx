import { useAuthStore } from "@/src/store/AuthStore";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ToggleButtonProps = {
  title: string;
  active: boolean;
  onPress: () => void;
};

type RowProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
};

export default function ProfileScreen() {
  const [tab, setTab] = useState<"account" | "info">("account");
  const { clearAuth: logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
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
        <View className="items-center mt-6 mb-6 bg-white py-6">
          <View className="p-1 rounded-full !bg-primary">
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
            {user?.name}
          </Text>

          <Text className="text-gray-500 text-sm">Premium Member</Text>
        </View>

        {/* GLASS TOGGLE */}
        <View className="mx-6 mt-8 bg-white rounded-2xl p-1 flex-row shadow-sm">
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
        {tab === "account" ? <Account /> : <Info />}

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

const Row = ({ icon, title, href }: RowProps & { href: string }) => (
  <Link href={href as any} asChild>
    <Pressable className="flex-row items-center justify-between bg-white p-4 rounded-2xl mb-3 shadow-sm active:scale-[0.98]">
      <View className="flex-row items-center gap-3">
        <LinearGradient
          colors={["#ec489933", "#db277733"]}
          className="p-2 rounded-xl"
        >
          <MaterialIcons name={icon} size={20} color="#ec4899" />
        </LinearGradient>

        <Text className="font-semibold text-gray-900">{title}</Text>
      </View>

      <MaterialIcons name="chevron-right" size={22} color="#9ca3af" />
    </Pressable>
  </Link>
);

/* ---------- Sections ---------- */

const Account = () => (
  <View className="mx-6 mt-8">
    <Text className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">
      BUSINESS
    </Text>

    <Row icon="analytics" title="Analytics" href="/profile/analytics" />
    <Row
      icon="business"
      title="Business Information"
      href="/profile/business-information"
    />
    <Row
      icon="sell"
      title="Services & Pricing"
      href="/profile/services-pricing"
    />
    <Row icon="photo-library" title="Portfolio" href="/profile/portfolio" />
    <Row
      icon="verified"
      title="Vendor Verification"
      href="/profile/vendor-verification"
    />
  </View>
);

const Info = () => (
  <View className="mx-6 mt-8">
    <Text className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">
      PERSONAL
    </Text>

    <Row icon="person" title="Edit Profile" href="/profile/edit-profile" />
    <Row icon="group" title="Family Members" href="/profile/family-members" />
    <Row
      icon="lock"
      title="Privacy & Security"
      href="/profile/privacy-security"
    />
    <Row icon="settings" title="App Settings" href="/profile/app-settings" />
  </View>
);
