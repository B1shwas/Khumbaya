import { FamilyMember } from "@/src/features/family/api/family.service";
import { useDeleteFamilyMember } from "@/src/features/family/hooks/use-family";
import { useAuthStore } from "@/src/store/AuthStore";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Modal, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AvatarPicker from "../ui/AvatarPicker";
import { Text } from "../ui/Text";
import AddFamilyMemberForm from "./AddFamilyMemberForm";

type FamilyMembersCardListProps = {
  members: FamilyMember[];
  familyId: number;
};

export default function FamilyMembersCardList({
  members,
  familyId,
}: FamilyMembersCardListProps) {
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const { user } = useAuthStore();

  const selfItem = members.find((i) => i.id === user?.id);
  const sortedArrayWithCreatorAtTop = [
    ...(selfItem ? [selfItem] : []),
    ...members.filter((i) => i.relation?.toLowerCase() !== "self"),
  ];

  const { mutate: deleteMember, isPending: isDeleting } =
    useDeleteFamilyMember();

  const handleDeletePress = (member: FamilyMember) => {
    const memberId = Number(member.id);

    console.log(memberId);

    Alert.alert(
      "Delete Member",
      `Are you sure you want to delete ${member.username}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteMember(
              { familyId, memberId },
              {
                onSuccess: () => {
                  Alert.alert("Success", "Member deleted successfully");
                },
                onError: (error: any) => {
                  const message =
                    error?.response?.data?.message || "Failed to delete member";
                  Alert.alert("Error", message);
                },
              }
            );
          },
        },
      ]
    );
  };

  const handleEditSuccess = () => {
    setEditingMember(null);
    setShowAddModal(false);
  };

  const handleAddSuccess = () => {
    setShowAddModal(false);
  };

  if (members.length === 0) {
    return (
      <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-200">
        <Text className="text-sm text-gray-600">
          No family members found yet.
        </Text>
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => setShowAddModal(true)}
        className="bg-primary/10 border border-primary/30 rounded-2xl p-4 flex-row items-center justify-center gap-2 mb-4"
      >
        <Ionicons name="add-circle" size={24} color="#4F46E5" />
        <Text className="text-primary font-semibold">Add New Member</Text>
      </TouchableOpacity>

      {/* Member Cards */}
      {sortedArrayWithCreatorAtTop.map((member, index) => (
        <View
        key={index}
          className="bg-white rounded-2xl p-4 mb-3 border border-gray-200 flex-row items-center gap-4"
        >
          <AvatarPicker
            name={member.username}
            size="small"
            showEditButton={false}
            onPick={() => {}}
          />

          <View className="flex-1">
            <Text
              className="text-base text-gray-800"
              variant="h1"
              numberOfLines={1}
            >
              {member.username}
            </Text>

            <Text
              className="text-sm text-gray-600 mt-0.5 capitalize"
              numberOfLines={1}
            >
              {member.relation}
              {member.foodPreference
                ? ` • ${member.foodPreference}`
                : undefined}
            </Text>
          </View>

          {/* Action Buttons - hide for self member */}
          {member.id !== user?.id && (
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setEditingMember(member)}
                className="p-2 bg-blue-50 rounded-full"
                disabled={isDeleting}
              >
                <Ionicons name="pencil" size={18} color="#2563eb" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDeletePress(member)}
                className="p-2 bg-red-50 rounded-full"
                disabled={isDeleting}
              >
                <Ionicons name="trash-outline" size={18} color="#dc2626" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}

      {/* Add Member Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddModal(false)}
      >
        <SafeAreaView className="flex-1 bg-gray-50" edges={["top", "bottom"]}>
          <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-200">
            <Text className="text-lg font-bold text-gray-800">
              Add New Member
            </Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Ionicons name="close" size={28} color="#374151" />
            </TouchableOpacity>
          </View>
          <View className="p-4">
            <AddFamilyMemberForm
              familyId={familyId}
              onSuccess={handleAddSuccess}
            />
          </View>
        </SafeAreaView>
      </Modal>

      {/* Edit Member Modal */}
      <Modal
        visible={!!editingMember}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setEditingMember(null)}
      >
        <SafeAreaView className="flex-1 bg-gray-50" edges={["top", "bottom"]}>
          <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-200">
            <Text className="text-lg font-bold text-gray-800">Edit Member</Text>
            <TouchableOpacity onPress={() => setEditingMember(null)}>
              <Ionicons name="close" size={28} color="#374151" />
            </TouchableOpacity>
          </View>
          <View className="p-4">
            {editingMember && (
              <AddFamilyMemberForm
                familyId={familyId}
                memberId={editingMember.id}
                initialData={editingMember}
                onSuccess={handleEditSuccess}
              />
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}
