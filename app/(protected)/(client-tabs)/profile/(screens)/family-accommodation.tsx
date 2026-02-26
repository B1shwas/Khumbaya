import { RoomCard } from "@/src/components/accommodation";
import { Room } from "@/src/types/accommodation";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock Family Members (in real app, this would come from context/state)
export interface FamilyMember {
  id: string;
  name: string;
  phone: string;
  email: string;
  relation: string;
  foodPreference: string;
  idImage: string;
}

const mockFamilyMembers: FamilyMember[] = [
  {
    id: "fm1",
    name: "John Smith",
    phone: "+1234567890",
    email: "john@example.com",
    relation: "Self",
    foodPreference: "Vegetarian",
    idImage: "",
  },
  {
    id: "fm2",
    name: "Jane Smith",
    phone: "+1234567891",
    email: "jane@example.com",
    relation: "Spouse",
    foodPreference: "Non-Vegetarian",
    idImage: "",
  },
  {
    id: "fm3",
    name: "Tommy Smith",
    phone: "+1234567892",
    email: "tommy@example.com",
    relation: "Child",
    foodPreference: "Vegetarian",
    idImage: "",
  },
  {
    id: "fm4",
    name: "Baby Smith",
    phone: "",
    email: "",
    relation: "Child",
    foodPreference: "Vegetarian",
    idImage: "",
  },
];

// Mock Rooms for family
const mockRooms: Room[] = [
  {
    id: "r1",
    name: "Standard Room",
    type: "single",
    capacity: 1,
    available: 0,
    pricePerNight: 100,
    amenities: ["WiFi", "TV", "AC"],
    assignedGuests: ["fm1"],
  },
  {
    id: "r2",
    name: "Deluxe Room",
    type: "double",
    capacity: 2,
    available: 1,
    pricePerNight: 150,
    amenities: ["WiFi", "TV", "AC", "Mini Bar"],
    assignedGuests: ["fm2", "fm3"],
  },
  {
    id: "r3",
    name: "Family Suite",
    type: "suite",
    capacity: 4,
    available: 4,
    pricePerNight: 250,
    amenities: ["WiFi", "TV", "AC", "Mini Bar", "Balcony"],
    assignedGuests: [],
  },
];

const PRIMARY = "#ec4899";

export default function FamilyAccommodation() {
  const params = useLocalSearchParams();

  const [familyMembers] = useState<FamilyMember[]>(mockFamilyMembers);
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [showMemberSelector, setShowMemberSelector] = useState(false);
  const [roomForMemberAssignment, setRoomForMemberAssignment] = useState<
    string | null
  >(null);

  // Get assigned member IDs
  const assignedMemberIds = new Set(
    rooms.flatMap((r) => r.assignedGuests || [])
  );

  // Get unassigned family members
  const unassignedMembers = familyMembers.filter(
    (m) => !assignedMemberIds.has(m.id)
  );

  // New room form
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomType, setNewRoomType] = useState<Room["type"]>("single");
  const [newRoomCapacity, setNewRoomCapacity] = useState("");
  const [newRoomPrice, setNewRoomPrice] = useState("");
  const [newRoomAmenities, setNewRoomAmenities] = useState("");

  const handleSelectRoom = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    if (room && room.available > 0) {
      setSelectedRoom(selectedRoom === roomId ? null : roomId);
    }
  };

  const handleAssignMember = (roomId: string) => {
    setRoomForMemberAssignment(roomId);
    setShowMemberSelector(true);
  };

  const handleAddMemberToRoom = (memberId: string) => {
    if (!roomForMemberAssignment) return;

    const roomIndex = rooms.findIndex((r) => r.id === roomForMemberAssignment);
    if (roomIndex === -1) return;

    const room = rooms[roomIndex];
    const currentAssigned = room.assignedGuests || [];

    if (currentAssigned.length >= room.capacity) {
      Alert.alert("Room Full", "This room has reached its capacity.");
      return;
    }

    const updatedRooms = [...rooms];
    updatedRooms[roomIndex] = {
      ...room,
      assignedGuests: [...currentAssigned, memberId],
      available: room.capacity - (currentAssigned.length + 1),
    };

    setRooms(updatedRooms);
    setShowMemberSelector(false);
    setRoomForMemberAssignment(null);
  };

  const handleRemoveMemberFromRoom = (roomId: string, memberId: string) => {
    const roomIndex = rooms.findIndex((r) => r.id === roomId);
    if (roomIndex === -1) return;

    const room = rooms[roomIndex];
    const currentAssigned = room.assignedGuests || [];

    const updatedRooms = [...rooms];
    updatedRooms[roomIndex] = {
      ...room,
      assignedGuests: currentAssigned.filter((id) => id !== memberId),
      available: room.capacity - (currentAssigned.length - 1),
    };

    setRooms(updatedRooms);
  };

  // Get member name by ID
  const getMemberName = (memberId: string) => {
    const member = familyMembers.find((m) => m.id === memberId);
    return member?.name || "Unknown";
  };

  const handleAddRoom = () => {
    if (!newRoomName.trim() || !newRoomCapacity || !newRoomPrice) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const amenitiesList = newRoomAmenities
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a);

    const newRoom: Room = {
      id: `r${Date.now()}`,
      name: newRoomName.trim(),
      type: newRoomType,
      capacity: parseInt(newRoomCapacity),
      available: parseInt(newRoomCapacity),
      pricePerNight: parseInt(newRoomPrice),
      amenities: amenitiesList,
    };

    setRooms([...rooms, newRoom]);
    setNewRoomName("");
    setNewRoomCapacity("");
    setNewRoomPrice("");
    setNewRoomAmenities("");
    setShowAddRoom(false);
    Alert.alert("Success", "Room added successfully!");
  };

  const handleSave = () => {
    Alert.alert("Saved!", "Family accommodation details saved successfully!");
    router.back();
  };

  const totalRooms = rooms.length;
  const availableRooms = rooms.filter((r) => r.available > 0).length;
  const totalMembers = familyMembers.length;
  const assignedMembers = familyMembers.length - unassignedMembers.length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Family Accommodation</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Family Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Ionicons name="people" size={24} color="white" />
          </View>
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryTitle}>Family Members</Text>
            <Text style={styles.summarySubtitle}>
              {assignedMembers} of {totalMembers} allocated to rooms
            </Text>
          </View>
          <View style={styles.summaryBadge}>
            <Text style={styles.summaryBadgeText}>{totalMembers}</Text>
          </View>
        </View>

        {/* Add Room Form */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Rooms</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddRoom(!showAddRoom)}
            >
              <Ionicons name="add" size={24} color={PRIMARY} />
            </TouchableOpacity>
          </View>

          {showAddRoom && (
            <View style={styles.formCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Room Name *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter room name"
                  placeholderTextColor="#9CA3AF"
                  value={newRoomName}
                  onChangeText={setNewRoomName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Room Type</Text>
                <View style={styles.chipContainer}>
                  {["single", "double", "suite", "villa"].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.chip,
                        newRoomType === type && styles.chipSelected,
                      ]}
                      onPress={() => setNewRoomType(type as Room["type"])}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          newRoomType === type && styles.chipTextSelected,
                        ]}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Capacity *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="1"
                    placeholderTextColor="#9CA3AF"
                    value={newRoomCapacity}
                    onChangeText={setNewRoomCapacity}
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Price/night *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="$0"
                    placeholderTextColor="#9CA3AF"
                    value={newRoomPrice}
                    onChangeText={setNewRoomPrice}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Amenities</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="WiFi, TV, AC (comma separated)"
                  placeholderTextColor="#9CA3AF"
                  value={newRoomAmenities}
                  onChangeText={setNewRoomAmenities}
                />
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddRoom}
              >
                <Text style={styles.submitButtonText}>Add Room</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Room List */}
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              isSelected={selectedRoom === room.id}
              onSelect={handleSelectRoom}
              onAssignMember={handleAssignMember}
              onRemoveMember={handleRemoveMemberFromRoom}
              getMemberName={getMemberName}
            />
          ))}
        </View>

        {/* Summary Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Accommodation Summary</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalRooms}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: "#10B981" }]}>
                {availableRooms}
              </Text>
              <Text style={styles.statLabel}>Available</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: PRIMARY }]}>
                {assignedMembers}
              </Text>
              <Text style={styles.statLabel}>Allocated</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: "#F59E0B" }]}>
                {unassignedMembers.length}
              </Text>
              <Text style={styles.statLabel}>Unassigned</Text>
            </View>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={20} color="#3B82F6" />
            <Text style={styles.infoTitle}>Room Allocation Info</Text>
          </View>
          <Text style={styles.infoText}>
            Each room allocation is for a family. The primary member (you) gets
            immediate room allocation. Additional rooms will be assigned based
            on availability. Maximum 4 pax per room (3 adults + 1 kid).
          </Text>
        </View>
      </ScrollView>

      {/* Member Selector Modal */}
      <Modal
        visible={showMemberSelector}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMemberSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Assign Family Member</Text>
              <TouchableOpacity onPress={() => setShowMemberSelector(false)}>
                <Ionicons name="close" size={24} color="#181114" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.memberList}>
              {unassignedMembers.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="people" size={48} color="#9CA3AF" />
                  <Text style={styles.emptyText}>No unassigned members</Text>
                  <Text style={styles.emptySubtext}>
                    All family members have been allocated to rooms
                  </Text>
                </View>
              ) : (
                unassignedMembers.map((member) => (
                  <TouchableOpacity
                    key={member.id}
                    style={styles.memberItem}
                    onPress={() => handleAddMemberToRoom(member.id)}
                  >
                    <View style={styles.memberAvatar}>
                      <Ionicons name="person" size={20} color={PRIMARY} />
                    </View>
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName}>{member.name}</Text>
                      <Text style={styles.memberRelation}>
                        {member.relation}
                      </Text>
                    </View>
                    <Ionicons name="add-circle" size={24} color="#10B981" />
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

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
    backgroundColor: "#f3f4f6",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: PRIMARY,
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryInfo: {
    flex: 1,
    marginLeft: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
  },
  summarySubtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
  summaryBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryBadgeText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
  section: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: PRIMARY + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  formCard: {
    backgroundColor: "#f8f6f7",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1f2937",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  chipContainer: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
  },
  chipSelected: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
  },
  chipTextSelected: {
    color: "white",
  },
  submitButton: {
    backgroundColor: PRIMARY,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "white",
  },
  statsCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statItem: {
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#f8f6f7",
    borderRadius: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1d4ed8",
  },
  infoText: {
    fontSize: 13,
    color: "#3b82f6",
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
  },
  memberList: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 13,
    color: "#9ca3af",
    marginTop: 4,
    textAlign: "center",
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: PRIMARY + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  memberInfo: {
    flex: 1,
    marginLeft: 12,
  },
  memberName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1f2937",
  },
  memberRelation: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
});
