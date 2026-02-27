import { api } from "@/src/api/axios";
import { useAuthStore } from "@/src/store/AuthStore";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Guest {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isAdult: boolean;
  idNumber?: string;
  idImage?: string;
  height?: string;
  dob?: string;
}

interface InvitedEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  hostName: string;
  imageUrl: string;
}

interface RSVPData {
  attending: boolean | null;
  totalGuests: number;
  guests: Guest[];
  submitted: boolean;
}

interface FamilyMember {
  id?: number;
  familyId: number;
  relation: string;
  username: string;
  email: string;
  foodPreference: string;
  dob: string | null;
  hasAccount?: boolean;
  rsvpStatus?: "pending" | "attending" | "not-attending";
}

const getUserProfile = async () => {
  try {
    const response = await api.get("/user/me");
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

const getFamilyMembers = async (familyId: number): Promise<FamilyMember[]> => {
  try {
    const response = await api.get(`/family/${familyId}/member`);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching family members:", error);
    return [];
  }
};

const invitedEventData: InvitedEvent = {
  id: "5",
  title: "Friend's Birthday Bash",
  date: "Mar 15, 2024",
  time: "8:00 PM",
  location: "Rooftop Lounge",
  venue: "San Francisco, CA",
  hostName: "John Doe",
  imageUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDSiNZxjryxVvBt_Qvd2BsU8jmuyGXsbWyZqiGyTJOFCn4I4QdwE-xrJUmE938nQ2sYjA0qbPec911z6qe-blSH_epWVfQJy2W2NwU5R-4dwi1k7uUfEgPutKfIV3RpR1EUutrAFt_7SBxXq5yRfR9EkuQCohSjZJpWgX0eNFvBY3F5rZ-xWmmB8Em-xGg1AvxCRQDlpUPXbLlpkcqBsqbQXGIi5tNUNw3p5WrCahAWFPRTkzEE0B8v47AYzYa8b-aEAMvtdko47AM",
};

const GuestForm = ({
  guest,
  index,
  onUpdate,
  onRemove,
}: {
  guest: Guest;
  index: number;
  onUpdate: (guest: Guest) => void;
  onRemove: () => void;
}) => {
  const isSelf = index === 0;
  const relationships = isSelf
    ? ["Self"]
    : ["Spouse", "Child", "Parent", "Sibling", "Friend", "Colleague", "Other"];

  return (
    <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-base font-bold text-gray-800">
          {isSelf ? "Your Details" : `Guest ${index + 1}`}
        </Text>
        {!isSelf && (
          <TouchableOpacity onPress={onRemove} className="p-1">
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        )}
      </View>

      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          Full Name (Self)*
        </Text>
        <TextInput
          className="bg-gray-50 rounded-xl px-4 py-3.5 text-sm text-gray-800 border border-gray-200"
          placeholder="Enter guest name"
          placeholderTextColor="#9CA3AF"
          value={guest.name}
          onChangeText={(text) => onUpdate({ ...guest, name: text })}
        />
      </View>

      {!isSelf && (
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Relationship *
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row flex-wrap gap-2">
              {relationships.map((rel) => (
                <TouchableOpacity
                  key={rel}
                  className={`px-4 py-2 rounded-full ${
                    guest.relationship === rel
                      ? "bg-pink-600 border-pink-600"
                      : "bg-gray-100 border-gray-200"
                  } border`}
                  onPress={() => onUpdate({ ...guest, relationship: rel })}
                >
                  <Text
                    className={`text-sm ${
                      guest.relationship === rel
                        ? "text-white font-semibold"
                        : "text-gray-500"
                    }`}
                  >
                    {rel}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          Phone Number *
        </Text>
        <TextInput
          className="bg-gray-50 rounded-xl px-4 py-3.5 text-sm text-gray-800 border border-gray-200"
          placeholder="Enter phone number"
          placeholderTextColor="#9CA3AF"
          value={guest.phone}
          onChangeText={(text) => onUpdate({ ...guest, phone: text })}
          keyboardType="phone-pad"
        />
      </View>

      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          Is this guest 18 or older?
        </Text>
        <View className="flex-row flex-wrap gap-2">
          <TouchableOpacity
            className={`px-4 py-2 rounded-full ${
              guest.isAdult
                ? "bg-pink-600 border-pink-600"
                : "bg-gray-100 border-gray-200"
            } border`}
            onPress={() => onUpdate({ ...guest, isAdult: true })}
          >
            <Text
              className={`text-sm ${guest.isAdult ? "text-white font-semibold" : "text-gray-500"}`}
            >
              Yes (18+)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-4 py-2 rounded-full ${
              !guest.isAdult
                ? "bg-pink-600 border-pink-600"
                : "bg-gray-100 border-gray-200"
            } border`}
            onPress={() =>
              onUpdate({
                ...guest,
                isAdult: false,
                idNumber: undefined,
                idImage: undefined,
                height: undefined,
                dob: undefined,
              })
            }
          >
            <Text
              className={`text-sm ${!guest.isAdult ? "text-white font-semibold" : "text-gray-500"}`}
            >
              No (Under 18)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {guest.isAdult && (
        <>
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Date of Birth *
            </Text>
            <TextInput
              className="bg-gray-50 rounded-xl px-4 py-3.5 text-sm text-gray-800 border border-gray-200"
              placeholder="e.g., 15/06/1995"
              placeholderTextColor="#9CA3AF"
              value={guest.dob || ""}
              onChangeText={(text) => onUpdate({ ...guest, dob: text })}
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Height (cm) *
            </Text>
            <TextInput
              className="bg-gray-50 rounded-xl px-4 py-3.5 text-sm text-gray-800 border border-gray-200"
              placeholder="e.g., 175"
              placeholderTextColor="#9CA3AF"
              value={guest.height || ""}
              onChangeText={(text) => onUpdate({ ...guest, height: text })}
              keyboardType="numeric"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              ID Number (Passport/License) *
            </Text>
            <TextInput
              className="bg-gray-50 rounded-xl px-4 py-3.5 text-sm text-gray-800 border border-gray-200"
              placeholder="Enter ID number"
              placeholderTextColor="#9CA3AF"
              value={guest.idNumber || ""}
              onChangeText={(text) => onUpdate({ ...guest, idNumber: text })}
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              ID Image URI (optional)
            </Text>
            <TextInput
              className="bg-gray-50 rounded-xl px-4 py-3.5 text-sm text-gray-800 border border-gray-200"
              placeholder="Enter ID image URL or upload"
              placeholderTextColor="#9CA3AF"
              value={guest.idImage || ""}
              onChangeText={(text) => onUpdate({ ...guest, idImage: text })}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default function RSVPPage() {
  const params = useLocalSearchParams();
  const eventId = params.eventId as string;

  const user = useAuthStore((state) => state.user);

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [familyLoading, setFamilyLoading] = useState(false);
  const [hasFamily, setHasFamily] = useState(false);

  const [rsvpData, setRsvpData] = useState<RSVPData>({
    attending: null,
    totalGuests: 1,
    guests: [],
    submitted: false,
  });

  const [currentStep, setCurrentStep] = useState<
    "decision" | "guestCount" | "guestDetails" | "confirmation"
  >("decision");

  const nonAccountFamilyMembers = useMemo(
    () => familyMembers.filter((m) => !m.hasAccount),
    [familyMembers]
  );

  const accountFamilyMembers = useMemo(
    () => familyMembers.filter((m) => m.hasAccount),
    [familyMembers]
  );

  const [selectedFamilyMembers, setSelectedFamilyMembers] = useState<number[]>(
    []
  );

  const toggleFamilyMember = (memberId: number) => {
    setSelectedFamilyMembers((prev) => {
      if (prev.includes(memberId)) {
        return prev.filter((id) => id !== memberId);
      }
      return [...prev, memberId];
    });
  };

  const generateGuestList = (totalGuests: number): Guest[] => {
    const selfGuest: Guest = {
      id: "guest-self",
      name: user?.name || "",
      relationship: "Self",
      phone: "",
      isAdult: true,
      idNumber: "",
      idImage: "",
      height: "",
      dob: "",
    };

    const selectedMembers = nonAccountFamilyMembers.filter((m) =>
      selectedFamilyMembers.includes(m.id as number)
    );
    const familyGuests: Guest[] = selectedMembers.map((m, i) => ({
      id: `guest-member-${m.id || i}`,
      name: m.username || "",
      relationship: m.relation || "Family",
      phone: "",
      isAdult: true,
      idNumber: "",
      idImage: "",
      height: "",
      dob: m.dob || "",
    }));

    const extraGuestCount = Math.max(0, totalGuests - 1 - familyGuests.length);
    const extraGuests: Guest[] = Array.from(
      { length: extraGuestCount },
      (_, i) => ({
        id: `guest-extra-${i + 1}`,
        name: "",
        relationship: "",
        phone: "",
        isAdult: true,
        idNumber: "",
        idImage: "",
        height: "",
        dob: "",
      })
    );

    return [selfGuest, ...familyGuests, ...extraGuests];
  };

  const fetchFamilyMembers = async () => {
    setFamilyLoading(true);
    try {
      const userProfile = await getUserProfile();
      if (userProfile && userProfile.familyId) {
        setHasFamily(true);
        const members = await getFamilyMembers(userProfile.familyId);
        const otherMembers = members.filter(
          (m: FamilyMember) => m.email !== user?.email
        );
        setFamilyMembers(otherMembers);

        const membersWithoutAccounts = otherMembers.filter(
          (m: FamilyMember) => !m.hasAccount
        );
        setSelectedFamilyMembers(
          membersWithoutAccounts.map((m) => m.id as number)
        );

        setRsvpData((prev) => ({
          ...prev,
          totalGuests: 1 + membersWithoutAccounts.length,
        }));
      }
    } catch (error) {
      console.error("Error fetching family:", error);
    } finally {
      setFamilyLoading(false);
    }
  };

  const handleDecision = (attending: boolean) => {
    setRsvpData((prev) => ({ ...prev, attending }));

    if (attending) {
      fetchFamilyMembers();
      setCurrentStep("guestCount");
    } else {
      setCurrentStep("confirmation");
    }
  };

  const handleGuestCountSubmit = () => {
    const count = rsvpData.totalGuests;
    if (count < 1) {
      Alert.alert("Error", "Please enter at least 1 guest (yourself)");
      return;
    }

    const newGuests = generateGuestList(count);
    setRsvpData((prev) => ({ ...prev, guests: newGuests }));
    setCurrentStep("guestDetails");
  };

  const updateGuest = (index: number, updatedGuest: Guest) => {
    setRsvpData((prev) => ({
      ...prev,
      guests: prev.guests.map((g, i) => (i === index ? updatedGuest : g)),
    }));
  };

  const removeGuest = (index: number) => {
    if (index === 0) {
      Alert.alert("Error", "You cannot remove yourself from the RSVP");
      return;
    }
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

      if (!guest.name.trim()) {
        Alert.alert(
          "Error",
          `Please enter ${isSelf ? "your name" : `name for Guest ${i + 1}`}`
        );
        return false;
      }
      if (!isSelf && !guest.relationship) {
        Alert.alert("Error", `Please select relationship for Guest ${i + 1}`);
        return false;
      }
      if (!guest.phone.trim()) {
        Alert.alert(
          "Error",
          `Please enter ${isSelf ? "your phone" : `phone for Guest ${i + 1}`}`
        );
        return false;
      }
      const phoneRegex = /^[0-9]{7,15}$/;
      if (!phoneRegex.test(guest.phone.trim())) {
        Alert.alert(
          "Invalid Phone",
          `Please enter a valid phone number for ${isSelf ? "yourself" : `Guest ${i + 1}`}`
        );
        return false;
      }
      if (guest.isAdult) {
        if (!guest.dob?.trim()) {
          Alert.alert(
            "Error",
            `Please enter date of birth for ${isSelf ? "yourself" : `Guest ${i + 1}`}`
          );
          return false;
        }
        if (!guest.height?.trim()) {
          Alert.alert(
            "Error",
            `Please enter height for ${isSelf ? "yourself" : `Guest ${i + 1}`}`
          );
          return false;
        }
        if (!guest.idNumber?.trim()) {
          Alert.alert(
            "Error",
            `Please enter ID number for ${isSelf ? "yourself" : `Guest ${i + 1}`}`
          );
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateGuestDetails()) {
      return;
    }

    setRsvpData((prev) => ({ ...prev, submitted: true }));
    setCurrentStep("confirmation");

    Alert.alert(
      "See You There!",
      `Your RSVP for ${rsvpData.totalGuests} guest(s) has been submitted.`,
      [{ text: "OK" }]
    );
  };

  const getStepIndicator = () => {
    const steps = ["RSVP", "Guests", "Details", "Done"];
    const stepMap = {
      decision: 0,
      guestCount: 1,
      guestDetails: 2,
      confirmation: 3,
    };
    const currentIndex = stepMap[currentStep];

    return (
      <View className="flex-row justify-center items-center py-4 bg-white border-b border-gray-100">
        {steps.map((step, index) => (
          <View key={step} className="flex-row items-center">
            <View
              className={`w-7 h-7 rounded-full ${
                index <= currentIndex ? "bg-pink-600" : "bg-gray-100"
              } items-center justify-center`}
            >
              {index < currentIndex ? (
                <Ionicons name="checkmark" size={16} color="white" />
              ) : (
                <Text
                  className={`text-xs font-semibold ${
                    index <= currentIndex ? "text-white" : "text-gray-400"
                  }`}
                >
                  {index + 1}
                </Text>
              )}
            </View>
            <Text
              className={`text-[10px] ${
                index <= currentIndex
                  ? "font-semibold text-gray-800"
                  : "text-gray-400"
              } ml-0.5`}
            >
              {step}
            </Text>
            {index < steps.length - 1 && (
              <View
                className={`w-[30px] h-0.5 ${
                  index < currentIndex ? "bg-pink-600" : "bg-gray-100"
                } mx-1`}
              />
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row items-center justify-between px-4 py-3 bg-white">
        <TouchableOpacity className="p-2 w-12" onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800">RSVP</Text>
        <View className="w-12" />
      </View>

      {getStepIndicator()}

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {currentStep === "decision" && (
          <View className="p-4">
            <View className="bg-white rounded-2xl overflow-hidden mb-6 shadow-sm">
              <Image
                source={{ uri: invitedEventData.imageUrl }}
                className="w-full h-40"
              />
              <View className="p-4">
                <Text className="text-xl font-bold text-gray-800 mb-2">
                  {invitedEventData.title}
                </Text>
                <View className="flex-row items-center gap-2 mb-1">
                  <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                  <Text className="text-sm text-gray-500">
                    {invitedEventData.date} • {invitedEventData.time}
                  </Text>
                </View>
                <View className="flex-row items-center gap-2 mb-1">
                  <Ionicons name="location-outline" size={16} color="#6B7280" />
                  <Text className="text-sm text-gray-500">
                    {invitedEventData.location}
                  </Text>
                </View>
                <Text className="text-xs text-gray-400 mt-2">
                  Hosted by {invitedEventData.hostName}
                </Text>
              </View>
            </View>

            <Text className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Will you be attending?
            </Text>

            <TouchableOpacity
              className="bg-white rounded-2xl p-5 mb-3 border-2 border-emerald-500"
              onPress={() => handleDecision(true)}
            >
              <View className="w-16 h-16 rounded-full bg-emerald-50 items-center justify-center self-center mb-3">
                <Ionicons name="checkmark-circle" size={48} color="#10B981" />
              </View>
              <Text className="text-lg font-bold text-emerald-600 text-center mb-1">
                Yes, I'll be there!
              </Text>
              <Text className="text-sm text-gray-500 text-center">
                I'd love to celebrate with you
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-white rounded-2xl p-5 mb-3 border-2 border-red-500"
              onPress={() => handleDecision(false)}
            >
              <View className="w-16 h-16 rounded-full bg-red-50 items-center justify-center self-center mb-3">
                <Ionicons name="close-circle" size={48} color="#EF4444" />
              </View>
              <Text className="text-lg font-bold text-red-600 text-center mb-1">
                No, I can't make it
              </Text>
              <Text className="text-sm text-gray-400 text-center">
                Unfortunately, I won't be able to attend
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {currentStep === "guestCount" && (
          <View className="p-4">
            <View className="mb-6">
              <Text className="text-xl font-bold text-gray-800 mb-2">
                How many guests?
              </Text>
              <Text className="text-sm text-gray-500">
                Including yourself - how many people will be attending?
              </Text>
            </View>

            <View className="bg-white rounded-2xl p-6 flex-row items-center justify-between mb-3 shadow-sm">
              <TouchableOpacity
                className="w-14 h-14 rounded-full bg-pink-100 items-center justify-center"
                onPress={() =>
                  setRsvpData((prev) => ({
                    ...prev,
                    totalGuests: Math.max(1, prev.totalGuests - 1),
                  }))
                }
                disabled={rsvpData.totalGuests <= 1}
              >
                <Ionicons
                  name="remove"
                  size={32}
                  color={rsvpData.totalGuests <= 1 ? "#9CA3AF" : "#ee2b8c"}
                />
              </TouchableOpacity>

              <View className="items-center">
                <Text className="text-5xl font-bold text-gray-800">
                  {rsvpData.totalGuests}
                </Text>
                <Text className="text-sm text-gray-500">
                  {rsvpData.totalGuests === 1 ? "Guest" : "Guests"}
                </Text>
                {hasFamily && nonAccountFamilyMembers.length > 0 && (
                  <Text className="text-xs text-pink-500 mt-1">
                    ({selectedFamilyMembers.length} family member
                    {selectedFamilyMembers.length > 1 ? "s" : ""} selected)
                  </Text>
                )}
              </View>

              <TouchableOpacity
                className="w-14 h-14 rounded-full bg-pink-100 items-center justify-center"
                onPress={() =>
                  setRsvpData((prev) => ({
                    ...prev,
                    totalGuests: Math.min(
                      10 + selectedFamilyMembers.length,
                      prev.totalGuests + 1
                    ),
                  }))
                }
                disabled={
                  rsvpData.totalGuests >= 10 + selectedFamilyMembers.length
                }
              >
                <Ionicons
                  name="add"
                  size={32}
                  color={
                    rsvpData.totalGuests >= 10 + selectedFamilyMembers.length
                      ? "#9CA3AF"
                      : "#ee2b8c"
                  }
                />
              </TouchableOpacity>
            </View>

            <Text className="text-xs text-gray-400 text-center mb-6">
              Maximum {10 + selectedFamilyMembers.length} guests allowed
              {hasFamily && nonAccountFamilyMembers.length > 0
                ? ` (${selectedFamilyMembers.length} of ${nonAccountFamilyMembers.length} family selected)`
                : ""}
            </Text>

            {hasFamily && (
              <View className="bg-gray-50 rounded-2xl p-4 mb-6">
                <Text className="text-base font-semibold text-gray-800 mb-3">
                  Your Family Members
                </Text>
                {familyLoading ? (
                  <Text className="text-sm text-gray-500 text-center p-4">
                    Loading family members...
                  </Text>
                ) : familyMembers.length > 0 ? (
                  <>
                    {accountFamilyMembers.length > 0 && (
                      <View className="mb-3">
                        <Text className="text-sm font-medium text-gray-500 mb-2">
                          Will respond individually:
                        </Text>
                        {accountFamilyMembers.map((member, index) => (
                          <View
                            key={index}
                            className="bg-white rounded-xl p-3 mb-2 flex-row items-center justify-between border border-gray-200"
                          >
                            <View className="flex-1">
                              <Text className="text-base font-semibold text-gray-800">
                                {member.username}
                              </Text>
                              <Text className="text-sm text-gray-500">
                                {member.relation}
                              </Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                              <Ionicons
                                name={
                                  member.rsvpStatus === "attending"
                                    ? "checkmark-circle"
                                    : member.rsvpStatus === "not-attending"
                                      ? "close-circle"
                                      : "time-outline"
                                }
                                size={20}
                                color={
                                  member.rsvpStatus === "attending"
                                    ? "#10B981"
                                    : member.rsvpStatus === "not-attending"
                                      ? "#EF4444"
                                      : "#F59E0B"
                                }
                              />
                              <Text
                                className={`text-sm font-medium ${
                                  member.rsvpStatus === "attending"
                                    ? "text-emerald-500"
                                    : member.rsvpStatus === "not-attending"
                                      ? "text-red-500"
                                      : "text-amber-500"
                                }`}
                              >
                                {member.rsvpStatus === "attending"
                                  ? "Attending"
                                  : member.rsvpStatus === "not-attending"
                                    ? "Not Attending"
                                    : "Pending"}
                              </Text>
                            </View>
                          </View>
                        ))}
                      </View>
                    )}

                    {nonAccountFamilyMembers.length > 0 && (
                      <View className="mb-3">
                        <Text className="text-sm font-medium text-gray-500 mb-2">
                          Tap to add family members:
                        </Text>
                        <View className="flex-row flex-wrap gap-2">
                          {nonAccountFamilyMembers.map((member) => {
                            const isSelected = selectedFamilyMembers.includes(
                              member.id as number
                            );
                            return (
                              <TouchableOpacity
                                key={member.id}
                                className={`flex-row items-center gap-1.5 rounded-full px-3 py-2 border ${
                                  isSelected
                                    ? "bg-pink-500 border-pink-500"
                                    : "bg-white border-pink-500"
                                }`}
                                onPress={() =>
                                  toggleFamilyMember(member.id as number)
                                }
                              >
                                <Ionicons
                                  name={
                                    isSelected
                                      ? "checkmark-circle"
                                      : "add-circle-outline"
                                  }
                                  size={18}
                                  color={isSelected ? "white" : "#ec4899"}
                                />
                                <Text
                                  className={`text-sm font-medium ${
                                    isSelected ? "text-white" : "text-pink-500"
                                  }`}
                                >
                                  {member.username} ({member.relation})
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                        <Text className="text-xs text-gray-400 italic mt-1">
                          {selectedFamilyMembers.length} of{" "}
                          {nonAccountFamilyMembers.length} family members
                          selected
                        </Text>
                      </View>
                    )}
                  </>
                ) : (
                  <Text className="text-sm text-gray-400 text-center p-2">
                    No other family members found
                  </Text>
                )}
              </View>
            )}

            <TouchableOpacity
              className="bg-pink-600 rounded-xl py-4 flex-row items-center justify-center"
              onPress={handleGuestCountSubmit}
            >
              <Text className="text-base font-bold text-white">Continue</Text>
              <Ionicons
                name="arrow-forward"
                size={20}
                color="white"
                className="ml-2"
              />
            </TouchableOpacity>
          </View>
        )}

        {currentStep === "guestDetails" && (
          <View className="p-4">
            <View className="mb-6">
              <Text className="text-xl font-bold text-gray-800 mb-2">
                Guest Details
              </Text>
              <Text className="text-sm text-gray-500">
                Please provide details for each guest
              </Text>
            </View>

            {rsvpData.guests.map((guest, index) => (
              <GuestForm
                key={guest.id}
                guest={guest}
                index={index}
                onUpdate={(updated) => updateGuest(index, updated)}
                onRemove={() => removeGuest(index)}
              />
            ))}

            <TouchableOpacity
              className="bg-pink-600 rounded-xl py-4 flex-row items-center justify-center"
              onPress={handleSubmit}
            >
              <Text className="text-base font-bold text-white">
                Submit RSVP
              </Text>
              <Ionicons name="send" size={20} color="white" className="ml-2" />
            </TouchableOpacity>
          </View>
        )}

        {currentStep === "confirmation" && (
          <View className="p-4">
            <View className="items-center mb-4">
              {rsvpData.attending ? (
                <Ionicons name="checkmark-circle" size={80} color="#10B981" />
              ) : (
                <Ionicons name="heart-dislike" size={80} color="#EF4444" />
              )}
            </View>

            <Text className="text-2xl font-bold text-gray-800 text-center mb-2">
              {rsvpData.attending
                ? "See You There! 🎉"
                : "We're Sorry to See You Go 💔"}
            </Text>

            <Text className="text-sm text-gray-500 text-center mb-6">
              {rsvpData.attending
                ? `Your RSVP for ${rsvpData.totalGuests} guest(s) has been submitted.`
                : "Your response has been noted."}
            </Text>

            {rsvpData.attending && (
              <>
                <TouchableOpacity
                  className="bg-white rounded-2xl p-4 flex-row items-center mb-2 shadow-sm"
                  onPress={() =>
                    router.push({
                      pathname:
                        "/(protected)/(client-stack)/events/[eventId]/(guest)/transport",
                      params: { eventId },
                    })
                  }
                >
                  <View className="w-12 h-12 rounded-xl bg-pink-100 items-center justify-center mr-3">
                    <Ionicons name="car" size={24} color="#ee2b8c" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-800">
                      Transportation
                    </Text>
                    <Text className="text-xs text-gray-400 mt-0.5">
                      Manage transport for guests
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-white rounded-2xl p-4 flex-row items-center mb-2 shadow-sm"
                  onPress={() =>
                    router.push({
                      pathname:
                        "/(protected)/(client-stack)/events/[eventId]/(guest)/accommodation",
                      params: { eventId },
                    })
                  }
                >
                  <View className="w-12 h-12 rounded-xl bg-pink-100 items-center justify-center mr-3">
                    <Ionicons name="bed" size={24} color="#ee2b8c" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-800">
                      Accommodation
                    </Text>
                    <Text className="text-xs text-gray-400 mt-0.5">
                      Manage rooms for guests
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </>
            )}

            <View className="bg-white rounded-2xl overflow-hidden mt-4 mb-6 shadow-sm">
              <Image
                source={{ uri: invitedEventData.imageUrl }}
                className="w-full h-30"
              />
              <View className="p-4">
                <Text className="text-lg font-bold text-gray-800 mb-1">
                  {invitedEventData.title}
                </Text>
                <Text className="text-sm text-gray-500 mb-0.5">
                  {invitedEventData.date} • {invitedEventData.time}
                </Text>
                <Text className="text-xs text-gray-400">
                  {invitedEventData.location}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              className="bg-pink-600 rounded-xl py-4 items-center mb-3"
              onPress={() =>
                router.push("/(protected)/(client-tabs)/events" as any)
              }
            >
              <Text className="text-base font-bold text-white">Done</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
