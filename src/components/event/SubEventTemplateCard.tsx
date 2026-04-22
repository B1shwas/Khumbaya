import { SubEventTemplate } from "@/src/constants/subeventTemplates";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface SubEventTemplateCardProps {
  template: SubEventTemplate;
  isSelected: boolean;
  onSelect: (template: SubEventTemplate) => void;
}

export default function SubEventTemplateCard({
  template,
  isSelected,
  onSelect,
}: SubEventTemplateCardProps) {
  const getCategoryColor = (): string => {
    const colors: Record<string, string> = {
      sangeet: "#F59E0B",
      mehendi: "#EC4899",
      haldi: "#F59E0B",
      reception: "#10B981",
      baraat: "#8B5CF6",
      "bridal-party": "#EC4899",
      "wedding-ceremony": "#ee2b8c",
      engagement: "#3B82F6",
      "card-invitation": "#6366F1",
    };
    return colors[template.id] || "#6B7280";
  };

  const color = getCategoryColor();

  return (
    <TouchableOpacity
      className={`bg-white rounded-2xl mb-3 border-2 overflow-hidden ${
        isSelected ? "border-primary bg-pink-50" : "border-gray-200"
      }`}
      onPress={() => onSelect(template)}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center p-4">
        <View
          className="w-14 h-14 rounded-2xl items-center justify-center"
          style={{ backgroundColor: color + "15" }}
        >
          <Ionicons name={template.icon as any} size={28} color={color} />
        </View>

        <View className="flex-1 ml-3.5">
          <Text className="font-bold text-base text-[#181114]">
            {template.name}
          </Text>
          <Text className="text-sm text-gray-500 mt-0.5">
            {template.description}
          </Text>
          <Text className="text-xs text-gray-400 mt-1">
            {template.activities.length} activities
          </Text>
        </View>

        <View
          className={`w-7 h-7 rounded-full border-2 items-center justify-center ${
            isSelected
              ? "bg-primary border-primary"
              : "bg-transparent border-gray-300"
          }`}
        >
          {isSelected && <Ionicons name="checkmark" size={18} color="white" />}
        </View>
      </View>
    </TouchableOpacity>
  );
}
