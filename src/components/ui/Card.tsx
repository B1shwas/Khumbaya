import { ReactNode } from "react";
import { Platform, StyleProp, View, ViewStyle } from "react-native";

const topLevelShadowStyle: ViewStyle = Platform.select<ViewStyle>({
  ios: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  android: {
    elevation: 3,
  },
  default: {},
}) as ViewStyle;

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
      style={[topLevelShadowStyle, style]}
    >
      {children}
    </View>
  );
};

export default Card;
