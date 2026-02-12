import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import type { Vendor } from "../../../types/subevent";

interface VendorContactModalProps {
  visible: boolean;
  vendor: Vendor | null;
  onClose: () => void;
}

export const VendorContactModal: React.FC<VendorContactModalProps> = ({
  visible,
  vendor,
  onClose,
}) => {
  if (!vendor) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={localStyles.modalOverlay}>
        <View style={localStyles.modalContent}>
          <View style={localStyles.modalHeader}>
            <Text style={localStyles.modalTitle}>Contact Vendor</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#181114" />
            </TouchableOpacity>
          </View>

          <View style={localStyles.contactContent}>
            <View style={localStyles.contactVendorInfo}>
              <Image
                source={{ uri: vendor.imageUrl }}
                style={localStyles.contactVendorImage}
              />
              <Text style={localStyles.contactVendorName}>{vendor.name}</Text>
              <Text style={localStyles.contactVendorCategory}>
                {vendor.category}
              </Text>
            </View>

            <TouchableOpacity
              style={localStyles.contactButton}
              onPress={() => {
                Alert.alert(
                  "Calling",
                  `Calling ${vendor.name} at ${vendor.phone}`,
                );
              }}
            >
              <Ionicons name="call-outline" size={20} color="white" />
              <Text style={localStyles.contactButtonText}>
                Call {vendor.phone}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={localStyles.contactButton}
              onPress={() => {
                Alert.alert("Email", `Opening email to ${vendor.email}`);
              }}
            >
              <Ionicons name="mail-outline" size={20} color="white" />
              <Text style={localStyles.contactButtonText}>
                Email {vendor.email}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

import { Alert } from "react-native";

const localStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "55%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  modalTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 18,
    color: "#181114",
  },
  contactContent: {
    padding: 24,
    alignItems: "center",
  },
  contactVendorInfo: {
    alignItems: "center",
    marginBottom: 24,
  },
  contactVendorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  contactVendorName: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 18,
    color: "#181114",
    marginBottom: 4,
  },
  contactVendorCategory: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: "#6B7280",
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ee2b8c",
    borderRadius: 12,
    paddingVertical: 14,
    width: "100%",
    gap: 8,
    marginBottom: 12,
  },
  contactButtonText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: "white",
  },
});
