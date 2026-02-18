import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfileScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "Sarah Mitchell",
    email: "sarah.mitchell@example.com",
    phone: "+1 234 567 8900",
    bio: "Professional wedding planner with 5+ years of experience creating unforgettable events.",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // TODO: Implement backend integration for updating profile
    // await updateProfile(formData);

    Alert.alert("Success", "Profile updated successfully!");
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
          <Text className="text-lg font-bold text-gray-900">Edit Profile</Text>
          <View className="size-10" />
        </View>

        <View className="bg-white p-6">
          {/* Name */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
              value={formData.name}
              onChangeText={(text) => handleInputChange("name", text)}
              placeholder="Enter your full name"
            />
          </View>

          {/* Email */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
              value={formData.email}
              onChangeText={(text) => handleInputChange("email", text)}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Phone */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
              value={formData.phone}
              onChangeText={(text) => handleInputChange("phone", text)}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>

          {/* Bio */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Bio
            </Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 h-24"
              value={formData.bio}
              onChangeText={(text) => handleInputChange("bio", text)}
              placeholder="Tell us about yourself"
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Save Button */}
          <Pressable
            className="bg-pink-500 rounded-lg py-4 items-center mt-4"
            onPress={handleSave}
          >
            <Text className="text-white font-semibold text-lg">
              Save Changes
            </Text>
          </Pressable>
        </View>

        {/* Backend integration comments */}
        {/* 
          // Backend integration example
          import { updateProfile } from '@/src/api/profile';
          
          const handleSave = async () => {
            try {
              const response = await updateProfile(formData);
              if (response.success) {
                Alert.alert('Success', 'Profile updated successfully!');
              } else {
                Alert.alert('Error', response.message);
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to update profile');
            }
          };
        */}
      </SafeAreaView>
    </View>
  );
}
