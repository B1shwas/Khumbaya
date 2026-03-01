import AlreadyHasAFamilyScreen from "@/src/components/family-imp/AlreadyHasAFamilyScreen";
import CreateFamilyScreen from "@/src/components/family-imp/CreateFamilyScreen";
import { Text } from "@/src/components/ui/Text";
import { useGetFamilyByUserId } from "@/src/features/family/hooks/use-family";

export default function CreateFamilyMemberScreen() {
  const { isLoading, data, error } = useGetFamilyByUserId();
  const family = data?.data ?? data;
  const familyId = family?.id;

  if (isLoading) {
    return <Text>Loading</Text>;
  }

  if (error) {
    return <Text>Cannot fetch the family</Text>;
  }

  if (!familyId) {
    return <CreateFamilyScreen />;
  }

  return <AlreadyHasAFamilyScreen id={familyId} />;
}
