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
}: {
  title: string;
  subtitle?: string;
  value: boolean;
  onToggle: (value: boolean) => void;
  icon?: string;
}) => (
  <View className="flex-row items-center justify-between py-4 border-b border-gray-50 last:border-0">
    <View className="flex-row items-center flex-1 mr-4">
      <View className="w-10 h-10 bg-pink-50 rounded-full items-center justify-center mr-3">
        <MaterialIcons name={icon as any} size={20} color="#ee2b8c" />
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-900">{title}</Text>
        {subtitle && (
          <Text className="text-sm text-gray-500 mt-0.5">{subtitle}</Text>
        )}
      </View>
    </View>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: "#d1d5db", true: "#ec4899" }}
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
  showArrow = true,
  danger = false,
}: {
  title: string;
  subtitle?: string;
  onPress: () => void;
  icon?: string;
  showArrow?: boolean;
  danger?: boolean;
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

export default function AppSettingsScreen() {
  const router = useRouter();
  const [appSettings, setAppSettings] = useState({
    darkMode: false,
    offlineMode: false,
    autoSync: true,
    hapticFeedback: true,
    showTips: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = (field: string, value: boolean) => {
    setAppSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClearCache = () => {
    Alert.alert(
      "Clear Cache",
      "This will remove all temporary files and free up storage space.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          onPress: () => {
            // Simulate clearing cache
            setTimeout(() => {
              Alert.alert("Success", "Cache cleared successfully!");
            }, 500);
          },
        },
      ],
    );
  };

  const handleResetApp = () => {
    Alert.alert(
      "Reset App",
      "This will reset all app settings to default. Your account data will not be affected.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            // Reset to defaults
            setAppSettings({
              darkMode: false,
              offlineMode: false,
              autoSync: true,
              hapticFeedback: true,
              showTips: true,
            });
            Alert.alert("Success", "App settings reset to defaults.");
          },
        },
      ],
    );
  };

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Success", "App settings saved!");
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-4 pt-6 pb-10"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              App Settings
            </Text>
            <Text className="text-base text-gray-600 leading-relaxed">
              Customize your app experience and preferences.
            </Text>
          </View>

          {/* Appearance */}
          <Card className="mb-4">
            <Text className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
              Appearance
            </Text>
            <ToggleItem
              title="Dark Mode"
              subtitle="Enable dark theme for better night viewing"
              value={appSettings.darkMode}
              onToggle={(value) => handleToggle("darkMode", value)}
              icon="dark-mode"
            />
          </Card>

          {/* Performance */}
          <Card className="mb-4">
            <Text className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
              Performance
            </Text>
            <ToggleItem
              title="Offline Mode"
              subtitle="Save data for offline use"
              value={appSettings.offlineMode}
              onToggle={(value) => handleToggle("offlineMode", value)}
              icon="offline-bolt"
            />
            <ToggleItem
              title="Auto Sync"
              subtitle="Sync data automatically in background"
              value={appSettings.autoSync}
              onToggle={(value) => handleToggle("autoSync", value)}
              icon="sync"
            />
          </Card>

          {/* Features */}
          <Card className="mb-4">
            <Text className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
              Features
            </Text>
            <ToggleItem
              title="Haptic Feedback"
              subtitle="Enable vibration feedback"
              value={appSettings.hapticFeedback}
              onToggle={(value) => handleToggle("hapticFeedback", value)}
              icon="vibration"
            />
            <ToggleItem
              title="Show Tips"
              subtitle="Display helpful tips and tutorials"
              value={appSettings.showTips}
              onToggle={(value) => handleToggle("showTips", value)}
              icon="lightbulb"
            />
          </Card>

          {/* Storage */}
          <Card className="mb-4">
            <Text className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
              Storage
            </Text>
            <ActionItem
              title="Clear Cache"
              subtitle="Free up storage space"
              onPress={handleClearCache}
              icon="delete-sweep"
            />
          </Card>

          {/* Reset */}
          <Card className="mb-4 border-red-100">
            <Text className="text-sm font-bold text-red-500 uppercase tracking-wider mb-3">
              Reset
            </Text>
            <ActionItem
              title="Reset to Default"
              subtitle="Reset all settings to defaults"
              onPress={handleResetApp}
              icon="restore"
              danger
              showArrow={false}
            />
          </Card>

          {/* Save Button */}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
