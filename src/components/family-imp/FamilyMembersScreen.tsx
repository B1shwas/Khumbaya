import AlreadyHasAFamilyScreen from "@/src/components/family-imp/AlreadyHasAFamilyScreen";
import CreateFamilyScreen from "@/src/components/family-imp/CreateFamilyScreen";
import { Text } from "@/src/components/ui/Text";
import { useGetFamilyByUserId } from "@/src/features/family/hooks/use-family";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { TouchableOpacity } from "react-native";

export default function FamilyMembersScreen() {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const { isLoading, data, error, refetch } = useGetFamilyByUserId();
  const router = useRouter();

  const family = data?.data ?? data;
  const familyId = family?.id;
  const familyName = family?.familyName ?? "";

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      await refetch();

      if (familyId) {
        await queryClient.refetchQueries({
          queryKey: ["family-members", familyId],
          exact: true,
        });
      }
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoading) {
    return <Text>Loading</Text>;
  }

  if (error) {
    return <Text>Cannot fetch the family</Text>;
  }

  if (!familyId) {
    return (
      <>
        <Stack.Screen
          options={{
            headerTitle: "Family",
            headerTitleStyle: { fontFamily: "PlusJakartaSans-Bold" },
          }}
        />
        <CreateFamilyScreen />
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: familyName || "Family",
          headerTitleAlign: "center",
          headerTitleStyle: { fontFamily: "PlusJakartaSans-Bold" },
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(protected)/(client-tabs)/profile/family-options",
                  params: { familyId, familyName },
                })
              }
              className="p-1"
              accessibilityRole="button"
              accessibilityLabel="Open family options"
            >
              <Ionicons name="menu-outline" size={24} color="#1f2937" />
            </TouchableOpacity>
          ),
        }}
      />

      <AlreadyHasAFamilyScreen
        id={familyId}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </>
  );
}
