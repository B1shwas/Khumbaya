import { useAuthStore } from "@/src/store/AuthStore";
import { useFamilyStore, type FamilyMember } from "@/src/store/familyStore";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Constants ────────────────────────────────────────────────────────────────

const PRIMARY = "#ec4899";

const FOOD_OPTIONS = [
  { label: "Veg", value: "Vegetarian", icon: "leaf" },
  { label: "Non-Veg", value: "Non-Vegetarian", icon: "restaurant" },
  { label: "Vegan", value: "Vegan", icon: "flower" },
  { label: "Jain", value: "Jain", icon: "star" },
] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

interface MemberForm {
  name: string;
  phone?: string;
  email?: string;
  relation: string;
  foodPreference?: string;
  idImage?: string;
  isAdult?: boolean;
  dob?: string;
  height?: string;
  idNumber?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

const avatarColor = (id: string) => {
  const colors = [
    { bg: "#fff1ec", text: "#c2440b" },
    { bg: "#fce7f3", text: "#be185d" },
    { bg: "#dbeafe", text: "#1d4ed8" },
    { bg: "#dcfce7", text: "#15803d" },
    { bg: "#ede9fe", text: "#7c3aed" },
  ];
  return colors[parseInt(id, 10) % colors.length] ?? colors[0];
};

// ─── Step Indicator ─────────────────────────────────────────────────────────

const StepIndicator = ({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) => {
  const steps = ["Family", "Members", "Done"];

  return (
    <View style={styles.stepIndicator}>
      {steps.map((step, index) => (
        <View key={step} style={styles.stepItem}>
          <View
            style={[
              styles.stepCircle,
              index < currentStep && styles.stepCircleActive,
              index === currentStep && styles.stepCircleCurrent,
            ]}
          >
            {index < currentStep ? (
              <Ionicons name="checkmark" size={16} color="white" />
            ) : (
              <Text
                style={[
                  styles.stepNumber,
                  index <= currentStep && styles.stepNumberActive,
                ]}
              >
                {index + 1}
              </Text>
            )}
          </View>
          <Text
            style={[
              styles.stepLabel,
              index <= currentStep && styles.stepLabelActive,
            ]}
          >
            {step}
          </Text>
          {index < steps.length - 1 && (
            <View
              style={[
                styles.stepLine,
                index < currentStep && styles.stepLineActive,
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );
};

// ─── Member Form Component ─────────────────────────────────────────────────

const MemberFormModal = ({
  visible,
  onClose,
  onSave,
  initial,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (form: MemberForm) => void;
  initial?: MemberForm;
}) => {
  const [form, setForm] = useState<MemberForm>(
    initial ?? {
      name: "",
      phone: "",
      email: "",
      relation: "",
      foodPreference: "",
      idImage: "",
      isAdult: true,
      dob: "",
      height: "",
      idNumber: "",
    }
  );
  const [errors, setErrors] = useState<Partial<MemberForm>>({});

  const updateField = (field: keyof MemberForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library."
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      updateField("idImage", result.assets[0].uri);
    }
  };

  const validate = (): boolean => {
    const e: Partial<MemberForm> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.relation.trim()) e.relation = "Relation is required";
    if (!form.foodPreference) e.foodPreference = "Food preference is required";

    // Phone validation
    if (form.phone?.trim()) {
      const phoneRegex = /^[0-9]{7,15}$/;
      if (!phoneRegex.test(form.phone.trim())) {
        e.phone = "Invalid phone number";
      }
    }

    // Validate age-specific fields
    if (form.isAdult) {
      // Adults (18+) need ID/Government docs
      if (!form.idNumber?.trim()) e.idNumber = "ID number is required";
      if (!form.idImage?.trim()) e.idImage = "ID image is required";
    } else {
      // Children (<18) need DOB and height
      if (!form.dob?.trim()) e.dob = "Date of birth is required";
      if (!form.height?.trim()) e.height = "Height is required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave(form);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
            <Ionicons name="close" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {initial ? "Edit Member" : "Add Member"}
          </Text>
          <View style={styles.modalCloseButton} />
        </View>

        <ScrollView
          style={styles.modalContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name *</Text>
            <TextInput
              style={[styles.textInput, errors.name && styles.textInputError]}
              placeholder="Enter name"
              placeholderTextColor="#9CA3AF"
              value={form.name}
              onChangeText={(v) => updateField("name", v)}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={[styles.textInput, errors.phone && styles.textInputError]}
              placeholder="+977 98XXXXXXXX"
              placeholderTextColor="#9CA3AF"
              value={form.phone}
              onChangeText={(v) => updateField("phone", v)}
              keyboardType="phone-pad"
            />
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.textInput}
              placeholder="email@example.com"
              placeholderTextColor="#9CA3AF"
              value={form.email}
              onChangeText={(v) => updateField("email", v)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Relation *</Text>
            <TextInput
              style={[
                styles.textInput,
                errors.relation && styles.textInputError,
              ]}
              placeholder="e.g. Spouse, Child, Parent, Friend..."
              placeholderTextColor="#9CA3AF"
              value={form.relation}
              onChangeText={(v) => updateField("relation", v)}
            />
            {errors.relation && (
              <Text style={styles.errorText}>{errors.relation}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Food Preference *</Text>
            <View style={styles.chipContainer}>
              {FOOD_OPTIONS.map((opt) => {
                const active = form.foodPreference === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={[styles.chip, active && styles.chipSelected]}
                    onPress={() => updateField("foodPreference", opt.value)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        active && styles.chipTextSelected,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {errors.foodPreference && (
              <Text style={styles.errorText}>{errors.foodPreference}</Text>
            )}
          </View>

          {/* Age Verification */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Is this member 18 or older?</Text>
            <View style={styles.chipContainer}>
              <TouchableOpacity
                style={[styles.chip, form.isAdult && styles.chipSelected]}
                onPress={() =>
                  setForm((prev) => ({
                    ...prev,
                    isAdult: true,
                    dob: "",
                    height: "",
                    idNumber: "",
                  }))
                }
              >
                <Text
                  style={[
                    styles.chipText,
                    form.isAdult && styles.chipTextSelected,
                  ]}
                >
                  Yes (18+)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chip, !form.isAdult && styles.chipSelected]}
                onPress={() =>
                  setForm((prev) => ({
                    ...prev,
                    isAdult: false,
                    dob: undefined,
                    height: undefined,
                    idNumber: undefined,
                  }))
                }
              >
                <Text
                  style={[
                    styles.chipText,
                    !form.isAdult && styles.chipTextSelected,
                  ]}
                >
                  No (Under 18)
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Age-specific fields */}
          {form.isAdult ? (
            // Adults (18+) - show ID fields
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  ID Number (Passport/License) *
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    errors.idNumber && styles.textInputError,
                  ]}
                  placeholder="Enter ID number"
                  placeholderTextColor="#9CA3AF"
                  value={form.idNumber || ""}
                  onChangeText={(v) => updateField("idNumber", v)}
                />
                {errors.idNumber && (
                  <Text style={styles.errorText}>{errors.idNumber}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Government ID Image *</Text>
                <TouchableOpacity
                  style={styles.imageUploadButton}
                  onPress={pickImage}
                >
                  {form.idImage ? (
                    <Image
                      source={{ uri: form.idImage }}
                      style={styles.idImagePreview}
                    />
                  ) : (
                    <View style={styles.imageUploadPlaceholder}>
                      <Ionicons
                        name="camera-outline"
                        size={32}
                        color="#9CA3AF"
                      />
                      <Text style={styles.imageUploadText}>
                        Upload ID Document
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
                {errors.idImage && (
                  <Text style={styles.errorText}>{errors.idImage}</Text>
                )}
              </View>
            </>
          ) : (
            // Children (<18) - show DOB and Height
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Date of Birth *</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    errors.dob && styles.textInputError,
                  ]}
                  placeholder="e.g. 15/06/2010"
                  placeholderTextColor="#9CA3AF"
                  value={form.dob || ""}
                  onChangeText={(v) => updateField("dob", v)}
                />
                {errors.dob && (
                  <Text style={styles.errorText}>{errors.dob}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Height (cm) *</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    errors.height && styles.textInputError,
                  ]}
                  placeholder="e.g. 120"
                  placeholderTextColor="#9CA3AF"
                  value={form.height || ""}
                  onChangeText={(v) => updateField("height", v)}
                  keyboardType="numeric"
                />
                {errors.height && (
                  <Text style={styles.errorText}>{errors.height}</Text>
                )}
              </View>
            </>
          )}

          <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
            <Text style={styles.submitButtonText}>Save Member</Text>
            <Ionicons
              name="checkmark"
              size={20}
              color="white"
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function FamilyMembersScreen() {
  // Get logged-in user from auth store
  const user = useAuthStore((state) => state.user);
  const fetchUserProfile = useAuthStore((state) => state.fetchUserProfile);

  // Get family data from store
  const familyName = useFamilyStore((state) => state.familyName);
  const setFamilyName = useFamilyStore((state) => state.setFamilyName);
  const members = useFamilyStore((state) => state.members);
  const setMembersDirect = useFamilyStore((state) => state.setMembersDirect);
  const updateMember = useFamilyStore((state) => state.updateMember);
  const removeMember = useFamilyStore((state) => state.removeMember);
  const loadFamily = useFamilyStore((state) => state.loadFamily);

  const [step, setStep] = useState<1 | 2>(1);
  const [totalMembers, setTotalMembers] = useState(2);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch user profile and load family on mount
  useEffect(() => {
    const init = async () => {
      await fetchUserProfile();
      await loadFamily();
      setIsInitialized(true);
    };
    init();
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

  const getEditingMember = () => {
    if (!editingMemberId) return undefined;
    return members.find((m) => m.id === editingMemberId);
  };

  const openAdd = () => {
    setEditingMemberId(null);
    setModalVisible(true);
  };

  const openEdit = (id: string) => {
    // Cannot edit self - it's auto-filled from profile
    if (id === "self") {
      Alert.alert(
        "Cannot Edit",
        "Your profile details come from your account profile. Please edit your profile instead."
      );
      return;
    }
    setEditingMemberId(id);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingMemberId(null);
  };

  const handleSaveMember = (form: MemberForm) => {
    if (editingMemberId) {
      // Update existing member - convert MemberForm to Partial<FamilyMember>
      updateMember(editingMemberId, {
        name: form.name,
        phone: form.phone,
        email: form.email,
        relation: form.relation,
        foodPreference: form.foodPreference,
        idImage: form.idImage,
        isAdult: form.isAdult ?? true,
        dob: form.dob,
        height: form.height,
        idNumber: form.idNumber,
      });
    } else {
      // Add new member - convert MemberForm to FamilyMember
      const newMember: FamilyMember = {
        id: `m${Date.now()}`,
        name: form.name,
        phone: form.phone,
        email: form.email,
        relation: form.relation,
        foodPreference: form.foodPreference,
        idImage: form.idImage,
        isAdult: form.isAdult ?? true,
        dob: form.dob,
        height: form.height,
        idNumber: form.idNumber,
      };
      setMembersDirect((prev) => [...prev, newMember]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    // Cannot delete self
    if (id === "self") {
      Alert.alert(
        "Cannot Remove",
        "You cannot remove yourself from the family"
      );
      return;
    }

    Alert.alert("Remove Member", "Remove this person from your family?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => removeMember(id),
      },
    ]);
  };

  const handleCreateFamily = () => {
    if (!familyName.trim()) {
      Alert.alert("Required", "Please enter your family name");
      return;
    }
    if (totalMembers < 1) {
      Alert.alert("Required", "Please specify at least 1 family member");
      return;
    }

    // Self member injected from user profile when family is created
    const selfMember: FamilyMember = {
      id: "self",
      name: user?.username || user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      relation: "Self",
      foodPreference: user?.foodPreference || user?.food_preference || "",
      idImage: user?.idImage || user?.id_image || "",
      isAdult: true,
      dob: user?.dateOfBirth || user?.date_of_birth || "",
      height: "",
      idNumber: "",
    };

    // Create additional member slots (totalMembers - 1 because self is included)
    const additionalMembers: FamilyMember[] = Array.from(
      { length: Math.max(0, totalMembers - 1) },
      (_, i) => ({
        id: `m${i + 1}`,
        name: "",
        phone: "",
        email: "",
        relation: "",
        foodPreference: "",
        idImage: "",
        isAdult: true,
        dob: "",
        height: "",
        idNumber: "",
      })
    );

    // Combine self + additional members
    const initialMembers: FamilyMember[] = [selfMember, ...additionalMembers];

    setMembersDirect(initialMembers);
    setStep(2);
  };

  const handleContinueToRooms = () => {
    const incompleteMembers = members.filter(
      (m) => !m.name.trim() || !m.foodPreference
    );

    if (incompleteMembers.length > 0) {
      Alert.alert(
        "Incomplete Members",
        `Please complete all member details before continuing. ${incompleteMembers.length} member(s) need attention.`
      );
      return;
    }

    router.push("/profile/family-accommodation");
  };

  const adults = members.filter((m) => m.relation !== "Child").length;
  const kids = members.filter((m) => m.relation === "Child").length;
  const completedMembers = members.filter(
    (m) => m.name.trim() && m.foodPreference
  ).length;

  // ─── STEP 1: CREATE FAMILY ────────────────────────────────────────────────

  if (step === 1) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Family Setup</Text>
          <View style={styles.headerButton} />
        </View>

        <StepIndicator currentStep={0} totalSteps={2} />

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.questionsContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="people" size={48} color={PRIMARY} />
            </View>
            <Text style={styles.questionsTitle}>Name Your Family</Text>
            <Text style={styles.questionsSubtitle}>
              Give your family a name and tell us how many people are joining
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Family Name *</Text>
              <View style={styles.inputWithIcon}>
                <Ionicons
                  name="person"
                  size={20}
                  color={PRIMARY}
                  style={{ marginRight: 12 }}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Smith Family"
                  placeholderTextColor="#9CA3AF"
                  value={familyName}
                  onChangeText={setFamilyName}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Number of Family Members *</Text>
              <View style={styles.memberCountCard}>
                <TouchableOpacity
                  style={styles.countButton}
                  onPress={() => setTotalMembers(Math.max(1, totalMembers - 1))}
                  disabled={totalMembers <= 1}
                >
                  <Ionicons
                    name="remove"
                    size={24}
                    color={totalMembers <= 1 ? "#9CA3AF" : PRIMARY}
                  />
                </TouchableOpacity>

                <View style={styles.countDisplay}>
                  <Text style={styles.countNumber}>{totalMembers}</Text>
                  <Text style={styles.countLabel}>
                    {totalMembers === 1 ? "Member" : "Members"}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.countButton}
                  onPress={() =>
                    setTotalMembers(Math.min(10, totalMembers + 1))
                  }
                  disabled={totalMembers >= 10}
                >
                  <Ionicons
                    name="add"
                    size={24}
                    color={totalMembers >= 10 ? "#9CA3AF" : PRIMARY}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.quickSelectContainer}>
                {[1, 2, 3, 4, 5].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={[
                      styles.quickSelectButton,
                      totalMembers === num && styles.quickSelectButtonActive,
                    ]}
                    onPress={() => setTotalMembers(num)}
                  >
                    <Text
                      style={[
                        styles.quickSelectText,
                        totalMembers === num && styles.quickSelectTextActive,
                      ]}
                    >
                      {num}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[
                    styles.quickSelectButton,
                    totalMembers > 4 && styles.quickSelectButtonActive,
                  ]}
                  onPress={() => setTotalMembers(5)}
                >
                  <Text
                    style={[
                      styles.quickSelectText,
                      totalMembers > 4 && styles.quickSelectTextActive,
                    ]}
                  >
                    5+
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={20} color="#3B82F6" />
              <Text style={styles.infoText}>
                You'll add details for each family member next. The first member
                will be marked as "Self".
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleCreateFamily}
          >
            <Text style={styles.submitButtonText}>Continue</Text>
            <Ionicons
              name="arrow-forward"
              size={20}
              color="white"
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── STEP 2: ADD MEMBERS ─────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setStep(1)}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{familyName || "Family"} Members</Text>
        <View style={[styles.headerBadge, { backgroundColor: PRIMARY + "20" }]}>
          <Text style={[styles.headerBadgeText, { color: PRIMARY }]}>
            {completedMembers}/{members.length}
          </Text>
        </View>
      </View>

      <StepIndicator currentStep={1} totalSteps={2} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryLabel}>Family Members</Text>
            <Text style={styles.summaryValue}>
              {adults} Adult{adults !== 1 ? "s" : ""} · {kids} Kid
              {kids !== 1 ? "s" : ""}
            </Text>
          </View>
          <View style={styles.summaryIcon}>
            <Ionicons name="people" size={24} color={PRIMARY} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Add Member Details</Text>
        <Text style={styles.sectionSubtitle}>
          Fill in details for each family member. Tap a card to edit.
        </Text>

        {members.map((member, index) => {
          const isCompleted = !!(member.name.trim() && member.foodPreference);
          const colors = avatarColor(member.id);

          return (
            <TouchableOpacity
              key={member.id}
              style={styles.guestCard}
              onPress={() => openEdit(member.id)}
            >
              <View style={styles.guestHeader}>
                <View style={styles.guestTitleRow}>
                  {member.idImage ? (
                    <Image
                      source={{ uri: member.idImage }}
                      style={styles.memberAvatarImage}
                    />
                  ) : (
                    <View
                      style={[
                        styles.memberAvatar,
                        { backgroundColor: colors.bg },
                      ]}
                    >
                      <Text
                        style={[
                          styles.memberAvatarText,
                          { color: colors.text },
                        ]}
                      >
                        {getInitials(member.name || "?")}
                      </Text>
                    </View>
                  )}
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>
                      {member.name || `Member ${index + 1}`}
                    </Text>
                    <View style={styles.memberBadges}>
                      <View
                        style={[
                          styles.memberBadge,
                          isCompleted
                            ? styles.memberBadgeDone
                            : styles.memberBadgePending,
                        ]}
                      >
                        <Text
                          style={[
                            styles.memberBadgeText,
                            isCompleted
                              ? styles.memberBadgeTextDone
                              : styles.memberBadgeTextPending,
                          ]}
                        >
                          {isCompleted ? "✓ Done" : "Pending"}
                        </Text>
                      </View>
                      {member.relation && (
                        <Text style={styles.memberRelation}>
                          {member.relation}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
                <View style={styles.memberActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => openEdit(member.id)}
                  >
                    <Ionicons name="create-outline" size={20} color={PRIMARY} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDelete(member.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity style={styles.addMemberButton} onPress={openAdd}>
          <Ionicons name="add" size={24} color={PRIMARY} />
          <Text style={styles.addMemberText}>Add Another Member</Text>
        </TouchableOpacity>

        {completedMembers > 0 && (
          <TouchableOpacity
            style={styles.roomCard}
            onPress={handleContinueToRooms}
          >
            <View style={styles.roomIcon}>
              <Ionicons name="bed" size={24} color="white" />
            </View>
            <View style={styles.roomInfo}>
              <Text style={styles.roomTitle}>Next: Choose Rooms</Text>
              <Text style={styles.roomSubtitle}>
                We'll suggest rooms based on your family
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={PRIMARY} />
          </TouchableOpacity>
        )}
      </ScrollView>

      <MemberFormModal
        visible={modalVisible}
        onClose={closeModal}
        onSave={handleSaveMember}
        initial={
          getEditingMember()
            ? {
                name: getEditingMember()!.name,
                phone: getEditingMember()!.phone,
                email: getEditingMember()!.email,
                relation: getEditingMember()!.relation,
                foodPreference: getEditingMember()!.foodPreference,
                idImage: getEditingMember()!.idImage,
                isAdult: getEditingMember()!.isAdult ?? true,
                dob: getEditingMember()!.dob,
                height: getEditingMember()!.height,
                idNumber: getEditingMember()!.idNumber,
              }
            : undefined
        }
      />
    </SafeAreaView>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

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
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
  },
  headerBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  headerBadgeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  stepItem: {
    alignItems: "center",
    position: "relative",
    minWidth: 80,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  stepCircleActive: {
    backgroundColor: PRIMARY,
  },
  stepCircleCurrent: {
    borderWidth: 2,
    borderColor: PRIMARY,
    backgroundColor: "white",
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9ca3af",
  },
  stepNumberActive: {
    color: "white",
  },
  stepLabel: {
    fontSize: 12,
    color: "#9ca3af",
  },
  stepLabelActive: {
    color: PRIMARY,
    fontWeight: "600",
  },
  stepLine: {
    position: "absolute",
    top: 16,
    left: "60%",
    width: 40,
    height: 2,
    backgroundColor: "#f3f4f6",
  },
  stepLineActive: {
    backgroundColor: PRIMARY,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  questionsContainer: {
    padding: 16,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: PRIMARY + "20",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 16,
  },
  questionsTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 8,
  },
  questionsSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: "#1f2937",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  textInputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 16,
  },
  memberCountCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  countButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: PRIMARY + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  countDisplay: {
    alignItems: "center",
  },
  countNumber: {
    fontSize: 40,
    fontWeight: "700",
    color: "#1f2937",
  },
  countLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  quickSelectContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  quickSelectButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
  },
  quickSelectButtonActive: {
    backgroundColor: PRIMARY,
  },
  quickSelectText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "600",
  },
  quickSelectTextActive: {
    color: "white",
  },
  infoCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#3B82F6",
    lineHeight: 20,
  },
  bottomBar: {
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  submitButton: {
    backgroundColor: PRIMARY,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
  // Step 2 styles
  summaryCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginTop: 4,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: PRIMARY + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
  },
  guestCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  guestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  guestTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  memberAvatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  memberAvatarText: {
    fontSize: 18,
    fontWeight: "700",
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  memberBadges: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  memberBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  memberBadgeDone: {
    backgroundColor: "#10B981" + "20",
  },
  memberBadgePending: {
    backgroundColor: PRIMARY + "20",
  },
  memberBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  memberBadgeTextDone: {
    color: "#10B981",
  },
  memberBadgeTextPending: {
    color: PRIMARY,
  },
  memberRelation: {
    fontSize: 12,
    color: "#6b7280",
  },
  memberActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  addMemberButton: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: PRIMARY,
  },
  addMemberText: {
    fontSize: 14,
    fontWeight: "600",
    color: PRIMARY,
  },
  roomCard: {
    backgroundColor: PRIMARY + "15",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: PRIMARY + "30",
  },
  roomIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  roomInfo: {
    flex: 1,
  },
  roomTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  roomSubtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#f8f6f7",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  modalCloseButton: {
    width: 40,
    height: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  chipSelected: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  chipText: {
    fontSize: 14,
    color: "#6b7280",
  },
  chipTextSelected: {
    color: "white",
    fontWeight: "600",
  },
  imageUploadButton: {
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
    borderRadius: 12,
    overflow: "hidden",
  },
  idImagePreview: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  imageUploadPlaceholder: {
    width: "100%",
    height: 120,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  imageUploadText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginTop: 8,
  },
  imageUploadHint: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
});
function updateField(arg0: string, uri: string) {
  throw new Error("Function not implemented.");
}
