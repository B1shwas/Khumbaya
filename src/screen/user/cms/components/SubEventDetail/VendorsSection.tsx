import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import type { Vendor } from "../../types/subevent";
import { getCategoryColor } from "../../types/subevent";

interface VendorsSectionProps {
  vendors: Vendor[];
  selectedVendorsCount: number;
  onToggleVendor: (vendorId: string) => void;
  onShowVendorDetail: (vendor: Vendor) => void;
}

export const VendorsSection: React.FC<VendorsSectionProps> = ({
  vendors,
  selectedVendorsCount,
  onToggleVendor,
  onShowVendorDetail,
}) => {
  return (
    <View style={localStyles.section}>
      <View style={localStyles.sectionHeader}>
        <View>
          <Text style={localStyles.sectionTitle}>Vendors</Text>
          <Text style={localStyles.sectionSubtitle}>
            {selectedVendorsCount} selected
          </Text>
        </View>
      </View>

      {selectedVendorsCount > 0 && (
        <View style={localStyles.selectedVendorsSummary}>
          <Text style={localStyles.selectedVendorsTitle}>Assigned Vendors</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={localStyles.selectedVendorsList}
          >
            {vendors
              .filter((v) => v.selected)
              .map((vendor) => (
                <View key={vendor.id} style={localStyles.selectedVendorChip}>
                  <Image
                    source={{ uri: vendor.imageUrl }}
                    style={localStyles.selectedVendorImage}
                  />
                  <Text
                    style={localStyles.selectedVendorName}
                    numberOfLines={1}
                  >
                    {vendor.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => onToggleVendor(vendor.id)}
                    style={localStyles.selectedVendorRemove}
                  >
                    <Ionicons name="close-circle" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
          </ScrollView>
        </View>
      )}

      <View style={localStyles.vendorGrid}>
        {vendors.map((vendor) => (
          <TouchableOpacity
            key={vendor.id}
            style={[
              localStyles.vendorCard,
              vendor.selected && localStyles.vendorCardSelected,
            ]}
            onPress={() => onShowVendorDetail(vendor)}
            activeOpacity={0.8}
          >
            <View style={localStyles.vendorImageContainer}>
              <Image
                source={{ uri: vendor.imageUrl }}
                style={localStyles.vendorImage}
              />
              <View
                style={[
                  localStyles.vendorCategoryBadge,
                  {
                    backgroundColor: getCategoryColor(vendor.category) + "20",
                  },
                ]}
              >
                <Text
                  style={[
                    localStyles.vendorCategoryText,
                    {
                      color: getCategoryColor(vendor.category),
                    },
                  ]}
                >
                  {vendor.category}
                </Text>
              </View>
            </View>

            <View style={localStyles.vendorInfo}>
              <View style={localStyles.vendorHeader}>
                <Text style={localStyles.vendorName} numberOfLines={1}>
                  {vendor.name}
                </Text>
                {vendor.verified && (
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                )}
              </View>

              <View style={localStyles.vendorRatingRow}>
                <Ionicons
                  name="star"
                  size={14}
                  color="#F59E0B"
                  fill="#F59E0B"
                />
                <Text style={localStyles.vendorRating}>{vendor.rating}</Text>
                <Text style={localStyles.vendorReviews}>
                  ({vendor.reviews})
                </Text>
                <Text style={localStyles.vendorPrice}>{vendor.price}</Text>
              </View>

              <View style={localStyles.vendorActions}>
                <TouchableOpacity
                  style={localStyles.vendorActionButton}
                  onPress={() => onToggleVendor(vendor.id)}
                >
                  <Ionicons
                    name={vendor.selected ? "checkbox" : "square-outline"}
                    size={18}
                    color={vendor.selected ? "#10B981" : "#6B7280"}
                  />
                  <Text
                    style={[
                      localStyles.vendorActionText,
                      {
                        color: vendor.selected ? "#10B981" : "#6B7280",
                      },
                    ]}
                  >
                    {vendor.selected ? "Assigned" : "Assign"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  section: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: "#181114",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 12,
  },
  selectedVendorsSummary: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  selectedVendorsTitle: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  selectedVendorsList: {
    gap: 8,
  },
  selectedVendorChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 4,
    paddingRight: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedVendorImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  selectedVendorName: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 12,
    color: "#181114",
    maxWidth: 80,
  },
  selectedVendorRemove: {
    marginLeft: 4,
  },
  vendorGrid: {
    gap: 12,
  },
  vendorCard: {
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  vendorCardSelected: {
    borderColor: "#10B981",
    backgroundColor: "#f0fdf4",
  },
  vendorImageContainer: {
    position: "relative",
    height: 120,
  },
  vendorImage: {
    width: "100%",
    height: "100%",
  },
  vendorCategoryBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  vendorCategoryText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 11,
  },
  vendorInfo: {
    padding: 12,
  },
  vendorHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  vendorName: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: "#181114",
    flex: 1,
  },
  vendorRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  vendorRating: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 13,
    color: "#181114",
    marginLeft: 4,
  },
  vendorReviews: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
  },
  vendorPrice: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
  },
  vendorActions: {
    flexDirection: "row",
    gap: 8,
  },
  vendorActionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  vendorActionText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 12,
  },
});
