import EditFamilyModal from "@/src/components/family-imp/EditFamilyModal";
import {
  useDeleteFamily,
  useUpdateFamily,
} from "@/src/features/family/hooks/use-family";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../ui/Text";

export default function FamilyOptionsScreen() {
  const router = useRouter();
  const { familyId, familyName } = useLocalSearchParams<{
    familyId: string;
    familyName: string;
  }>();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [familyNameInput, setFamilyNameInput] = useState(familyName ?? "");

  const { mutate: updateFamily, isPending: isUpdating } = useUpdateFamily();
  const { mutate: deleteFamily, isPending: isDeleting } = useDeleteFamily();

  const handleUpdateFamilyName = () => {
    const nextName = familyNameInput.trim();

    if (!familyId) {
      Alert.alert("Error", "Family id not found");
      return;
    }

    if (!nextName) {
      Alert.alert("Validation", "Family name is required");
      return;
    }

    if (nextName === familyName) {
      setIsEditModalVisible(false);
      return;
    }

    updateFamily(
      { id: Number(familyId), data: { familyName: nextName } },
      {
        onSuccess: () => {
          Alert.alert("Success", "Family name updated");
          setIsEditModalVisible(false);
          router.back();
        },
        onError: (err: any) => {
          const message =
            err?.response?.data?.message || "Failed to update family name";
          Alert.alert("Error", message);
        },
      }
    );
  };

  const handleDeleteFamily = () => {
    if (!familyId) return;

    Alert.alert(
      "Delete Family",
      "Are you sure you want to delete this family? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteFamily(Number(familyId), {
              onSuccess: () => {
                router.replace("/(protected)/(client-tabs)/profile");
              },
              onError: (err: any) => {
                const message =
                  err?.response?.data?.message || "Failed to delete family";
                Alert.alert("Error", message);
              },
            });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Options */}
      <View className="px-4 pt-2 gap-3">
        {/* Edit */}
        <TouchableOpacity
          className="flex-row items-center rounded-2xl bg-gray-50 px-4 py-4"
          onPress={() => {
            setFamilyNameInput(familyName ?? "");
            setIsEditModalVisible(true);
          }}
        >
          <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <Ionicons name="create-outline" size={20} color="#2563eb" />
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-base  text-gray-900" variant="h2">
              Edit Family
            </Text>
            <Text className="text-xs text-gray-500">Change family name</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#a3a3a3" />
        </TouchableOpacity>

        {/* Delete */}
        <TouchableOpacity
          className="flex-row items-center rounded-2xl bg-red-50 px-4 py-4"
          onPress={handleDeleteFamily}
          disabled={isDeleting}
          activeOpacity={isDeleting ? 0.5 : 0.7}
        >
          <View className="h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <Ionicons name="trash-outline" size={20} color="#dc2626" />
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-base font-semibold text-red-600" variant="h2">
              {isDeleting ? "Deleting..." : "Delete Family"}
            </Text>
            <Text className="text-xs text-red-500">
              Remove family permanently
            </Text>
          </View>
          {!isDeleting && (
            <Ionicons name="chevron-forward" size={18} color="#fca5a5" />
          )}
        </TouchableOpacity>
      </View>

      <EditFamilyModal
        visible={isEditModalVisible}
        value={familyNameInput}
        isUpdating={isUpdating}
        onClose={() => setIsEditModalVisible(false)}
        onChangeText={setFamilyNameInput}
        onSave={handleUpdateFamilyName}
      />
    </SafeAreaView>
  );
}
