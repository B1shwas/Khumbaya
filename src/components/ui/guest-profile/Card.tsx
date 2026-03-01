import { View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export const Card = ({ children, className = "", ...props }: CardProps) => {
  return (
    <View
      className={`bg-white rounded-2xl px-4 py-4 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </View>
  );
};
