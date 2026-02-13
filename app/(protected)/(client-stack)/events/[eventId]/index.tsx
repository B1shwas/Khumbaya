import { EventDetail } from "@/src/screen/user/View/index";
import { useLocalSearchParams } from "expo-router";
export default function EventDetailScreen() {
    const params = useLocalSearchParams();
    const isInvited = params.isInvited === "true";
    return <EventDetail isInvitedGuest={isInvited} />;
}
