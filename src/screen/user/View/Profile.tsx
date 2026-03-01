import AvatarPicker from "@/src/components/ui/AvatarPicker";
import { useAuthStore } from "@/src/store/AuthStore";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

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
  const { clearAuth: logout, user, updateUser } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/(onboarding)");
  };

  const handlePickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      updateUser({
        avatarImage: result.assets[0].uri,
        photo: result.assets[0].uri,
      });
    }
  };

  // Get avatar from user
  const avatarUri =
    user?.avatarImage || user?.photo || user?.avatar || user?.profilePicture;

  return (
    <View className="bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* PROFILE */}
        <View className="items-center mt-6 mb-6 bg-white py-6">
          <AvatarPicker
            name={user?.name || user?.username || "User"}
            avatarUri={avatarUri}
            onPick={handlePickAvatar}
            size="large"
            showEditButton={true}
            showName={false}
          />

          <Text className="text-2xl font-bold mt-4 text-gray-900">
            {user?.name || user?.username || "User"}
          </Text>

          <Text className="text-gray-500 text-sm">{user?.email}</Text>
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
    </View>
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
