import {
  FamilyMemberCard,
  FormButton,
  FormCard,
  FormInput,
  FormSelect,
} from "@/src/components/ui/guest-profile";
import CustomHeader from "@/src/components/ui/profile/CustomHeader";
import {
  FamilyMember,
  FOOD_PREFERENCE_LABELS,
  FoodPreference,
  GuestProfile,
  IDENTITY_PROOF_LABELS,
  IdentityProofType,
} from "@/src/types/guest";
// NOTE: API import commented - using mock data only for UI testing
// import { guestProfileApi } from "@/src/api/guestProfileApi";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
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

export default function EditProfileScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Guest profile form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    foodPreference: "" as FoodPreference | "",
    identityProofType: "" as IdentityProofType | "",
    identityProofNumber: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [profileId, setProfileId] = useState<string | null>(null);

  // Load profile data on mount
  useEffect(() => {
    loadProfile();
  }, []);

  // ============================================================
  // BACKEND INTEGRATION NOTES:
  // ----------------------------------------------------------
  // When backend is ready, uncomment the API version below
  // and remove the mock data version
  // ============================================================

  /*
  // API VERSION (uncomment when backend is ready):
  const loadProfile = async () => {
    try {
      setIsLoadingProfile(true);
      const response = await guestProfileApi.getMyProfile();
      if (response.success && response.data) {
        const profile: GuestProfile = response.data;
        setProfileId(profile.id);
        setFormData({
          name: profile.name || "",
          email: profile.email || "",
          phone: profile.phone || "",
          foodPreference: profile.foodPreference || "",
          identityProofType: profile.identity?.type || "",
          identityProofNumber: profile.identity?.number || "",
        });
        setFamilyMembers(profile.familyMembers || []);
      }
    } catch (error) {
      console.log("No existing profile, starting fresh");
    } finally {
      setIsLoadingProfile(false);
    }
  };
  */

  // ============================================================
  // MOCK DATA VERSION (for UI testing only)
  // TODO: Remove this when backend is ready
  // ============================================================
  const loadProfile = async () => {
    try {
      setIsLoadingProfile(true);

      // Mock data - simulates API response
      const mockProfile: GuestProfile = {
        id: "test-profile-1",
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 234 567 8900",
        foodPreference: "vegetarian",
        identity: {
          type: "passport",
          number: "AB1234567",
        },
        familyMembers: [
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
          {
            id: "fm-2",
            name: "Tommy Doe",
            phone: "",
            email: "",
            relation: "child",
            foodPreference: "vegetarian",
            identity: { type: "national_id", number: "CHILD001" },
            isAdult: false,
          },
        ],
        adultCount: 2,
        kidCount: 1,
        totalPax: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Set mock data to state
      setProfileId(mockProfile.id);
      setFormData({
        name: mockProfile.name,
        email: mockProfile.email,
        phone: mockProfile.phone,
        foodPreference: mockProfile.foodPreference,
        identityProofType: mockProfile.identity.type,
        identityProofNumber: mockProfile.identity.number,
      });
      setFamilyMembers(mockProfile.familyMembers);
    } catch (error) {
      console.log("Error loading mock data:", error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
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

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
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
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const profileData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        foodPreference: formData.foodPreference as FoodPreference,
        identity: {
          type: formData.identityProofType as IdentityProofType,
          number: formData.identityProofNumber,
        },
      };

      // ============================================================
      // TODO: When backend ready, uncomment this:
      // ============================================================
      /*
      if (profileId) {
        await guestProfileApi.updateProfile(profileId, profileData);
      } else {
        const response = await guestProfileApi.saveProfile(profileData);
        if (response.data?.id) {
          setProfileId(response.data.id);
        }
      }
      */

      // Mock save - just show success
      console.log("Mock save:", profileData);
      Alert.alert("Success", "Profile saved successfully! (Mock)");
    } catch (error) {
      Alert.alert("Error", "Failed to save profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFamilyMember = (memberId: string) => {
    Alert.alert(
      "Delete Family Member",
      "Are you sure you want to remove this family member?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            // ============================================================
            // TODO: When backend ready, uncomment this:
            // ============================================================
            /*
            if (profileId) {
              try {
                await familyMemberApi.deleteFamilyMember(profileId, memberId);
                setFamilyMembers((prev) =>
                  prev.filter((m) => m.id !== memberId)
                );
                Alert.alert("Success", "Family member removed successfully!");
              } catch (error) {
                Alert.alert("Error", "Failed to remove family member.");
              }
            }
            */

            // Mock delete - just update local state
            setFamilyMembers((prev) => prev.filter((m) => m.id !== memberId));
            Alert.alert("Success", "Family member removed! (Mock)");
          },
        },
      ]
    );
  };

  const handleAddFamilyMember = () => {
    if (!profileId) {
      Alert.alert(
        "Save Profile First",
        "Please save your profile before adding family members."
      );
      return;
    }
    router.push("/profile/(screens)/family-member" as any);
  };

  // Calculate pax count
  const adultCount = 1 + familyMembers.filter((m) => m.isAdult).length;
  const kidCount = familyMembers.filter((m) => !m.isAdult).length;
  const totalPax = adultCount + kidCount;

  if (isLoadingProfile) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <CustomHeader title="Edit Profile" showSaveButton={false} />
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <CustomHeader
        title="Guest Profile"
        showSaveButton
        onSave={handleSave}
        isLoading={isLoading}
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
              Guest Information
            </Text>
            <Text className="text-base text-gray-600 leading-relaxed">
              Complete your profile to help with room allocation and event
              planning.
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
              placeholder="Enter your full name"
              icon="person"
              required
              error={errors.name}
            />

            <FormInput
              label="Email Address"
              value={formData.email}
              onChangeText={(text) => handleInputChange("email", text)}
              placeholder="Enter your email"
              icon="email"
              required
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <FormInput
              label="Phone Number"
              value={formData.phone}
              onChangeText={(text) => handleInputChange("phone", text)}
              placeholder="Enter your phone number"
              icon="phone"
              required
              error={errors.phone}
              keyboardType="phone-pad"
            />
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
              placeholder="Select your food preference"
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

          {/* Family Members Section */}
          <FormCard className="mb-4">
            <View className="flex-row justify-between items-center mb-4">
              <View>
                <Text className="text-lg font-semibold text-gray-800">
                  Family Members
                </Text>
                <Text className="text-sm text-gray-500 mt-1">
                  {totalPax} pax ({adultCount} Adult
                  {adultCount !== 1 ? "s" : ""}, {kidCount} Kid
                  {kidCount !== 1 ? "s" : ""})
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleAddFamilyMember}
                className="bg-pink-500 px-4 py-2 rounded-lg flex-row items-center"
              >
                <MaterialIcons name="add" size={20} color="#ffffff" />
                <Text className="text-white font-semibold ml-1">Add</Text>
              </TouchableOpacity>
            </View>

            {familyMembers.length === 0 ? (
              <View className="py-6 items-center">
                <MaterialIcons
                  name="family-restroom"
                  size={48}
                  color="#d1d5db"
                />
                <Text className="text-gray-500 mt-2 text-center">
                  No family members added yet.
                  {"\n"}Tap "Add" to add family members.
                </Text>
              </View>
            ) : (
              <View>
                {familyMembers.map((member) => (
                  <FamilyMemberCard
                    key={member.id}
                    member={member}
                    onDelete={handleDeleteFamilyMember}
                  />
                ))}
              </View>
            )}
          </FormCard>

          {/* Room Allocation Info */}
          <FormCard className="mb-4 bg-blue-50 border-blue-100">
            <View className="flex-row items-start">
              <MaterialIcons name="info" size={24} color="#3b82f6" />
              <View className="ml-3 flex-1">
                <Text className="text-base font-semibold text-blue-800">
                  Room Allocation
                </Text>
                <Text className="text-sm text-blue-600 mt-1">
                  Based on {totalPax} pax ({adultCount} adult
                  {adultCount !== 1 ? "s" : ""}, {kidCount} kid
                  {kidCount !== 1 ? "s" : ""}), one room will be allocated
                  immediately. Additional rooms will be adjusted based on
                  availability.
                </Text>
              </View>
            </View>
          </FormCard>

          {/* Save Button */}
          <FormButton
            title={isLoading ? "Saving..." : "Save Profile"}
            onPress={handleSave}
            isLoading={isLoading}
            icon="save"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
