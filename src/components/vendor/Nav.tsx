import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

type NavProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  active?: boolean;
};

export default function Nav({ icon, label, active = false }: NavProps) {
  return (
    <TouchableOpacity className="items-center">
      <MaterialIcons
        name={icon}
        size={24}
        color={active ? "#ee2b8c" : "gray"}
      />
      <Text
        className={`text-xs ${
          active ? "text-pink-500 font-bold" : "text-gray-400"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
