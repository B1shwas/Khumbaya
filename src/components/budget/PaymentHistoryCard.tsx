import { Text } from "@/src/components/ui/Text";
import { MaterialIcons } from "@expo/vector-icons";
import { ReactNode } from "react";
import { TouchableOpacity, View } from "react-native";

type PaymentHistoryCardProps = {
  id: number;
  name: string;
  amount: number;
  paidOn: string;
  mode: string;
  status: string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
  renderDetails?: () => ReactNode;
};

export function PaymentHistoryCard({
  id,
  name,
  amount,
  paidOn,
  mode,
  status,
  onEdit,
  onDelete,
  isDeleting = false,
  renderDetails,
}: PaymentHistoryCardProps) {
  const getModeLabel = (mode: string) => {
    switch (mode) {
      case "bank_transfer":
        return "Bank Transfer";
      case "cash":
        return "Cash";
      case "card":
        return "Card";
      case "check":
        return "Check";
      case "other":
        return "Other";
      default:
        return mode;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "cleared":
        return {
          bg: "bg-emerald-100",
          text: "text-emerald-700",
        };
      case "pending":
        return {
          bg: "bg-amber-100",
          text: "text-amber-700",
        };
      case "failed":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
        };
    }
  };

  const statusColors = getStatusColor(status);

  return (
    <View className="bg-white rounded-md p-5 shadow-sm border border-gray-100">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-4 flex-1">
          {/* Details */}
          <View className="flex-1">
            <Text variant="h2" className="text-[#181114] mb-1">
              {name}
            </Text>
            <View className="flex-row items-center gap-2">
              <Text variant="h2" className="text-on-surface-variant">
                {paidOn}
              </Text>
              <Text variant="h2" className="text-gray-300">
                •
              </Text>
              <View className="flex-row items-center gap-1">
                <Text variant="h2" className="text-gray-500">
                  {getModeLabel(mode)}
                </Text>
              </View>
            </View>
            {renderDetails && renderDetails()}
          </View>
        </View>

        <View className="items-end">
          <Text variant="h2" className="text-[#181114] mb-2">
            Rs. {amount?.toLocaleString()}
          </Text>
          <View className={`${statusColors.bg} px-2 py-0.5 rounded-lg`}>
            <Text
              variant="h2"
              className={`${statusColors.text} uppercase text-xs`}
            >
              {status.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      {/* Edit and Delete Buttons */}
      <View className="flex-row items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
        <TouchableOpacity
          onPress={() => onEdit(id)}
          className="flex-row items-center gap-1 px-3 py-2 rounded-md bg-blue-50"
          activeOpacity={0.7}
        >
          <MaterialIcons name="edit" size={16} color="#3b82f6" />
          <Text variant="h2" className="text-blue-600 text-xs">
            Edit
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onDelete(id)}
          className="flex-row items-center gap-1 px-3 py-2 rounded-md bg-red-50"
          activeOpacity={0.7}
          disabled={isDeleting}
        >
          <MaterialIcons name="delete" size={16} color="#ef4444" />
          <Text variant="h2" className="text-red-600 text-xs">
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
