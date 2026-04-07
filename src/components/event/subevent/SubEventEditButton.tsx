import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

type SubEventEditButtonProps = {
  eventId?: string;
  subEventId?: string;
};

export default function SubEventEditButton({
  eventId,
  subEventId,
}: SubEventEditButtonProps) {
  const router = useRouter();

  if (!eventId || !subEventId) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={() =>
        router.push(
          `/(protected)/(client-stack)/events/${eventId}/(organizer)/(subevent)/${subEventId}/edit-sub-event`
        )
      }
      style={{ paddingHorizontal: 12 }}
      activeOpacity={0.75}
    >
      <MaterialIcons name="edit" size={22} color="#1f2937" />
    </TouchableOpacity>
  );
}
