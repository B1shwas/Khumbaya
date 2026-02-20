import { Text as RNText, TextProps } from "react-native";
import { cn } from "../../utils/cn";

type Variant = "h1" | "h2" | "body" | "caption";

interface Props extends TextProps {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}

export function Text({ variant = "body", className, ...props }: Props) {
  return (
    <RNText
      {...props}
      className={cn(
        "text-gray-900",
        variant === "h1" && "font-jakarta-bold text-2xl",
        variant === "h2" && "font-jakarta-semi text-xl",
        variant === "body" && "font-jakarta text-base",
        variant === "caption" && "font-jakarta-medium text-sm text-gray-500",
        className
      )}
    />
  );
}
