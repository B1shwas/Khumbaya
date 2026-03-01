import { FamilyMember } from "@/src/features/family/api/family.service";
import { useGetFamilyMembers } from "@/src/features/family/hooks/use-family";
import { ScrollView, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
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

  if (isLoading) return <Text>Loading family members...</Text>;
  if (error) return <Text>Unable to fetch family members</Text>;

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: "#f3f4f6" }}
      contentContainerStyle={{
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 50,
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={180}
      scrollEnabled={false}
    >
      <View className="flex-row justify-between items-center px-2 mb-2">
        <Text className="text-xl font-bold text-gray-800">Family Members</Text>
        <Text className="text-sm text-gray-500">{members.length} added</Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <FamilyMembersCardList members={members} />
      </ScrollView>

      <AddFamilyMemberForm familyId={id} />
    </KeyboardAwareScrollView>
  );
}
