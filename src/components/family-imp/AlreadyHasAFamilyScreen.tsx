import { FamilyMember } from "@/src/features/family/api/family.service";
import { useGetFamilyMembers } from "@/src/features/family/hooks/use-family";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { Text } from "../ui/Text";
import AddFamilyMemberForm from "./AddFamilyMemberForm";
import FamilyMembersCardList from "./FamilyMembersCardList";

type AlreadyHasAFamilyScreenProps = {
  id: number;
};

export default function AlreadyHasAFamilyScreen({
  id,
}: AlreadyHasAFamilyScreenProps) {
  const {
    data: members = [],
    isLoading,
    error,
  } = useGetFamilyMembers(id) as {
    data: FamilyMember[];
    isLoading: boolean;
    error: unknown;
  };

  if (isLoading) {
    return <Text>Loading family members...</Text>;
  }

  if (error) {
    return <Text>Unable to fetch family members</Text>;
  }

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.select({ ios: "padding", android: "height" })}
      keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
    >
      <ScrollView
        className="flex-1 bg-gray-100"
        contentContainerClassName="px-4 pt-3 pb-10"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-2 flex flex-row justify-between px-2">
          <Text className="text-xl font-bold text-gray-800">
            Family Members
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            {members.length} added
          </Text>
        </View>

        <FamilyMembersCardList members={members} />
        <AddFamilyMemberForm familyId={id} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
