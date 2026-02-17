import { useAuth } from "@/src/store/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
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
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
  };

  const handleNavigation = (screen: string) => {
    router.push({ pathname: `/profile/${screen}` });
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
          <LinearGradient
            colors={["#ec4899", "#db2777"]}
            className="p-[3px] rounded-full"
          >
            <View className="bg-white p-1 rounded-full">
              <Image
                source={{
                  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8QYwLdrh7xjte39mVYvDpi053GDi8rf6uQT5uRehpkzgSaSUO1bU-gjQR3vC5rz0trs8aPuTJQ-NF-7EWhF0dW0Sncg_Vhq_mo8NftERtP4ZVATWyqgiFk4YEYtjMq-kH0vubWOCRAWN0iY_YzSfmg5zLdv55nlQE84xdxw-TTt-IVuBhKoAuBzCQypf1qEhxeHZNxVPFpTjsCytpO95l4FHsaMS3HtpB0dJJssJtnyKpr-sBd50Vrtk2mkFa_ESaiscwocjW8do",
                }}
                className="w-32 h-32 rounded-full"
              />
            </View>
          </LinearGradient>

          {/* camera */}
          <Pressable className="absolute bottom-[70px] right-[140px] bg-pink-500 p-2 rounded-full shadow-lg">
            <MaterialIcons name="photo-camera" size={18} color="white" />
          </Pressable>

          <Text className="text-2xl font-bold mt-4 text-gray-900">
            Sarah Mitchell
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
        {tab === "account" ? (
          <Account onNavigate={handleNavigation} />
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

const ToggleButton = ({ title, active, onPress }: ToggleButtonProps) => (
  <Pressable
    onPress={onPress}
    className={`flex-1 py-3 rounded-xl ${active ? "bg-pink-50 shadow-sm" : ""}`}
  >
    <Text
      className={`text-center font-semibold ${
        active ? "text-pink-500" : "text-gray-400"
      }`}
    >
      {title}
    </Text>
  </Pressable>
);

/* ---------- Row ---------- */

const Row = ({ icon, title, onPress }: RowProps & { onPress?: () => void }) => (
  <Pressable
    className="flex-row items-center justify-between bg-white p-4 rounded-2xl mb-3 shadow-sm active:scale-[0.98]"
    onPress={onPress}
  >
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
);

/* ---------- Sections ---------- */

const Account = ({ onNavigate }: { onNavigate: (screen: string) => void }) => (
  <View className="mx-6 mt-8">
    <Text className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">
      BUSINESS
    </Text>

    <Row
      icon="business"
      title="Business Information"
      onPress={() => onNavigate("business-information")}
    />
    <Row
      icon="sell"
      title="Services & Pricing"
      onPress={() => onNavigate("services-pricing")}
    />
    <Row
      icon="photo-library"
      title="Portfolio"
      onPress={() => onNavigate("portfolio")}
    />
    <Row
      icon="verified"
      title="Vendor Verification"
      onPress={() => onNavigate("vendor-verification")}
    />
  </View>
);

const Info = () => (
  <View className="mx-6 mt-8">
    <Text className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">
      PERSONAL
    </Text>

    <Row icon="person" title="Edit Profile" />
    <Row icon="notifications" title="Notifications" />
    <Row icon="lock" title="Privacy & Security" />
    <Row icon="settings" title="App Settings" />
  </View>
);
