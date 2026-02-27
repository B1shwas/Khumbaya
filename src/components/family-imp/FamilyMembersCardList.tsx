import { FamilyMember } from "@/src/features/family/api/family.service";
import { Image, View } from "react-native";
import { Text } from "../ui/Text";

type FamilyMembersCardListProps = {
  members: FamilyMember[];
};

export default function FamilyMembersCardList({
  members,
}: FamilyMembersCardListProps) {
  const avatarUri =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBBLor0Omw5GQnEDi4KhI8VPI30Ouh9jQ4b2wfQNJ51iL5aY1qdsn-7m3BYgtHMSM-HvZ0pe5d9vhNKO6rKEmXy3926x1LY3qxAKIikj3s5DFv8IQPuKi1NFQ3JJ_V8k7VNrTxdqpelZB_pyj2bB5N0Ruw8KJjCdaLSk2729h9Q7ptpMuq2EVE4SIuB_ilJ6_N2sHshxtygeBbLAzGKtwkcVQJcIHZwzMBb7ZjmJixXMO7NFxT3yf8wxifpl_E78wEtZ7i9L6K89lM";

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
      {members.map((member) => (
        <View
          key={member.id}
          className="bg-white rounded-2xl p-4 mb-3 border border-gray-200 flex-row items-center gap-6"
        >
          <Image
            source={{ uri: avatarUri }}
            className="h-16 w-16 rounded-full"
            resizeMode="cover"
          />

          <View className="flex-1">
            <Text
              className="text-base font-bold text-gray-800"
              numberOfLines={1}
            >
              {member.username}
            </Text>

            <Text
              className="text-sm text-gray-600 mt-1 capitalize"
              numberOfLines={1}
            >
              {member.relation} • Veg
            </Text>
          </View>
        </View>
      ))}
    </>
  );
}
