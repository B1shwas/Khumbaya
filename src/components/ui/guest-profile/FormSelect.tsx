// Reusable FormSelect Component - DRY principle
// This component can be used for dropdown selections

import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    FlatList,
    Modal,
    Pressable,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  value: string;
  options: SelectOption[];
  onSelect: (value: string) => void;
  placeholder?: string;
  icon?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  value,
  options,
  onSelect,
  placeholder = "Select an option",
  icon,
  required = false,
  error,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onSelect(optionValue);
    setIsVisible(false);
  };

  return (
    <View className={`mb-5 ${className}`}>
      <View className="flex-row items-center mb-2">
        <Text className="text-sm font-semibold text-gray-800">{label}</Text>
        {required && <Text className="text-red-500 ml-1">*</Text>}
      </View>

      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        className={`relative bg-white rounded-xl shadow-sm border ${
          error ? "border-red-300" : "border-gray-100"
        } h-14 flex-row items-center px-4`}
      >
        {icon && (
          <View className="mr-3">
            <MaterialIcons
              name={icon as any}
              size={20}
              color={error ? "#ef4444" : "#9ca3af"}
            />
          </View>
        )}
        <View className="flex-1">
          <Text
            className={
              selectedOption
                ? "text-gray-800 text-base"
                : "text-gray-400 text-base"
            }
          >
            {selectedOption?.label || placeholder}
          </Text>
        </View>
        <MaterialIcons name="keyboard-arrow-down" size={24} color="#9ca3af" />
      </TouchableOpacity>

      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}

      {/* Modal for selection */}
      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center px-4"
          onPress={() => setIsVisible(false)}
        >
          <View className="bg-white rounded-2xl w-full max-h-[60%] shadow-xl">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
              <Text className="text-lg font-semibold text-gray-800">
                Select {label}
              </Text>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <MaterialIcons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item.value)}
                  className={`flex-row items-center justify-between p-4 border-b border-gray-50 ${
                    item.value === value ? "bg-pink-50" : ""
                  }`}
                >
                  <Text
                    className={`text-base ${
                      item.value === value
                        ? "text-pink-600 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <MaterialIcons name="check" size={20} color="#db2777" />
                  )}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default FormSelect;
