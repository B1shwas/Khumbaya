import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacySecurityScreen() {
  const router = useRouter();
  const [privacySettings, setPrivacySettings] = useState({
    showProfilePublic: true,
    shareDataWithPartners: false,
    enableTwoFactor: false,
    allowAnalytics: true,
  });

  const handleToggle = (field: string, value: boolean) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleChangePassword = () => {
    router.push({ pathname: "/profile/change-password" });
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // TODO: Implement account deletion
          },
        },
      ],
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <SafeAreaView className="flex-1">
        {/* Top App Bar */}
        <View className="sticky top-0 z-10 flex-row items-center justify-between px-4 py-4 bg-white shadow-sm">
          <TouchableOpacity
            className="size-10 items-center justify-center rounded-full"
            accessibilityRole="button"
            onPress={() => router.back()}
          >
            <MaterialIcons
              name="arrow-back-ios-new"
              size={24}
              color="#0f172a"
            />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-900">
            Privacy & Security
          </Text>
          <View className="size-10" />
        </View>

        <View className="bg-white p-6">
          {/* Privacy Settings */}
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Privacy Settings
          </Text>

          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-base font-semibold text-gray-900">
                Public Profile
              </Text>
              <Text className="text-sm text-gray-500">
                Allow others to view your profile
              </Text>
            </View>
            <Switch
              value={privacySettings.showProfilePublic}
              onValueChange={(value) =>
                handleToggle("showProfilePublic", value)
              }
              trackColor={{ false: "#d1d5db", true: "#ec4899" }}
              thumbColor="#fff"
            />
          </View>

          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-base font-semibold text-gray-900">
                Share Data
              </Text>
              <Text className="text-sm text-gray-500">
                Share data with partners
              </Text>
            </View>
            <Switch
              value={privacySettings.shareDataWithPartners}
              onValueChange={(value) =>
                handleToggle("shareDataWithPartners", value)
              }
              trackColor={{ false: "#d1d5db", true: "#ec4899" }}
              thumbColor="#fff"
            />
          </View>

          {/* Security Settings */}
          <Text className="text-lg font-semibold text-gray-900 mb-4 mt-8">
            Security Settings
          </Text>

          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-base font-semibold text-gray-900">
                Two-Factor Authentication
              </Text>
              <Text className="text-sm text-gray-500">
                Add an extra layer of security
              </Text>
            </View>
            <Switch
              value={privacySettings.enableTwoFactor}
              onValueChange={(value) => handleToggle("enableTwoFactor", value)}
              trackColor={{ false: "#d1d5db", true: "#ec4899" }}
              thumbColor="#fff"
            />
          </View>

          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-base font-semibold text-gray-900">
                Allow Analytics
              </Text>
              <Text className="text-sm text-gray-500">
                Help us improve by sharing usage data
              </Text>
            </View>
            <Switch
              value={privacySettings.allowAnalytics}
              onValueChange={(value) => handleToggle("allowAnalytics", value)}
              trackColor={{ false: "#d1d5db", true: "#ec4899" }}
              thumbColor="#fff"
            />
          </View>

          {/* Actions */}
          <Text className="text-lg font-semibold text-gray-900 mb-4 mt-8">
            Actions
          </Text>

          <Pressable
            className="py-4 border-t border-gray-200"
            onPress={handleChangePassword}
          >
            <Text className="text-base text-gray-900">Change Password</Text>
          </Pressable>

          <Pressable
            className="py-4 border-t border-gray-200"
            onPress={handleDeleteAccount}
          >
            <Text className="text-base text-red-500">Delete Account</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
