import { useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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
    <View style={{ flex: 1, padding: 24, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 8 }}>Guests</Text>
      <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 20 }}>
        Manage your event invitations.
      </Text>

      <TouchableOpacity
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
            <Text style={{ textAlign: "center", color: "#6B7280", marginTop: 20 }}>
              No guests invited yet.
            </Text>
          }
        />
      )}

      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              paddingBottom: 32,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 20 }}>
              Add New Guest
            </Text>

            <View style={{ gap: 16 }}>
              <View>
                <Text style={{ fontSize: 14, fontWeight: "500", color: "#374151", marginBottom: 6 }}>
                  Name *
                </Text>
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter guest name"
                  style={{
                    backgroundColor: "#F3F4F6",
                    padding: 14,
                    borderRadius: 12,
                    fontSize: 14,
                  }}
                />
              </View>

              <View>
                <Text style={{ fontSize: 14, fontWeight: "500", color: "#374151", marginBottom: 6 }}>
                  Email *
                </Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{
                    backgroundColor: "#F3F4F6",
                    padding: 14,
                    borderRadius: 12,
                    fontSize: 14,
                  }}
                />
              </View>

              <View>
                <Text style={{ fontSize: 14, fontWeight: "500", color: "#374151", marginBottom: 6 }}>
                  Phone *
                </Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                  style={{
                    backgroundColor: "#F3F4F6",
                    padding: 14,
                    borderRadius: 12,
                    fontSize: 14,
                  }}
                />
              </View>

              <View>
                <Text style={{ fontSize: 14, fontWeight: "500", color: "#374151", marginBottom: 6 }}>
                  Relation
                </Text>
                <TextInput
                  value={relation}
                  onChangeText={setRelation}
                  placeholder="e.g., Family, Friend"
                  style={{
                    backgroundColor: "#F3F4F6",
                    padding: 14,
                    borderRadius: 12,
                    fontSize: 14,
                  }}
                />
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 12, marginTop: 24 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 12,
                  backgroundColor: "#F3F4F6",
                  alignItems: "center",
                }}
                onPress={closeModal}
              >
                <Text style={{ fontSize: 16, fontWeight: "600", color: "#4B5563" }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 12,
                  backgroundColor: inviteGuestMutation.isPending ? "#F9A8D4" : "#EE2B8C",
                  alignItems: "center",
                }}
                disabled={inviteGuestMutation.isPending}
                onPress={handleAddGuest}
              >
                <Text style={{ fontSize: 16, fontWeight: "600", color: "#fff" }}>
                  {inviteGuestMutation.isPending ? "Adding..." : "Add Guest"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
