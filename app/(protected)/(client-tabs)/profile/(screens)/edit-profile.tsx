import api from "@/src/api/axios";
import ImageUpload from "@/src/components/ui/ImageUpload";
import { useAuthStore } from "@/src/store/AuthStore";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Theme ────────────────────────────────────────────────────────────────────
const PRIMARY = "#ec4899";

// ─── Constants ────────────────────────────────────────────────────────────────
const FOOD_OPTIONS = [
  { label: "Vegetarian", icon: "eco" },
  { label: "Non-Veg", icon: "set-meal" },
  { label: "Vegan", icon: "grass" },
  { label: "No Prefe", icon: "restaurant" },
] as const;

const IDENTITY_OPTIONS = [
  "Passport",
  "Driving License",
  "Aadhaar Card",
  "Voter ID",
  "National ID",
  "Other",
] as const;

const BIO_MAX = 500;
const BIO_MIN = 20;

// ─── Types ────────────────────────────────────────────────────────────────────
interface ProfileForm {
  name: string;
  email: string;
  phone: string;
  bio: string;
  foodPreference: string;
  identity: string;
  idProof: string;
  dateOfBirth: string;
  idImage: string;
  avatarImage: string;
}

type FormErrors = Partial<Record<keyof ProfileForm, string>>;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

// ─── Components ──────────────────────────────────────────────────────────────

const ProgressBar = ({ step, total }: { step: number; total: number }) => (
  <View style={styles.progressBar}>
    {Array.from({ length: total }).map((_, i) => (
      <View
        key={i}
        style={[styles.progressDot, i < step && styles.progressDotActive]}
      />
    ))}
  </View>
);

const AvatarPicker = ({
  name,
  avatarUri,
  onPick,
}: {
  name: string;
  avatarUri: string;
  onPick: () => void;
}) => {
  const scale = new Animated.Value(1);

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.94, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  return (
    <View style={styles.avatarContainer}>
      <Pressable onPress={onPick} onPressIn={onPressIn} onPressOut={onPressOut}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <View style={styles.avatar}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarInitials}>{getInitials(name)}</Text>
            )}
          </View>
          <View style={styles.cameraButton}>
            <MaterialIcons name="camera-alt" size={14} color="#fff" />
          </View>
        </Animated.View>
      </Pressable>
      <Text style={styles.avatarHint}>Tap to upload photo</Text>
    </View>
  );
};

const ValidationSummary = ({ count }: { count: number }) =>
  count > 0 ? (
    <View style={styles.validationCard}>
      <MaterialIcons name="error-outline" size={18} color="#ef4444" />
      <View style={styles.validationInfo}>
        <Text style={styles.validationTitle}>
          {count} issue{count > 1 ? "s" : ""} to fix
        </Text>
        <Text style={styles.validationText}>
          Check the highlighted fields below before continuing.
        </Text>
      </View>
    </View>
  ) : null;

const SectionLabel = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <View style={styles.sectionLabel}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function EditProfileScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Get user from AuthStore (no API call needed!)
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const fetchUserProfile = useAuthStore((state) => state.fetchUserProfile);
  const isProfileLoading = useAuthStore((state) => state.isProfileLoading);

  // ✅ Fetch fresh user data from backend when component mounts
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const [form, setForm] = useState<ProfileForm>({
    name: "",
    email: "",
    phone: "",
    bio: "",
    foodPreference: "",
    identity: "",
    idProof: "",
    dateOfBirth: "",
    idImage: "",
    avatarImage: "",
  });

  // ✅ Hydrate form from AuthStore (no network call needed)
  useEffect(() => {
    // Wait for profile to finish loading before setting form data
    if (!isProfileLoading && user) {
      setForm({
        name: user.username || user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        foodPreference: user.foodPreference || user.food_preference || "",
        identity: user.identity || user.idType || "",
        idProof: user.idProof || user.id_proof || user.idNumber || "",
        dateOfBirth: user.dateOfBirth || user.date_of_birth || "",
        idImage: user.idImage || user.id_image || user.governmentId || "",
        avatarImage:
          user.photo ||
          user.avatarImage ||
          user.avatar ||
          user.profilePicture ||
          "",
      });
      setLoading(false);
    } else if (!isProfileLoading && !user) {
      // No user and not loading - still show form
      setLoading(false);
    }
  }, [user, isProfileLoading]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
    "idle"
  );

  const set = (field: keyof ProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email address is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = "Enter a valid email address";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.bio.trim()) e.bio = "Bio is required";
    else if (form.bio.length < BIO_MIN)
      e.bio = `Please write at least ${BIO_MIN} characters`;
    if (!form.identity) e.identity = "Please select an ID type";
    if (!form.idImage) e.idImage = "Please upload your government ID";
    setErrors(e);
    if (Object.keys(e).length > 0)
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    return Object.keys(e).length === 0;
  };

  // ✅ Save updates to AuthStore when user hits Update
  const handleSave = async () => {
    if (!validate()) return;
    setSaveState("saving");
    try {
      // Send update to backend API
      const res = await api.put("/user/update", {
        username: form.name,
        name: form.name,
        email: form.email,
        phone: form.phone,
        bio: form.bio,
        foodPreference: form.foodPreference,
        identity: form.identity,
        idProof: form.idProof,
        dateOfBirth: form.dateOfBirth,
        idImage: form.idImage,
        photo: form.avatarImage,
        avatarImage: form.avatarImage,
      });

      // Update AuthStore with the response from server
      if (res.data) {
        updateUser(res.data);
      } else {
        // Fallback: update with local form data
        updateUser({
          username: form.name,
          name: form.name,
          email: form.email,
          phone: form.phone,
          bio: form.bio,
          foodPreference: form.foodPreference,
          identity: form.identity,
          idProof: form.idProof,
          dateOfBirth: form.dateOfBirth,
          idImage: form.idImage,
          photo: form.avatarImage,
          avatarImage: form.avatarImage,
        });
      }

      setSaveState("saved");
      setTimeout(() => router.back(), 600);
    } catch (error) {
      console.error("Error saving profile:", error);
      setSaveState("idle");
      Alert.alert("Save Failed", "Please check your connection and try again.");
    }
  };

  const pickAvatar = async () => {
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
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0])
      set("avatarImage", result.assets[0].uri);
  };

  const isSaving = saveState === "saving";
  const errorCount = Object.keys(errors).length;

  // Show loading while either local loading or fetching profile from backend
  if (loading || isProfileLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PRIMARY} />
          <Text style={styles.loadingText}>
            {isProfileLoading
              ? "Fetching latest profile..."
              : "Loading profile..."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back-ios-new" size={18} color="#374151" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <ProgressBar step={1} total={2} />
          <Text style={styles.stepText}></Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>Let's get started.</Text>
            <Text style={styles.headerSubtitle}>
              Fill in your details for a seamless check-in.
            </Text>
          </View>

          {/* Validation Summary */}
          <ValidationSummary count={errorCount} />

          {/* Avatar */}
          <AvatarPicker
            name={form.name}
            avatarUri={form.avatarImage}
            onPick={pickAvatar}
          />

          {/* Personal Details */}
          <SectionLabel title="Personal Details" />

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name *</Text>
            <TextInput
              style={[styles.textInput, errors.name && styles.textInputError]}
              placeholder="Enter your legal name"
              placeholderTextColor="#9CA3AF"
              value={form.name}
              onChangeText={(v) => set("name", v)}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Date of Birth</Text>
            <TextInput
              style={styles.textInput}
              placeholder="DD/MM/YYYY"
              placeholderTextColor="#9CA3AF"
              value={form.dateOfBirth}
              onChangeText={(v) => set("dateOfBirth", v)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number *</Text>
            <TextInput
              style={[styles.textInput, errors.phone && styles.textInputError]}
              placeholder="+977 98XXXXXXXX"
              placeholderTextColor="#9CA3AF"
              value={form.phone}
              onChangeText={(v) => set("phone", v)}
              keyboardType="phone-pad"
            />
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address *</Text>
            <TextInput
              style={[styles.textInput, errors.email && styles.textInputError]}
              placeholder="name@example.com"
              placeholderTextColor="#9CA3AF"
              value={form.email}
              onChangeText={(v) => set("email", v)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          {/* Stay Preferences */}
          <SectionLabel title="Stay Preferences" />

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Food Preference</Text>
            <View style={styles.chipContainer}>
              {FOOD_OPTIONS.map((opt) => {
                const active = form.foodPreference === opt.label;
                return (
                  <TouchableOpacity
                    key={opt.label}
                    style={[styles.chip, active && styles.chipSelected]}
                    onPress={() => set("foodPreference", opt.label)}
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
          </View>

          {/* Identity Verification */}
          <SectionLabel
            title="Identity Verification"
            subtitle="Required for check-in. Your ID is encrypted and never shared."
          />

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>ID Type *</Text>
            <View style={styles.chipContainerWrap}>
              {IDENTITY_OPTIONS.map((opt) => {
                const active = form.identity === opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.chip, active && styles.chipSelected]}
                    onPress={() => set("identity", opt)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        active && styles.chipTextSelected,
                      ]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {errors.identity && (
              <Text style={styles.errorText}>{errors.identity}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>ID Number</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. AB1234567"
              placeholderTextColor="#9CA3AF"
              value={form.idProof}
              onChangeText={(v) => set("idProof", v)}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.inputGroup}>
            <ImageUpload
              value={form.idImage}
              onChange={(uri) => set("idImage", uri)}
              label="Government ID *"
              placeholder="Upload Government ID"
              hint="Passport, Aadhaar, Driving Licence"
              error={errors.idImage}
            />
          </View>

          {/* About You */}
          <SectionLabel title="About You" />

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bio *</Text>
            <TextInput
              style={[
                styles.textInput,
                styles.textArea,
                errors.bio && styles.textInputError,
              ]}
              placeholder="Tell others about yourself, your profession, your interests…"
              placeholderTextColor="#9CA3AF"
              value={form.bio}
              onChangeText={(v) => {
                if (v.length <= BIO_MAX) set("bio", v);
              }}
              multiline
              maxLength={BIO_MAX}
            />
            <Text
              style={[
                styles.charCount,
                form.bio.length >= BIO_MIN
                  ? styles.charCountDone
                  : styles.charCountPending,
              ]}
            >
              {form.bio.length}/{BIO_MAX}
              {form.bio.length < BIO_MIN
                ? ` (${BIO_MIN - form.bio.length} more to go)`
                : " ✓"}
            </Text>
            {errors.bio && <Text style={styles.errorText}>{errors.bio}</Text>}
          </View>

          {/* CTA Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSave}
            disabled={isSaving}
            activeOpacity={0.85}
          >
            {isSaving ? (
              <>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.submitButtonText}>Saving…</Text>
              </>
            ) : saveState === "saved" ? (
              <>
                <MaterialIcons name="check-circle" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>Saved!</Text>
              </>
            ) : (
              <>
                <Text style={styles.submitButtonText}>Update</Text>
                <MaterialIcons name="arrow-forward" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.privacyText}>
            By continuing you agree to our{" "}
            <Text style={styles.privacyLink}>Privacy Policy</Text>. Your data is
            encrypted.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f6f7",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f6f7",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6b7280",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  progressBar: {
    flexDirection: "row",
    gap: 6,
  },
  progressDot: {
    width: 24,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#e5e7eb",
  },
  progressDotActive: {
    backgroundColor: PRIMARY,
  },
  stepText: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
  },
  headerRight: {
    width: 36,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  headerSection: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 22,
  },
  validationCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    gap: 12,
  },
  validationInfo: {
    flex: 1,
  },
  validationTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#b91c1c",
    marginBottom: 2,
  },
  validationText: {
    fontSize: 12,
    color: "#dc2626",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: PRIMARY + "20",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarInitials: {
    fontSize: 36,
    fontWeight: "700",
    color: PRIMARY,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  avatarHint: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 8,
  },
  sectionLabel: {
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: "#1f2937",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  textInputError: {
    borderColor: "#ef4444",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 14,
  },
  errorText: {
    fontSize: 12,
    color: "#ef4444",
    marginTop: 4,
  },
  charCount: {
    fontSize: 12,
    textAlign: "right",
    marginTop: 4,
  },
  charCountDone: {
    color: "#10b981",
  },
  charCountPending: {
    color: "#9ca3af",
  },
  chipContainer: {
    flexDirection: "row",
    gap: 8,
  },
  chipContainerWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    minWidth: 80,
  },
  chipSelected: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  chipText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  chipTextSelected: {
    color: "white",
  },
  imageUpload: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#e5e7eb",
  },
  idImagePreview: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  imageUploadPlaceholder: {
    width: "100%",
    height: 120,
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginTop: 8,
  },
  uploadHint: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: PRIMARY,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 24,
    marginBottom: 16,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
  privacyText: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: 18,
  },
  privacyLink: {
    color: "#374151",
    fontWeight: "600",
  },
});
