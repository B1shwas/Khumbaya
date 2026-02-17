import { useState } from "react";
import { Alert, Pressable, Switch, Text, View } from "react-native";

export default function AppSettingsScreen() {
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
      <View className="bg-white p-6">
        <Text className="text-2xl font-bold text-gray-900 mb-6">
          App Settings
        </Text>

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
              Show helpful tips and tutorials
            </Text>
          </View>
          <Switch
            value={appSettings.showTips}
            onValueChange={(value) => handleToggle("showTips", value)}
            trackColor={{ false: "#d1d5db", true: "#ec4899" }}
            thumbColor="#fff"
          />
        </View>

        {/* Storage */}
        <Text className="text-lg font-semibold text-gray-900 mb-4 mt-8">
          Storage
        </Text>

        <Pressable
          className="bg-gray-50 border border-gray-200 rounded-lg py-4 px-4 mb-6"
          onPress={handleClearCache}
        >
          <Text className="text-base font-semibold text-gray-900">
            Clear Cache
          </Text>
        </Pressable>

        {/* Reset */}
        <Pressable
          className="bg-red-50 border border-red-200 rounded-lg py-4 px-4"
          onPress={handleResetApp}
        >
          <Text className="text-red-600 font-semibold text-center">
            Reset to Default
          </Text>
        </Pressable>
      </View>

      {/* Backend integration comments */}
      {/* 
        // Backend integration example for settings
        import { updateAppSettings } from '@/src/api/settings';
        
        const handleToggle = async (field: string, value: boolean) => {
          try {
            const response = await updateAppSettings({ [field]: value });
            if (response.success) {
              setAppSettings(prev => ({ ...prev, [field]: value }));
            } else {
              Alert.alert('Error', response.message);
            }
          } catch (error) {
            Alert.alert('Error', 'Failed to update settings');
          }
        };
      */}
    </View>
  );
}
