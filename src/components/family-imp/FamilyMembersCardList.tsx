import { FamilyMember } from "@/src/features/family/api/family.service";
import { View } from "react-native";
import { Text } from "../ui/Text";

type FamilyMembersCardListProps = {
  members: FamilyMember[];
};

export default function FamilyMembersCardList({
  members,
}: FamilyMembersCardListProps) {
  if (members.length === 0) {
    return (
      <View className="bg-white rounded-xl p-4 mb-3 border border-gray-200">
        <Text className="text-sm text-gray-600">No family members found yet.</Text>
      </View>
    );
  }

  return (
    <>
      {members.map((member) => (
        <View
          key={member.id}
          className="bg-white rounded-xl p-4 mb-3 border border-gray-200"
        >
          <Text className="text-base font-semibold text-gray-800">
            {member.name}
          </Text>
          <Text className="text-sm text-gray-600 mt-1">{member.email}</Text>
          <Text className="text-sm text-gray-600 mt-1">
            Relation: {member.relation}
          </Text>
        </View>
      ))}
    </>
  );
}
