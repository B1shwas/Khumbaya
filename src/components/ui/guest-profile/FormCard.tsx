// Reusable FormCard Component - DRY principle

import React from "react";
import { View } from "react-native";

interface FormCardProps {
  children: React.ReactNode;
  className?: string;
}

const FormCard: React.FC<FormCardProps> = ({ children, className = "" }) => {
  return (
    <View
      className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 ${className}`}
    >
      {children}
    </View>
  );
};

export default FormCard;
