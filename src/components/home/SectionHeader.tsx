import React, { useCallback } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface SectionHeaderProps {
  title: string;
  onPress?: () => void;
  testID?: string;
}

const SectionHeader = React.memo(
  ({ title, onPress, testID }: SectionHeaderProps) => {
    const handlePress = useCallback(() => {
      if (onPress) {
        onPress();
      }
    }, [onPress]);

    return (
      <View
        className="flex-row items-center justify-between px-4 pb-3"
        testID={testID}
      >
        <Text className="text-lg font-bold text-gray-900">{title}</Text>
        {onPress && (
          <TouchableOpacity onPress={handlePress} testID={`${testID}-button`}>
            <Text className="text-sm font-semibold text-primary">See All</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
);

export default SectionHeader;
