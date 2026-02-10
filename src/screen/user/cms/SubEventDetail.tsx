import {
    SUB_EVENT_TEMPLATES,
    SubEventTemplate,
    TemplateActivity,
} from "@/src/data/subeventTemplates";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
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

// ============================================
// Types
// ============================================

interface SelectedActivity {
  activity: TemplateActivity;
  time: string;
  budget: string;
}

interface Guest {
  id: string;
  name: string;
  phone: string;
  email: string;
  relation: string;
  invited: boolean;
}

interface Vendor {
  id: string;
  name: string;
  category: string;
  rating: number;
  price: string;
  phone?: string;
  email?: string;
  selected?: boolean;
  imageUrl?: string;
  verified?: boolean;
  reviews?: number;
  yearsExperience?: number;
  description?: string;
}

export default function SubEventDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const subEventId = params.subEventId as string;
  const eventId = params.eventId as string;
  const isNew = params.isNew === "true";

  const [template, setTemplate] = useState<SubEventTemplate | null>(null);
  const [date, setDate] = useState("");
  const [theme, setTheme] = useState("");
  const [budget, setBudget] = useState("");
  const [activities, setActivities] = useState<SelectedActivity[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);

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

  // Vendor category colors
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

  // Get vendor placeholder image based on category
  const getVendorPlaceholderImage = (category: string): string => {
    const images: Record<string, string> = {
      Music:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop",
      Decoration:
        "https://images.unsplash.com/photo-1519225421980-715cb0202128?w=200&h=200&fit=crop",
      Food: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=200&fit=crop",
      Photography:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&h=200&fit=crop",
      Lighting:
        "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=200&h=200&fit=crop",
      Video:
        "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=200&h=200&fit=crop",
      Catering:
        "https://images.unsplash.com/photo-1555244162-803834f70033?w=200&h=200&fit=crop",
      Florist:
        "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=200&h=200&fit=crop",
      Makeup:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop",
      DJ: "https://images.unsplash.com/photo-1571266028243-3716002dbc84?w=200&h=200&fit=crop",
    };
    return (
      images[category] ||
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=200&fit=crop"
    );
  };

  useEffect(() => {
    // Load template data
    const foundTemplate = SUB_EVENT_TEMPLATES.find((t) => t.id === subEventId);
    if (foundTemplate) {
      setTemplate(foundTemplate);
    }

    // Initialize mock vendors with images
    setVendors([
      {
        id: "v1",
        name: "DJ Beats Pro",
        category: "Music",
        rating: 4.8,
        price: "$$$",
        phone: "+91 98765 12345",
        email: "djbeats@email.com",
        verified: true,
        reviews: 124,
        yearsExperience: 8,
        description:
          "Professional DJ services for weddings and parties with state-of-the-art equipment.",
        imageUrl: getVendorPlaceholderImage("Music"),
      },
      {
        id: "v2",
        name: "Flower Decor Studio",
        category: "Decoration",
        rating: 4.9,
        price: "$$",
        phone: "+91 98765 12346",
        email: "flowers@email.com",
        verified: true,
        reviews: 89,
        yearsExperience: 12,
        description:
          "Exquisite floral arrangements and venue decoration for all occasions.",
        imageUrl: getVendorPlaceholderImage("Decoration"),
      },
      {
        id: "v3",
        name: "Catering Kings",
        category: "Food",
        rating: 4.7,
        price: "$$$",
        phone: "+91 98765 12347",
        email: "catering@email.com",
        verified: true,
        reviews: 156,
        yearsExperience: 15,
        description:
          "Multi-cuisine catering with live cooking stations and bar service.",
        imageUrl: getVendorPlaceholderImage("Food"),
      },
      {
        id: "v4",
        name: "Photo Moments",
        category: "Photography",
        rating: 4.9,
        price: "$$",
        phone: "+91 98765 12348",
        email: "photo@email.com",
        verified: true,
        reviews: 203,
        yearsExperience: 10,
        description:
          "Capturing your precious moments with cinematic photography and albums.",
        imageUrl: getVendorPlaceholderImage("Photography"),
      },
      {
        id: "v5",
        name: "Lighting Masters",
        category: "Lighting",
        rating: 4.6,
        price: "$$$",
        phone: "+91 98765 12349",
        email: "lighting@email.com",
        verified: false,
        reviews: 45,
        yearsExperience: 5,
        description:
          "Transform your venue with stunning LED lighting, dance floors, and special effects.",
        imageUrl: getVendorPlaceholderImage("Lighting"),
      },
    ]);

    // Initialize mock guests
    setGuests([
      {
        id: "1",
        name: "Priya Sharma",
        phone: "+91 98765 43210",
        email: "priya@email.com",
        relation: "Friend",
        invited: false,
      },
      {
        id: "2",
        name: "Rahul Kapoor",
        phone: "+91 98765 43211",
        email: "rahul@email.com",
        relation: "Family",
        invited: false,
      },
      {
        id: "3",
        name: "Sarah Jenkins",
        phone: "+1 555-123-4567",
        email: "sarah@email.com",
        relation: "Friend",
        invited: false,
      },
      {
        id: "4",
        name: "Mike Ross",
        phone: "+1 555-234-5678",
        email: "mike@email.com",
        relation: "Colleague",
        invited: false,
      },
      {
        id: "5",
        name: "Amara Singh",
        phone: "+91 98765 43212",
        email: "amara@email.com",
        relation: "Family",
        invited: false,
      },
    ]);
  }, [subEventId]);

  // ============================================
  // Activity Handlers
  // ============================================

  const handleActivityToggle = (activity: TemplateActivity) => {
    const existingIndex = activities.findIndex(
      (a) => a.activity.id === activity.id,
    );

    if (existingIndex >= 0) {
      setActivities((prev) =>
        prev.filter((a) => a.activity.id !== activity.id),
      );
    } else {
      setActivities((prev) => [...prev, { activity, time: "", budget: "" }]);
    }
  };

  const handleActivityTimeChange = (activityId: string, time: string) => {
    setActivities((prev) =>
      prev.map((a) => (a.activity.id === activityId ? { ...a, time } : a)),
    );
  };

  const handleActivityBudgetChange = (activityId: string, budget: string) => {
    setActivities((prev) =>
      prev.map((a) => (a.activity.id === activityId ? { ...a, budget } : a)),
    );
  };

  const isActivitySelected = (activityId: string): boolean => {
    return activities.some((a) => a.activity.id === activityId);
  };

  const getSelectedActivity = (
    activityId: string,
  ): SelectedActivity | undefined => {
    return activities.find((a) => a.activity.id === activityId);
  };

  // ============================================
  // Vendor Handlers
  // ============================================

  const handleToggleVendor = (vendorId: string) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendorId ? { ...v, selected: !v.selected } : v,
      ),
    );
  };

  const handleShowVendorDetail = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowVendorDetailModal(true);
  };

  const handleContactVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowVendorContactModal(true);
  };

  const handleCallVendor = (vendor: Vendor) => {
    Alert.alert("Call", `Calling ${vendor.name} at ${vendor.phone}`);
  };

  const handleEmailVendor = (vendor: Vendor) => {
    Alert.alert("Email", `Emailing ${vendor.name} at ${vendor.email}`);
  };

  const selectedVendorsCount = vendors.filter((v) => v.selected).length;

  // ============================================
  // Guest Handlers
  // ============================================

  const handleToggleGuest = (guestId: string) => {
    setGuests((prev) =>
      prev.map((g) => (g.id === guestId ? { ...g, invited: !g.invited } : g)),
    );
  };

  const handleAddGuest = () => {
    if (!newGuestName.trim()) {
      Alert.alert("Error", "Please enter guest name");
      return;
    }

    const newGuest: Guest = {
      id: Date.now().toString(),
      name: newGuestName.trim(),
      phone: newGuestPhone.trim(),
      email: newGuestEmail.trim(),
      relation: newGuestRelation || "Other",
      invited: true,
    };

    setGuests((prev) => [...prev, newGuest]);

    // Reset form
    setNewGuestName("");
    setNewGuestPhone("");
    setNewGuestEmail("");
    setNewGuestRelation("");
    setShowAddGuestModal(false);
  };

  const handleDeleteGuest = (guestId: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== guestId));
  };

  const handleUploadExcel = () => {
    // Simulate Excel upload
    setIsUploading(true);

    setTimeout(() => {
      setIsUploading(false);
      setExcelFileName("guest_list.xlsx");

      // Add mock guests from Excel
      const excelGuests: Guest[] = [
        {
          id: "excel1",
          name: "Amit Patel",
          phone: "+91 98765 44444",
          email: "amit@email.com",
          relation: "Family",
          invited: true,
        },
        {
          id: "excel2",
          name: "Neha Gupta",
          phone: "+91 98765 55555",
          email: "neha@email.com",
          relation: "Friend",
          invited: true,
        },
        {
          id: "excel3",
          name: "Vikram Singh",
          phone: "+91 98765 66666",
          email: "vikram@email.com",
          relation: "Colleague",
          invited: true,
        },
      ];

      setGuests((prev) => [...prev, ...excelGuests]);

      Alert.alert("Success", "Guests imported successfully!");
      setShowExcelModal(false);
    }, 2000);
  };

  const invitedGuestsCount = guests.filter((g) => g.invited).length;

  // ============================================
  // Navigation Handlers
  // ============================================

  const handleSave = () => {
    console.log("Saving sub-event:", {
      template,
      date,
      theme,
      budget,
      activities,
      vendors: vendors.filter((v) => v.selected),
      invitedGuests: guests.filter((g) => g.invited),
    });
    router.back();
  };

  const handleBack = () => {
    router.back();
  };

  // ============================================
  // Render
  // ============================================

  if (!template) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
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

        {/* Vendors Section - Enhanced with Images */}
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

          {/* Vendor Cards with Images */}
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
                {/* Vendor Image */}
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
                        {
                          color: getCategoryColor(vendor.category),
                        },
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
                    <Text
                      style={styles.vendorPriceText}
                    >{` • ${vendor.price}`}</Text>
                  </View>

                  <Text style={styles.vendorExperience}>
                    {vendor.yearsExperience}+ years experience
                  </Text>

                  {/* Action Buttons */}
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

        {/* Activities Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Activities ({activities.length} selected)
          </Text>
          <Text style={styles.sectionSubtitle}>
            Select activities and set time & budget for each
          </Text>

          <View style={styles.activitiesList}>
            {template.activities.map((activity, index) => {
              const selected = isActivitySelected(activity.id);
              const selectedData = getSelectedActivity(activity.id);

              return (
                <TouchableOpacity
                  key={activity.id}
                  style={[
                    styles.activityItem,
                    selected && styles.activityItemSelected,
                  ]}
                  onPress={() => handleActivityToggle(activity)}
                >
                  <View style={styles.activityHeader}>
                    <View
                      style={[
                        styles.activityCheckbox,
                        selected && styles.activityCheckboxSelected,
                      ]}
                    >
                      {selected && (
                        <Ionicons name="checkmark" size={14} color="white" />
                      )}
                    </View>
                    <View style={styles.activityInfo}>
                      <Text
                        style={[
                          styles.activityTitle,
                          selected && styles.activityTitleSelected,
                        ]}
                      >
                        {index + 1}. {activity.title}
                      </Text>
                      <Text style={styles.activityDescription}>
                        {activity.description}
                      </Text>
                    </View>
                  </View>

                  {selected && (
                    <View style={styles.activityInputsContainer}>
                      <View style={styles.activityInputRow}>
                        <Ionicons
                          name="time-outline"
                          size={16}
                          color="#6B7280"
                        />
                        <TextInput
                          style={styles.activityInput}
                          placeholder="Time (e.g., 2:00 PM)"
                          placeholderTextColor="#9CA3AF"
                          value={selectedData?.time || ""}
                          onChangeText={(text) =>
                            handleActivityTimeChange(activity.id, text)
                          }
                        />
                      </View>
                      <View style={styles.activityInputRow}>
                        <Ionicons
                          name="wallet-outline"
                          size={16}
                          color="#6B7280"
                        />
                        <TextInput
                          style={styles.activityInput}
                          placeholder="Budget (e.g., $500)"
                          placeholderTextColor="#9CA3AF"
                          value={selectedData?.budget || ""}
                          onChangeText={(text) =>
                            handleActivityBudgetChange(activity.id, text)
                          }
                          keyboardType="numeric"
                        />
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
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

          {/* Quick Guest Stats */}
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

            {/* Quick Actions */}
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

            {/* Guest List */}
            <FlatList
              data={guests}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.guestItem,
                    item.invited && styles.guestItemInvited,
                  ]}
                >
                  <TouchableOpacity
                    style={styles.guestToggle}
                    onPress={() => handleToggleGuest(item.id)}
                  >
                    <View
                      style={[
                        styles.inviteCheckbox,
                        item.invited && styles.inviteCheckboxSelected,
                      ]}
                    >
                      {item.invited && (
                        <Ionicons name="checkmark" size={14} color="white" />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.guestName,
                        item.invited && styles.guestNameInvited,
                      ]}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>

                  <Text style={styles.guestRelation} numberOfLines={1}>
                    {item.relation}
                  </Text>

                  <TouchableOpacity
                    onPress={() => handleDeleteGuest(item.id)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
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
                        {
                          color: getCategoryColor(selectedVendor.category),
                        },
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
                    <Text
                      style={styles.vendorDetailPriceText}
                    >{` • ${selectedVendor.price}`}</Text>
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

                  {/* Assign Button */}
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

                  {/* Contact Buttons */}
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
                        newGuestRelation === relation && {
                          color: "white",
                        },
                      ]}
                    >
                      {relation}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddGuest}
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
                onPress={handleUploadExcel}
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
                    "Download sample Excel template",
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

const styles = StyleSheet.create({
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
  activityItem: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },
  activityItemSelected: {
    backgroundColor: "#fceaf4",
    borderColor: "#ee2b8c",
  },
  activityHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  activityCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  activityCheckboxSelected: {
    backgroundColor: "#ee2b8c",
    borderColor: "#ee2b8c",
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "#181114",
  },
  activityTitleSelected: {
    color: "#ee2b8c",
  },
  activityDescription: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  activityInputsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  activityInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  activityInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 13,
    color: "#181114",
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
  guestItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  guestItemInvited: {
    backgroundColor: "#f0fdf4",
  },
  guestToggle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  inviteCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  inviteCheckboxSelected: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  guestName: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "#181114",
  },
  guestNameInvited: {
    color: "#10B981",
  },
  guestRelation: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: "#6B7280",
    marginRight: 12,
    maxWidth: 80,
  },
  deleteButton: {
    padding: 4,
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
