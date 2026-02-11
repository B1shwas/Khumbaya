import { SubEventTemplate } from "@/src/constants/subeventTemplates";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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

  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={() => onSelect(template)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: getCategoryColor() + "15" },
          ]}
        >
          <Ionicons
            name={template.icon as any}
            size={28}
            color={getCategoryColor()}
          />
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{template.name}</Text>
          <Text style={styles.cardDescription}>{template.description}</Text>
          <Text style={styles.cardActivities}>
            {template.activities.length} activities
          </Text>
        </View>

        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Ionicons name="checkmark" size={18} color="white" />}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  cardSelected: {
    borderColor: "#ee2b8c",
    backgroundColor: "#FDF2F8",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: {
    flex: 1,
    marginLeft: 14,
  },
  cardTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: "#181114",
  },
  cardDescription: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  cardActivities: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  checkboxSelected: {
    backgroundColor: "#ee2b8c",
    borderColor: "#ee2b8c",
  },
});
