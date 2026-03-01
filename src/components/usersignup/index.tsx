import { Text } from "@/src/components/ui/Text";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Letstart from "./Letstart";

export type SignupFormData = {
  username: string;
  email: string;
  phone: string;
  password: string;
};

export default function UserSignupFlow() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupFormData>({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const updateFormData = (updates: Partial<SignupFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light">
      <View className="px-4 pt-2">
        <View className="flex-row items-center justify-between pb-2">
          <TouchableOpacity
            onPress={handleBack}
            accessibilityRole="button"
            className="h-10 w-10 items-center justify-center"
          >
            <MaterialIcons
              name="arrow-back-ios-new"
              size={22}
              color="#181114"
            />
          </TouchableOpacity>
          <Text className="text-lg font-jakarta-bold text-text-light flex-1 text-center pr-10">
            Sign Up
          </Text>
          <View className="w-10" />
        </View>
      </View>

      <View className="flex-1">
        <Letstart data={formData} onChange={updateFormData} />
      </View>
    </SafeAreaView>
  );
}
