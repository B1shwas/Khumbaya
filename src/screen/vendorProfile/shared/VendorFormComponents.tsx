/**
 * Shared Vendor Form Components - DRY Principle
 * Reusable components for all vendor types
 */

import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// ============================================================================
// Types
// ============================================================================

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  icon?: string;
  required?: boolean;
  error?: string;
  multiline?: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
  className?: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  onPress: () => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  icon?: string;
}

interface ToggleRowProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  description?: string;
  icon?: string;
}

interface SelectOptionProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: string;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  step?: number;
  icon?: string;
  color?: string;
}

interface StepIndicatorProps {
  steps: Array<{ id: string; title: string; icon: string }>;
  currentStep: number;
  onStepPress?: (step: number) => void;
}

// ============================================================================
// Components
// ============================================================================

export const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <View className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 ${className}`}>
    {children}
  </View>
);

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  step,
  icon,
  color = "#ec4899",
}) => (
  <View className="mb-5">
    {step && (
      <View className="flex-row items-center gap-2 mb-2">
        <View
          className="w-6 h-6 rounded-full items-center justify-center"
          style={{ backgroundColor: color }}
        >
          <Text className="text-white text-xs font-bold">{step}</Text>
        </View>
        <Text className="text-xs font-semibold" style={{ color }}>
          Step {step}
        </Text>
      </View>
    )}
    <View className="flex-row items-center gap-2">
      {icon && (
        <MaterialIcons name={icon as any} size={22} color={color} />
      )}
      <Text className="text-xl font-bold text-gray-900">{title}</Text>
    </View>
    {subtitle && <Text className="text-sm text-gray-500 mt-1">{subtitle}</Text>}
  </View>
);

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  required,
  error,
  multiline = false,
  keyboardType = "default",
  className = "",
}) => (
  <View className={`mb-4 ${className}`}>
    <View className="flex-row items-center mb-2">
      <Text className="text-sm font-semibold text-gray-800">{label}</Text>
      {required && <Text className="text-red-500 ml-1">*</Text>}
    </View>
    <View className="relative">
      {icon && (
        <View className="absolute left-4 top-3 z-10">
          <MaterialIcons name={icon as any} size={20} color={error ? "#ef4444" : "#9ca3af"} />
        </View>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        multiline={multiline}
        keyboardType={keyboardType}
        className={`w-full bg-gray-50 rounded-xl border ${
          error ? "border-red-300" : "border-gray-200"
        } ${multiline ? "p-4 min-h-[100px] text-top" : "h-12"} ${
          icon ? (multiline ? "pl-12 pr-4" : "pl-12 pr-4") : "px-4"
        } text-gray-900`}
        style={multiline ? { textAlignVertical: "top" } : {}}
      />
    </View>
    {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
  </View>
);

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onPress,
  placeholder,
  required,
  error,
  icon,
}) => (
  <View className="mb-4">
    <View className="flex-row items-center mb-2">
      <Text className="text-sm font-semibold text-gray-800">{label}</Text>
      {required && <Text className="text-red-500 ml-1">*</Text>}
    </View>
    <TouchableOpacity
      onPress={onPress}
      className={`w-full h-12 px-4 bg-gray-50 rounded-xl border flex-row items-center justify-between ${
        error ? "border-red-300" : "border-gray-200"
      }`}
    >
      <View className="flex-row items-center gap-2">
        {icon && (
          <MaterialIcons name={icon as any} size={20} color="#9ca3af" />
        )}
        <Text className={value ? "text-gray-900" : "text-gray-400"}>
          {value || placeholder}
        </Text>
      </View>
      <MaterialIcons name="expand-more" size={24} color="#9ca3af" />
    </TouchableOpacity>
    {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
  </View>
);

export const ToggleRow: React.FC<ToggleRowProps> = ({
  label,
  value,
  onValueChange,
  description,
  icon,
}) => (
  <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
    <View className="flex-row items-center gap-3 flex-1">
      {icon && <MaterialIcons name={icon as any} size={22} color="#6b7280" />}
      <View className="flex-1">
        <Text className="text-gray-900 font-medium">{label}</Text>
        {description && (
          <Text className="text-xs text-gray-500 mt-0.5">{description}</Text>
        )}
      </View>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: "#e5e7eb", true: "#f9a8d4" }}
      thumbColor={value ? "#ec4899" : "#f9fafb"}
    />
  </View>
);

export const SelectOption: React.FC<SelectOptionProps> = ({
  label,
  selected,
  onPress,
  icon,
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex-row items-center gap-3 p-4 rounded-xl border ${
      selected ? "border-pink-500 bg-pink-50" : "border-gray-200 bg-white"
    }`}
  >
    {icon && (
      <MaterialIcons
        name={icon as any}
        size={22}
        color={selected ? "#ec4899" : "#6b7280"}
      />
    )}
    <Text
      className={`flex-1 font-medium ${
        selected ? "text-pink-600" : "text-gray-700"
      }`}
    >
      {label}
    </Text>
    {selected && (
      <MaterialIcons name="check-circle" size={22} color="#ec4899" />
    )}
  </TouchableOpacity>
);

export const ChipGroup: React.FC<{
  options: Array<{ id: string; label: string }>;
  selected: string[];
  onToggle: (id: string) => void;
  className?: string;
}> = ({ options, selected, onToggle, className = "" }) => (
  <View className={`flex-row flex-wrap gap-2 ${className}`}>
    {options.map((option) => (
      <TouchableOpacity
        key={option.id}
        onPress={() => onToggle(option.id)}
        className={`px-4 py-2 rounded-full border ${
          selected.includes(option.id)
            ? "border-pink-500 bg-pink-50"
            : "border-gray-200"
        }`}
      >
        <Text
          className={
            selected.includes(option.id)
              ? "text-pink-600 font-medium"
              : "text-gray-600"
          }
        >
          {option.label}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  onStepPress,
}) => (
  <View className="flex-row items-center justify-center mb-6 overflow-x-auto">
    {steps.map((step, index) => (
      <View key={step.id} className="flex-row items-center">
        <TouchableOpacity
          onPress={() => onStepPress?.(index + 1)}
          disabled={!onStepPress}
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep > index + 1
              ? "bg-green-500"
              : currentStep === index + 1
              ? "bg-pink-500"
              : "bg-gray-200"
          }`}
        >
          {currentStep > index + 1 ? (
            <MaterialIcons name="check" size={16} color="white" />
          ) : (
            <Text
              className={`font-bold text-xs ${
                currentStep === index + 1 ? "text-white" : "text-gray-500"
              }`}
            >
              {index + 1}
            </Text>
          )}
        </TouchableOpacity>
        {index < steps.length - 1 && (
          <View
            className={`w-8 h-0.5 ${
              currentStep > index + 1 ? "bg-green-500" : "bg-gray-200"
            }`}
          />
        )}
      </View>
    ))}
  </View>
);

export const PricingCard: React.FC<{
  packageName: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
}> = ({ packageName, price, description, features, popular }) => (
  <View
    className={`rounded-2xl p-4 border ${
      popular ? "border-pink-500 bg-pink-50" : "border-gray-200 bg-white"
    }`}
  >
    {popular && (
      <View className="bg-pink-500 px-2 py-0.5 rounded-full self-start mb-2">
        <Text className="text-white text-xs font-bold">POPULAR</Text>
      </View>
    )}
    <Text className="text-lg font-bold text-gray-900">{packageName}</Text>
    <Text className="text-2xl font-bold text-pink-600 mt-1">₹{price}</Text>
    <Text className="text-gray-500 text-sm mt-1">{description}</Text>
    <View className="mt-3 pt-3 border-t border-gray-200">
      {features.map((feature, index) => (
        <View key={index} className="flex-row items-center gap-2 mb-1">
          <MaterialIcons name="check" size={16} color="#22c55e" />
          <Text className="text-gray-600 text-sm">{feature}</Text>
        </View>
      ))}
    </View>
  </View>
);

export const NavigationButtons: React.FC<{
  onBack?: () => void;
  onNext?: () => void;
  onSave?: () => void;
  isLoading?: boolean;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  backLabel?: string;
  nextLabel?: string;
  saveLabel?: string;
}> = ({
  onBack,
  onNext,
  onSave,
  isLoading = false,
  isFirstStep = false,
  isLastStep = false,
  backLabel = "Back",
  nextLabel = "Next",
  saveLabel = "Save",
}) => (
  <View className="flex-row gap-3 mt-6 mb-8">
    {!isFirstStep && (
      <TouchableOpacity
        onPress={onBack}
        className="flex-1 h-12 border border-gray-300 rounded-xl items-center justify-center"
      >
        <Text className="text-gray-600 font-semibold">{backLabel}</Text>
      </TouchableOpacity>
    )}
    
    {isLastStep ? (
      <TouchableOpacity
        onPress={onSave}
        disabled={isLoading}
        className="flex-1 h-12 bg-green-500 rounded-xl items-center justify-center shadow-lg"
      >
        <Text className="text-white font-bold">
          {isLoading ? "Saving..." : saveLabel}
        </Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        onPress={onNext}
        className="flex-1 h-12 bg-pink-500 rounded-xl items-center justify-center shadow-lg shadow-pink-200"
      >
        <Text className="text-white font-bold">{nextLabel}</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ============================================================================
// Constants
// ============================================================================

export const EXPERIENCE_OPTIONS = [
  { id: "1", label: "1-2 years" },
  { id: "2", label: "3-5 years" },
  { id: "3", label: "5-10 years" },
  { id: "4", label: "10+ years" },
];

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Other",
];

export const CANCELLATION_POLICIES = [
  { id: "flexible", label: "Flexible", description: "Full refund if cancelled 7+ days before" },
  { id: "moderate", label: "Moderate", description: "Full refund if cancelled 14+ days before" },
  { id: "strict", label: "Strict", description: "50% refund if cancelled 7+ days before" },
  { id: "non_refundable", label: "Non-refundable", description: "No refund on cancellation" },
];
