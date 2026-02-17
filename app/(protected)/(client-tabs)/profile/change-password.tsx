import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

export default function ChangePasswordScreen() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTogglePassword = (field: "current" | "new" | "confirm") => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChangePassword = () => {
    // Validate inputs
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    if (formData.newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }

    // TODO: Implement backend integration
    // await changePassword(formData.currentPassword, formData.newPassword);

    Alert.alert("Success", "Password changed successfully!");
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white p-6">
        <Text className="text-2xl font-bold text-gray-900 mb-6">
          Change Password
        </Text>

        {/* Current Password */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Current Password
          </Text>
          <View className="relative">
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 pr-12"
              value={formData.currentPassword}
              onChangeText={(text) =>
                handleInputChange("currentPassword", text)
              }
              placeholder="Enter current password"
              secureTextEntry={!showPassword.current}
            />
            <Pressable
              className="absolute right-4 top-1/2 -translate-y-1/2"
              onPress={() => handleTogglePassword("current")}
            >
              <Text className="text-gray-500 text-sm">
                {showPassword.current ? "Hide" : "Show"}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* New Password */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            New Password
          </Text>
          <View className="relative">
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 pr-12"
              value={formData.newPassword}
              onChangeText={(text) => handleInputChange("newPassword", text)}
              placeholder="Enter new password"
              secureTextEntry={!showPassword.new}
            />
            <Pressable
              className="absolute right-4 top-1/2 -translate-y-1/2"
              onPress={() => handleTogglePassword("new")}
            >
              <Text className="text-gray-500 text-sm">
                {showPassword.new ? "Hide" : "Show"}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Confirm Password */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Confirm New Password
          </Text>
          <View className="relative">
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 pr-12"
              value={formData.confirmPassword}
              onChangeText={(text) =>
                handleInputChange("confirmPassword", text)
              }
              placeholder="Confirm new password"
              secureTextEntry={!showPassword.confirm}
            />
            <Pressable
              className="absolute right-4 top-1/2 -translate-y-1/2"
              onPress={() => handleTogglePassword("confirm")}
            >
              <Text className="text-gray-500 text-sm">
                {showPassword.confirm ? "Hide" : "Show"}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Change Password Button */}
        <Pressable
          className="bg-pink-500 rounded-lg py-4 items-center mt-4"
          onPress={handleChangePassword}
        >
          <Text className="text-white font-semibold text-lg">
            Change Password
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

// Backend integration example
/* 
import { changePassword } from '@/src/api/auth';

const handleChangePassword = async () => {
  try {
    const response = await changePassword(formData.currentPassword, formData.newPassword);
    if (response.success) {
      Alert.alert('Success', 'Password changed successfully!');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } else {
      Alert.alert('Error', response.message);
    }
  } catch (error) {
    Alert.alert('Error', 'Failed to change password');
  }
};
*/
