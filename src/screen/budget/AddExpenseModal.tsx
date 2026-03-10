import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface AddExpenseModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (expense: {
    category: string;
    icon: string;
    color: string;
    estimated: number;
    actual: number;
  }) => void;
}

const categories = [
  { name: "Venue", icon: "temple-buddhist", color: "#ec4899" },
  { name: "Catering", icon: "restaurant", color: "#475569" },
  { name: "Decor", icon: "local-florist", color: "#ec4899" },
  { name: "Photography", icon: "camera", color: "#8b5cf6" },
  { name: "Music", icon: "music-note", color: "#06b6d4" },
  { name: "Cake", icon: "cake", color: "#f59e0b" },
  { name: "Invitations", icon: "mail-outline", color: "#6366f1" },
  { name: "Transportation", icon: "directions-car", color: "#14b8a6" },
];

export default function AddExpenseModal({
  visible,
  onClose,
  onAdd,
}: AddExpenseModalProps) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [estimated, setEstimated] = useState("");
  const [actual, setActual] = useState("");
  const [itemName, setItemName] = useState("");

  const handleAdd = () => {
    if (!estimated || !actual) return;

    onAdd({
      category: itemName || selectedCategory.name,
      icon: selectedCategory.icon,
      color: selectedCategory.color,
      estimated: parseFloat(estimated),
      actual: parseFloat(actual),
    });

    // Reset form
    setEstimated("");
    setActual("");
    setItemName("");
    setSelectedCategory(categories[0]);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl max-h-[90%]">
          {/* Header */}
          <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#475569" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-slate-800">
              Add Expense
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView className="p-4">
            {/* Category Selection */}
            <Text className="text-sm font-semibold text-slate-600 mb-3">
              Select Category
            </Text>
            <View className="flex-row flex-wrap gap-2 mb-6">
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.name}
                  className={`px-4 py-2 rounded-full border ${
                    selectedCategory.name === cat.name
                      ? "border-pink-500 bg-pink-50"
                      : "border-slate-200 bg-white"
                  }`}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <View className="flex-row items-center gap-2">
                    <MaterialIcons
                      name={cat.icon as any}
                      size={16}
                      color={
                        selectedCategory.name === cat.name
                          ? "#ec4899"
                          : "#475569"
                      }
                    />
                    <Text
                      className={`text-sm ${
                        selectedCategory.name === cat.name
                          ? "text-pink-500 font-semibold"
                          : "text-slate-600"
                      }`}
                    >
                      {cat.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Item Name */}
            <Text className="text-sm font-semibold text-slate-600 mb-3">
              Item Name (Optional)
            </Text>
            <TextInput
              className="border border-slate-200 rounded-xl p-3 mb-4 text-slate-800"
              placeholder="e.g., Castle Wedding Hall"
              placeholderTextColor="#9ca3af"
              value={itemName}
              onChangeText={setItemName}
            />

            {/* Budget Amount */}
            <Text className="text-sm font-semibold text-slate-600 mb-3">
              Budget Amount
            </Text>
            <View className="flex-row items-center border border-slate-200 rounded-xl px-3 mb-4">
              <Text className="text-slate-800 text-lg">$</Text>
              <TextInput
                className="flex-1 p-3 text-slate-800"
                placeholder="0"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                value={estimated}
                onChangeText={setEstimated}
              />
            </View>

            {/* Actual Amount */}
            <Text className="text-sm font-semibold text-slate-600 mb-3">
              Actual Amount
            </Text>
            <View className="flex-row items-center border border-slate-200 rounded-xl px-3 mb-6">
              <Text className="text-slate-800 text-lg">$</Text>
              <TextInput
                className="flex-1 p-3 text-slate-800"
                placeholder="0"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                value={actual}
                onChangeText={setActual}
              />
            </View>

            {/* Add Button */}
            <TouchableOpacity
              className="bg-pink-500 py-4 rounded-xl items-center mb-6"
              onPress={handleAdd}
            >
              <Text className="text-white font-bold text-lg">Add Expense</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
