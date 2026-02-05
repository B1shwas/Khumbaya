import { buttonBase } from "@/src/styles/vendorhome-style";
import { TouchableOpacity } from "react-native";
import { Text } from "../ui/Text";

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "outline";
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onPress,
  variant = "primary",
}) => {
  const variantStyles =
    variant === "primary" ? "bg-primary" : "border border-border";

  const textColor =
    variant === "primary" ? "text-text-inverse" : "text-text-primary";

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-1 ${buttonBase} ${variantStyles}`}
    >
      <Text variant="caption" className={textColor}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};
