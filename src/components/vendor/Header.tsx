import { Text } from "@/src/components/ui/Text";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

export const Header = () => {
  return (
    <View className="flex-row items-center justify-between p-4 pb-2">
      <View className="flex-row items-center gap-3">
        <View className="relative">
          <Image
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAATjU_kQZjoZfq7eWB0ne6nC7b76Qgtzt04G3YTykDIhYR9-Dj4GvGli1Poeg057UncNIECqkKKgHIBfL5GeEV5EPPKZaUqr5zKsV9ZlAK7h9bigg8u-oKxxJ5BAs4ELKPygJOPsW8CAu5A8cqZG_bTZwdyec3-x5AzBsXCxn2tBJHXr-w6QWVWg1GsraHCU2KqVBJWltTZwIaX1lIIcUn8iilpVHQLmK8kggdMakYZCldCM7DXBbrLhe7EX_rdDTXywSDxee3Oio",
            }}
            className="w-10 h-10 rounded-full border-2 border-background"
          />
          <View className="absolute bottom-0 right-0 w-3 h-3 bg-success-500 rounded-full border-2 border-background" />
        </View>

        <View>
          <Text variant="caption" className="text-text-secondary">
            Welcome back,
          </Text>
          <Text variant="h1" className="text-lg text-text-primary">
            Elite Catering
          </Text>
        </View>
      </View>

      <TouchableOpacity className="w-10 h-10 rounded-full bg-background items-center justify-center shadow-sm relative">
        <MaterialIcons name="notifications" size={24} />
        <View className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
      </TouchableOpacity>
    </View>
  );
};
