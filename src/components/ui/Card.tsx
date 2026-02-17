import { ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

const Card = ({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <View
      className={`rounded-md bg-background-tertiary shadow-lg shadow-black/60 ${className ?? ""}`}
    >
      {children}
    </View>
  );
};

export default Card;
