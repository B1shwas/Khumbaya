// Reusable FormInput Component - DRY principle
// This component can be used across the entire application

import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TextInput, View } from "react-native";

interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  icon?: string;
  multiline?: boolean;
  required?: boolean;
  error?: string;
  keyboardType?:
    | "default"
    | "email-address"
    | "phone-pad"
    | "numeric"
    | "decimal-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  editable?: boolean;
  maxLength?: number;
  className?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  multiline = false,
  required = false,
  error,
  keyboardType = "default",
  autoCapitalize = "sentences",
  editable = true,
  maxLength,
  className = "",
}) => {
  return (
    <View className={`mb-5 ${className}`}>
      <View className="flex-row items-center mb-2">
        <Text className="text-sm font-semibold text-gray-800">{label}</Text>
        {required && <Text className="text-red-500 ml-1">*</Text>}
      </View>
      <View className="relative">
        {icon && (
          <View
            className={`absolute ${multiline ? "top-4 left-4" : "left-4"} z-10`}
          >
            <MaterialIcons
              name={icon as any}
              size={20}
              color={error ? "#ef4444" : "#9ca3af"}
            />
          </View>
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          multiline={multiline}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          maxLength={maxLength}
          className={`w-full bg-white rounded-xl shadow-sm border ${
            error ? "border-red-300" : "border-gray-100"
          } 
            ${multiline ? "p-4 min-h-[100px] text-top" : "h-14"} 
            ${icon ? (multiline ? "pl-12 pr-4" : "pl-12 pr-4") : "px-4"}
            ${!editable ? "bg-gray-100 text-gray-500" : "text-gray-800"} 
            text-base`}
          style={multiline ? { textAlignVertical: "top" } : {}}
        />
      </View>
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
};

export default FormInput;
