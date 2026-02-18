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

export default function AppSettingsScreen() {
  const router = useRouter();
  const [appSettings, setAppSettings] = useState({
    darkMode: false,
    offlineMode: false,
    autoSync: true,
    hapticFeedback: true,
    showTips: true,
  });

  const handleToggle = (field: string, value: boolean) => {
    setAppSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClearCache = () => {
    Alert.alert(
      "Clear Cache",
      "Are you sure you want to clear the app cache? This will remove all temporary files.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          onPress: () => {
            // TODO: Implement cache clearing
          },
        },
      ],
    );
  };

  const handleResetApp = () => {
    Alert.alert(
      "Reset App",
      "Are you sure you want to reset the app to default settings? This will not delete your account data.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            // TODO: Implement app reset
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
          <Text className="text-lg font-bold text-gray-900">App Settings</Text>
          <View className="size-10" />
        </View>

        <View className="bg-white p-6">
          {/* Appearance */}
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Appearance
          </Text>

          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-base font-semibold text-gray-900">
                Dark Mode
              </Text>
              <Text className="text-sm text-gray-500">Enable dark theme</Text>
            </View>
            <Switch
              value={appSettings.darkMode}
              onValueChange={(value) => handleToggle("darkMode", value)}
              trackColor={{ false: "#d1d5db", true: "#ec4899" }}
              thumbColor="#fff"
            />
          </View>

          {/* Performance */}
          <Text className="text-lg font-semibold text-gray-900 mb-4 mt-8">
            Performance
          </Text>

          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-base font-semibold text-gray-900">
                Offline Mode
              </Text>
              <Text className="text-sm text-gray-500">
                Save data for offline use
              </Text>
            </View>
            <Switch
              value={appSettings.offlineMode}
              onValueChange={(value) => handleToggle("offlineMode", value)}
              trackColor={{ false: "#d1d5db", true: "#ec4899" }}
              thumbColor="#fff"
            />
          </View>

          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-base font-semibold text-gray-900">
                Auto Sync
              </Text>
              <Text className="text-sm text-gray-500">
                Sync data automatically
              </Text>
            </View>
            <Switch
              value={appSettings.autoSync}
              onValueChange={(value) => handleToggle("autoSync", value)}
              trackColor={{ false: "#d1d5db", true: "#ec4899" }}
              thumbColor="#fff"
            />
          </View>

          {/* Features */}
          <Text className="text-lg font-semibold text-gray-900 mb-4 mt-8">
            Features
          </Text>

          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-base font-semibold text-gray-900">
                Haptic Feedback
              </Text>
              <Text className="text-sm text-gray-500">
                Enable vibration feedback
              </Text>
            </View>
            <Switch
              value={appSettings.hapticFeedback}
              onValueChange={(value) => handleToggle("hapticFeedback", value)}
              trackColor={{ false: "#d1d5db", true: "#ec4899" }}
              thumbColor="#fff"
            />
          </View>

          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-base font-semibold text-gray-900">
                Show Tips
              </Text>
              <Text className="text-sm text-gray-500">
                Display helpful tips
              </Text>
            </View>
            <Switch
              value={appSettings.showTips}
              onValueChange={(value) => handleToggle("showTips", value)}
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
            onPress={handleClearCache}
          >
            <Text className="text-base text-gray-900">Clear Cache</Text>
          </Pressable>

          <Pressable
            className="py-4 border-t border-gray-200"
            onPress={handleResetApp}
          >
            <Text className="text-base text-red-500">Reset App</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
