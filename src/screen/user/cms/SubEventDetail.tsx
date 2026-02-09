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
}

export default function SubEventDetail() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const subEventId = params.subEventId as string;
    const eventId = params.eventId as string;

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

    useEffect(() => {
        // Load template data
        const foundTemplate = SUB_EVENT_TEMPLATES.find(
            (t) => t.id === subEventId
        );
        if (foundTemplate) {
            setTemplate(foundTemplate);
        }

        // Initialize mock vendors
        setVendors([
            {
                id: "v1",
                name: "DJ Beats Pro",
                category: "Music",
                rating: 4.8,
                price: "$$$",
                phone: "+91 98765 12345",
                email: "djbeats@email.com",
            },
            {
                id: "v2",
                name: "Flower Decor Studio",
                category: "Decoration",
                rating: 4.9,
                price: "$$",
                phone: "+91 98765 12346",
                email: "flowers@email.com",
            },
            {
                id: "v3",
                name: "Catering Kings",
                category: "Food",
                rating: 4.7,
                price: "$$$",
                phone: "+91 98765 12347",
                email: "catering@email.com",
            },
            {
                id: "v4",
                name: "Photo Moments",
                category: "Photography",
                rating: 4.9,
                price: "$$",
                phone: "+91 98765 12348",
                email: "photo@email.com",
            },
            {
                id: "v5",
                name: "Lighting Masters",
                category: "Lighting",
                rating: 4.6,
                price: "$$$",
                phone: "+91 98765 12349",
                email: "lighting@email.com",
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
            (a) => a.activity.id === activity.id
        );

        if (existingIndex >= 0) {
            setActivities((prev) =>
                prev.filter((a) => a.activity.id !== activity.id)
            );
        } else {
            setActivities((prev) => [
                ...prev,
                { activity, time: "", budget: "" },
            ]);
        }
    };

    const handleActivityTimeChange = (activityId: string, time: string) => {
        setActivities((prev) =>
            prev.map((a) =>
                a.activity.id === activityId ? { ...a, time } : a
            )
        );
    };

    const handleActivityBudgetChange = (
        activityId: string,
        budget: string
    ) => {
        setActivities((prev) =>
            prev.map((a) =>
                a.activity.id === activityId ? { ...a, budget } : a
            )
        );
    };

    const isActivitySelected = (activityId: string): boolean => {
        return activities.some((a) => a.activity.id === activityId);
    };

    const getSelectedActivity = (
        activityId: string
    ): SelectedActivity | undefined => {
        return activities.find((a) => a.activity.id === activityId);
    };

    // ============================================
    // Vendor Handlers
    // ============================================

    const handleToggleVendor = (vendorId: string) => {
        setVendors((prev) =>
            prev.map((v) =>
                v.id === vendorId ? { ...v, selected: !v.selected } : v
            )
        );
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
            prev.map((g) =>
                g.id === guestId ? { ...g, invited: !g.invited } : g
            )
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
                                    onPress={() =>
                                        handleActivityToggle(activity)
                                    }
                                >
                                    <View style={styles.activityHeader}>
                                        <View
                                            style={[
                                                styles.activityCheckbox,
                                                selected &&
                                                    styles.activityCheckboxSelected,
                                            ]}
                                        >
                                            {selected && (
                                                <Ionicons
                                                    name="checkmark"
                                                    size={14}
                                                    color="white"
                                                />
                                            )}
                                        </View>
                                        <View style={styles.activityInfo}>
                                            <Text
                                                style={[
                                                    styles.activityTitle,
                                                    selected &&
                                                        styles.activityTitleSelected,
                                                ]}
                                            >
                                                {index + 1}. {activity.title}
                                            </Text>
                                            <Text
                                                style={
                                                    styles.activityDescription
                                                }
                                            >
                                                {activity.description}
                                            </Text>
                                        </View>
                                    </View>

                                    {selected && (
                                        <View
                                            style={
                                                styles.activityInputsContainer
                                            }
                                        >
                                            <View
                                                style={
                                                    styles.activityInputRow
                                                }
                                            >
                                                <Ionicons
                                                    name="time-outline"
                                                    size={16}
                                                    color="#6B7280"
                                                />
                                                <TextInput
                                                    style={
                                                        styles.activityInput
                                                    }
                                                    placeholder="Time (e.g., 2:00 PM)"
                                                    placeholderTextColor="#9CA3AF"
                                                    value={selectedData?.time || ""}
                                                    onChangeText={(text) =>
                                                        handleActivityTimeChange(
                                                            activity.id,
                                                            text
                                                        )
                                                    }
                                                />
                                            </View>
                                            <View
                                                style={
                                                    styles.activityInputRow
                                                }
                                            >
                                                <Ionicons
                                                    name="wallet-outline"
                                                    size={16}
                                                    color="#6B7280"
                                                />
                                                <TextInput
                                                    style={
                                                        styles.activityInput
                                                    }
                                                    placeholder="Budget (e.g., $500)"
                                                    placeholderTextColor="#9CA3AF"
                                                    value={selectedData?.budget || ""}
                                                    onChangeText={(text) =>
                                                        handleActivityBudgetChange(
                                                            activity.id,
                                                            text
                                                        )
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

                    {vendors.map((vendor) => (
                        <View
                            key={vendor.id}
                            style={[
                                styles.vendorCard,
                                vendor.selected && styles.vendorCardSelected,
                            ]}
                        >
                            <View style={styles.vendorInfo}>
                                <View style={styles.vendorHeader}>
                                    <Text style={styles.vendorName}>
                                        {vendor.name}
                                    </Text>
                                    {vendor.selected && (
                                        <View style={styles.selectedBadge}>
                                            <Text
                                                style={
                                                    styles.selectedBadgeText
                                                }
                                            >
                                                Selected
                                            </Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.vendorCategory}>
                                    {vendor.category}
                                </Text>
                                <View style={styles.vendorRating}>
                                    <Ionicons
                                        name="star"
                                        size={14}
                                        color="#F59E0B"
                                        fill="#F59E0B"
                                    />
                                    <Text style={styles.vendorRatingText}>
                                        {vendor.rating}
                                    </Text>
                                    <Text
                                        style={styles.vendorPrice}
                                    >{` • ${vendor.price}`}</Text>
                                </View>
                            </View>
                            <View style={styles.vendorActions}>
                                <TouchableOpacity
                                    style={[
                                        styles.vendorSelectButton,
                                        vendor.selected &&
                                            styles.vendorSelectButtonSelected,
                                    ]}
                                    onPress={() =>
                                        handleToggleVendor(vendor.id)
                                    }
                                >
                                    <Ionicons
                                        name={
                                            vendor.selected
                                                ? "checkmark-circle"
                                                : "add-circle-outline"
                                        }
                                        size={20}
                                        color={
                                            vendor.selected ? "white" : "#ee2b8c"
                                        }
                                    />
                                    <Text
                                        style={[
                                            styles.vendorSelectText,
                                            vendor.selected &&
                                                styles.vendorSelectTextSelected,
                                        ]}
                                    >
                                        {vendor.selected ? "Selected" : "Select"}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.vendorContactButton}
                                    onPress={() => handleContactVendor(vendor)}
                                >
                                    <Ionicons
                                        name="call-outline"
                                        size={18}
                                        color="#ee2b8c"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
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
                            <Ionicons
                                name="people-outline"
                                size={20}
                                color="white"
                            />
                            <Text style={styles.addGuestButtonText}>
                                Manage
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Quick Guest Stats */}
                    <View style={styles.guestStats}>
                        <View style={styles.guestStat}>
                            <Text style={styles.guestStatNumber}>
                                {guests.length}
                            </Text>
                            <Text style={styles.guestStatLabel}>Total</Text>
                        </View>
                        <View style={styles.guestStat}>
                            <Text style={styles.guestStatNumber}>
                                {invitedGuestsCount}
                            </Text>
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
                            <TouchableOpacity
                                onPress={() => setShowGuestModal(false)}
                            >
                                <Ionicons name="close" size={24} color="#181114" />
                            </TouchableOpacity>
                        </View>

                        {/* Quick Actions */}
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.modalActionButton}
                                onPress={() => setShowAddGuestModal(true)}
                            >
                                <Ionicons
                                    name="person-add"
                                    size={20}
                                    color="#ee2b8c"
                                />
                                <Text style={styles.modalActionText}>
                                    Add Manually
                                </Text>
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
                                <Text style={styles.modalActionText}>
                                    Upload Excel
                                </Text>
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
                                        onPress={() =>
                                            handleToggleGuest(item.id)
                                        }
                                    >
                                        <View
                                            style={[
                                                styles.inviteCheckbox,
                                                item.invited &&
                                                    styles.inviteCheckboxSelected,
                                            ]}
                                        >
                                            {item.invited && (
                                                <Ionicons
                                                    name="checkmark"
                                                    size={14}
                                                    color="white"
                                                />
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                    <View style={styles.guestInfo}>
                                        <Text style={styles.guestName}>
                                            {item.name}
                                        </Text>
                                        <Text style={styles.guestDetails}>
                                            {item.relation} • {item.phone}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() =>
                                            handleDeleteGuest(item.id)
                                        }
                                    >
                                        <Ionicons
                                            name="trash-outline"
                                            size={18}
                                            color="#EF4444"
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}
                            contentContainerStyle={styles.guestList}
                        />

                        <TouchableOpacity
                            style={styles.modalSaveButton}
                            onPress={() => setShowGuestModal(false)}
                        >
                            <Text style={styles.modalSaveButtonText}>Done</Text>
                        </TouchableOpacity>
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
                            <Text style={styles.modalTitle}>Add Guest Manually</Text>
                            <TouchableOpacity
                                onPress={() => setShowAddGuestModal(false)}
                            >
                                <Ionicons name="close" size={24} color="#181114" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.formScroll}>
                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Guest Name *</Text>
                                <TextInput
                                    style={styles.formInput}
                                    placeholder="Enter guest name"
                                    placeholderTextColor="#9CA3AF"
                                    value={newGuestName}
                                    onChangeText={setNewGuestName}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Phone Number</Text>
                                <TextInput
                                    style={styles.formInput}
                                    placeholder="Enter phone number"
                                    placeholderTextColor="#9CA3AF"
                                    value={newGuestPhone}
                                    onChangeText={setNewGuestPhone}
                                    keyboardType="phone-pad"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Email</Text>
                                <TextInput
                                    style={styles.formInput}
                                    placeholder="Enter email"
                                    placeholderTextColor="#9CA3AF"
                                    value={newGuestEmail}
                                    onChangeText={setNewGuestEmail}
                                    keyboardType="email-address"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Relationship</Text>
                                <View style={styles.relationChips}>
                                    {relations.map((relation) => (
                                        <TouchableOpacity
                                            key={relation}
                                            style={[
                                                styles.relationChip,
                                                newGuestRelation ===
                                                    relation &&
                                                    styles.relationChipSelected,
                                            ]}
                                            onPress={() =>
                                                setNewGuestRelation(relation)
                                            }
                                        >
                                            <Text
                                                style={[
                                                    styles.relationChipText,
                                                    newGuestRelation ===
                                                        relation &&
                                                        styles.relationChipTextSelected,
                                                ]}
                                            >
                                                {relation}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </ScrollView>

                        <TouchableOpacity
                            style={styles.modalSaveButton}
                            onPress={handleAddGuest}
                        >
                            <Text style={styles.modalSaveButtonText}>Add Guest</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Excel Upload Modal */}
            <Modal
                visible={showExcelModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => !isUploading && setShowExcelModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Upload Guest List</Text>
                            <TouchableOpacity
                                onPress={() =>
                                    !isUploading && setShowExcelModal(false)
                                }
                                disabled={isUploading}
                            >
                                <Ionicons
                                    name="close"
                                    size={24}
                                    color={isUploading ? "#D1D5DB" : "#181114"}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.excelUploadArea}>
                            {isUploading ? (
                                <View style={styles.uploadingContainer}>
                                    <Ionicons
                                        name="cloud-upload-outline"
                                        size={48}
                                        color="#ee2b8c"
                                    />
                                    <Text style={styles.uploadingText}>
                                        Uploading...
                                    </Text>
                                    <Text
                                        style={styles.uploadingSubtext}
                                    >
                                        Please wait while we process your file
                                    </Text>
                                </View>
                            ) : excelFileName ? (
                                <View style={styles.uploadedContainer}>
                                    <Ionicons
                                        name="document-text"
                                        size={48}
                                        color="#10B981"
                                    />
                                    <Text style={styles.uploadedFileName}>
                                        {excelFileName}
                                    </Text>
                                    <Text style={styles.uploadedCount}>
                                        3 guests imported
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.uploadAgainButton}
                                        onPress={() => setExcelFileName("")}
                                    >
                                        <Text
                                            style={styles.uploadAgainText}
                                        >
                                            Upload Different File
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={styles.uploadButton}
                                    onPress={handleUploadExcel}
                                >
                                    <Ionicons
                                        name="cloud-upload-outline"
                                        size={48}
                                        color="#ee2b8c"
                                    />
                                    <Text style={styles.uploadTitle}>
                                        Upload Excel File
                                    </Text>
                                    <Text style={styles.uploadSubtitle}>
                                        Supported formats: .xlsx, .xls, .csv
                                    </Text>
                                    <Text style={styles.uploadHint}>
                                        Make sure columns include: Name, Phone,
                                        Email, Relation
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {!isUploading && (
                            <TouchableOpacity
                                style={styles.modalSaveButton}
                                onPress={() => setShowExcelModal(false)}
                            >
                                <Text style={styles.modalSaveButtonText}>
                                    Done
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Modal>

            {/* Vendor Contact Modal */}
            <Modal
                visible={showVendorContactModal}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setShowVendorContactModal(false)}
            >
                <View style={styles.contactModalOverlay}>
                    <View style={styles.contactModalContent}>
                        {selectedVendor && (
                            <>
                                <View style={styles.contactModalHeader}>
                                    <Text style={styles.contactModalTitle}>
                                        Contact {selectedVendor.name}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() =>
                                            setShowVendorContactModal(false)
                                        }
                                    >
                                        <Ionicons
                                            name="close"
                                            size={24}
                                            color="#181114"
                                        />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.contactModalBody}>
                                    <TouchableOpacity
                                        style={styles.contactOption}
                                        onPress={() => {
                                            setShowVendorContactModal(false);
                                            handleCallVendor(selectedVendor);
                                        }}
                                    >
                                        <View
                                            style={
                                                styles.contactOptionIconCall
                                            }
                                        >
                                            <Ionicons
                                                name="call"
                                                size={24}
                                                color="white"
                                            />
                                        </View>
                                        <View style={styles.contactOptionInfo}>
                                            <Text
                                                style={
                                                    styles.contactOptionTitle
                                                }
                                            >
                                                Call
                                            </Text>
                                            <Text
                                                style={
                                                    styles.contactOptionValue
                                                }
                                            >
                                                {selectedVendor.phone}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.contactOption}
                                        onPress={() => {
                                            setShowVendorContactModal(false);
                                            handleEmailVendor(selectedVendor);
                                        }}
                                    >
                                        <View
                                            style={
                                                styles.contactOptionIconEmail
                                            }
                                        >
                                            <Ionicons
                                                name="mail"
                                                size={24}
                                                color="white"
                                            />
                                        </View>
                                        <View style={styles.contactOptionInfo}>
                                            <Text
                                                style={
                                                    styles.contactOptionTitle
                                                }
                                            >
                                                Email
                                            </Text>
                                            <Text
                                                style={
                                                    styles.contactOptionValue
                                                }
                                            >
                                                {selectedVendor.email}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.contactOption}
                                        onPress={() => {
                                            Alert.alert(
                                                "Message",
                                                "Messaging feature coming soon!"
                                            );
                                        }}
                                    >
                                        <View
                                            style={
                                                styles.contactOptionIconMessage
                                            }
                                        >
                                            <Ionicons
                                                name="chatbubble-ellipses"
                                                size={24}
                                                color="white"
                                            />
                                        </View>
                                        <View style={styles.contactOptionInfo}>
                                            <Text
                                                style={
                                                    styles.contactOptionTitle
                                                }
                                            >
                                                Message
                                            </Text>
                                            <Text
                                                style={
                                                    styles.contactOptionValue
                                                }
                                            >
                                                Send WhatsApp/SMS
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
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
        paddingTop: 60,
        paddingBottom: 8,
        backgroundColor: "white",
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#F3F4F6",
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        fontFamily: "PlusJakartaSans-Bold",
        fontSize: 18,
        color: "#181114",
    },
    saveButton: {
        backgroundColor: "#ee2b8c",
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    saveButtonText: {
        fontFamily: "PlusJakartaSans-Bold",
        fontSize: 14,
        color: "white",
    },
    scrollView: {
        flex: 1,
    },
    section: {
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    sectionTitle: {
        fontFamily: "PlusJakartaSans-Bold",
        fontSize: 18,
        color: "#181114",
    },
    sectionSubtitle: {
        fontFamily: "PlusJakartaSans-Regular",
        fontSize: 14,
        color: "#6B7280",
        marginTop: 4,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 12,
        paddingHorizontal: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    textInput: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 10,
        fontFamily: "PlusJakartaSans-Regular",
        fontSize: 14,
        color: "#181114",
    },
    activitiesList: {
        marginBottom: 16,
    },
    activityItem: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 14,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    activityItemSelected: {
        backgroundColor: "#FDF2F8",
        borderColor: "#F472B6",
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
        borderColor: "#D1D5DB",
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
        marginLeft: 34,
    },
    activityInputRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        marginBottom: 8,
    },
    activityInput: {
        flex: 1,
        marginLeft: 8,
        fontFamily: "PlusJakartaSans-Regular",
        fontSize: 14,
        color: "#181114",
    },
    vendorCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "white",
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: "#E5E7EB",
    },
    vendorCardSelected: {
        borderColor: "#ee2b8c",
        backgroundColor: "#FDF2F8",
    },
    vendorInfo: {
        flex: 1,
    },
    vendorHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    vendorName: {
        fontFamily: "PlusJakartaSans-SemiBold",
        fontSize: 15,
        color: "#181114",
    },
    selectedBadge: {
        backgroundColor: "#10B981",
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    selectedBadgeText: {
        fontFamily: "PlusJakartaSans-Regular",
        fontSize: 10,
        color: "white",
    },
    vendorCategory: {
        fontFamily: "PlusJakartaSans-Regular",
        fontSize: 13,
        color: "#6B7280",
    },
    vendorRating: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },
    vendorRatingText: {
        fontFamily: "PlusJakartaSans-Regular",
        fontSize: 13,
        color: "#6B7280",
        marginLeft: 4,
    },
    vendorPrice: {
        fontFamily: "PlusJakartaSans-Regular",
        fontSize: 13,
        color: "#6B7280",
    },
    vendorActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    vendorSelectButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FDF2F8",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
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
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#FDF2F8",
        alignItems: "center",
        justifyContent: "center",
    },
    guestStats: {
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    guestStat: {
        flex: 1,
        alignItems: "center",
    },
    guestStatNumber: {
        fontFamily: "PlusJakartaSans-Bold",
        fontSize: 24,
        color: "#181114",
    },
    guestStatLabel: {
        fontFamily: "PlusJakartaSans-Regular",
        fontSize: 12,
        color: "#6B7280",
    },
    addGuestButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ee2b8c",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 8,
        gap: 6,
    },
    addGuestButtonText: {
        fontFamily: "PlusJakartaSans-SemiBold",
        fontSize: 14,
        color: "white",
    },
    bottomSpacing: {
        height: 100,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "white",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: "90%",
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    modalTitle: {
        fontFamily: "PlusJakartaSans-Bold",
        fontSize: 18,
        color: "#181114",
    },
    modalActions: {
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 12,
    },
    modalActionButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        padding: 14,
        gap: 8,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    modalActionText: {
        fontFamily: "PlusJakartaSans-SemiBold",
        fontSize: 14,
        color: "#374151",
    },
    guestList: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    guestItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    guestItemInvited: {
        backgroundColor: "#FDF2F8",
        borderColor: "#F472B6",
    },
    guestToggle: {
        padding: 4,
    },
    inviteCheckbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#D1D5DB",
        alignItems: "center",
        justifyContent: "center",
    },
    inviteCheckboxSelected: {
        backgroundColor: "#ee2b8c",
        borderColor: "#ee2b8c",
    },
    guestInfo: {
        flex: 1,
        marginLeft: 12,
    },
    guestName: {
        fontFamily: "PlusJakartaSans-SemiBold",
        fontSize: 15,
        color: "#181114",
    },
    guestDetails: {
        fontFamily: "PlusJakartaSans-Regular",
        fontSize: 13,
        color: "#6B7280",
    },
    deleteButton: {
        padding: 4,
    },
    modalSaveButton: {
        backgroundColor: "#ee2b8c",
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
        marginHorizontal: 20,
        marginBottom: 20,
    },
    modalSaveButtonText: {
        fontFamily: "PlusJakartaSans-Bold",
        fontSize: 16,
        color: "white",
    },
    formScroll: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    formGroup: {
        marginBottom: 16,
    },
    formLabel: {
        fontFamily: "PlusJakartaSans-SemiBold",
        fontSize: 14,
        color: "#374151",
        marginBottom: 8,
    },
    formInput: {
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontFamily: "PlusJakartaSans-Regular",
        fontSize: 14,
        color: "#181114",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    relationChips: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    relationChip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "#F3F4F6",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    relationChipSelected: {
        backgroundColor: "#ee2b8c",
        borderColor: "#ee2b8c",
    },
    relationChipText: {
        fontFamily: "PlusJakartaSans-Regular",
        fontSize: 13,
        color: "#374151",
    },
    relationChipTextSelected: {
        color: "white",
        fontFamily: "PlusJakartaSans-SemiBold",
    },
    excelUploadArea: {
        padding: 30,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 200,
    },
    uploadButton: {
        alignItems: "center",
        justifyContent: "center",
        padding: 30,
        borderWidth: 2,
        borderColor: "#F472B6",
        borderStyle: "dashed",
        borderRadius: 16,
        backgroundColor: "#FDF2F8",
    },
    uploadTitle: {
        fontFamily: "PlusJakartaSans-Bold",
        fontSize: 18,
        color: "#181114",
        marginTop: 12,
    },
    uploadSubtitle: {
        fontFamily: "PlusJakartaSans-Regular",
        fontSize: 13,
        color: "#6B7280",
        marginTop: 4,
    },
    uploadHint: {
        fontFamily: "PlusJakartaSans-Regular",
        fontSize: 11,
        color: "#9CA3AF",
        marginTop: 8,
        textAlign: "center",
    },
    uploadingContainer: {
        alignItems: "center",
    },
    uploadingText: {
        fontFamily: "PlusJakartaSans-Bold",
        fontSize: 18,
        color: "#181114",
        marginTop: 12,
    },
    uploadingSubtext: {
        fontFamily: "PlusJakartaSans-Regular",
        fontSize: 13,
        color: "#6B7280",
        marginTop: 4,
    },
    uploadedContainer: {
        alignItems: "center",
    },
    uploadedFileName: {
        fontFamily: "PlusJakartaSans-Bold",
        fontSize: 16,
        color: "#181114",
        marginTop: 12,
    },
    uploadedCount: {
        fontFamily: "PlusJakartaSans-Regular",
        fontSize: 13,
        color: "#10B981",
        marginTop: 4,
    },
    uploadAgainButton: {
        marginTop: 16,
    },
    uploadAgainText: {
        fontFamily: "PlusJakartaSans-SemiBold",
        fontSize: 14,
        color: "#ee2b8c",
    },
    contactModalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        alignItems: "center",
        justifyContent: "center",
    },
    contactModalContent: {
        backgroundColor: "white",
        borderRadius: 20,
        width: "85%",
        overflow: "hidden",
    },
    contactModalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    contactModalTitle: {
        fontFamily: "PlusJakartaSans-Bold",
        fontSize: 16,
        color: "#181114",
    },
    contactModalBody: {
        padding: 16,
    },
    contactOption: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
        backgroundColor: "#F9FAFB",
    },
    contactOptionIconCall: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#10B981",
        alignItems: "center",
        justifyContent: "center",
    },
    contactOptionIconEmail: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#3B82F6",
        alignItems: "center",
        justifyContent: "center",
    },
    contactOptionIconMessage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#F59E0B",
        alignItems: "center",
        justifyContent: "center",
    },
    contactOptionInfo: {
        flex: 1,
        marginLeft: 12,
    },
    contactOptionTitle: {
        fontFamily: "PlusJakartaSans-SemiBold",
        fontSize: 15,
        color: "#181114",
    },
    contactOptionValue: {
        fontFamily: "PlusJakartaSans-Regular",
        fontSize: 13,
        color: "#6B7280",
    },
});
