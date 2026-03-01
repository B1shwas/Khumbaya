import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
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

const FOOD_OPTIONS = [
  { label: "Veg", value: "Vegetarian", icon: "leaf" },
  { label: "Non-Veg", value: "Non-Vegetarian", icon: "restaurant" },
  { label: "Vegan", value: "Vegan", icon: "flower" },
  { label: "Jain", value: "Jain", icon: "star" },
] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MemberFormData {
  name: string;
  phone: string;
  email: string;
  relation: string;
  foodPreference: string;
  idImage: string;
  isAdult?: boolean;
  dob?: string;
  height?: string;
  idNumber?: string;
}

interface MemberFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (form: MemberFormData) => void;
  initial?: MemberFormData;
  title?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MemberFormModal({
  visible,
  onClose,
  onSave,
  initial,
  title,
}: MemberFormModalProps) {
  const [form, setForm] = useState<MemberFormData>(
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
  const [errors, setErrors] = useState<Partial<MemberFormData>>({});

  const updateField = (
    field: keyof MemberFormData,
    value: string | boolean
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const e: Partial<MemberFormData> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.relation.trim()) e.relation = "Relation is required";
    if (!form.foodPreference) e.foodPreference = "Food preference is required";

    // Phone validation
    if (form.phone.trim()) {
      const phoneRegex = /^[0-9]{7,15}$/;
      if (!phoneRegex.test(form.phone.trim())) {
        e.phone = "Invalid phone number";
      }
    }

    // Validate adult-specific fields
    if (form.isAdult) {
      if (!form.dob?.trim()) e.dob = "Date of birth is required";
      if (!form.height?.trim()) e.height = "Height is required";
      if (!form.idNumber?.trim()) e.idNumber = "ID number is required";
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
            {initial ? "Edit Member" : title || "Add Member"}
          </Text>
          <View style={styles.modalCloseButton} />
        </View>

        <ScrollView
          style={styles.modalContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Full Name */}
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

          {/* Phone Number */}
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

          {/* Email */}
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

          {/* Relation */}
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

          {/* Food Preference */}
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
                onPress={() => updateField("isAdult", true)}
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
                onPress={() => updateField("isAdult", false)}
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

          {/* Adult-specific fields */}
          {form.isAdult && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Date of Birth *</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    errors.dob && styles.textInputError,
                  ]}
                  placeholder="e.g. 15/06/1995"
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
                  placeholder="e.g. 175"
                  placeholderTextColor="#9CA3AF"
                  value={form.height || ""}
                  onChangeText={(v) => updateField("height", v)}
                  keyboardType="numeric"
                />
                {errors.height && (
                  <Text style={styles.errorText}>{errors.height}</Text>
                )}
              </View>

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
            </>
          )}

          {/* Submit Button */}
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
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 18,
    color: "#181114",
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#181114",
    backgroundColor: "#F9FAFB",
  },
  textInputError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: "#EF4444",
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
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  chipSelected: {
    borderColor: "#ec4899",
    backgroundColor: "#FDF2F8",
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  chipTextSelected: {
    color: "#ec4899",
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ec4899",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 32,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});
