import { shadowStyle } from "@/src/utils/helper";
import { ReactNode } from "react";
import {  StyleProp, View, ViewStyle } from "react-native";

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
      className={`rounded-md bg-background-tertiary ${className ?? ""}`}
     style={shadowStyle}
    >
      {children}
    </View>
  );
};

export default Card;
