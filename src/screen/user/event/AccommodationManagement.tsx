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

// Mock Guests for assignment
interface Guest {
  id: string;
  name: string;
  rsvpStatus: "attending" | "not-attending" | "pending";
}

const mockGuests: Guest[] = [
  { id: "g1", name: "John Smith", rsvpStatus: "attending" },
  { id: "g2", name: "Jane Doe", rsvpStatus: "attending" },
  { id: "g3", name: "Bob Johnson", rsvpStatus: "attending" },
  { id: "g4", name: "Alice Williams", rsvpStatus: "attending" },
  { id: "g5", name: "Charlie Brown", rsvpStatus: "attending" },
  { id: "g6", name: "Diana Ross", rsvpStatus: "pending" },
  { id: "g7", name: "Edward Miller", rsvpStatus: "not-attending" },
  { id: "g8", name: "Fiona Davis", rsvpStatus: "attending" },
];

// Mock data
const mockRooms: Room[] = [
  {
    id: "r1",
    name: "Standard Room",
    type: "single",
    capacity: 1,
    available: 5,
    pricePerNight: 100,
    amenities: ["WiFi", "TV", "AC"],
  },
  {
    id: "r2",
    name: "Deluxe Room",
    type: "double",
    capacity: 2,
    available: 3,
    pricePerNight: 150,
    amenities: ["WiFi", "TV", "AC", "Mini Bar"],
  },
  {
    id: "r3",
    name: "Executive Suite",
    type: "suite",
    capacity: 3,
    available: 2,
    pricePerNight: 250,
    amenities: ["WiFi", "TV", "AC", "Mini Bar", "Balcony", "Room Service"],
  },
  {
    id: "r4",
    name: "Family Villa",
    type: "villa",
    capacity: 6,
    available: 1,
    pricePerNight: 500,
    amenities: ["WiFi", "TV", "AC", "Kitchen", "Private Pool", "Parking"],
  },
  {
    id: "r5",
    name: "Presidential Suite",
    type: "suite",
    capacity: 4,
    available: 0,
    pricePerNight: 800,
    amenities: ["WiFi", "TV", "AC", "Mini Bar", "Jacuzzi", "Butler"],
  },
];

const roomTypes: Room["type"][] = ["single", "double", "suite", "villa"];

export default function AccommodationManagement() {
  const params = useLocalSearchParams();
  const eventId = params.eventId as string;

  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [showGuestSelector, setShowGuestSelector] = useState(false);
  const [roomForGuestAssignment, setRoomForGuestAssignment] = useState<
    string | null
  >(null);

  // Get attending guests
  const attendingGuests = mockGuests.filter(
    (g) => g.rsvpStatus === "attending"
  );

  // Get unassigned guests (not assigned to any room)
  const assignedGuestIds = new Set(
    rooms.flatMap((r) => r.assignedGuests || [])
  );
  const unassignedGuests = attendingGuests.filter(
    (g) => !assignedGuestIds.has(g.id)
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

  const handleAssignGuest = (roomId: string) => {
    setRoomForGuestAssignment(roomId);
    setShowGuestSelector(true);
  };

  const handleAddGuestToRoom = (guestId: string) => {
    if (!roomForGuestAssignment) return;

    const roomIndex = rooms.findIndex((r) => r.id === roomForGuestAssignment);
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
      assignedGuests: [...currentAssigned, guestId],
      available: room.capacity - (currentAssigned.length + 1),
    };

    setRooms(updatedRooms);
    setShowGuestSelector(false);
    setRoomForGuestAssignment(null);
  };

  const handleRemoveGuestFromRoom = (roomId: string, guestId: string) => {
    const roomIndex = rooms.findIndex((r) => r.id === roomId);
    if (roomIndex === -1) return;

    const room = rooms[roomIndex];
    const currentAssigned = room.assignedGuests || [];

    const updatedRooms = [...rooms];
    updatedRooms[roomIndex] = {
      ...room,
      assignedGuests: currentAssigned.filter((id) => id !== guestId),
      available: room.capacity - (currentAssigned.length - 1),
    };

    setRooms(updatedRooms);
  };

  // Get guest name by ID
  const getGuestName = (guestId: string) => {
    const guest = mockGuests.find((g) => g.id === guestId);
    return guest?.name || "Unknown";
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
    console.log("Saving accommodation:", {
      eventId,
      selectedRoom,
      rooms,
    });
    Alert.alert("Saved!", "Accommodation details saved successfully!");
    router.back();
  };

  const totalRooms = rooms.length;
  const availableRooms = rooms.filter((r) => r.available > 0).length;
  const totalGuests = rooms.reduce((sum, r) => sum + r.available, 0);
  const totalValue = rooms.reduce(
    (sum, r) => sum + r.pricePerNight * r.available,
    0
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color="#181114" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Accommodation</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Add Room Form */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Rooms</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddRoom(!showAddRoom)}
            >
              <Ionicons name="add" size={20} color="#ee2b8c" />
            </TouchableOpacity>
          </View>

          {showAddRoom && (
            <View style={styles.formCard}>
              <TextInput
                style={styles.input}
                placeholder="Room Name *"
                placeholderTextColor="#9CA3AF"
                value={newRoomName}
                onChangeText={setNewRoomName}
              />

              <Text style={styles.inputLabel}>Room Type</Text>
              <View style={styles.typeSelector}>
                {roomTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeChip,
                      newRoomType === type && styles.typeChipSelected,
                    ]}
                    onPress={() => setNewRoomType(type)}
                  >
                    <Text
                      style={[
                        styles.typeChipText,
                        newRoomType === type && styles.typeChipTextSelected,
                      ]}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Capacity *"
                  placeholderTextColor="#9CA3AF"
                  value={newRoomCapacity}
                  onChangeText={setNewRoomCapacity}
                  keyboardType="numeric"
                />
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Price/night *"
                  placeholderTextColor="#9CA3AF"
                  value={newRoomPrice}
                  onChangeText={setNewRoomPrice}
                  keyboardType="numeric"
                />
              </View>

              <TextInput
                style={styles.input}
                placeholder="Amenities (comma separated)"
                placeholderTextColor="#9CA3AF"
                value={newRoomAmenities}
                onChangeText={setNewRoomAmenities}
              />

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
              onAssignGuest={handleAssignGuest}
              onRemoveGuest={handleRemoveGuestFromRoom}
              getGuestName={getGuestName}
            />
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Summary</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalRooms}</Text>
              <Text style={styles.statLabel}>Total Rooms</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: "#10B981" }]}>
                {availableRooms}
              </Text>
              <Text style={styles.statLabel}>Available</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: "#ee2b8c" }]}>
                {totalGuests}
              </Text>
              <Text style={styles.statLabel}>Guests</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: "#F59E0B" }]}>
                ${totalValue}
              </Text>
              <Text style={styles.statLabel}>Total Value</Text>
            </View>
          </View>
        </View>

        {/* Booking Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={24} color="#3B82F6" />
            <Text style={styles.infoTitle}>Booking Information</Text>
          </View>
          <Text style={styles.infoText}>
            Selected guests will be automatically assigned rooms based on
            availability. You can manage individual assignments in the guest
            list section.
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Guest Selector Modal */}
      <Modal
        visible={showGuestSelector}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowGuestSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Assign Guest to Room</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowGuestSelector(false);
                  setRoomForGuestAssignment(null);
                }}
              >
                <Ionicons name="close" size={24} color="#181114" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.guestList}>
              {unassignedGuests.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="people" size={48} color="#9CA3AF" />
                  <Text style={styles.emptyText}>No unassigned guests</Text>
                </View>
              ) : (
                unassignedGuests.map((guest) => (
                  <TouchableOpacity
                    key={guest.id}
                    style={styles.guestItem}
                    onPress={() => handleAddGuestToRoom(guest.id)}
                  >
                    <View style={styles.guestAvatar}>
                      <Ionicons name="person" size={20} color="#ee2b8c" />
                    </View>
                    <Text style={styles.guestName}>{guest.name}</Text>
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
  },
  headerTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 18,
    color: "#181114",
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#ee2b8c",
    borderRadius: 8,
  },
  saveButtonText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "white",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
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
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 18,
    color: "#181114",
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FCE7F3",
    alignItems: "center",
    justifyContent: "center",
  },
  formCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: "#181114",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  typeSelector: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  typeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  typeChipSelected: {
    backgroundColor: "#ee2b8c",
    borderColor: "#ee2b8c",
  },
  typeChipText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 12,
    color: "#6b7280",
  },
  typeChipTextSelected: {
    color: "white",
  },
  submitButton: {
    backgroundColor: "#ee2b8c",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  submitButtonText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 14,
    color: "white",
  },
  summaryCard: {
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
  summaryTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: "#181114",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statItem: {
    width: "47%",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  statNumber: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 24,
    color: "#181114",
  },
  statLabel: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  infoTitle: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "#1E40AF",
  },
  infoText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 13,
    color: "#3B82F6",
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 100,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 40,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 18,
    color: "#181114",
  },
  guestList: {
    maxHeight: 400,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 12,
  },
  guestItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    marginBottom: 8,
  },
  guestAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FCE7F3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  guestName: {
    flex: 1,
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "#181114",
  },
});
