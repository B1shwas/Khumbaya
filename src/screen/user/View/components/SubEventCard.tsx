import { Ionicons } from "@expo/vector-icons";
import { router, type RelativePathString } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/Events.styles";
import type { SubEvent } from "../types/events";

interface SubEventCardProps {
  subEvent: SubEvent;
}

export const SubEventCard = ({ subEvent }: SubEventCardProps) => {
  const handlePress = () => {
    router.push(
      `/events/subevent-detail?subEventId=${subEvent.id}&eventId=1` as RelativePathString,
    );
  };

  return (
    <TouchableOpacity style={styles.subEventCard} onPress={handlePress}>
      <View style={styles.subEventIcon}>
        <Ionicons name={subEvent.icon as any} size={20} color="#ee2b8c" />
      </View>
      <View style={styles.subEventInfo}>
        <Text style={styles.subEventName}>{subEvent.name}</Text>
        <Text style={styles.subEventDetails}>
          {subEvent.date} • {subEvent.time}
        </Text>
      </View>
      <View style={styles.subEventStats}>
        <Text style={styles.subEventStatLabel}>
          {subEvent.activitiesCount} activities
        </Text>
        <Text style={styles.subEventStatBudget}>{subEvent.budget}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
    </TouchableOpacity>
  );
};
