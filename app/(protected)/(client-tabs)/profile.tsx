import { Text } from "@/src/components/ui/Text";
import { useAuth } from "@/src/store/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { Pressable, View } from "react-native";

export default function ProfileScreen() {
  const [logginOut, setLoggingOut] = useState(false);
const {logout}  = useAuth();
  if (logginOut) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-lg text-gray-600">Logging out...</Text>
      </View>
    );
  }
  return (
    <View className="flex-1 items-center justify-center bg-gray-50">
      <Text className="text-2xl font-bold">Profile</Text>
      <Text className="text-gray-600 mt-2">Coming soon...</Text>
      <Pressable onPress={() => {
        const storageKey = "auth_user";
        AsyncStorage.removeItem(storageKey).then(() => {;
          setLoggingOut(true);
          logout();
          
       
        
      });
      }}>
        <View>
          <Text>Logout Bro</Text>
        </View>
      </Pressable>
    </View>
  );
}
