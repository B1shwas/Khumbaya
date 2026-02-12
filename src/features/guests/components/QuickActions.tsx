// QuickActions Component
// ============================================

import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { QUICK_ACTIONS } from "../constants";

interface QuickActionsProps {
  onActionPress: (actionKey: string) => void;
}

interface QuickActionProps {
  icon: string;
  label: string;
  color: string;
  onPress: () => void;
}

const QuickAction = ({ icon, label, color, onPress }: QuickActionProps) => (
  <TouchableOpacity
    className="items-center"
    onPress={onPress}
    accessibilityLabel={label}
    accessibilityRole="button"
  >
    <View
      className="w-12 h-12 rounded-full items-center justify-center mb-1"
      style={{ backgroundColor: `${color}15` }}
    >
      <Ionicons name={icon as any} size={22} color={color} />
    </View>
    <Text className="text-xs font-medium text-gray-600">{label}</Text>
  </TouchableOpacity>
);

const QuickActions = ({ onActionPress }: QuickActionsProps) => {
  return (
    <View
      className="px-6 py-2 flex-row justify-between items-center"
      accessibilityLabel="Quick actions"
    >
      <Text className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        Actions
      </Text>
      <View className="flex-row items-center gap-4">
        {QUICK_ACTIONS.map((action) => (
          <QuickAction
            key={action.key}
            icon={action.icon}
            label={action.label}
            color={action.color}
            onPress={() => onActionPress(action.key)}
          />
        ))}
      </View>
    </View>
  );
};

export default QuickActions;
