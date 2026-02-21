import { VehicleCard } from "@/src/components/transport";
import { TransportRoute, TransportVehicle } from "@/src/types/transport";
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
const mockVehicles: TransportVehicle[] = [
  {
    id: "v1",
    name: "Luxury Car",
    type: "car",
    capacity: 4,
    available: 3,
  },
  {
    id: "v2",
    name: "Mini Van",
    type: "car",
    capacity: 7,
    available: 5,
  },
  {
    id: "v3",
    name: "Party Bus",
    type: "bus",
    capacity: 30,
    available: 20,
  },
  {
    id: "v4",
    name: "Shuttle A",
    type: "shuttle",
    capacity: 14,
    available: 10,
  },
  {
    id: "v5",
    name: "Shuttle B",
    type: "shuttle",
    capacity: 14,
    available: 14,
  },
  {
    id: "v6",
    name: "Stretch Limo",
    type: "limo",
    capacity: 8,
    available: 6,
  },
];

const mockRoutes: TransportRoute[] = [
  {
    id: "r1",
    name: "Airport to Venue",
    pickupLocation: "International Airport",
    dropoffLocation: "Wedding Venue",
    departureTime: "2:00 PM",
    arrivalTime: "3:30 PM",
  },
  {
    id: "r2",
    name: "Hotel to Venue",
    pickupLocation: "Grand Hotel",
    dropoffLocation: "Wedding Venue",
    departureTime: "4:00 PM",
    arrivalTime: "4:30 PM",
  },
  {
    id: "r3",
    name: "Venue to Hotel (Return)",
    pickupLocation: "Wedding Venue",
    dropoffLocation: "Grand Hotel",
    departureTime: "10:00 PM",
    arrivalTime: "10:30 PM",
  },
];

export default function TransportManagement() {
  const params = useLocalSearchParams();
  const eventId = params.eventId as string;

  const [vehicles, setVehicles] = useState<TransportVehicle[]>(mockVehicles);
  const [routes, setRoutes] = useState<TransportRoute[]>(mockRoutes);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  // Guest assignment state
  const [showGuestSelector, setShowGuestSelector] = useState(false);
  const [vehicleForGuestAssignment, setVehicleForGuestAssignment] = useState<
    string | null
  >(null);

  // Get attending guests
  const attendingGuests = mockGuests.filter(
    (g) => g.rsvpStatus === "attending"
  );

  // Get unassigned guests
  const assignedGuestIds = new Set(
    vehicles.flatMap((v) => v.assignedGuests || [])
  );
  const unassignedGuests = attendingGuests.filter(
    (g) => !assignedGuestIds.has(g.id)
  );

  // New vehicle form
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehicleName, setNewVehicleName] = useState("");
  const [newVehicleType, setNewVehicleType] =
    useState<TransportVehicle["type"]>("car");
  const [newVehicleCapacity, setNewVehicleCapacity] = useState("");

  // New route form
  const [showAddRoute, setShowAddRoute] = useState(false);
  const [newRouteName, setNewRouteName] = useState("");
  const [newPickup, setNewPickup] = useState("");
  const [newDropoff, setNewDropoff] = useState("");
  const [newDeparture, setNewDeparture] = useState("");
  const [newArrival, setNewArrival] = useState("");

  const vehicleTypes = ["car", "bus", "shuttle", "limo"];

  const handleSelectVehicle = (vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (vehicle && vehicle.available > 0) {
      setSelectedVehicle(selectedVehicle === vehicleId ? null : vehicleId);
    }
  };

  const handleSelectRoute = (routeId: string) => {
    setSelectedRoute(selectedRoute === routeId ? null : routeId);
  };

  const handleAssignGuest = (vehicleId: string) => {
    setVehicleForGuestAssignment(vehicleId);
    setShowGuestSelector(true);
  };

  const handleAddGuestToVehicle = (guestId: string) => {
    if (!vehicleForGuestAssignment) return;

    const vehicleIndex = vehicles.findIndex(
      (v) => v.id === vehicleForGuestAssignment
    );
    if (vehicleIndex === -1) return;

    const vehicle = vehicles[vehicleIndex];
    const currentAssigned = vehicle.assignedGuests || [];

    if (currentAssigned.length >= vehicle.capacity) {
      Alert.alert("Vehicle Full", "This vehicle has reached its capacity.");
      return;
    }

    const updatedVehicles = [...vehicles];
    updatedVehicles[vehicleIndex] = {
      ...vehicle,
      assignedGuests: [...currentAssigned, guestId],
      available: vehicle.capacity - (currentAssigned.length + 1),
    };

    setVehicles(updatedVehicles);
    setShowGuestSelector(false);
    setVehicleForGuestAssignment(null);
  };

  const handleRemoveGuestFromVehicle = (vehicleId: string, guestId: string) => {
    const vehicleIndex = vehicles.findIndex((v) => v.id === vehicleId);
    if (vehicleIndex === -1) return;

    const vehicle = vehicles[vehicleIndex];
    const currentAssigned = vehicle.assignedGuests || [];

    const updatedVehicles = [...vehicles];
    updatedVehicles[vehicleIndex] = {
      ...vehicle,
      assignedGuests: currentAssigned.filter((id) => id !== guestId),
      available: vehicle.capacity - (currentAssigned.length - 1),
    };

    setVehicles(updatedVehicles);
  };

  // Get guest name by ID
  const getGuestName = (guestId: string) => {
    const guest = mockGuests.find((g) => g.id === guestId);
    return guest?.name || "Unknown";
  };

  const handleAddVehicle = () => {
    if (!newVehicleName.trim() || !newVehicleCapacity) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const newVehicle: TransportVehicle = {
      id: `v${Date.now()}`,
      name: newVehicleName.trim(),
      type: newVehicleType,
      capacity: parseInt(newVehicleCapacity),
      available: parseInt(newVehicleCapacity),
    };

    setVehicles([...vehicles, newVehicle]);
    setNewVehicleName("");
    setNewVehicleCapacity("");
    setShowAddVehicle(false);
    Alert.alert("Success", "Vehicle added successfully!");
  };

  const handleAddRoute = () => {
    if (!newRouteName.trim() || !newPickup || !newDropoff) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const newRoute: TransportRoute = {
      id: `r${Date.now()}`,
      name: newRouteName.trim(),
      pickupLocation: newPickup,
      dropoffLocation: newDropoff,
      departureTime: newDeparture || "TBD",
      arrivalTime: newArrival || "TBD",
    };

    setRoutes([...routes, newRoute]);
    setNewRouteName("");
    setNewPickup("");
    setNewDropoff("");
    setNewDeparture("");
    setNewArrival("");
    setShowAddRoute(false);
    Alert.alert("Success", "Route added successfully!");
  };

  const handleSave = () => {
    console.log("Saving transport:", {
      eventId,
      selectedVehicle,
      selectedRoute,
      vehicles,
      routes,
    });
    Alert.alert("Saved!", "Transportation details saved successfully!");
    router.back();
  };

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
        <Text style={styles.headerTitle}>Transportation</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Routes Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Routes</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddRoute(!showAddRoute)}
            >
              <Ionicons name="add" size={20} color="#ee2b8c" />
            </TouchableOpacity>
          </View>

          {showAddRoute && (
            <View style={styles.formCard}>
              <TextInput
                style={styles.input}
                placeholder="Route Name *"
                placeholderTextColor="#9CA3AF"
                value={newRouteName}
                onChangeText={setNewRouteName}
              />
              <TextInput
                style={styles.input}
                placeholder="Pickup Location *"
                placeholderTextColor="#9CA3AF"
                value={newPickup}
                onChangeText={setNewPickup}
              />
              <TextInput
                style={styles.input}
                placeholder="Drop-off Location *"
                placeholderTextColor="#9CA3AF"
                value={newDropoff}
                onChangeText={setNewDropoff}
              />
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Departure Time"
                  placeholderTextColor="#9CA3AF"
                  value={newDeparture}
                  onChangeText={setNewDeparture}
                />
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Arrival Time"
                  placeholderTextColor="#9CA3AF"
                  value={newArrival}
                  onChangeText={setNewArrival}
                />
              </View>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddRoute}
              >
                <Text style={styles.submitButtonText}>Add Route</Text>
              </TouchableOpacity>
            </View>
          )}

          {routes.map((route) => (
            <TouchableOpacity
              key={route.id}
              style={[
                styles.routeCard,
                selectedRoute === route.id && styles.routeCardSelected,
              ]}
              onPress={() => handleSelectRoute(route.id)}
            >
              <View style={styles.routeIcon}>
                <Ionicons name="navigate" size={20} color="#ee2b8c" />
              </View>
              <View style={styles.routeInfo}>
                <Text style={styles.routeName}>{route.name}</Text>
                <Text style={styles.routeLocation}>
                  {route.pickupLocation} → {route.dropoffLocation}
                </Text>
                <Text style={styles.routeTime}>
                  {route.departureTime} - {route.arrivalTime}
                </Text>
              </View>
              <Ionicons
                name={
                  selectedRoute === route.id
                    ? "checkmark-circle"
                    : "ellipse-outline"
                }
                size={24}
                color={selectedRoute === route.id ? "#10B981" : "#9CA3AF"}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Vehicles Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Vehicles</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddVehicle(!showAddVehicle)}
            >
              <Ionicons name="add" size={20} color="#ee2b8c" />
            </TouchableOpacity>
          </View>

          {showAddVehicle && (
            <View style={styles.formCard}>
              <TextInput
                style={styles.input}
                placeholder="Vehicle Name *"
                placeholderTextColor="#9CA3AF"
                value={newVehicleName}
                onChangeText={setNewVehicleName}
              />
              <View style={styles.typeSelector}>
                {vehicleTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeChip,
                      newVehicleType === type && styles.typeChipSelected,
                    ]}
                    onPress={() => setNewVehicleType(type as any)}
                  >
                    <Text
                      style={[
                        styles.typeChipText,
                        newVehicleType === type && styles.typeChipTextSelected,
                      ]}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={styles.input}
                placeholder="Capacity *"
                placeholderTextColor="#9CA3AF"
                value={newVehicleCapacity}
                onChangeText={setNewVehicleCapacity}
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddVehicle}
              >
                <Text style={styles.submitButtonText}>Add Vehicle</Text>
              </TouchableOpacity>
            </View>
          )}

          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              isSelected={selectedVehicle === vehicle.id}
              onSelect={handleSelectVehicle}
              onAssignGuest={handleAssignGuest}
              onRemoveGuest={handleRemoveGuestFromVehicle}
              getGuestName={getGuestName}
            />
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Selected Route:</Text>
            <Text style={styles.summaryValue}>
              {routes.find((r) => r.id === selectedRoute)?.name || "None"}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Available Vehicles:</Text>
            <Text style={styles.summaryValue}>
              {vehicles.filter((v) => v.available > 0).length}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Seats:</Text>
            <Text style={styles.summaryValue}>
              {vehicles.reduce((sum, v) => sum + v.available, 0)}
            </Text>
          </View>
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
              <Text style={styles.modalTitle}>Assign Guest to Vehicle</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowGuestSelector(false);
                  setVehicleForGuestAssignment(null);
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
                    onPress={() => handleAddGuestToVehicle(guest.id)}
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
  routeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  routeCardSelected: {
    borderColor: "#10B981",
    backgroundColor: "#F0FDF4",
  },
  routeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FCE7F3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "#181114",
  },
  routeLocation: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  routeTime: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 2,
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
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: "#6b7280",
  },
  summaryValue: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "#181114",
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
