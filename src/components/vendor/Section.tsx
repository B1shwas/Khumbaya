import { Text } from "@/src/components/ui/Text";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { sectionTitle } from "@/src/styles/vendorhome-style";

interface SectionProps {
  title: string;
  actionLabel?: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
  title,
  actionLabel,
  children,
}) => {
  return (
    <View className="px-4 mt-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text variant="h1" className={sectionTitle}>
          {title}
        </Text>

        {actionLabel && (
          <TouchableOpacity>
            <Text variant="caption" className="text-primary">
              {actionLabel}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="gap-4">{children}</View>
    </View>
  );
};
