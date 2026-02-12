import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ExcelImportModalProps {
  visible: boolean;
  fileName: string;
  isUploading: boolean;
  onClose: () => void;
  onUpload: () => void;
  onSetFileName: (name: string) => void;
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
  visible,
  fileName,
  isUploading,
  onClose,
  onUpload,
  onSetFileName,
}) => {
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
            <Text style={localStyles.modalTitle}>Import Guests from Excel</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#181114" />
            </TouchableOpacity>
          </View>

          <View style={localStyles.uploadContainer}>
            <TouchableOpacity
              style={localStyles.uploadButton}
              onPress={onUpload}
              disabled={isUploading}
            >
              <Ionicons name="cloud-upload-outline" size={48} color="#ee2b8c" />
              <Text style={localStyles.uploadTitle}>
                {fileName || "Upload Guest List"}
              </Text>
              <Text style={localStyles.uploadSubtitle}>
                {isUploading
                  ? "Uploading..."
                  : "Supported formats: .xlsx, .csv"}
              </Text>
            </TouchableOpacity>

            <Text style={localStyles.orText}>OR</Text>

            <TouchableOpacity
              style={localStyles.downloadButton}
              onPress={() => {
                Alert.alert(
                  "Download Template",
                  "Download sample Excel template",
                );
              }}
            >
              <Ionicons name="download-outline" size={20} color="#10B981" />
              <Text style={localStyles.downloadButtonText}>
                Download Sample Template
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

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
    height: "60%",
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
  uploadContainer: {
    padding: 24,
    alignItems: "center",
  },
  uploadButton: {
    backgroundColor: "#f9fafb",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
    width: "100%",
  },
  uploadTitle: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 16,
    color: "#181114",
    marginTop: 12,
  },
  uploadSubtitle: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  orText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: "#9ca3af",
    marginVertical: 16,
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  downloadButtonText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "#10B981",
  },
});
