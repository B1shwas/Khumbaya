import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { styles } from "../styles/CardMaking.styles";

export const InfoSection: React.FC = () => {
  return (
    <View style={styles.infoSection}>
      <View style={styles.infoCard}>
        <Ionicons name="image-outline" size={24} color="#ee2b8c" />
        <Text style={styles.infoTitle}>Create Cards & Books</Text>
        <Text style={styles.infoSubtitle}>
          Select images and enter prompts to create beautiful invitations, thank
          you cards, and bridal books
        </Text>
      </View>
    </View>
  );
};
