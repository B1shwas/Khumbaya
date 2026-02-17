import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

const SERVICES = [
  { icon: "checkmark-done", label: "Checklist", color: "#10b981" },
  { icon: "wallet", label: "Budget", color: "#3b82f6" },
  { icon: "people", label: "Guest List", color: "#8b5cf6" },
  { icon: "time", label: "Timeline", color: "#f59e0b" },
];

const QuickServices = () => {
  return (
    <View className="px-4 mt-6">
      <Text className="text-xl font-bold text-gray-800 mb-4">
        Quick Services
      </Text>

      <View className="flex-row flex-wrap justify-between">
        {SERVICES.map((service, index) => (
          <TouchableOpacity
            key={index}
            className="bg-white w-[48%] mb-4 p-4 rounded-2xl flex-row items-center"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 10,
              elevation: 3,
            }}
          >
            <View
              className="h-12 w-12 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: service.color + "20" }}
            >
              <Ionicons
                name={service.icon as any}
                size={22}
                color={service.color}
              />
            </View>

            <Text className="font-semibold text-gray-700">{service.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default QuickServices;
