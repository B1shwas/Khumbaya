import { KeyboardAvoidingView, Platform, View } from "react-native";
import { Text } from "../ui/Text";
import CreateFamilyForm from "./CreateFamilyForm";

export default function CreateFamilyScreen() {
  return (
    <View className="flex-1">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.select({ ios: "padding", android: "height" })}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        <View className="flex-1 px-6 pt-10">
          <Text className="text-2xl font-jakarta-bold text-text-primary mb-2">
            What&apos;s your family name?
          </Text>
          <Text className="text-sm text-text-tertiary mb-8">
            This helps us group your members together for bookings and events.
          </Text>

          <CreateFamilyForm />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
