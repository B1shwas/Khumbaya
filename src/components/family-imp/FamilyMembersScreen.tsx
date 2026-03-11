import AlreadyHasAFamilyScreen from "@/src/components/family-imp/AlreadyHasAFamilyScreen";
import CreateFamilyScreen from "@/src/components/family-imp/CreateFamilyScreen";
import EditFamilyModal from "@/src/components/family-imp/EditFamilyModal";
import FamilyOptionsMenu from "@/src/components/family-imp/FamilyOptionsMenu";
import { Text } from "@/src/components/ui/Text";
import {
  useDeleteFamily,
  useGetFamilyByUserId,
  useUpdateFamily,
} from "@/src/features/family/hooks/use-family";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, TouchableOpacity } from "react-native";

export default function FamilyMembersScreen() {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [familyNameInput, setFamilyNameInput] = useState("");

  const { isLoading, data, error } = useGetFamilyByUserId();
  const { mutate: updateFamily, isPending: isUpdating } = useUpdateFamily();
  const { mutate: deleteFamily, isPending: isDeleting } = useDeleteFamily();

  const family = data?.data ?? data;
  const familyId = family?.id;
  const familyName = family?.familyName ?? "";

  useEffect(() => {
    setFamilyNameInput(familyName);
  }, [familyName]);

  const closeAllOverlays = () => {
    setIsMenuVisible(false);
    setIsEditModalVisible(false);
  };

  const handleEditFamily = () => {
    setIsMenuVisible(false);
    setFamilyNameInput(familyName);
    setIsEditModalVisible(true);
  };

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
      { id: familyId, data: { familyName: nextName } },
      {
        onSuccess: () => {
          Alert.alert("Success", "Family name updated");
          setIsEditModalVisible(false);
        },
        onError: (updateError: any) => {
          const message =
            updateError?.response?.data?.message ||
            "Failed to update family name";
          Alert.alert("Error", message);
        },
      }
    );
  };

  const handleDeleteFamily = () => {
    setIsMenuVisible(false);

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
            deleteFamily(familyId, {
              onSuccess: () => {
                Alert.alert("Deleted", "Family deleted successfully");
                closeAllOverlays();
              },
              onError: (deleteError: any) => {
                const message =
                  deleteError?.response?.data?.message ||
                  "Failed to delete family";
                Alert.alert("Error", message);
              },
            });
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <Text>Loading</Text>;
  }

  if (error) {
    return <Text>Cannot fetch the family</Text>;
  }

  if (!familyId) {
    return <CreateFamilyScreen />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: familyName || "Family Members",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setIsMenuVisible(true)}
              className="p-1"
              accessibilityRole="button"
              accessibilityLabel="Open family options"
              disabled={isDeleting || isUpdating}
            >
              <Ionicons name="menu-outline" size={24} color="#1f2937" />
            </TouchableOpacity>
          ),
        }}
      />

      <AlreadyHasAFamilyScreen id={familyId} />

      <FamilyOptionsMenu
        visible={isMenuVisible}
        isDeleting={isDeleting}
        onClose={() => setIsMenuVisible(false)}
        onEdit={handleEditFamily}
        onDelete={handleDeleteFamily}
      />

      <EditFamilyModal
        visible={isEditModalVisible}
        value={familyNameInput}
        isUpdating={isUpdating}
        onClose={() => setIsEditModalVisible(false)}
        onChangeText={setFamilyNameInput}
        onSave={handleUpdateFamilyName}
      />
    </>
  );
}
