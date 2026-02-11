import { Text } from "@/src/components/ui/Text";
import { EventDetail } from "@/src/screen/user/View/index";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function EventDetailScreen() {
    const eventId = useLocalSearchParams<{ eventId?: string }>().eventId;
    return <>
    <EventDetail eventId={eventId}></EventDetail>

    </>
}

