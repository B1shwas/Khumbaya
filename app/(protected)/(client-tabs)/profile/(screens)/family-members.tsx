import { api } from "@/src/api/axios";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Constants ────────────────────────────────────────────────────────────────
const PRIMARY = "#ec4899";

const FOOD_OPTIONS = [
  { label: "Veg", value: "Vegetarian" },
  { label: "Non-Veg", value: "Non-Vegetarian" },
  { label: "Vegan", value: "Vegan" },
  { label: "Jain", value: "Jain" },
] as const;

// ─── Types ────────────────────────────────────────────────────────────────────
interface User {
  id: number;
  email: string;
  username: string;
  familyId: number | null;
}

interface Family {
  id: number;
  familyName: string;
  createdBy: number;
}

interface FamilyMember {
  id?: number;
  familyId: number;
  relation: string;
  username: string;
  email: string;
  foodPreference: string;
  dob: string | null;
}

interface MemberForm {
  name: string;
  email: string;
  relation: string;
  foodPreference: string;
}

// ─── API Functions ───────────────────────────────────────────────────────────
const getUserProfile = async () => {
  const response = await api.get("/user/me");
  return response.data.data || response.data;
};
const createFamily = async (familyName: string): Promise<Family> => {
  const response = await api.post("/family", { familyName });
  return response.data.data || response.data;
};

const addMember = async (
  familyId: number,
  member: {
    email: string;
    name?: string;
    relation?: string;
    foodPreference?: string;
  }
): Promise<FamilyMember> => {
  const response = await api.post(`/family/${familyId}/member`, member);
  return response.data.data || response.data;
};

const updateMember = async (
  familyId: number,
  memberId: number,
  member: { relation?: string; name?: string; foodPreference?: string }
): Promise<FamilyMember> => {
  const response = await api.patch(
    `/family/${familyId}/member/${memberId}`,
    member
  );
  return response.data.data || response.data;
};

const deleteMember = async (
  familyId: number,
  memberId: number
): Promise<FamilyMember> => {
  const response = await api.delete(`/family/${familyId}/member/${memberId}`);
  return response.data.data || response.data;
};

const getMembers = async (familyId: number): Promise<FamilyMember[]> => {
  const response = await api.get(`/family/${familyId}/member`);
  return response.data.data || response.data;
};

const getFamily = async (familyId: number): Promise<Family> => {
  const response = await api.get(`/family/${familyId}`);
  return response.data.data || response.data;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

const avatarColor = (index: number) => {
  const colors = [
    { bg: "bg-orange-100", text: "text-orange-700" },
    { bg: "bg-pink-100", text: "text-pink-700" },
    { bg: "bg-blue-100", text: "text-blue-700" },
    { bg: "bg-green-100", text: "text-green-700" },
    { bg: "bg-purple-100", text: "text-purple-700" },
  ];
  return colors[index % colors.length] ?? colors[0];
};

// ─── Step Indicator ─────────────────────────────────────────────────────────
const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  const steps = ["Family", "Members"];

  return (
    <View className="flex-row justify-center py-4 bg-white border-b border-gray-200">
      {steps.map((step, index) => (
        <View key={step} className="items-center relative min-w-[80px]">
          <View
            className={`w-8 h-8 rounded-full items-center justify-center mb-1 ${
              index < currentStep
                ? "bg-pink-500"
                : index === currentStep
                  ? "border-2 border-pink-500 bg-white"
                  : "bg-gray-200"
            }`}
          >
            {index < currentStep ? (
              <Ionicons name="checkmark" size={16} color="white" />
            ) : (
              <Text
                className={`text-sm font-semibold ${
                  index <= currentStep ? "text-pink-500" : "text-gray-400"
                }`}
              >
                {index + 1}
              </Text>
            )}
          </View>
          <Text
            className={`text-xs ${
              index <= currentStep
                ? "text-pink-500 font-semibold"
                : "text-gray-400"
            }`}
          >
            {step}
          </Text>
          {index < steps.length - 1 && (
            <View
              className={`absolute top-4 left-[60%] w-10 h-0.5 ${
                index < currentStep ? "bg-pink-500" : "bg-gray-200"
              }`}
            />
          )}
        </View>
      ))}
    </View>
  );
};

// ─── Member Form Modal ─────────────────────────────────────────────────────
const MemberFormModal = ({
  visible,
  onClose,
  onSave,
  initial,
  isEditing,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (form: MemberForm) => void;
  initial?: FamilyMember;
  isEditing: boolean;
}) => {
  const [form, setForm] = useState<MemberForm>(
    initial
      ? {
          name: initial.username || "",
          email: initial.email || "",
          relation: initial.relation || "",
          foodPreference: initial.foodPreference || "",
        }
      : { name: "", email: "", relation: "", foodPreference: "" }
  );
  const [errors, setErrors] = useState<Partial<MemberForm>>({});

  const updateField = (field: keyof MemberForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const e: Partial<MemberForm> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.relation.trim()) e.relation = "Relation is required";
    if (!form.foodPreference) e.foodPreference = "Food preference is required";

    if (!isEditing && !form.email.trim()) e.email = "Email is required";
    else if (form.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email.trim()))
        e.email = "Invalid email address";
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
      <SafeAreaView className="flex-1 bg-gray-100">
        <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          <TouchableOpacity
            onPress={onClose}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="close" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-800">
            {initial ? "Edit Member" : "Add Member"}
          </Text>
          <View className="w-10 h-10" />
        </View>

        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-5">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Full Name *
            </Text>
            <TextInput
              className={`bg-white rounded-xl px-4 py-3.5 text-base text-gray-800 border ${errors.name ? "border-red-500" : "border-gray-200"}`}
              placeholder="Enter name"
              placeholderTextColor="#9CA3AF"
              value={form.name}
              onChangeText={(v) => updateField("name", v)}
            />
            {errors.name && (
              <Text className="text-xs text-red-500 mt-1">{errors.name}</Text>
            )}
          </View>

          {!isEditing && (
            <View className="mb-5">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Email *
              </Text>
              <TextInput
                className={`bg-white rounded-xl px-4 py-3.5 text-base text-gray-800 border ${errors.email ? "border-red-500" : "border-gray-200"}`}
                placeholder="email@example.com"
                placeholderTextColor="#9CA3AF"
                value={form.email}
                onChangeText={(v) => updateField("email", v)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && (
                <Text className="text-xs text-red-500 mt-1">
                  {errors.email}
                </Text>
              )}
            </View>
          )}

          <View className="mb-5">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Relation *
            </Text>
            <TextInput
              className={`bg-white rounded-xl px-4 py-3.5 text-base text-gray-800 border ${errors.relation ? "border-red-500" : "border-gray-200"}`}
              placeholder="e.g. Spouse, Child, Parent, Friend..."
              placeholderTextColor="#9CA3AF"
              value={form.relation}
              onChangeText={(v) => updateField("relation", v)}
            />
            {errors.relation && (
              <Text className="text-xs text-red-500 mt-1">
                {errors.relation}
              </Text>
            )}
          </View>

          <View className="mb-5">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Food Preference *
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {FOOD_OPTIONS.map((opt) => {
                const active = form.foodPreference === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    className={`px-4 py-2.5 rounded-full border ${active ? "bg-pink-500 border-pink-500" : "bg-white border-gray-200"}`}
                    onPress={() => updateField("foodPreference", opt.value)}
                  >
                    <Text
                      className={`text-sm font-medium ${active ? "text-white" : "text-gray-700"}`}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {errors.foodPreference && (
              <Text className="text-xs text-red-500 mt-1">
                {errors.foodPreference}
              </Text>
            )}
          </View>

          <TouchableOpacity
            className="bg-pink-500 rounded-xl py-4 flex-row items-center justify-center mb-6"
            onPress={handleSave}
          >
            <Text className="text-white text-base font-semibold">
              {initial ? "Update Member" : "Add Member"}
            </Text>
            <Ionicons
              name="checkmark"
              size={20}
              color="white"
              className="ml-2"
            />
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function FamilyMembersScreen() {
  // UI State
  const [step, setStep] = useState<1 | 2>(1);
  const [familyName, setFamilyName] = useState("");
  const [members, setMembers] = useState<FamilyMember[]>([]);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMemberIndex, setEditingMemberIndex] = useState<number | null>(
    null
  );

  // API State
  const [familyId, setFamilyId] = useState<number | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  // ─── Load existing family on mount ────────────────────────────────────────────
  useEffect(() => {
    const loadUserAndFamily = async () => {
      setLoading(true);
      try {
        // Get user profile which includes familyId
        const userProfile = await getUserProfile();
        setUserData(userProfile);
        console.log("User data:", userData);

        // If user has a family, load it
        if (userProfile && userProfile.familyId) {
          setFamilyId(userProfile.familyId);

          // Get family details
          const family = await getFamily(userProfile.familyId);
          setFamilyName(family.familyName);

          // Get family members
          const membersData = await getMembers(userProfile.familyId);
          setMembers(membersData);

          // Go to step 2 to show members
          setStep(2);
        }
      } catch (err) {
        console.log("Failed to load user/family:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUserAndFamily();
  }, []);

  // ─── Modal Helpers ────────────────────────────────────────────────
  const getEditingMember = () =>
    editingMemberIndex !== null ? members[editingMemberIndex] : undefined;
  const openAdd = () => {
    setEditingMemberIndex(null);
    setModalVisible(true);
  };
  const openEdit = (index: number) => {
    setEditingMemberIndex(index);
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
    setEditingMemberIndex(null);
  };

  // ─── Member Handlers ────────────────────────────────────────────────
  const handleSaveMember = async (form: MemberForm) => {
    if (!familyId) {
      Alert.alert(
        "Error",
        "No family selected. Please create or select a family first."
      );
      return;
    }

    const member =
      editingMemberIndex !== null ? members[editingMemberIndex] : null;
    const isExisting = member?.id !== undefined;

    setLoading(true);
    setLoadingMessage(isExisting ? "Updating member..." : "Adding member...");

    try {
      if (isExisting && member?.id) {
        const updatedMember = await updateMember(familyId, member.id, {
          name: form.name,
          relation: form.relation,
          foodPreference: form.foodPreference,
        });
        setMembers((prev) =>
          prev.map((m, i) =>
            i === editingMemberIndex ? { ...m, ...updatedMember } : m
          )
        );
      } else {
        const newMember = await addMember(familyId, {
          email: form.email,
          name: form.name,
          relation: form.relation,
          foodPreference: form.foodPreference,
        });
        setMembers((prev) => [...prev, newMember]);
      }
      closeModal();
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to save member";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const handleDelete = async (index: number) => {
    const member = members[index];
    if (index === 0) {
      Alert.alert(
        "Cannot Remove",
        "You cannot remove yourself from the family"
      );
      return;
    }
    if (!member?.id || !familyId) {
      Alert.alert("Error", "Member not found");
      return;
    }

    Alert.alert("Remove Member", "Remove this person from your family?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          setLoadingMessage("Removing member...");
          try {
            await deleteMember(familyId, member.id!);
            setMembers((prev) => prev.filter((_, i) => i !== index));
          } catch (err: any) {
            Alert.alert(
              "Error",
              err.response?.data?.message || "Failed to remove member"
            );
          } finally {
            setLoading(false);
            setLoadingMessage("");
          }
        },
      },
    ]);
  };

  // ─── Family Creation ────────────────────────────────────────────────
  const handleCreateFamily = async () => {
    if (!familyName.trim()) {
      Alert.alert("Required", "Please enter your family name");
      return;
    }

    setLoading(true);
    setLoadingMessage("Creating family...");

    try {
      const familyResponse = await createFamily(familyName);
      setFamilyId(familyResponse.id);

      // Add self as first member
      const self = await addMember(familyResponse.id, {
        email: userData?.email || "",
        name: userData?.username || "",
        relation: "Self",
        foodPreference: "",
      });
      setMembers([self]);
      setStep(2);
    } catch (err: any) {
      const errorData = err.response?.data;
      const errorMessage = errorData?.message || "";

      if (errorMessage.includes("already has a family")) {
        // User already has a family - try to get familyId from error response
        const existingFamilyId = errorData?.familyId;

        if (existingFamilyId) {
          setFamilyId(existingFamilyId);
          try {
            const membersData = await getMembers(existingFamilyId);
            setMembers(membersData);
          } catch (memberErr) {
            console.log("Failed to load members:", memberErr);
          }
        }

        Alert.alert(
          "Family Exists",
          "You already have a family. You can add more members.",
          [{ text: "OK", onPress: () => setStep(2) }]
        );
      } else {
        Alert.alert("Error", errorMessage || "Failed to create family");
      }
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  // ─── Continue Button ────────────────────────────────────────────────
  const handleContinueToRooms = () => {
    const incompleteMembers = members.filter(
      (m) => !m.username?.trim() || !m.foodPreference
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

  const completedMembers = members.filter(
    (m) => m.username?.trim() && m.foodPreference
  ).length;

  // ─── STEP 1: CREATE FAMILY ────────────────────────────────────────────────
  if (step === 1) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <View className="flex-row items-center justify-between px-4 py-3 bg-white">
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-800">Family Setup</Text>
          <View className="w-10 h-10" />
        </View>

        <StepIndicator currentStep={1} />

        <View className="p-4">
          <Text className="text-base text-gray-700 mb-2">Family Name *</Text>
          <TextInput
            placeholder="Enter your family name"
            placeholderTextColor="#9CA3AF"
            className="bg-white rounded-xl px-4 py-3.5 border border-gray-200 text-gray-800"
            value={familyName}
            onChangeText={setFamilyName}
          />

          <TouchableOpacity
            className="bg-pink-500 rounded-xl py-4 mt-6 items-center justify-center flex-row"
            onPress={handleCreateFamily}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Text className="text-white text-base font-semibold">
                  Create Family
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="white"
                  className="ml-2"
                />
              </>
            )}
          </TouchableOpacity>
        </View>

        {loading && (
          <View className="absolute inset-0 bg-black/20 items-center justify-center">
            <ActivityIndicator size="large" color={PRIMARY} />
            <Text className="mt-2 text-white font-semibold">
              {loadingMessage}
            </Text>
          </View>
        )}
      </SafeAreaView>
    );
  }

  // ─── STEP 2: MANAGE MEMBERS ───────────────────────────────────────────────
  // If no familyId, show prompt to enter family name
  if (!familyId) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <View className="flex-row items-center justify-between px-4 py-3 bg-white">
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-800">Add Members</Text>
          <View className="w-10 h-10" />
        </View>

        <View className="flex-1 p-4">
          <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
            <Text className="text-yellow-800 font-semibold mb-2">
              Family Not Selected
            </Text>
            <Text className="text-yellow-700 text-sm">
              To add members, we need to find your existing family. Please enter
              your family name below.
            </Text>
          </View>

          <Text className="text-base text-gray-700 mb-2">Family Name</Text>
          <TextInput
            placeholder="Enter your family name"
            placeholderTextColor="#9CA3AF"
            className="bg-white rounded-xl px-4 py-3.5 border border-gray-200 text-gray-800 mb-4"
            value={familyName}
            onChangeText={setFamilyName}
          />

          <TouchableOpacity
            className="bg-pink-500 rounded-xl py-4 items-center justify-center flex-row"
            onPress={async () => {
              if (!familyName.trim()) {
                Alert.alert("Required", "Please enter your family name");
                return;
              }
              setLoading(true);
              setLoadingMessage("Finding family...");
              try {
                // Try to get family by name - this would need a backend endpoint
                // For now, show error that this feature needs backend support
                Alert.alert(
                  "Feature Required",
                  "Please contact support to add members to your existing family, or delete your current family and create a new one."
                );
              } catch (err: any) {
                Alert.alert(
                  "Error",
                  "Could not find your family. Please try again."
                );
              } finally {
                setLoading(false);
                setLoadingMessage("");
              }
            }}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white text-base font-semibold">
                Find My Family
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-row items-center justify-between px-4 py-3 bg-white">
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800">
          {familyName || "Family"} Members
        </Text>
        <View className="w-10 h-10" />
      </View>

      <StepIndicator currentStep={2} />

      <ScrollView
        className="flex-1 px-4 py-3"
        showsVerticalScrollIndicator={false}
      >
        {members.map((m, idx) => {
          const { bg, text } = avatarColor(idx);
          return (
            <View
              key={idx}
              className="flex-row items-center justify-between mb-4 bg-white rounded-xl p-4 shadow"
            >
              <View className="flex-row items-center">
                <View
                  className={`w-12 h-12 rounded-full items-center justify-center mr-3`}
                  style={{ backgroundColor: bg }}
                >
                  <Text style={{ color: text, fontWeight: "bold" }}>
                    {getInitials(m.username)}
                  </Text>
                </View>
                <View>
                  <Text className="text-base font-semibold text-gray-800">
                    {m.username || `Member ${idx + 1}`}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <View
                      className={`px-2 py-0.5 rounded-full ${m.username && m.foodPreference ? "bg-green-100" : "bg-yellow-100"}`}
                    >
                      <Text
                        className={`text-xs font-medium ${m.username && m.foodPreference ? "text-green-600" : "text-yellow-600"}`}
                      >
                        {m.username && m.foodPreference ? "✓ Done" : "Pending"}
                      </Text>
                    </View>
                    {m.relation && (
                      <Text className="text-xs text-gray-500 ml-2">
                        {m.relation}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
              <View className="flex-row items-center">
                <TouchableOpacity
                  className="w-9 h-9 rounded-full items-center justify-center"
                  onPress={() => openEdit(idx)}
                >
                  <Ionicons name="create-outline" size={20} color={PRIMARY} />
                </TouchableOpacity>
                {idx !== 0 && (
                  <TouchableOpacity
                    className="w-9 h-9 rounded-full items-center justify-center ml-1"
                    onPress={() => handleDelete(idx)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}

        <TouchableOpacity
          className="flex-row items-center justify-center py-4 rounded-xl border-2 border-pink-500 border-dashed mt-2"
          onPress={openAdd}
        >
          <Ionicons name="add" size={24} color={PRIMARY} />
          <Text className="text-base font-semibold text-pink-500 ml-2">
            Add Another Member
          </Text>
        </TouchableOpacity>

        {completedMembers > 0 && (
          <TouchableOpacity
            className="flex-row items-center bg-white rounded-xl p-4 mt-4 mb-6"
            onPress={handleContinueToRooms}
          >
            <View className="w-12 h-12 rounded-full bg-pink-500 items-center justify-center">
              <Ionicons name="bed" size={24} color="white" />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-base font-semibold text-gray-800">
                Next: Choose Rooms
              </Text>
              <Text className="text-sm text-gray-500 mt-0.5">
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
        initial={getEditingMember()}
        isEditing={editingMemberIndex !== null}
      />
    </SafeAreaView>
  );
}
