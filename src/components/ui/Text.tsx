import { cn } from "@/src/utils/cn";
import { Text as RNText, TextProps as RNTextProps } from "react-native";

type TextVariant = "h1" | "h2" | "h3" | "h4" | "body" | "caption" | "small";

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  className?: string;
  children: React.ReactNode;
}

const variantStyles = {
  h1: "text-3xl font-bold text-gray-900",
  h2: "text-2xl font-bold text-gray-900",
  h3: "text-xl font-semibold text-gray-900",
  h4: "text-lg font-semibold text-gray-900",
  body: "text-base text-gray-700",
  caption: "text-sm text-gray-500",
  small: "text-xs text-gray-500",
};

export function Text({
  variant = "body",
  className,
  children,
  ...props
}: TextProps) {
  return (
    <RNText
      className={cn(variantStyles[variant], className)}
      {...props}
    >
      {children}
    </RNText>
  );
}
