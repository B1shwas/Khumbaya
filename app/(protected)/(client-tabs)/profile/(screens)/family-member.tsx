import {
  FormButton,
  FormCard,
  FormInput,
  FormSelect,
} from "@/src/components/ui/guest-profile";
import CustomHeader from "@/src/components/ui/profile/CustomHeader";
import {
  FamilyMember,
  FamilyMemberFormData,
  FOOD_PREFERENCE_LABELS,
  FoodPreference,
  IDENTITY_PROOF_LABELS,
  IdentityProofType,
  RELATION_LABELS,
  RelationType,
} from "@/src/types/guest";
// NOTE: API import commented - using mock data only
// import { familyMemberApi } from "@/src/api/guestProfileApi";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Food preference options
const FOOD_PREFERENCE_OPTIONS = Object.entries(FOOD_PREFERENCE_LABELS).map(
  ([value, label]) => ({ value, label })
);

// Identity proof type options
const IDENTITY_PROOF_OPTIONS = Object.entries(IDENTITY_PROOF_LABELS).map(
  ([value, label]) => ({ value, label })
);

// Relation type options
const RELATION_OPTIONS = Object.entries(RELATION_LABELS)
  .filter(([value]) => value !== "self") // Remove self from family member relations
  .map(([value, label]) => ({ value, label }));

export default function FamilyMemberScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ memberId?: string }>();
  const memberId = params.memberId;
  const isEditing = !!memberId;

  const [isLoading, setIsLoading] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);

  // Family member form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    relation: "" as RelationType | "",
    foodPreference: "" as FoodPreference | "",
    identityProofType: "" as IdentityProofType | "",
    identityProofNumber: "",
    dateOfBirth: "",
    isAdult: true,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Load profile and member data on mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    // ============================================================
    // BACKEND INTEGRATION NOTES:
    // TODO: Uncomment API call when backend is ready
    // ============================================================

    /*
    // API VERSION:
    try {
      const response = await guestProfileApi.getMyProfile();
      if (response.success && response.data) {
        setProfileId(response.data.id);
        if (memberId) {
          const member = response.data.familyMembers?.find(
            (m) => m.id === memberId
          );
          if (member) {
            setFormData({
              name: member.name || "",
              email: member.email || "",
              phone: member.phone || "",
              relation: member.relation || "",
              foodPreference: member.foodPreference || "",
              identityProofType: member.identity?.type || "",
              identityProofNumber: member.identity?.number || "",
              dateOfBirth: member.dateOfBirth || "",
              isAdult: member.isAdult ?? true,
            });
          }
        }
        return;
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load profile data.");
      router.back();
    }
    */

    // ============================================================
    // MOCK DATA VERSION (for UI testing only)
    // TODO: Remove this when backend is ready
    // ============================================================
    const mockProfileId = "test-profile-1";
    setProfileId(mockProfileId);

    if (memberId) {
      const mockMembers: FamilyMember[] = [
        {
          id: "fm-1",
          name: "Jane Doe",
          phone: "+1 234 567 8901",
          email: "jane.doe@example.com",
          relation: "spouse",
          foodPreference: "non_vegetarian",
          identity: { type: "passport", number: "AB1234568" },
          isAdult: true,
        },
      ];
      const member = mockMembers.find((m) => m.id === memberId);
      if (member) {
        setFormData({
          name: member.name || "",
          email: member.email || "",
          phone: member.phone || "",
          relation: member.relation || "",
          foodPreference: member.foodPreference || "",
          identityProofType: member.identity?.type || "",
          identityProofNumber: member.identity?.number || "",
          dateOfBirth: member.dateOfBirth || "",
          isAdult: member.isAdult ?? true,
        });
      }
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.relation) {
      newErrors.relation = "Relation is required";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.foodPreference) {
      newErrors.foodPreference = "Food preference is required";
    }

    if (!formData.identityProofType) {
      newErrors.identityProofType = "Identity proof type is required";
    }

    if (!formData.identityProofNumber.trim()) {
      newErrors.identityProofNumber = "Identity proof number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !profileId) return;

    setIsLoading(true);
    try {
      const memberData: FamilyMemberFormData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        relation: formData.relation as RelationType,
        foodPreference: formData.foodPreference as FoodPreference,
        identity: {
          type: formData.identityProofType as IdentityProofType,
          number: formData.identityProofNumber,
        },
        dateOfBirth: formData.dateOfBirth || undefined,
        isAdult: formData.isAdult,
      };

      // ============================================================
      // TODO: When backend ready, uncomment this:
      // ============================================================
      /*
      if (isEditing && memberId) {
        await familyMemberApi.updateFamilyMember(
          profileId,
          memberId,
          memberData
        );
        Alert.alert("Success", "Family member updated successfully!");
      } else {
        await familyMemberApi.addFamilyMember(profileId, memberData);
        Alert.alert("Success", "Family member added successfully!");
      }
      */

      // Mock save - just show success
      console.log("Mock save:", memberData);
      Alert.alert(
        "Success",
        isEditing
          ? "Family member updated! (Mock)"
          : "Family member added! (Mock)"
      );

      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to save family member. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <CustomHeader
        title={isEditing ? "Edit Family Member" : "Add Family Member"}
        showSaveButton={false}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-4 pt-6 pb-10"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              {isEditing ? "Edit Family Member" : "Add Family Member"}
            </Text>
            <Text className="text-base text-gray-600 leading-relaxed">
              Add details for each family member attending the event.
            </Text>
          </View>

          {/* Personal Information */}
          <FormCard className="mb-4">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Personal Details
            </Text>

            <FormInput
              label="Full Name"
              value={formData.name}
              onChangeText={(text) => handleInputChange("name", text)}
              placeholder="Enter family member's full name"
              icon="person"
              required
              error={errors.name}
            />

            <FormSelect
              label="Relation"
              value={formData.relation}
              options={RELATION_OPTIONS}
              onSelect={(value) => handleInputChange("relation", value)}
              placeholder="Select relation"
              icon="family-restroom"
              required
              error={errors.relation}
            />

            <FormInput
              label="Email Address"
              value={formData.email}
              onChangeText={(text) => handleInputChange("email", text)}
              placeholder="Enter email (optional)"
              icon="email"
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <FormInput
              label="Phone Number"
              value={formData.phone}
              onChangeText={(text) => handleInputChange("phone", text)}
              placeholder="Enter phone number (optional)"
              icon="phone"
              keyboardType="phone-pad"
            />

            {/* Adult/Child Toggle */}
            <View className="flex-row items-center justify-between py-3 border-t border-gray-100">
              <View className="flex-row items-center">
                <MaterialIcons
                  name={formData.isAdult ? "person" : "child-care"}
                  size={24}
                  color="#6b7280"
                />
                <View className="ml-3">
                  <Text className="text-base font-semibold text-gray-800">
                    {formData.isAdult ? "Adult" : "Child"}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {formData.isAdult ? "Above 12 years" : "Below 12 years"}
                  </Text>
                </View>
              </View>
              <Switch
                value={formData.isAdult}
                onValueChange={(value) => handleInputChange("isAdult", value)}
                trackColor={{ false: "#f9a8d4", true: "#f9a8d4" }}
                thumbColor={formData.isAdult ? "#db2777" : "#f9a8d4"}
              />
            </View>
          </FormCard>

          {/* Food Preference */}
          <FormCard className="mb-4">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Food Preference
            </Text>

            <FormSelect
              label="Food Preference"
              value={formData.foodPreference}
              options={FOOD_PREFERENCE_OPTIONS}
              onSelect={(value) => handleInputChange("foodPreference", value)}
              placeholder="Select food preference"
              icon="restaurant"
              required
              error={errors.foodPreference}
            />
          </FormCard>

          {/* Identity Proof */}
          <FormCard className="mb-4">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Identity Proof
            </Text>
            <Text className="text-sm text-gray-500 mb-4">
              Upload ID proof for each family member as per event requirements.
            </Text>

            <FormSelect
              label="ID Proof Type"
              value={formData.identityProofType}
              options={IDENTITY_PROOF_OPTIONS}
              onSelect={(value) =>
                handleInputChange("identityProofType", value)
              }
              placeholder="Select ID proof type"
              icon="badge"
              required
              error={errors.identityProofType}
            />

            <FormInput
              label="ID Number"
              value={formData.identityProofNumber}
              onChangeText={(text) =>
                handleInputChange("identityProofNumber", text)
              }
              placeholder="Enter ID number"
              icon="numbers"
              required
              error={errors.identityProofNumber}
              autoCapitalize="characters"
            />
          </FormCard>

          {/* Save Button */}
          <FormButton
            title={
              isLoading
                ? "Saving..."
                : isEditing
                  ? "Update Member"
                  : "Add Member"
            }
            onPress={handleSave}
            isLoading={isLoading}
            icon={isEditing ? "save" : "person-add"}
          />

          {/* Cancel Button */}
          <View className="mt-3">
            <FormButton
              title="Cancel"
              onPress={() => router.back()}
              variant="outline"
              icon="close"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
