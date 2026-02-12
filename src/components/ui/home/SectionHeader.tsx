import React, { useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

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
      <View style={styles.container} testID={testID}>
        <Text style={styles.title}>{title}</Text>
        {onPress && (
          <TouchableOpacity onPress={handlePress} testID={`${testID}-button`}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ee2b8c",
  },
});

export default SectionHeader;
