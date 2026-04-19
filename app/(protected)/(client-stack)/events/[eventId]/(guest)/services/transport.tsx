import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function TransportPage() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams<{ eventId: string }>();

  return (
    <SafeAreaView className="flex-1 bg-background-light" edges={["top"]}>
      <Text> Transport</Text>
    </SafeAreaView>
  );
}
