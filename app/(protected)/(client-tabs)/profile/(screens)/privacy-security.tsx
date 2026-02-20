import CustomHeader from "@/src/components/ui/profile/CustomHeader";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Reusable Toggle Item Component (DRY)
const ToggleItem = ({
  title,
  subtitle,
  value,
  onToggle,
  icon,
  danger = false,
}: {
  title: string;
  subtitle?: string;
  value: boolean;
  onToggle: (value: boolean) => void;
  icon?: string;
  danger?: boolean;
}) => (
  <View className="flex-row items-center justify-between py-4 border-b border-gray-50 last:border-0">
    <View className="flex-row items-center flex-1 mr-4">
      <View
        className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${danger ? "bg-red-50" : "bg-pink-50"}`}
      >
        <MaterialIcons
          name={icon as any}
          size={20}
          color={danger ? "#ef4444" : "#ee2b8c"}
        />
      </View>
      <View className="flex-1">
        <Text
          className={`text-base font-semibold ${danger ? "text-red-600" : "text-gray-900"}`}
        >
          {title}
        </Text>
        {subtitle && (
          <Text className="text-sm text-gray-500 mt-0.5">{subtitle}</Text>
        )}
      </View>
    </View>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: "#d1d5db", true: danger ? "#ef4444" : "#ec4899" }}
      thumbColor="#ffffff"
    />
  </View>
);

// Reusable Action Item Component (DRY)
const ActionItem = ({
  title,
  subtitle,
  onPress,
  icon,
  danger = false,
  showArrow = true,
}: {
  title: string;
  subtitle?: string;
  onPress: () => void;
  icon?: string;
  danger?: boolean;
  showArrow?: boolean;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center justify-between py-4 border-b border-gray-50 last:border-0"
  >
    <View className="flex-row items-center flex-1 mr-4">
      <View
        className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${danger ? "bg-red-50" : "bg-gray-100"}`}
      >
        <MaterialIcons
          name={icon as any}
          size={20}
          color={danger ? "#ef4444" : "#6b7280"}
        />
      </View>
      <View className="flex-1">
        <Text
          className={`text-base font-semibold ${danger ? "text-red-600" : "text-gray-900"}`}
        >
          {title}
        </Text>
        {subtitle && (
          <Text className="text-sm text-gray-500 mt-0.5">{subtitle}</Text>
        )}
      </View>
    </View>
    {showArrow && (
      <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
    )}
  </TouchableOpacity>
);

// Reusable Card Component (DRY)
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <View
    className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 ${className}`}
  >
    {children}
  </View>
);

export default function PrivacySecurityScreen() {
  const router = useRouter();
  const [privacySettings, setPrivacySettings] = useState({
    showProfilePublic: true,
    shareDataWithPartners: false,
    enableTwoFactor: false,
    allowAnalytics: true,
  });
  const [isLoading, setIsLoading] = useState(false);

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
      "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // TODO: Implement account deletion
            Alert.alert("Account Deleted", "Your account has been deleted.");
          },
        },
      ],
    );
  };

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Success", "Privacy settings saved!");
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <CustomHeader title="Privacy & Security" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-4 pt-6"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              Privacy & Security
            </Text>
            <Text className="text-base text-gray-600 leading-relaxed">
              Manage your privacy settings and secure your account.
            </Text>
          </View>

          {/* Privacy Settings */}
          <Card className="mb-4">
            <Text className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
              Privacy
            </Text>
            <ToggleItem
              title="Public Profile"
              subtitle="Allow others to view your profile"
              value={privacySettings.showProfilePublic}
              onToggle={(value) => handleToggle("showProfilePublic", value)}
              icon="public"
            />
            <ToggleItem
              title="Share Data"
              subtitle="Share data with partners for better recommendations"
              value={privacySettings.shareDataWithPartners}
              onToggle={(value) => handleToggle("shareDataWithPartners", value)}
              icon="share"
            />
            <ToggleItem
              title="Analytics"
              subtitle="Help improve our services"
              value={privacySettings.allowAnalytics}
              onToggle={(value) => handleToggle("allowAnalytics", value)}
              icon="analytics"
            />
          </Card>

          {/* Security Settings */}
          <Card className="mb-4">
            <Text className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
              Security
            </Text>
            <ToggleItem
              title="Two-Factor Authentication"
              subtitle="Add extra security to your account"
              value={privacySettings.enableTwoFactor}
              onToggle={(value) => handleToggle("enableTwoFactor", value)}
              icon="security"
            />
            <ActionItem
              title="Change Password"
              subtitle="Update your password"
              onPress={handleChangePassword}
              icon="lock"
            />
          </Card>

          {/* Danger Zone */}
          <Card className="mb-4 border-red-100">
            <Text className="text-sm font-bold text-red-500 uppercase tracking-wider mb-3">
              Danger Zone
            </Text>
            <ActionItem
              title="Delete Account"
              subtitle="Permanently delete your account and data"
              onPress={handleDeleteAccount}
              icon="delete-forever"
              danger
              showArrow={false}
            />
          </Card>
        </ScrollView>

        {/* Save Button */}
        <View className="px-6 pb-6">
          <TouchableOpacity
            onPress={handleSave}
            disabled={isLoading}
            className={`w-full h-14 bg-pink-500 rounded-xl flex-row items-center justify-center shadow-lg shadow-pink-200 
              ${isLoading ? "opacity-70" : ""}`}
            activeOpacity={0.9}
          >
            <MaterialIcons
              name="save"
              size={20}
              color="#ffffff"
              className="mr-2"
            />
            <Text className="text-white font-bold text-lg">
              {isLoading ? "Saving..." : "Save Settings"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
