import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetInvitationsForEvent, useInviteGuest } from "./api/use-guests";
import GuestCard from "./components/GuestCard";

export default function GuestListScreen() {
  const params = useLocalSearchParams();

  const eventId = useMemo(() => {
    const raw = Array.isArray(params.eventId) ? params.eventId[0] : params.eventId;
    const parsed = raw ? Number(raw) : NaN;
    return Number.isFinite(parsed) ? parsed : null;
  }, [params.eventId]);

  const inviteGuestMutation = useInviteGuest();
  const { data: invitations, isLoading } = useGetInvitationsForEvent(eventId);

  const [showAddModal, setShowAddModal] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("");

  const resetForm = useCallback(() => {
    setFullName("");
    setEmail("");
    setPhone("");
    setRelation("");
  }, []);

  const closeModal = useCallback(() => {
    setShowAddModal(false);
    resetForm();
  }, [resetForm]);

  const handleAddGuest = useCallback(async () => {
    if (!eventId) {
      Alert.alert("Error", "Invalid event id");
      return;
    }

    if (!fullName.trim()) {
      Alert.alert("Error", "Please enter a guest name");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Error", "Please enter a guest email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Error", "Please enter a valid email");
      return;
    }

    if (!phone.trim()) {
      Alert.alert("Error", "Please enter a phone number");
      return;
    }

    try {
      await inviteGuestMutation.mutateAsync({
        eventId,
        payload: {
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          eventId,
          isFamily: relation.trim().toLowerCase().includes("family"),
        },
      });

      Alert.alert("Success", "Guest added successfully!");
      closeModal();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to add guest. Please try again.";
      Alert.alert("Error", message);
    }
  }, [eventId, fullName, email, phone, relation, inviteGuestMutation, closeModal]);

  return (
    <SafeAreaView className="flex-1 bg-background-light">
      <View className="flex-1 px-4">
<<<<<<< HEAD
        <Text className="text-[22px] font-bold text-gray-900 mb-2">Guests</Text>
        <Text className="text-sm text-gray-500 mb-5">
=======
        <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 8 }}>Guests</Text>
        <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 20 }}>
>>>>>>> 0cf33ec (Updating in the guest list screen page)
          Manage your event invitations.
        </Text>

        <TouchableOpacity
<<<<<<< HEAD
          className="bg-primary py-3.5 rounded-xl items-center mb-5"
          onPress={() => setShowAddModal(true)}
        >
          <Text className="text-base font-semibold text-white">Add Guest</Text>
=======
          style={{
            paddingVertical: 14,
            borderRadius: 12,
            backgroundColor: "#EE2B8C",
            alignItems: "center",
            marginBottom: 20,
          }}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#fff" }}>Add Guest</Text>
>>>>>>> 0cf33ec (Updating in the guest list screen page)
        </TouchableOpacity>

        {isLoading ? (
          <Text>Loading invitations...</Text>
        ) : (
          <FlatList
            data={invitations}
            keyExtractor={(item: any) => (item.user?.id || Math.random()).toString()}
            renderItem={({ item }: { item: any }) => <GuestCard guest={item} />}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
<<<<<<< HEAD
              <Text className="text-center text-gray-500 mt-5">
=======
              <Text style={{ textAlign: "center", color: "#6B7280", marginTop: 20 }}>
>>>>>>> 0cf33ec (Updating in the guest list screen page)
                No guests invited yet.
              </Text>
            }
          />
        )}

        <Modal
          visible={showAddModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={closeModal}
        >
          <SafeAreaView className="flex-1 bg-white">
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
              <TouchableOpacity onPress={closeModal} className="p-2">
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
              <Text className="text-lg font-bold text-gray-900">Add New Guest</Text>
              <View className="w-10" />
            </View>

            <ScrollView className="flex-1 px-4 py-6" keyboardShouldPersistTaps="handled">
              <View className="gap-4">
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1.5">Name *</Text>
                  <TextInput
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Enter guest name"
                    className="bg-gray-100 p-3.5 rounded-xl text-sm"
                  />
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1.5">Email *</Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="bg-gray-100 p-3.5 rounded-xl text-sm"
                  />
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1.5">Phone *</Text>
                  <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                    className="bg-gray-100 p-3.5 rounded-xl text-sm"
                  />
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1.5">Relation</Text>
                  <TextInput
                    value={relation}
                    onChangeText={setRelation}
                    placeholder="e.g., Family, Friend"
                    className="bg-gray-100 p-3.5 rounded-xl text-sm"
                  />
                </View>
              </View>

              <TouchableOpacity
                className={`mt-8 py-3.5 rounded-xl items-center ${inviteGuestMutation.isPending ? "bg-pink-300" : "bg-primary"
                  }`}
                disabled={inviteGuestMutation.isPending}
                onPress={handleAddGuest}
              >
                <Text className="text-base font-semibold text-white">
                  {inviteGuestMutation.isPending ? "Adding..." : "Add Guest"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
