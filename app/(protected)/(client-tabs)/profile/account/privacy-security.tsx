import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Switch, Text, View } from "react-native";

export default function PrivacySecurityScreen() {
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

  const router = useRouter();

  const handleChangePassword = () => {
    router.push({ pathname: "/profile/account/change-password" });
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
      <View className="bg-white p-6">
        <Text className="text-2xl font-bold text-gray-900 mb-6">
          Privacy & Security
        </Text>

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
            onValueChange={(value) => handleToggle("showProfilePublic", value)}
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
              Add extra security to your account
            </Text>
          </View>
          <Switch
            value={privacySettings.enableTwoFactor}
            onValueChange={(value) => handleToggle("enableTwoFactor", value)}
            trackColor={{ false: "#d1d5db", true: "#ec4899" }}
            thumbColor="#fff"
          />
        </View>

        {/* Change Password */}
        <Pressable
          className="bg-gray-50 border border-gray-200 rounded-lg py-4 px-4 mb-6"
          onPress={handleChangePassword}
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-base font-semibold text-gray-900">
                Change Password
              </Text>
              <Text className="text-sm text-gray-500">
                Update your password
              </Text>
            </View>
            <Text className="text-pink-500 font-semibold">Change</Text>
          </View>
        </Pressable>

        {/* Analytics */}
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-base font-semibold text-gray-900">
              Analytics
            </Text>
            <Text className="text-sm text-gray-500">
              Help improve our services
            </Text>
          </View>
          <Switch
            value={privacySettings.allowAnalytics}
            onValueChange={(value) => handleToggle("allowAnalytics", value)}
            trackColor={{ false: "#d1d5db", true: "#ec4899" }}
            thumbColor="#fff"
          />
        </View>

        {/* Delete Account */}
        <Pressable
          className="bg-red-50 border border-red-200 rounded-lg py-4 px-4"
          onPress={handleDeleteAccount}
        >
          <Text className="text-red-600 font-semibold text-center">
            Delete Account
          </Text>
        </Pressable>
      </View>

      {/* Backend integration comments */}
      {/* 
        // Backend integration example for change password
        import { changePassword } from '@/src/api/auth';
        
        const handleChangePassword = async () => {
          try {
            const response = await changePassword(oldPassword, newPassword);
            if (response.success) {
              Alert.alert('Success', 'Password changed successfully!');
            } else {
              Alert.alert('Error', response.message);
            }
          } catch (error) {
            Alert.alert('Error', 'Failed to change password');
          }
        };
      */}
    </View>
  );
}
