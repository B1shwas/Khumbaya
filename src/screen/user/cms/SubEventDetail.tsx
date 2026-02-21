import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ActivityItem, GuestItem } from "@/src/components/subevent";
import { useSubEvent } from "@/src/hooks/useSubEvent";
import { Vendor } from "@/src/types";

// ============================================
// Helper Functions
// ============================================

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    Music: "#8B5CF6",
    Decoration: "#10B981",
    Food: "#F59E0B",
    Photography: "#EC4899",
    Lighting: "#6366F1",
    Video: "#14B8A6",
    Catering: "#EF4444",
    Florist: "#F97316",
    Makeup: "#D946EF",
    DJ: "#06B6D4",
  };
  return colors[category] || "#6B7280";
};

// ============================================
// Main Component
// ============================================

export default function SubEventDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const subEventId = params.subEventId as string;

  // Use the hook
  const {
    template,
    date,
    theme,
    budget,
    activities,
    guests,
    vendors,
    isLoading,
    selectedVendorsCount,
    invitedGuestsCount,
    setDate,
    setTheme,
    setBudget,
    handleActivityToggle,
    handleActivityTimeChange,
    handleActivityBudgetChange,
    isActivitySelected,
    getSelectedActivity,
    handleToggleVendor,
    handleCallVendor,
    handleEmailVendor,
    handleToggleGuest,
    handleAddGuest,
    handleDeleteGuest,
    handleUploadExcel,
    saveSubEvent,
  } = useSubEvent(subEventId);

  // Modal states
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [showVendorContactModal, setShowVendorContactModal] = useState(false);
  const [showVendorDetailModal, setShowVendorDetailModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  // New guest form
  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestPhone, setNewGuestPhone] = useState("");
  const [newGuestEmail, setNewGuestEmail] = useState("");
  const [newGuestRelation, setNewGuestRelation] = useState("");

  // Excel import simulation
  const [excelFileName, setExcelFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const relations = [
    "Family",
    "Friend",
    "Colleague",
    "Neighbor",
    "Relative",
    "Other",
  ];

  // ============================================
  // Vendor Handlers
  // ============================================

  const handleShowVendorDetail = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowVendorDetailModal(true);
  };

  const handleContactVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowVendorContactModal(true);
  };

  // ============================================
  // Guest Handlers
  // ============================================

  const submitAddGuest = () => {
    if (!newGuestName.trim()) {
      Alert.alert("Error", "Please enter guest name");
      return;
    }

    handleAddGuest({
      name: newGuestName.trim(),
      phone: newGuestPhone.trim(),
      email: newGuestEmail.trim(),
      relation: newGuestRelation || "Other",
    });

    // Reset form
    setNewGuestName("");
    setNewGuestPhone("");
    setNewGuestEmail("");
    setNewGuestRelation("");
    setShowAddGuestModal(false);
  };

  const submitUploadExcel = () => {
    setIsUploading(true);
    handleUploadExcel().finally(() => {
      setIsUploading(false);
      setExcelFileName("guest_list.xlsx");
      setShowExcelModal(false);
    });
  };

  // ============================================
  // Navigation Handlers
  // ============================================

  const handleSave = async () => {
    await saveSubEvent();
    router.back();
  };

  const handleBack = () => {
    router.back();
  };

  // ============================================
  // Render
  // ============================================

  if (isLoading || !template) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ee2b8c" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#181114" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{template.name}</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Date & Theme & Budget Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Details</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="calendar-outline" size={20} color="#6B7280" />
            <TextInput
              style={styles.textInput}
              placeholder="Date (e.g., 15th March 2025)"
              placeholderTextColor="#9CA3AF"
              value={date}
              onChangeText={setDate}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="color-palette-outline" size={20} color="#6B7280" />
            <TextInput
              style={styles.textInput}
              placeholder="Theme (e.g., Royal, Traditional)"
              placeholderTextColor="#9CA3AF"
              value={theme}
              onChangeText={setTheme}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="wallet-outline" size={20} color="#6B7280" />
            <TextInput
              style={styles.textInput}
              placeholder="Total Budget (e.g., $5000)"
              placeholderTextColor="#9CA3AF"
              value={budget}
              onChangeText={setBudget}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Vendors Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Vendors</Text>
              <Text style={styles.sectionSubtitle}>
                {selectedVendorsCount} selected
              </Text>
            </View>
          </View>

          {/* Selected Vendors Summary */}
          {selectedVendorsCount > 0 && (
            <View style={styles.selectedVendorsSummary}>
              <Text style={styles.selectedVendorsTitle}>Assigned Vendors</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.selectedVendorsList}
              >
                {vendors
                  .filter((v) => v.selected)
                  .map((vendor) => (
                    <View key={vendor.id} style={styles.selectedVendorChip}>
                      <Image
                        source={{ uri: vendor.imageUrl }}
                        style={styles.selectedVendorImage}
                      />
                      <Text style={styles.selectedVendorName} numberOfLines={1}>
                        {vendor.name}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleToggleVendor(vendor.id)}
                        style={styles.selectedVendorRemove}
                      >
                        <Ionicons
                          name="close-circle"
                          size={18}
                          color="#EF4444"
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
              </ScrollView>
            </View>
          )}

          {/* Vendor Cards */}
          <View style={styles.vendorGrid}>
            {vendors.map((vendor) => (
              <TouchableOpacity
                key={vendor.id}
                style={[
                  styles.vendorCard,
                  vendor.selected && styles.vendorCardSelected,
                ]}
                onPress={() => handleShowVendorDetail(vendor)}
                activeOpacity={0.8}
              >
                <View style={styles.vendorImageContainer}>
                  <Image
                    source={{ uri: vendor.imageUrl }}
                    style={styles.vendorImage}
                  />
                  <View
                    style={[
                      styles.vendorCategoryBadge,
                      {
                        backgroundColor:
                          getCategoryColor(vendor.category) + "20",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.vendorCategoryText,
                        { color: getCategoryColor(vendor.category) },
                      ]}
                    >
                      {vendor.category}
                    </Text>
                  </View>
                  {vendor.verified && (
                    <View style={styles.verifiedBadge}>
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="#10B981"
                        fill="#10B981"
                      />
                    </View>
                  )}
                </View>

                <View style={styles.vendorInfo}>
                  <Text style={styles.vendorName} numberOfLines={1}>
                    {vendor.name}
                  </Text>
                  <View style={styles.vendorRatingRow}>
                    <Ionicons
                      name="star"
                      size={14}
                      color="#F59E0B"
                      fill="#F59E0B"
                    />
                    <Text style={styles.vendorRatingText}>{vendor.rating}</Text>
                    <Text style={styles.vendorReviewsText}>
                      ({vendor.reviews} reviews)
                    </Text>
                    <Text style={styles.vendorPriceText}>
                      {" "}
                      • {vendor.price}
                    </Text>
                  </View>
                  <Text style={styles.vendorExperience}>
                    {vendor.yearsExperience}+ years experience
                  </Text>
                  <View style={styles.vendorActions}>
                    <TouchableOpacity
                      style={[
                        styles.vendorSelectButton,
                        vendor.selected && styles.vendorSelectButtonSelected,
                      ]}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleToggleVendor(vendor.id);
                      }}
                    >
                      <Ionicons
                        name={
                          vendor.selected
                            ? "checkmark-circle"
                            : "add-circle-outline"
                        }
                        size={20}
                        color={vendor.selected ? "white" : "#ee2b8c"}
                      />
                      <Text
                        style={[
                          styles.vendorSelectText,
                          vendor.selected && styles.vendorSelectTextSelected,
                        ]}
                      >
                        {vendor.selected ? "Assigned" : "Assign"}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.vendorContactButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleContactVendor(vendor);
                      }}
                    >
                      <Ionicons name="call-outline" size={18} color="#ee2b8c" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Activities Section - Using Reusable Component */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Activities ({activities.length} selected)
          </Text>
          <Text style={styles.sectionSubtitle}>
            Select activities and set time & budget for each
          </Text>

          <View style={styles.activitiesList}>
            {template.activities.map((activity, index) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                index={index}
                isSelected={isActivitySelected(activity.id)}
                selectedData={getSelectedActivity(activity.id)}
                onToggle={handleActivityToggle}
                onTimeChange={handleActivityTimeChange}
                onBudgetChange={handleActivityBudgetChange}
              />
            ))}
          </View>
        </View>

        {/* Guest Management Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Guest List</Text>
              <Text style={styles.sectionSubtitle}>
                {invitedGuestsCount} guests invited
              </Text>
            </View>
            <TouchableOpacity
              style={styles.addGuestButton}
              onPress={() => setShowGuestModal(true)}
            >
              <Ionicons name="people-outline" size={20} color="white" />
              <Text style={styles.addGuestButtonText}>Manage</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.guestStats}>
            <View style={styles.guestStat}>
              <Text style={styles.guestStatNumber}>{guests.length}</Text>
              <Text style={styles.guestStatLabel}>Total</Text>
            </View>
            <View style={styles.guestStat}>
              <Text style={styles.guestStatNumber}>{invitedGuestsCount}</Text>
              <Text style={styles.guestStatLabel}>Invited</Text>
            </View>
            <View style={styles.guestStat}>
              <Text style={styles.guestStatNumber}>
                {guests.length - invitedGuestsCount}
              </Text>
              <Text style={styles.guestStatLabel}>Pending</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Guest Management Modal */}
      <Modal
        visible={showGuestModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowGuestModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Manage Guests</Text>
              <TouchableOpacity onPress={() => setShowGuestModal(false)}>
                <Ionicons name="close" size={24} color="#181114" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalActionButton}
                onPress={() => setShowAddGuestModal(true)}
              >
                <Ionicons name="person-add" size={20} color="#ee2b8c" />
                <Text style={styles.modalActionText}>Add Manually</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalActionButton}
                onPress={() => setShowExcelModal(true)}
              >
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color="#10B981"
                />
                <Text style={styles.modalActionText}>Upload Excel</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={guests}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <GuestItem
                  guest={item}
                  onToggleInvite={handleToggleGuest}
                  onDelete={handleDeleteGuest}
                />
              )}
              style={styles.guestList}
            />
          </View>
        </View>
      </Modal>

      {/* Vendor Detail Modal */}
      <Modal
        visible={showVendorDetailModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowVendorDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.vendorDetailModalContent}>
            <View style={styles.vendorDetailHeader}>
              <TouchableOpacity onPress={() => setShowVendorDetailModal(false)}>
                <Ionicons name="close" size={24} color="#181114" />
              </TouchableOpacity>
              <Text style={styles.vendorDetailTitle}>Vendor Details</Text>
              <View style={{ width: 40 }} />
            </View>

            {selectedVendor && (
              <ScrollView
                style={styles.vendorDetailContent}
                showsVerticalScrollIndicator={false}
              >
                <Image
                  source={{ uri: selectedVendor.imageUrl }}
                  style={styles.vendorDetailImage}
                />
                <View style={styles.vendorDetailInfo}>
                  <View style={styles.vendorDetailCategoryBadge}>
                    <Text
                      style={[
                        styles.vendorDetailCategoryText,
                        { color: getCategoryColor(selectedVendor.category) },
                      ]}
                    >
                      {selectedVendor.category}
                    </Text>
                  </View>

                  <Text style={styles.vendorDetailName}>
                    {selectedVendor.name}
                  </Text>

                  <View style={styles.vendorDetailRatingRow}>
                    <Ionicons
                      name="star"
                      size={16}
                      color="#F59E0B"
                      fill="#F59E0B"
                    />
                    <Text style={styles.vendorDetailRatingText}>
                      {selectedVendor.rating}
                    </Text>
                    <Text style={styles.vendorDetailReviewsText}>
                      ({selectedVendor.reviews} reviews)
                    </Text>
                    <Text style={styles.vendorDetailPriceText}>
                      {" "}
                      • {selectedVendor.price}
                    </Text>
                  </View>

                  {selectedVendor.verified && (
                    <View style={styles.vendorDetailVerified}>
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="#10B981"
                      />
                      <Text style={styles.vendorDetailVerifiedText}>
                        Verified Vendor
                      </Text>
                    </View>
                  )}

                  <Text style={styles.vendorDetailExperience}>
                    {selectedVendor.yearsExperience}+ years of experience
                  </Text>

                  <Text style={styles.vendorDetailDescription}>
                    {selectedVendor.description}
                  </Text>

                  <TouchableOpacity
                    style={[
                      styles.vendorDetailAssignButton,
                      selectedVendor.selected &&
                        styles.vendorDetailAssignButtonSelected,
                    ]}
                    onPress={() => {
                      handleToggleVendor(selectedVendor.id);
                      if (!selectedVendor.selected) {
                        setShowVendorDetailModal(false);
                      }
                    }}
                  >
                    <Ionicons
                      name={
                        selectedVendor.selected
                          ? "checkmark-circle"
                          : "add-circle-outline"
                      }
                      size={20}
                      color="white"
                    />
                    <Text style={styles.vendorDetailAssignButtonText}>
                      {selectedVendor.selected ? "Assigned" : "Assign to Event"}
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.vendorDetailContactButtons}>
                    <TouchableOpacity
                      style={styles.vendorDetailContactButton}
                      onPress={() => handleCallVendor(selectedVendor)}
                    >
                      <Ionicons name="call-outline" size={20} color="#ee2b8c" />
                      <Text style={styles.vendorDetailContactButtonText}>
                        Call
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.vendorDetailContactButton}
                      onPress={() => handleEmailVendor(selectedVendor)}
                    >
                      <Ionicons name="mail-outline" size={20} color="#ee2b8c" />
                      <Text style={styles.vendorDetailContactButtonText}>
                        Email
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Vendor Contact Modal */}
      <Modal
        visible={showVendorContactModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowVendorContactModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Contact Vendor</Text>
              <TouchableOpacity
                onPress={() => setShowVendorContactModal(false)}
              >
                <Ionicons name="close" size={24} color="#181114" />
              </TouchableOpacity>
            </View>

            {selectedVendor && (
              <View style={styles.contactContent}>
                <View style={styles.contactVendorInfo}>
                  <Image
                    source={{ uri: selectedVendor.imageUrl }}
                    style={styles.contactVendorImage}
                  />
                  <Text style={styles.contactVendorName}>
                    {selectedVendor.name}
                  </Text>
                  <Text style={styles.contactVendorCategory}>
                    {selectedVendor.category}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.contactButton}
                  onPress={() => handleCallVendor(selectedVendor)}
                >
                  <Ionicons name="call" size={24} color="white" />
                  <Text style={styles.contactButtonText}>
                    Call {selectedVendor.phone}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.contactButton}
                  onPress={() => handleEmailVendor(selectedVendor)}
                >
                  <Ionicons name="mail" size={24} color="white" />
                  <Text style={styles.contactButtonText}>
                    Email {selectedVendor.email}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Add Guest Modal */}
      <Modal
        visible={showAddGuestModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddGuestModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Guest</Text>
              <TouchableOpacity onPress={() => setShowAddGuestModal(false)}>
                <Ionicons name="close" size={24} color="#181114" />
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              <TextInput
                style={styles.formInput}
                placeholder="Guest Name *"
                placeholderTextColor="#9CA3AF"
                value={newGuestName}
                onChangeText={setNewGuestName}
              />
              <TextInput
                style={styles.formInput}
                placeholder="Phone Number"
                placeholderTextColor="#9CA3AF"
                value={newGuestPhone}
                onChangeText={setNewGuestPhone}
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.formInput}
                placeholder="Email Address"
                placeholderTextColor="#9CA3AF"
                value={newGuestEmail}
                onChangeText={setNewGuestEmail}
                keyboardType="email-address"
              />

              <View style={styles.relationContainer}>
                {relations.map((relation) => (
                  <TouchableOpacity
                    key={relation}
                    style={[
                      styles.relationChip,
                      newGuestRelation === relation &&
                        styles.relationChipSelected,
                    ]}
                    onPress={() => setNewGuestRelation(relation)}
                  >
                    <Text
                      style={[
                        styles.relationChipText,
                        newGuestRelation === relation && { color: "white" },
                      ]}
                    >
                      {relation}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.addButton}
                onPress={submitAddGuest}
              >
                <Text style={styles.addButtonText}>Add Guest</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Excel Upload Modal */}
      <Modal
        visible={showExcelModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowExcelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Upload Excel</Text>
              <TouchableOpacity onPress={() => setShowExcelModal(false)}>
                <Ionicons name="close" size={24} color="#181114" />
              </TouchableOpacity>
            </View>

            <View style={styles.uploadContainer}>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={submitUploadExcel}
                disabled={isUploading}
              >
                <Ionicons
                  name="cloud-upload-outline"
                  size={48}
                  color="#ee2b8c"
                />
                <Text style={styles.uploadTitle}>
                  {excelFileName || "Upload Guest List"}
                </Text>
                <Text style={styles.uploadSubtitle}>
                  {isUploading
                    ? "Uploading..."
                    : "Supported formats: .xlsx, .csv"}
                </Text>
              </TouchableOpacity>

              <Text style={styles.orText}>OR</Text>

              <TouchableOpacity
                style={styles.downloadButton}
                onPress={() => {
                  Alert.alert(
                    "Download Template",
                    "Download sample Excel template"
                  );
                }}
              >
                <Ionicons name="download-outline" size={20} color="#10B981" />
                <Text style={styles.downloadButtonText}>
                  Download Sample Template
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ============================================
// Styles
// ============================================

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f6f7",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f6f7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 18,
    color: "#181114",
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#ee2b8c",
    borderRadius: 8,
  },
  saveButtonText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "white",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  textInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: "#181114",
  },
  // Vendor Section Styles
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  vendorCategoryText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 11,
  },
  verifiedBadge: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  vendorInfo: {
    padding: 12,
  },
  vendorName: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: "#181114",
    marginBottom: 4,
  },
  vendorRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  vendorRatingText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 12,
    color: "#181114",
    marginLeft: 4,
  },
  vendorReviewsText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 11,
    color: "#6B7280",
    marginLeft: 2,
  },
  vendorPriceText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 11,
    color: "#6B7280",
  },
  vendorExperience: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 12,
  },
  vendorActions: {
    flexDirection: "row",
    gap: 8,
  },
  vendorSelectButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fceaf4",
    borderRadius: 10,
    paddingVertical: 10,
    gap: 4,
  },
  vendorSelectButtonSelected: {
    backgroundColor: "#10B981",
  },
  vendorSelectText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 12,
    color: "#ee2b8c",
  },
  vendorSelectTextSelected: {
    color: "white",
  },
  vendorContactButton: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#fceaf4",
    alignItems: "center",
    justifyContent: "center",
  },
  // Activities Section
  activitiesList: {
    gap: 8,
  },
  // Guest Section
  addGuestButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ee2b8c",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  addGuestButtonText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 13,
    color: "white",
  },
  guestStats: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
  },
  guestStat: {
    flex: 1,
    alignItems: "center",
  },
  guestStatNumber: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 20,
    color: "#181114",
  },
  guestStatLabel: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 11,
    color: "#6B7280",
  },
  bottomSpacing: {
    height: 100,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
    maxHeight: "85%",
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
  modalActions: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  modalActionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  modalActionText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 13,
    color: "#181114",
  },
  guestList: {
    paddingHorizontal: 16,
  },
  // Form Styles
  formContainer: {
    padding: 16,
  },
  formInput: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: "#181114",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  relationContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  relationChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  relationChipSelected: {
    backgroundColor: "#ee2b8c",
    borderColor: "#ee2b8c",
  },
  relationChipText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 12,
    color: "#6B7280",
  },
  addButton: {
    backgroundColor: "#ee2b8c",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  addButtonText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: "white",
  },
  // Upload Styles
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
  // Vendor Detail Modal
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
  // Contact Modal
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
