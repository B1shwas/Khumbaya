import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import type { Vendor } from "../../../types/subevent";
import { getCategoryColor } from "../../../types/subevent";

interface VendorDetailModalProps {
  visible: boolean;
  vendor: Vendor | null;
  onClose: () => void;
  onAssign: (vendorId: string) => void;
  onContact: (vendor: Vendor) => void;
}

export const VendorDetailModal: React.FC<VendorDetailModalProps> = ({
  visible,
  vendor,
  onClose,
  onAssign,
  onContact,
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
        <View style={localStyles.vendorDetailModalContent}>
          <View style={localStyles.vendorDetailHeader}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#181114" />
            </TouchableOpacity>
            <Text style={localStyles.vendorDetailTitle}>Vendor Details</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView
            style={localStyles.vendorDetailContent}
            showsVerticalScrollIndicator={false}
          >
            <Image
              source={{ uri: vendor.imageUrl }}
              style={localStyles.vendorDetailImage}
            />
            <View style={localStyles.vendorDetailInfo}>
              <View
                style={[
                  localStyles.vendorDetailCategoryBadge,
                  {
                    backgroundColor: getCategoryColor(vendor.category) + "20",
                  },
                ]}
              >
                <Text
                  style={[
                    localStyles.vendorDetailCategoryText,
                    {
                      color: getCategoryColor(vendor.category),
                    },
                  ]}
                >
                  {vendor.category}
                </Text>
              </View>

              <Text style={localStyles.vendorDetailName}>{vendor.name}</Text>

              <View style={localStyles.vendorDetailRatingRow}>
                <Ionicons
                  name="star"
                  size={16}
                  color="#F59E0B"
                  fill="#F59E0B"
                />
                <Text style={localStyles.vendorDetailRatingText}>
                  {vendor.rating}
                </Text>
                <Text style={localStyles.vendorDetailReviewsText}>
                  ({vendor.reviews} reviews)
                </Text>
                <Text style={localStyles.vendorDetailPriceText}>
                  {` • ${vendor.price}`}
                </Text>
              </View>

              {vendor.verified && (
                <View style={localStyles.vendorDetailVerified}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={localStyles.vendorDetailVerifiedText}>
                    Verified Vendor
                  </Text>
                </View>
              )}

              <Text style={localStyles.vendorDetailExperience}>
                {vendor.yearsExperience}+ years of experience
              </Text>

              <Text style={localStyles.vendorDetailDescription}>
                {vendor.description}
              </Text>

              <TouchableOpacity
                style={[
                  localStyles.vendorDetailAssignButton,
                  vendor.selected &&
                    localStyles.vendorDetailAssignButtonSelected,
                ]}
                onPress={() => onAssign(vendor.id)}
              >
                <Text style={localStyles.vendorDetailAssignButtonText}>
                  {vendor.selected ? "Assigned" : "Assign Vendor"}
                </Text>
              </TouchableOpacity>

              <View style={localStyles.vendorDetailContactButtons}>
                <TouchableOpacity
                  style={localStyles.vendorDetailContactButton}
                  onPress={() => onContact(vendor)}
                >
                  <Ionicons name="call-outline" size={18} color="#ee2b8c" />
                  <Text style={localStyles.vendorDetailContactButtonText}>
                    Contact
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={localStyles.vendorDetailContactButton}
                  onPress={() => {
                    Alert.alert("Message", "Chat feature coming soon!");
                  }}
                >
                  <Ionicons
                    name="chatbubble-outline"
                    size={18}
                    color="#ee2b8c"
                  />
                  <Text style={localStyles.vendorDetailContactButtonText}>
                    Chat
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
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
  vendorDetailModalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "85%",
  },
  vendorDetailHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  vendorDetailTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 18,
    color: "#181114",
  },
  vendorDetailContent: {
    flex: 1,
  },
  vendorDetailImage: {
    width: "100%",
    height: 200,
  },
  vendorDetailInfo: {
    padding: 16,
  },
  vendorDetailCategoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  vendorDetailCategoryText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 11,
  },
  vendorDetailName: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 22,
    color: "#181114",
    marginBottom: 8,
  },
  vendorDetailRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  vendorDetailRatingText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "#181114",
    marginLeft: 4,
  },
  vendorDetailReviewsText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
  },
  vendorDetailPriceText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: "#6B7280",
  },
  vendorDetailVerified: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  vendorDetailVerifiedText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 12,
    color: "#10B981",
  },
  vendorDetailExperience: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 12,
  },
  vendorDetailDescription: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: "#181114",
    lineHeight: 20,
    marginBottom: 16,
  },
  vendorDetailAssignButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ee2b8c",
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    marginBottom: 16,
  },
  vendorDetailAssignButtonSelected: {
    backgroundColor: "#10B981",
  },
  vendorDetailAssignButtonText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: "white",
  },
  vendorDetailContactButtons: {
    flexDirection: "row",
    gap: 12,
  },
  vendorDetailContactButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fceaf4",
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  vendorDetailContactButtonText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "#ee2b8c",
  },
});
