// Reusable FormButton Component - DRY principle

import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

interface FormButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline" | "danger";
  icon?: string;
  className?: string;
}

const FormButton: React.FC<FormButtonProps> = ({
  title,
  onPress,
  isLoading = false,
  disabled = false,
  variant = "primary",
  icon,
  className = "",
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return {
          button: "bg-gray-600 shadow-gray-200",
          text: "text-white",
        };
      case "outline":
        return {
          button: "bg-transparent border-2 border-pink-500",
          text: "text-pink-500",
        };
      case "danger":
        return {
          button: "bg-red-500 shadow-red-200",
          text: "text-white",
        };
      default:
        return {
          button: "bg-pink-500 shadow-pink-200",
          text: "text-white",
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      className={`w-full h-14 rounded-xl flex-row items-center justify-center shadow-lg ${
        variantStyles.button
      } ${disabled || isLoading ? "opacity-70" : ""} ${className}`}
      activeOpacity={0.9}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === "outline" ? "#db2777" : "#ffffff"}
          size="small"
        />
      ) : (
        <>
          {icon && (
            <MaterialIcons
              name={icon as any}
              size={20}
              color={variant === "outline" ? "#db2777" : "#ffffff"}
              className="mr-2"
            />
          )}
          <Text className={`${variantStyles.text} font-bold text-lg`}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default FormButton;
