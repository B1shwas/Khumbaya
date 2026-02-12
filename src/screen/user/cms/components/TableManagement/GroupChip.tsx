import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { GuestGroup } from "../../types/tableManagement";
import { styles } from "../styles/TableManagement.styles";

interface GroupChipProps {
  group: GuestGroup;
  isSelected: boolean;
  onSelect: () => void;
}

export const GroupChip: React.FC<GroupChipProps> = ({
  group,
  isSelected,
  onSelect,
}) => {
  return (
    <TouchableOpacity
      style={[styles.groupChip, isSelected && styles.groupChipSelected]}
      onPress={onSelect}
    >
      <View style={styles.groupChipHeader}>
        <Text style={styles.groupChipName}>{group.name}</Text>
        <View style={styles.groupChipBadge}>
          <Text style={styles.groupChipBadgeText}>{group.totalSize}</Text>
        </View>
      </View>
      <Text style={styles.groupChipMembers}>
        {group.members
          .slice(0, 3)
          .map((m) => m.name.split(" ")[0])
          .join(", ")}
        {group.members.length > 3 && ` +${group.members.length - 3}`}
      </Text>
    </TouchableOpacity>
  );
};
