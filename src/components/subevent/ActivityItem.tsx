import { SelectedActivity, TemplateActivity } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface ActivityItemProps {
  activity: TemplateActivity;
  index: number;
  isSelected: boolean;
  selectedData?: SelectedActivity;
  onToggle: (activity: TemplateActivity) => void;
  onTimeChange: (activityId: string, time: string) => void;
  onBudgetChange: (activityId: string, budget: string) => void;
}

export default function ActivityItem({
  activity,
  index,
  isSelected,
  selectedData,
  onToggle,
  onTimeChange,
  onBudgetChange,
}: ActivityItemProps) {
  return (
    <TouchableOpacity
      style={[styles.activityItem, isSelected && styles.activityItemSelected]}
      onPress={() => onToggle(activity)}
    >
      <View style={styles.activityHeader}>
        <View
          style={[
            styles.activityCheckbox,
            isSelected && styles.activityCheckboxSelected,
          ]}
        >
          {isSelected && <Ionicons name="checkmark" size={14} color="white" />}
        </View>
        <View style={styles.activityInfo}>
          <Text
            style={[
              styles.activityTitle,
              isSelected && styles.activityTitleSelected,
            ]}
          >
            {index + 1}. {activity.title}
          </Text>
          <Text style={styles.activityDescription}>{activity.description}</Text>
        </View>
      </View>

      {isSelected && (
        <View style={styles.activityInputsContainer}>
          <View style={styles.activityInputRow}>
            <Ionicons name="time-outline" size={16} color="#6B7280" />
            <TextInput
              style={styles.activityInput}
              placeholder="Time (e.g., 2:00 PM)"
              placeholderTextColor="#9CA3AF"
              value={selectedData?.time || ""}
              onChangeText={(text) => onTimeChange(activity.id, text)}
            />
          </View>
          <View style={styles.activityInputRow}>
            <Ionicons name="wallet-outline" size={16} color="#6B7280" />
            <TextInput
              style={styles.activityInput}
              placeholder="Budget (e.g., $500)"
              placeholderTextColor="#9CA3AF"
              value={selectedData?.budget || ""}
              onChangeText={(text) => onBudgetChange(activity.id, text)}
              keyboardType="numeric"
            />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  activityItem: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "transparent",
    marginBottom: 8,
  },
  activityItemSelected: {
    backgroundColor: "#fceaf4",
    borderColor: "#ee2b8c",
  },
  activityHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  activityCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  activityCheckboxSelected: {
    backgroundColor: "#ee2b8c",
    borderColor: "#ee2b8c",
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "#181114",
  },
  activityTitleSelected: {
    color: "#ee2b8c",
  },
  activityDescription: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  activityInputsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  activityInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  activityInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 13,
    color: "#181114",
  },
});
