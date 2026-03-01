import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

interface SwipeableRowProps {
  children: ReactNode;
  onDelete?: () => void;
  onEdit?: () => void;
  deleteLabel?: string;
  editLabel?: string;
}

export default function SwipeableRow({
  children,
  onDelete,
  onEdit,
  deleteLabel = "Delete",
  editLabel = "Edit",
}: SwipeableRowProps) {
  const handleDelete = () => {
    if (onDelete) {
      Alert.alert(
        "Remove Sub-Event",
        "Are you sure you want to remove this sub-event?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Remove",
            style: "destructive",
            onPress: onDelete,
          },
        ]
      );
    }
  };

  const renderRightActions = () => (
    <View style={styles.actionsContainer}>
      {onEdit && (
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={onEdit}
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
        </TouchableOpacity>
      )}
      {onDelete && (
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      overshootRight={false}
      rightThreshold={40}
    >
      {children}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 64,
    height: "100%",
  },
  editButton: {
    backgroundColor: "#3B82F6",
  },
  deleteButton: {
    backgroundColor: "#EF4444",
  },
});
