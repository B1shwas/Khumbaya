import GuestEventDetails from "@/src/screen/user/View/GuestEventDetails";
import { useLocalSearchParams } from "expo-router";
export default function EventDetailScreen() {
  const params = useLocalSearchParams();
  const isInvited = params.isInvited === "true";
  return <GuestEventDetails />;
}
