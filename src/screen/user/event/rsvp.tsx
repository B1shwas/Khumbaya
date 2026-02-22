/**
 * RSVP & Guest Invitation System
 * Follows DRY principles and is backend-ready
 * 
 * Features:
 * - Age verification (18+ requires ID, below 18 requires guardian info)
 * - Free entry for children under certain age
 * - ID image upload for adults
 * - Backend-ready data structure
 */

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ============================================================================
// Types - Backend Ready Interfaces
// ============================================================================

// Age category for guest
type AgeCategory = "adult" | "child" | "infant";

// Guest status for backend
type GuestStatus = "pending" | "confirmed" | "cancelled" | "checked_in";

// ID document types
type IDDocumentType = "aadhar" | "passport" | "driving_license" | "voter_id" | "pan";

// Guest interface
interface Guest {
  id: string;
  // Basic info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  relationship: string;
  
  // Age verification
  age: number;
  ageCategory: AgeCategory; // adult (18+), child (5-17), infant (0-4)
  
  // For adults (18+) - ID verification required
  idDocumentType?: IDDocumentType;
  idNumber?: string;
  idImageUrl?: string;
  idVerified?: boolean;
  
  // For children (below 18) - Guardian info required
  guardianName?: string;
  guardianPhone?: string;
  guardianRelationship?: string;
  
  // Measurements (for certain events like weddings with specific outfits)
  height?: string; // in cm
  weight?: string; // in kg
  chest?: string;
  waist?: string;
  
  // Free entry status
  isFreeEntry: boolean;
  freeEntryReason?: string; // e.g., "child_under_5", "vip"
  
  // Status
  status: GuestStatus;
  rsvpDate?: string;
}

// Event details interface (from backend)
interface EventDetails {
  id: string;
  title: string;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  venue: string;
  venueAddress: string;
  hostName: string;
  hostId: string;
  imageUrl: string;
  
  // Age policies
  minimumAge: number; // Minimum age for entry
  childFreeAge: number; // Age below which entry is free (e.g., 5)
  requiresID: boolean; // Whether ID is required for adults
  idRequiredAge: number; // Age from which ID is required
  
  // Custom fields required
  requiresMeasurements: boolean;
  measurementFields: string[]; // e.g., ["height", "weight", "chest", "waist"]
  
  // Event type
  eventType: "wedding" | "birthday" | "corporate" | "party" | "other";
  
  // Allow plus ones
  allowPlusOnes: boolean;
  maxPlusOnes: number;
  
  // RSVP deadline
  rsvpDeadline?: string;
}

// RSVP data interface
interface RSVPData {
  eventId: string;
  attending: boolean | null;
  totalGuests: number;
  totalAdults: number;
  totalChildren: number;
  totalInfants: number;
  guests: Guest[];
  submitted: boolean;
  submittedAt?: string;
}

// Storage keys for backend integration
const STORAGE_KEYS = {
  RSVP_PREFIX: "rsvp_",
  GUEST_LIST: "guest_list_",
};

// ============================================================================
// Constants - DRY Principle
// ============================================================================

const RELATIONSHIPS = [
  "Self", "Spouse", "Child", "Parent", "Sibling", 
  "Friend", "Colleague", "Relative", "Business Partner", "Other"
];

const CHILD_RELATIONSHIPS = [
  "Son", "Daughter", "Nephew", "Niece", 
  "Grandchild", "Friend's Child", "Other"
];

const ID_DOCUMENT_TYPES: { id: IDDocumentType; label: string }[] = [
  { id: "aadhar", label: "Aadhar Card" },
  { id: "passport", label: "Passport" },
  { id: "driving_license", label: "Driving License" },
  { id: "voter_id", label: "Voter ID" },
  { id: "pan", label: "PAN Card" },
];

const FREE_ENTRY_REASONS: { id: string; label: string }[] = [
  { id: "child_under_5", label: "Child under 5 years" },
  { id: "child_under_12", label: "Child under 12 years (meal not included)" },
  { id: "vip_guest", label: "VIP Guest" },
  { id: "staff_member", label: "Staff/Team Member" },
  { id: "special_pass", label: "Special Pass Holder" },
];

// Default event (replace with API call in production)
const DEFAULT_EVENT: EventDetails = {
  id: "1",
  title: "Wedding Celebration",
  date: "March 15, 2024",
  time: "6:00 PM",
  endTime: "11:00 PM",
  location: "Grand Ballroom, Hotel Royal",
  venue: "Hotel Royal, Mumbai",
  venueAddress: "123 Marine Drive, Mumbai - 400001",
  hostName: "Rahul & Priya Sharma",
  hostId: "user_123",
  imageUrl: "https://example.com/wedding.jpg",
  
  // Age policies
  minimumAge: 18,
  childFreeAge: 5,
  requiresID: true,
  idRequiredAge: 18,
  
  // Custom fields
  requiresMeasurements: false,
  measurementFields: [],
  
  // Event type
  eventType: "wedding",
  
  // Plus ones
  allowPlusOnes: true,
  maxPlusOnes: 2,
  
  // Deadline
  rsvpDeadline: "March 10, 2024",
};

// ============================================================================
// Helper Functions
// ============================================================================

// Determine age category based on age
const getAgeCategory = (age: number, childFreeAge: number): AgeCategory => {
  if (age < childFreeAge) return "infant";
  if (age < 18) return "child";
  return "adult";
};

// Check if ID is required based on age
const requiresID = (age: number, idRequiredAge: number): boolean => {
  return age >= idRequiredAge;
};

// Check if guardian info is required
const requiresGuardian = (age: number): boolean => {
  return age < 18;
};

// ============================================================================
// Components - DRY Principle
// ============================================================================

// Input Field Component
const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  required = false,
  keyboardType = "default",
  multiline = false,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  required?: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
  multiline?: boolean;
}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>
      {label} {required && <Text style={styles.required}>*</Text>}
    </Text>
    <TextInput
      style={[styles.textInput, multiline && styles.textInputMultiline]}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      multiline={multiline}
    />
  </View>
);

// Chip Selection Component
const ChipGroup = ({
  options,
  selected,
  onToggle,
  multiple = false,
}: {
  options: { id: string; label: string }[];
  selected: string | string[];
  onToggle: (id: string) => void;
  multiple?: boolean;
}) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    <View style={styles.chipContainer}>
      {options.map((option) => {
        const isSelected = multiple 
          ? (selected as string[]).includes(option.id)
          : selected === option.id;
        
        return (
          <TouchableOpacity
            key={option.id}
            style={[styles.chip, isSelected && styles.chipSelected]}
            onPress={() => onToggle(option.id)}
          >
            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </ScrollView>
);

// ============================================================================
// Guest Form Component
// ============================================================================

const GuestForm = ({
  guest,
  index,
  event,
  onUpdate,
  onRemove,
}: {
  guest: Guest;
  index: number;
  event: EventDetails;
  onUpdate: (guest: Guest) => void;
  onRemove: () => void;
}) => {
  const isSelf = index === 0;
  const showIDFields = requiresID(guest.age, event.idRequiredAge);
  const showGuardianFields = requiresGuardian(guest.age);
  const showMeasurements = event.requiresMeasurements;
  
  const relationships = isSelf 
    ? [{ id: "self", label: "Self" }] 
    : event.eventType === "wedding"
      ? CHILD_RELATIONSHIPS.map(r => ({ id: r.toLowerCase().replace("'", ""), label: r }))
      : RELATIONSHIPS.map(r => ({ id: r.toLowerCase().replace("'", ""), label: r }));

  return (
    <View style={styles.guestCard}>
      <View style={styles.guestHeader}>
        <Text style={styles.guestTitle}>
          {isSelf ? "👤 Your Details" : `👤 Guest ${index + 1}`}
        </Text>
        {!isSelf && (
          <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        )}
      </View>

      {/* Age Category Indicator */}
      <View style={styles.ageCategoryContainer}>
        <View style={[
          styles.ageCategoryBadge,
          guest.ageCategory === "adult" && styles.ageCategoryAdult,
          guest.ageCategory === "child" && styles.ageCategoryChild,
          guest.ageCategory === "infant" && styles.ageCategoryInfant,
        ]}>
          <Ionicons 
            name={(guest.ageCategory === "adult" ? "person" : guest.ageCategory === "child" ? "happy" : "baby") as any}
            size={16} 
            color={guest.ageCategory === "adult" ? "#fff" : "#666"} 
          />
          <Text style={[
            styles.ageCategoryText,
            guest.ageCategory === "adult" && styles.ageCategoryTextAdult,
          ]}>
            {guest.ageCategory === "adult" ? "Adult (18+)" : guest.ageCategory === "child" ? "Child (5-17)" : "Infant (0-4)"}
          </Text>
        </View>
        
        {/* Free Entry Toggle */}
        {guest.ageCategory !== "adult" && (
          <View style={styles.freeEntryToggle}>
            <Text style={styles.freeEntryLabel}>Free Entry</Text>
            <Switch
              value={guest.isFreeEntry}
              onValueChange={(value) => onUpdate({ ...guest, isFreeEntry: value })}
              trackColor={{ false: "#e5e7eb", true: "#10B981" }}
              thumbColor={guest.isFreeEntry ? "#fff" : "#f4f3f4"}
            />
          </View>
        )}
      </View>

      {/* Basic Info */}
      <View style={styles.row}>
        <View style={styles.halfInput}>
          <InputField
            label="First Name"
            value={guest.firstName}
            onChangeText={(text) => onUpdate({ ...guest, firstName: text })}
            placeholder="First name"
            required
          />
        </View>
        <View style={styles.halfInput}>
          <InputField
            label="Last Name"
            value={guest.lastName}
            onChangeText={(text) => onUpdate({ ...guest, lastName: text })}
            placeholder="Last name"
            required
          />
        </View>
      </View>

      {/* Age - Determines what fields show */}
      <InputField
        label="Age"
        value={guest.age.toString()}
        onChangeText={(text) => {
          const age = parseInt(text) || 0;
          onUpdate({
            ...guest,
            age,
            ageCategory: getAgeCategory(age, event.childFreeAge),
          });
        }}
        placeholder="Enter age"
        required
        keyboardType="numeric"
      />

      {/* Relationship */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Relationship *</Text>
        <ChipGroup
          options={relationships}
          selected={guest.relationship}
          onToggle={(id) => onUpdate({ ...guest, relationship: id })}
        />
      </View>

      {/* Contact Info */}
      <InputField
        label="Email"
        value={guest.email}
        onChangeText={(text) => onUpdate({ ...guest, email: text })}
        placeholder="email@example.com"
        keyboardType="email-address"
      />
      
      <InputField
        label="Phone Number"
        value={guest.phone}
        onChangeText={(text) => onUpdate({ ...guest, phone: text })}
        placeholder="10-digit phone"
        required
        keyboardType="phone-pad"
      />

      {/* ID Fields for Adults (18+) */}
      {showIDFields && (
        <View style={styles.idSection}>
          <Text style={styles.sectionTitle}>📋 ID Verification</Text>
          <Text style={styles.sectionSubtitle}>Required for age {event.idRequiredAge}+</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>ID Type *</Text>
            <ChipGroup
              options={ID_DOCUMENT_TYPES}
              selected={guest.idDocumentType || ""}
              onToggle={(id) => onUpdate({ ...guest, idDocumentType: id as IDDocumentType })}
            />
          </View>
          
          <InputField
            label="ID Number"
            value={guest.idNumber || ""}
            onChangeText={(text) => onUpdate({ ...guest, idNumber: text })}
            placeholder="Enter ID number"
            required
          />
          
          {/* ID Image Upload - Placeholder for backend integration */}
          <View style={styles.uploadSection}>
            <Text style={styles.inputLabel}>Upload ID *</Text>
            <TouchableOpacity style={styles.uploadButton}>
              <Ionicons name="camera-outline" size={24} color="#6B7280" />
              <Text style={styles.uploadText}>Tap to upload ID image</Text>
              <Text style={styles.uploadHint}>JPG, PNG up to 5MB</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Guardian Info for Children */}
      {showGuardianFields && (
        <View style={styles.guardianSection}>
          <Text style={styles.sectionTitle}>👨‍👩‍👧 Guardian Information</Text>
          <Text style={styles.sectionSubtitle}>Required for guests under 18</Text>
          
          <InputField
            label="Guardian Name"
            value={guest.guardianName || ""}
            onChangeText={(text) => onUpdate({ ...guest, guardianName: text })}
            placeholder="Parent/Guardian name"
            required={showGuardianFields}
          />
          
          <InputField
            label="Guardian Phone"
            value={guest.guardianPhone || ""}
            onChangeText={(text) => onUpdate({ ...guest, guardianPhone: text })}
            placeholder="Parent/Guardian phone"
            required={showGuardianFields}
            keyboardType="phone-pad"
          />
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Guardian Relationship</Text>
            <ChipGroup
              options={[
                { id: "father", label: "Father" },
                { id: "mother", label: "Mother" },
                { id: "guardian", label: "Legal Guardian" },
              ]}
              selected={guest.guardianRelationship || ""}
              onToggle={(id) => onUpdate({ ...guest, guardianRelationship: id })}
            />
          </View>
        </View>
      )}

      {/* Measurements (if required by event) */}
      {showMeasurements && guest.ageCategory === "child" && (
        <View style={styles.measurementsSection}>
          <Text style={styles.sectionTitle}>📏 Measurements</Text>
          <Text style={styles.sectionSubtitle}>For custom outfits</Text>
          
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <InputField
                label="Height (cm)"
                value={guest.height || ""}
                onChangeText={(text) => onUpdate({ ...guest, height: text })}
                placeholder="e.g., 120"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.halfInput}>
              <InputField
                label="Weight (kg)"
                value={guest.weight || ""}
                onChangeText={(text) => onUpdate({ ...guest, weight: text })}
                placeholder="e.g., 25"
                keyboardType="numeric"
              />
            </View>
          </View>
          
          {event.measurementFields?.includes("chest") && (
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <InputField
                  label="Chest (inches)"
                  value={guest.chest || ""}
                  onChangeText={(text) => onUpdate({ ...guest, chest: text })}
                  placeholder="e.g., 28"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfInput}>
                <InputField
                  label="Waist (inches)"
                  value={guest.waist || ""}
                  onChangeText={(text) => onUpdate({ ...guest, waist: text })}
                  placeholder="e.g., 24"
                  keyboardType="numeric"
                />
              </View>
            </View>
          )}
        </View>
      )}

      {/* Free Entry Reason */}
      {guest.isFreeEntry && guest.ageCategory !== "adult" && (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Free Entry Reason</Text>
          <ChipGroup
            options={FREE_ENTRY_REASONS}
            selected={guest.freeEntryReason || ""}
            onToggle={(id) => onUpdate({ ...guest, freeEntryReason: id })}
          />
        </View>
      )}
    </View>
  );
};

// ============================================================================
// Main RSVP Page Component
// ============================================================================

export default function RSVPPage() {
  const params = useLocalSearchParams();
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<EventDetails>(DEFAULT_EVENT);
  const [rsvpData, setRsvpData] = useState<RSVPData>({
    eventId: eventId || "1",
    attending: null,
    totalGuests: 1,
    totalAdults: 1,
    totalChildren: 0,
    totalInfants: 0,
    guests: [],
    submitted: false,
  });

  const [currentStep, setCurrentStep] = useState<
    "decision" | "guestCount" | "guestDetails" | "confirmation"
  >("decision");

  // Step handlers
  const handleDecision = (attending: boolean) => {
    setRsvpData((prev) => ({ ...prev, attending }));
    setCurrentStep(attending ? "guestCount" : "confirmation");
  };

  const handleGuestCountSubmit = () => {
    const { totalGuests, totalAdults, totalChildren, totalInfants } = rsvpData;
    
    // Create guest entries
    const newGuests: Guest[] = Array.from({ length: totalGuests }, (_, i) => {
      const isSelf = i === 0;
      const ageCategory = isSelf ? "adult" : getAgeCategory(18, event.childFreeAge);
      
      return {
        id: `guest-${Date.now()}-${i}`,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        relationship: isSelf ? "self" : "",
        age: isSelf ? 25 : 18, // Default age
        ageCategory,
        isFreeEntry: ageCategory === "infant",
        status: "pending" as GuestStatus,
      };
    });

    setRsvpData((prev) => ({
      ...prev,
      guests: newGuests,
      totalAdults,
      totalChildren,
      totalInfants,
    }));
    setCurrentStep("guestDetails");
  };

  const updateGuest = (index: number, updatedGuest: Guest) => {
    setRsvpData((prev) => ({
      ...prev,
      guests: prev.guests.map((g, i) => (i === index ? updatedGuest : g)),
    }));
  };

  const removeGuest = (index: number) => {
    if (rsvpData.guests.length <= 1) {
      Alert.alert("Error", "You must include at least yourself");
      return;
    }
    setRsvpData((prev) => ({
      ...prev,
      guests: prev.guests.filter((_, i) => i !== index),
      totalGuests: prev.totalGuests - 1,
    }));
  };

  const validateGuestDetails = (): boolean => {
    for (let i = 0; i < rsvpData.guests.length; i++) {
      const guest = rsvpData.guests[i];
      const isSelf = i === 0;

      // Basic validation
      if (!guest.firstName.trim()) {
        Alert.alert("Error", `Please enter first name for ${isSelf ? "yourself" : `Guest ${i + 1}`}`);
        return false;
      }
      if (!guest.phone.trim()) {
        Alert.alert("Error", `Please enter phone for ${isSelf ? "yourself" : `Guest ${i + 1}`}`);
        return false;
      }

      // Adult ID validation
      if (requiresID(guest.age, event.idRequiredAge)) {
        if (!guest.idDocumentType || !guest.idNumber) {
          Alert.alert("Error", `Please provide ID for ${isSelf ? "yourself" : `Guest ${i + 1}`} (${guest.age} years old)`);
          return false;
        }
      }

      // Guardian validation for children
      if (requiresGuardian(guest.age)) {
        if (!guest.guardianName || !guest.guardianPhone) {
          Alert.alert("Error", `Please provide guardian info for Guest ${i + 1} (under 18)`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateGuestDetails()) {
      return;
    }

    try {
      // Prepare data for backend
      const submissionData = {
        ...rsvpData,
        submittedAt: new Date().toISOString(),
        guests: rsvpData.guests.map(g => ({
          ...g,
          status: "confirmed" as GuestStatus,
          rsvpDate: new Date().toISOString(),
        })),
      };

      // Save to local storage (replace with API call in production)
      await AsyncStorage.setItem(
        `${STORAGE_KEYS.RSVP_PREFIX}${eventId}`,
        JSON.stringify(submissionData)
      );

      setRsvpData((prev) => ({ ...prev, submitted: true }));
      setCurrentStep("confirmation");

      Alert.alert(
        "🎉 RSVP Confirmed!",
        `Your response for ${rsvpData.totalGuests} guest(s) has been submitted.`,
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error saving RSVP:", error);
      Alert.alert("Error", "Failed to submit RSVP. Please try again.");
    }
  };

  // Step indicator
  const steps = ["RSVP", "Guests", "Details", "Done"];
  const stepMap = { decision: 0, guestCount: 1, guestDetails: 2, confirmation: 3 };
  const currentIndex = stepMap[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>RSVP</Text>
        <View style={styles.headerButton} />
      </View>

      {/* Step Indicator */}
      <View style={styles.stepIndicator}>
        {steps.map((step, index) => (
          <View key={step} style={styles.stepItem}>
            <View style={[styles.stepCircle, index <= currentIndex && styles.stepCircleActive]}>
              {index < currentIndex ? (
                <Ionicons name="checkmark" size={14} color="white" />
              ) : (
                <Text style={[styles.stepNumber, index <= currentIndex && styles.stepNumberActive]}>
                  {index + 1}
                </Text>
              )}
            </View>
            <Text style={[styles.stepLabel, index <= currentIndex && styles.stepLabelActive]}>
              {step}
            </Text>
            {index < steps.length - 1 && (
              <View style={[styles.stepLine, index < currentIndex && styles.stepLineActive]} />
            )}
          </View>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Step 1: Decision */}
        {currentStep === "decision" && (
          <View style={styles.decisionContainer}>
            <View style={styles.eventCard}>
              <Image source={{ uri: event.imageUrl }} style={styles.eventImage} />
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <View style={styles.eventDetailRow}>
                  <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                  <Text style={styles.eventDetailText}>{event.date} • {event.time}</Text>
                </View>
                <View style={styles.eventDetailRow}>
                  <Ionicons name="location-outline" size={16} color="#6B7280" />
                  <Text style={styles.eventDetailText}>{event.location}</Text>
                </View>
                <Text style={styles.hostedBy}>Hosted by {event.hostName}</Text>
              </View>
            </View>

            {/* Event Policies */}
            <View style={styles.policyCard}>
              <Text style={styles.policyTitle}>📋 Event Policies</Text>
              <View style={styles.policyRow}>
                <Ionicons name="person-outline" size={18} color="#6B7280" />
                <Text style={styles.policyText}>Minimum age: {event.minimumAge} years</Text>
              </View>
              <View style={styles.policyRow}>
                <Ionicons name="ticket-outline" size={18} color="#6B7280" />
                <Text style={styles.policyText}>Free entry for children under {event.childFreeAge}</Text>
              </View>
              {event.requiresID && (
                <View style={styles.policyRow}>
                  <Ionicons name="card-outline" size={18} color="#6B7280" />
                  <Text style={styles.policyText}>ID required for age {event.idRequiredAge}+</Text>
                </View>
              )}
            </View>

            <Text style={styles.decisionTitle}>Will you be attending?</Text>

            <TouchableOpacity style={styles.decisionButton} onPress={() => handleDecision(true)}>
              <View style={styles.decisionIconContainer}>
                <Ionicons name="checkmark-circle" size={48} color="#10B981" />
              </View>
              <Text style={styles.decisionButtonTitle}>Yes, I'll be there!</Text>
              <Text style={styles.decisionButtonSubtitle}>I'd love to celebrate with you</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.decisionButton, styles.decisionButtonDecline]} onPress={() => handleDecision(false)}>
              <View style={[styles.decisionIconContainer, styles.decisionIconContainerDecline]}>
                <Ionicons name="close-circle" size={48} color="#EF4444" />
              </View>
              <Text style={[styles.decisionButtonTitle, styles.decisionButtonTitleDecline]}>No, I can't make it</Text>
              <Text style={styles.decisionButtonSubtitleDecline}>Unfortunately, I won't be able to attend</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 2: Guest Count */}
        {currentStep === "guestCount" && (
          <View style={styles.guestCountContainer}>
            <View style={styles.questionsHeader}>
              <Text style={styles.questionsTitle}>How many guests?</Text>
              <Text style={styles.questionsSubtitle}>
                Including yourself - how many people will be attending?
              </Text>
            </View>

            {/* Adults */}
            <View style={styles.countSection}>
              <Text style={styles.countLabel}>� Adults (18+)</Text>
              <View style={styles.guestCountCard}>
                <TouchableOpacity
                  style={styles.countButton}
                  onPress={() => setRsvpData(prev => ({
                    ...prev,
                    totalAdults: Math.max(1, prev.totalAdults - 1),
                    totalGuests: Math.max(1, prev.totalGuests - 1),
                  }))}
                  disabled={rsvpData.totalAdults <= 1}
                >
                  <Ionicons name="remove" size={24} color={rsvpData.totalAdults <= 1 ? "#9CA3AF" : "#ee2b8c"} />
                </TouchableOpacity>
                <View style={styles.countDisplay}>
                  <Text style={styles.countNumber}>{rsvpData.totalAdults}</Text>
                </View>
                <TouchableOpacity
                  style={styles.countButton}
                  onPress={() => setRsvpData(prev => ({
                    ...prev,
                    totalAdults: prev.totalAdults + 1,
                    totalGuests: prev.totalGuests + 1,
                  }))}
                >
                  <Ionicons name="add" size={24} color="#ee2b8c" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Children */}
            <View style={styles.countSection}>
              <Text style={styles.countLabel}>👶 Children (5-17)</Text>
              <View style={styles.guestCountCard}>
                <TouchableOpacity
                  style={styles.countButton}
                  onPress={() => setRsvpData(prev => ({
                    ...prev,
                    totalChildren: Math.max(0, prev.totalChildren - 1),
                    totalGuests: Math.max(1, prev.totalGuests - 1),
                  }))}
                >
                  <Ionicons name="remove" size={24} color={rsvpData.totalChildren <= 0 ? "#9CA3AF" : "#ee2b8c"} />
                </TouchableOpacity>
                <View style={styles.countDisplay}>
                  <Text style={styles.countNumber}>{rsvpData.totalChildren}</Text>
                </View>
                <TouchableOpacity
                  style={styles.countButton}
                  onPress={() => setRsvpData(prev => ({
                    ...prev,
                    totalChildren: prev.totalChildren + 1,
                    totalGuests: prev.totalGuests + 1,
                  }))}
                >
                  <Ionicons name="add" size={24} color="#ee2b8c" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Infants */}
            <View style={styles.countSection}>
              <Text style={styles.countLabel}>👼 Infants (0-4) - Free Entry</Text>
              <View style={styles.guestCountCard}>
                <TouchableOpacity
                  style={styles.countButton}
                  onPress={() => setRsvpData(prev => ({
                    ...prev,
                    totalInfants: Math.max(0, prev.totalInfants - 1),
                    totalGuests: Math.max(1, prev.totalGuests - 1),
                  }))}
                >
                  <Ionicons name="remove" size={24} color={rsvpData.totalInfants <= 0 ? "#9CA3AF" : "#ee2b8c"} />
                </TouchableOpacity>
                <View style={styles.countDisplay}>
                  <Text style={styles.countNumber}>{rsvpData.totalInfants}</Text>
                </View>
                <TouchableOpacity
                  style={styles.countButton}
                  onPress={() => setRsvpData(prev => ({
                    ...prev,
                    totalInfants: prev.totalInfants + 1,
                    totalGuests: prev.totalGuests + 1,
                  }))}
                >
                  <Ionicons name="add" size={24} color="#ee2b8c" />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.totalGuests}>
              Total: {rsvpData.totalGuests} guest{rsvpData.totalGuests !== 1 ? "s" : ""}
            </Text>

            <TouchableOpacity style={styles.submitButton} onPress={handleGuestCountSubmit}>
              <Text style={styles.submitButtonText}>Continue</Text>
              <Ionicons name="arrow-forward" size={20} color="white" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
        )}

        {/* Step 3: Guest Details */}
        {currentStep === "guestDetails" && (
          <View style={styles.guestDetailsContainer}>
            <View style={styles.questionsHeader}>
              <Text style={styles.questionsTitle}>Guest Details</Text>
              <Text style={styles.questionsSubtitle}>
                Please provide details for each guest
              </Text>
            </View>

            {rsvpData.guests.map((guest, index) => (
              <GuestForm
                key={guest.id}
                guest={guest}
                index={index}
                event={event}
                onUpdate={(updated) => updateGuest(index, updated)}
                onRemove={() => removeGuest(index)}
              />
            ))}

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit RSVP</Text>
              <Ionicons name="send" size={20} color="white" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === "confirmation" && rsvpData.attending === false && (
          <View style={styles.confirmationContainer}>
            <View style={styles.confirmationIcon}>
              <Ionicons name="sad-outline" size={64} color="#9CA3AF" />
            </View>
            <Text style={styles.confirmationTitle}>Sorry You Can't Make It</Text>
            <Text style={styles.confirmationText}>
              We've noted that you won't be able to attend. We hope to see you at a future event!
            </Text>
            <TouchableOpacity style={styles.submitButton} onPress={() => router.back()}>
              <Text style={styles.submitButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        )}

        {currentStep === "confirmation" && rsvpData.attending === true && (
          <View style={styles.confirmationContainer}>
            <View style={[styles.confirmationIcon, { backgroundColor: "#D1FAE5" }]}>
              <Ionicons name="checkmark-circle" size={64} color="#10B981" />
            </View>
            <Text style={styles.confirmationTitle}>You're All Set! 🎉</Text>
            <Text style={styles.confirmationText}>
              Your RSVP for {rsvpData.totalGuests} guest(s) has been submitted.
            </Text>
            
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Summary</Text>
              <View style={styles.summaryRow}>
                <Text>Adults:</Text>
                <Text style={styles.summaryValue}>{rsvpData.totalAdults}</Text>
              </View>
              {rsvpData.totalChildren > 0 && (
                <View style={styles.summaryRow}>
                  <Text>Children:</Text>
                  <Text style={styles.summaryValue}>{rsvpData.totalChildren}</Text>
                </View>
              )}
              {rsvpData.totalInfants > 0 && (
                <View style={styles.summaryRow}>
                  <Text>Infants (Free):</Text>
                  <Text style={styles.summaryValue}>{rsvpData.totalInfants}</Text>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={() => router.back()}>
              <Text style={styles.submitButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#fff",
    borderBottomWidth: 1, borderBottomColor: "#E5E7EB",
  },
  headerButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  
  stepIndicator: { flexDirection: "row", justifyContent: "center", paddingVertical: 16, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#E5E7EB" },
  stepItem: { alignItems: "center", flexDirection: "row" },
  stepCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#E5E7EB", alignItems: "center", justifyContent: "center" },
  stepCircleActive: { backgroundColor: "#ec4899" },
  stepNumber: { fontSize: 12, fontWeight: "600", color: "#9CA3AF" },
  stepNumberActive: { color: "#fff" },
  stepLabel: { fontSize: 10, color: "#9CA3AF", marginLeft: 4 },
  stepLabelActive: { color: "#ec4899", fontWeight: "600" },
  stepLine: { width: 24, height: 2, backgroundColor: "#E5E7EB", marginHorizontal: 4 },
  stepLineActive: { backgroundColor: "#ec4899" },
  
  content: { flex: 1, paddingHorizontal: 16 },
  
  // Event Card
  eventCard: { backgroundColor: "#fff", borderRadius: 16, overflow: "hidden", marginBottom: 20 },
  eventImage: { width: "100%", height: 160 },
  eventInfo: { padding: 16 },
  eventTitle: { fontSize: 20, fontWeight: "700", color: "#111827", marginBottom: 8 },
  eventDetailRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  eventDetailText: { fontSize: 14, color: "#6B7280", marginLeft: 8 },
  hostedBy: { fontSize: 12, color: "#9CA3AF", marginTop: 8 },
  
  // Policy Card
  policyCard: { backgroundColor: "#EEF2FF", borderRadius: 12, padding: 16, marginBottom: 20 },
  policyTitle: { fontSize: 14, fontWeight: "600", color: "#4F46E5", marginBottom: 12 },
  policyRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  policyText: { fontSize: 13, color: "#6B7280", marginLeft: 8 },
  
  // Decision
  decisionContainer: { paddingTop: 20 },
  decisionTitle: { fontSize: 18, fontWeight: "600", color: "#111827", marginBottom: 16, textAlign: "center" },
  decisionButton: { backgroundColor: "#fff", borderRadius: 16, padding: 20, marginBottom: 12, borderWidth: 2, borderColor: "#10B981" },
  decisionButtonDecline: { borderColor: "#EF4444" },
  decisionIconContainer: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#D1FAE5", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  decisionIconContainerDecline: { backgroundColor: "#FEE2E2" },
  decisionButtonTitle: { fontSize: 16, fontWeight: "600", color: "#111827", marginBottom: 4 },
  decisionButtonTitleDecline: { color: "#EF4444" },
  decisionButtonSubtitle: { fontSize: 13, color: "#6B7280" },
  decisionButtonSubtitleDecline: { fontSize: 13, color: "#9CA3AF" },
  
  // Guest Count
  guestCountContainer: { paddingTop: 20 },
  questionsHeader: { marginBottom: 20 },
  questionsTitle: { fontSize: 20, fontWeight: "700", color: "#111827", marginBottom: 8 },
  questionsSubtitle: { fontSize: 14, color: "#6B7280" },
  countSection: { marginBottom: 16 },
  countLabel: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 },
  guestCountCard: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#fff", borderRadius: 12, padding: 8 },
  countButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  countDisplay: { alignItems: "center" },
  countNumber: { fontSize: 24, fontWeight: "700", color: "#111827" },
  totalGuests: { fontSize: 16, fontWeight: "600", color: "#ec4899", textAlign: "center", marginVertical: 16 },
  
  // Guest Form
  guestCard: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16 },
  guestHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  guestTitle: { fontSize: 16, fontWeight: "600", color: "#111827" },
  removeButton: { padding: 8 },
  
  ageCategoryContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16, backgroundColor: "#F3F4F6", borderRadius: 8, padding: 12 },
  ageCategoryBadge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  ageCategoryAdult: { backgroundColor: "#ec4899" },
  ageCategoryChild: { backgroundColor: "#FCD34D" },
  ageCategoryInfant: { backgroundColor: "#D1D5DB" },
  ageCategoryText: { fontSize: 12, fontWeight: "600", color: "#666", marginLeft: 4 },
  ageCategoryTextAdult: { color: "#fff" },
  freeEntryToggle: { flexDirection: "row", alignItems: "center" },
  freeEntryLabel: { fontSize: 12, color: "#6B7280", marginRight: 8 },
  
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: "500", color: "#374151", marginBottom: 8 },
  required: { color: "#EF4444" },
  textInput: { backgroundColor: "#F9FAFB", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: "#111827", borderWidth: 1, borderColor: "#E5E7EB" },
  textInputMultiline: { minHeight: 80, textAlignVertical: "top" },
  
  row: { flexDirection: "row", gap: 12 },
  halfInput: { flex: 1 },
  
  chipContainer: { flexDirection: "row", gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: "#F3F4F6", borderWidth: 1, borderColor: "#E5E7EB" },
  chipSelected: { backgroundColor: "#FCE7F3", borderColor: "#ec4899" },
  chipText: { fontSize: 13, color: "#6B7280" },
  chipTextSelected: { color: "#ec4899", fontWeight: "500" },
  
  // Sections
  idSection: { backgroundColor: "#F0FDF4", borderRadius: 12, padding: 16, marginTop: 16, borderWidth: 1, borderColor: "#BBF7D0" },
  guardianSection: { backgroundColor: "#FEF3C7", borderRadius: 12, padding: 16, marginTop: 16, borderWidth: 1, borderColor: "#FDE68A" },
  measurementsSection: { backgroundColor: "#F3E8FF", borderRadius: 12, padding: 16, marginTop: 16, borderWidth: 1, borderColor: "#DDD6FE" },
  sectionTitle: { fontSize: 14, fontWeight: "600", color: "#111827", marginBottom: 4 },
  sectionSubtitle: { fontSize: 12, color: "#6B7280", marginBottom: 12 },
  
  uploadSection: { marginBottom: 16 },
  uploadButton: { backgroundColor: "#F3F4F6", borderRadius: 10, padding: 24, alignItems: "center", borderWidth: 2, borderColor: "#E5E7EB", borderStyle: "dashed" },
  uploadText: { fontSize: 14, color: "#6B7280", marginTop: 8 },
  uploadHint: { fontSize: 12, color: "#9CA3AF", marginTop: 4 },
  
  // Buttons
  submitButton: { backgroundColor: "#ec4899", borderRadius: 12, paddingVertical: 16, alignItems: "center", marginTop: 20, marginBottom: 40 },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  
  // Confirmation
  confirmationContainer: { paddingTop: 40, alignItems: "center", paddingHorizontal: 20 },
  confirmationIcon: { width: 96, height: 96, borderRadius: 48, backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center", marginBottom: 20 },
  confirmationTitle: { fontSize: 24, fontWeight: "700", color: "#111827", marginBottom: 12 },
  confirmationText: { fontSize: 14, color: "#6B7280", textAlign: "center", marginBottom: 24 },
  summaryCard: { backgroundColor: "#fff", borderRadius: 12, padding: 16, width: "100%", marginBottom: 24 },
  summaryTitle: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 12 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  summaryValue: { fontWeight: "600", color: "#111827" },
  
  guestHint: { fontSize: 12, color: "#9CA3AF", textAlign: "center", marginTop: 8 },
  guestDetailsContainer: { paddingTop: 20 },
});
