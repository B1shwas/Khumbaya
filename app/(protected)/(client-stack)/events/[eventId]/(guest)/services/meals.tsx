import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function MealsPage() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams<{ eventId: string }>();

  return (
    <SafeAreaView className="flex-1 bg-background-light" edges={["top"]}>
     <Text>  Melas</Text>
    </SafeAreaView>
  );
}
