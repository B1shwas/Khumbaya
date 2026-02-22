import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SelectedSubEvent } from "../../types";
import SwipeableRow from "./SwipeableRow";

interface SelectedSubEventCardProps {
  subEvent: SelectedSubEvent;
  onPress: () => void;
  onDelete: () => void;
  onEdit?: () => void;
}

export default function SelectedSubEventCard({
  subEvent,
  onPress,
  onDelete,
  onEdit,
}: SelectedSubEventCardProps) {
  return (
    <SwipeableRow onDelete={onDelete} onEdit={onEdit}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={subEvent.template.icon as any}
              size={24}
              color="#ee2b8c"
            />
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.title}>{subEvent.template.name}</Text>
            <Text style={styles.subtitle}>
              {subEvent.date || "Tap to set details"}
            </Text>
          </View>

          <View style={styles.chevron}>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </View>
        </View>

        {/* Quick Info */}
        <View style={styles.detailsContainer}>
          {subEvent.theme && (
            <View style={styles.detailItem}>
              <Ionicons
                name="color-palette-outline"
                size={14}
                color="#6B7280"
              />
              <Text style={styles.detailText}>{subEvent.theme}</Text>
            </View>
          )}
          {subEvent.budget && (
            <View style={styles.detailItem}>
              <Ionicons name="wallet-outline" size={14} color="#6B7280" />
              <Text style={styles.detailText}>{subEvent.budget}</Text>
            </View>
          )}
          <View style={styles.detailItem}>
            <Ionicons
              name="checkmark-circle-outline"
              size={14}
              color="#6B7280"
            />
            <Text style={styles.detailText}>
              {subEvent.activities.length} activities
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </SwipeableRow>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#ee2b8c",
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FDF2F8",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: "#181114",
  },
  subtitle: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  chevron: {
    padding: 4,
  },
  detailsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
    gap: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 13,
    color: "#6B7280",
  },
});
