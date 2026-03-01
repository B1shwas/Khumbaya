import Card from "@/src/components/ui/Card";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

interface RSVPSectionProps {
  status?: "Going" | "Pending" | "Declined";
  deadline?: string;
  dietary?: string;
  onEdit?: () => void;
  onModify?: () => void;
  onDecline?: () => void;
}

const RSVPSection = ({
  status = "Going",
  deadline = "July 15th",
  dietary = "Vegetarian Meal",
  onEdit,
  onModify,
  onDecline,
}: RSVPSectionProps) => {
  const statusColor = status === "Going" ? "bg-green-100" : "bg-yellow-100";
  const statusTextColor =
    status === "Going" ? "text-green-700" : "text-yellow-700";

  return (
    <Card className="mx-4 mb-4">
      <View className="p-5">
        {/* Header */}
        <View className="flex-row justify-between items-start mb-4">
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-900">Your RSVP</Text>
            <Text className="text-sm text-gray-500 mt-1">
              Please confirm by {deadline}
            </Text>
          </View>
          <View className={`${statusColor} px-3 py-1 rounded-full`}>
            <Text className={`${statusTextColor} text-xs font-bold`}>
              {status}
            </Text>
          </View>
        </View>

        {/* Dietary Preference */}
        <View className="flex-row items-center p-3 bg-gray-50 rounded-lg mb-4">
          <View className="bg-white p-2 rounded-full mr-3">
            <Ionicons name="restaurant" size={20} color="#ee2b8c" />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-gray-900">
              {dietary}
            </Text>
            <Text className="text-xs text-gray-500">
              Dietary preference selected
            </Text>
          </View>
          <Pressable onPress={onEdit}>
            <Text className="text-primary text-sm font-medium">Edit</Text>
          </Pressable>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3">
          <Pressable
            onPress={onDecline}
            className="flex-1 py-3 rounded-lg border border-gray-200 items-center"
          >
            <Text className="text-gray-600 font-medium text-sm">Decline</Text>
          </Pressable>
          <Pressable
            onPress={onModify}
            className="flex-1 py-3 rounded-lg bg-background-dark items-center"
          >
            <Text className="text-white font-medium text-sm">Modify RSVP</Text>
          </Pressable>
        </View>
      </View>
    </Card>
  );
};

export default RSVPSection;
