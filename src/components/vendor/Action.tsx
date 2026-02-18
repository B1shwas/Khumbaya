import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";

type ActionProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  primary?: boolean;
};

export default function Action({ icon, label, primary = false }: ActionProps) {
  return (
    <TouchableOpacity
      className={`w-[48%] p-4 rounded-2xl items-center ${
        primary ? "bg-pink-500" : "bg-white border border-gray-200"
      }`}
    >
      <MaterialIcons
        name={icon}
        size={24}
        color={primary ? "white" : "#ee2b8c"}
      />
      <Text
        className={`mt-1 font-semibold ${
          primary ? "text-white" : "text-black"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
