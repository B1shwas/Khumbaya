import { MaterialIcons } from "@expo/vector-icons";
import { Alert, TouchableOpacity } from "react-native";

type DeleteButtonProps = {
  onPress: () => void;
  disabled?: boolean;
  size?: number;
  color?: string;
  confirmTitle?: string;
  confirmMessage?: string;
};

export default function DeleteButton({
  onPress,
  disabled = false,
  size = 16,
  color = "#ffffff",
  confirmTitle = "Delete Item",
  confirmMessage = "Are you sure you want to delete this item?",
}: DeleteButtonProps) {
  const handlePress = () => {
    Alert.alert(confirmTitle, confirmMessage, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress,
      },
    ]);
  };

  return (
    <TouchableOpacity
      className="absolute top-4 right-4 bg-black/50 rounded-full p-2"
      accessibilityRole="button"
      onPress={handlePress}
      disabled={disabled}
    >
      <MaterialIcons name="delete" size={size} color={color} />
    </TouchableOpacity>
  );
}
