import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const CATEGORIES = [
  { id: "venue", label: "Venue & Site", icon: "location-on" },
  { id: "catering", label: "Catering", icon: "restaurant" },
  { id: "apparel", label: "Apparel", icon: "checkroom" },
  { id: "flowers", label: "Flowers & Decor", icon: "local-florist" },
  { id: "photography", label: "Photography", icon: "camera-alt" },
  { id: "entertainment", label: "Entertainment", icon: "music-note" },
  { id: "transportation", label: "Transportation", icon: "directions-car" },
  { id: "other", label: "Other", icon: "more-horiz" },
];

export default function AddBudgetItemScreen() {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [itemName, setItemName] = useState("");
  const [vendor, setVendor] = useState("");
  const [estimatedAmount, setEstimatedAmount] = useState("");
  const [actualAmount, setActualAmount] = useState("");
  const [notes, setNotes] = useState("");

  const handleSave = (goBack: boolean = false) => {
    // TODO: Implement save functionality
    console.log({
      category,
      itemName,
      vendor,
      estimatedAmount,
      actualAmount,
      notes,
    });

    // Clear form for next entry or go back
    if (goBack) {
      router.back();
    } else {
      // Clear form
      setCategory("");
      setItemName("");
      setVendor("");
      setEstimatedAmount("");
      setActualAmount("");
      setNotes("");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f8f6f7]">
      <StatusBar barStyle="dark-content" backgroundColor="#f8f6f7" />

    

      {/* ── Scrollable Content ── */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-5"
        showsVerticalScrollIndicator={false}
      >
        {/* Category Selection */}
        <Text className="text-sm font-bold text-gray-700 mb-2">Category</Text>
        <View className="flex-row flex-wrap gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setCategory(cat.id)}
              className={`flex-row items-center px-4 py-2 rounded-full border ${
                category === cat.id
                  ? "bg-[#ee2b8c] border-[#ee2b8c]"
                  : "bg-white border-gray-200"
              }`}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name={cat.icon as any}
                size={16}
                color={category === cat.id ? "#fff" : "#6b7280"}
              />
              <Text
                className={`text-xs font-semibold ml-1.5 ${
                  category === cat.id ? "text-white" : "text-gray-600"
                }`}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Item Name */}
        <Text className="text-sm font-bold text-gray-700 mb-2">Item Name</Text>
        <View className="bg-white rounded-2xl px-4 h-14 shadow-sm border border-gray-100 mb-4">
          <TextInput
            className="flex-1 text-sm font-medium text-[#181114]"
            placeholder="e.g., Grand Ballroom"
            placeholderTextColor="#9ca3af"
            value={itemName}
            onChangeText={setItemName}
          />
        </View>

        {/* Vendor */}
        <Text className="text-sm font-bold text-gray-700 mb-2">Vendor</Text>
        <View className="bg-white rounded-2xl px-4 h-14 shadow-sm border border-gray-100 mb-4">
          <TextInput
            className="flex-1 text-sm font-medium text-[#181114]"
            placeholder="e.g., Majestic Hotel"
            placeholderTextColor="#9ca3af"
            value={vendor}
            onChangeText={setVendor}
          />
        </View>

        {/* Amounts Row */}
        <View className="flex-row gap-3 mb-4">
          <View className="flex-1">
            <Text className="text-sm font-bold text-gray-700 mb-2">
              Estimated Amount
            </Text>
            <View className="bg-white rounded-2xl px-4 h-14 shadow-sm border border-gray-100">
              <TextInput
                className="flex-1 text-sm font-medium text-[#181114]"
                placeholder="$0"
                placeholderTextColor="#9ca3af"
                value={estimatedAmount}
                onChangeText={setEstimatedAmount}
                keyboardType="numeric"
              />
            </View>
          </View>
          <View className="flex-1">
            <Text className="text-sm font-bold text-gray-700 mb-2">
              Actual Amount
            </Text>
            <View className="bg-white rounded-2xl px-4 h-14 shadow-sm border border-gray-100">
              <TextInput
                className="flex-1 text-sm font-medium text-[#181114]"
                placeholder="$0"
                placeholderTextColor="#9ca3af"
                value={actualAmount}
                onChangeText={setActualAmount}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Notes */}
        <Text className="text-sm font-bold text-gray-700 mb-2">Notes</Text>
        <View className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 mb-6 min-h-[100px]">
          <TextInput
            className="flex-1 text-sm font-medium text-[#181114]"
            placeholder="Add any additional notes..."
            placeholderTextColor="#9ca3af"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          className="bg-[#ee2b8c] rounded-2xl h-14 items-center justify-center shadow-lg"
          activeOpacity={0.8}
          onPress={() => handleSave(true)}
        >
          <Text className="text-white font-bold text-base">
            Add Budget Item
          </Text>
        </TouchableOpacity>
      </ScrollView>

    </SafeAreaView>
  );
}
