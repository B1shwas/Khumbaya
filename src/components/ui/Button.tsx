import { cn } from "@/src/utils/cn";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Text } from "./Text";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  primary: "bg-primary",
  secondary: "bg-primary/10",
  outline: "bg-transparent border-2 border-primary",
  ghost: "bg-transparent",
};

const textVariantStyles = {
  primary: "text-white",
  secondary: "text-primary",
  outline: "text-primary",
  ghost: "text-primary",
};

const sizeStyles = {
  sm: "py-2 px-4",
  md: "py-3 px-6",
  lg: "py-4 px-8",
};

const textSizeStyles = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export function Button({
  variant = "primary",
  size = "lg",
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      className={cn(
        "rounded-md shadow-lg items-center justify-center",
        variantStyles[variant],
        sizeStyles[size],
        disabled && "opacity-50",
        className,
      )}
      activeOpacity={0.8}
      disabled={disabled}
      accessibilityRole="button"
      {...props}
    >
      <Text
        variant="h1"
        className={cn(
          "text-center font-semibold",
          textVariantStyles[variant],
          textSizeStyles[size],
        )}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}
