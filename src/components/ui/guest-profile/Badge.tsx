import { Text, View } from "react-native";

type BadgeType = "success" | "warning" | "error" | "default";

interface BadgeProps {
  label: string;
  type?: BadgeType;
  className?: string;
}

export const Badge = ({
  label,
  type = "default",
  className = "",
}: BadgeProps) => {
  const styles: Record<BadgeType, string> = {
    success: "bg-green-100 text-green-700 border-green-200",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
    error: "bg-red-100 text-red-700 border-red-200",
    default: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <View
      className={`px-3 py-1 rounded-full border ${styles[type]} ${className}`}
    >
      <Text className={`text-xs font-semibold ${styles[type].split(" ")[1]}`}>
        {label}
      </Text>
    </View>
  );
};
