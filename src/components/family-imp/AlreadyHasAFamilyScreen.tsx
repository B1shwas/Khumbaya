import { FamilyMember } from "@/src/features/family/api/family.service";
import { useGetFamilyMembers } from "@/src/features/family/hooks/use-family";
import { ScrollView, View } from "react-native";
import AddFamilyMemberForm from "./AddFamilyMemberForm";
import FamilyMembersCardList from "./FamilyMembersCardList";
import { Text } from "../ui/Text";

type AlreadyHasAFamilyScreenProps = {
  id: number;
};

export default function AlreadyHasAFamilyScreen({
  id,
}: AlreadyHasAFamilyScreenProps) {
  const { data: members = [], isLoading, error } = useGetFamilyMembers(id) as {
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
    <ScrollView className="flex-1 bg-gray-100 px-4 py-3">
      <View className="mb-2">
        <Text className="text-lg font-bold text-gray-800">Family Members</Text>
        <Text className="text-sm text-gray-500 mt-1">
          View current members and add new ones.
        </Text>
      </View>

      <FamilyMembersCardList members={members} />
      <AddFamilyMemberForm familyId={id} />
    </ScrollView>
  );
}
