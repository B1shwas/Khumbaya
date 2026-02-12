import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../styles/EventCreate.styles";

interface CoverUploadProps {
  onPress: () => void;
}

export const CoverUpload: React.FC<CoverUploadProps> = ({ onPress }) => {
  return (
    <View style={styles.section}>
      <TouchableOpacity
        onPress={onPress}
        style={styles.coverUploadContainer}
        activeOpacity={0.8}
      >
        <Image
          source={{
            uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4baplBpAzVE_Kbv7m5jmbgfKEsZdzJcLTblHvHyn_CNxgGJ-spHw_-lcr1J_eQJK_onSfJPDupULCeQLMZd-cLvKBMgzzViLvDItg2ng1UIiZVvbQ5CwFEo-lqmLVbH5gyK4fkgRNsiRz8-wcyZYDzkYCmyI3K2pgzYajYnxOThBEL1RbDkAhjz-hv9j9fNN8MKdGjJ7oqMlN1vqSDKRDlWWbxdNT1jniUPXUy5mcnJ7XsOCE2Qz6WO5pgIHRrOKlvu-5NrxRhU8",
          }}
          style={styles.coverImage}
          resizeMode="cover"
        />
        <View style={styles.coverOverlay}>
          <View style={styles.coverIconContainer}>
            <Ionicons name="camera" size={24} color="white" />
          </View>
          <Text style={styles.coverTitle}>Add Event Cover</Text>
          <Text style={styles.coverSubtitle}>High quality JPG or PNG</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
