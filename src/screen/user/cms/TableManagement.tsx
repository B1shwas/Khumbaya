import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

// ============================================
// Types
// ============================================

interface Guest {
  id: string;
  name: string;
  familySize: number;
  relation: string;
  tableId: string | null;
  assigned: boolean;
}

interface Table {
  id: string;
  name: string;
  capacity: number;
  assignedGuests: number;
  guests: Guest[];
}

// ============================================
// Mock Data
// ============================================

const MOCK_GUESTS: Guest[] = [
  {
    id: "1",
    name: "Priya Sharma",
    familySize: 4,
    relation: "Family",
    tableId: null,
    assigned: false,
  },
  {
    id: "2",
    name: "Rahul Kapoor",
    familySize: 6,
    relation: "Family",
    tableId: null,
    assigned: false,
  },
  {
    id: "3",
    name: "Sarah Jenkins",
    familySize: 2,
    relation: "Friend",
    tableId: null,
    assigned: false,
  },
  {
    id: "4",
    name: "Mike Ross",
    familySize: 3,
    relation: "Colleague",
    tableId: null,
    assigned: false,
  },
  {
    id: "5",
    name: "Amara Singh",
    familySize: 5,
    relation: "Family",
    tableId: null,
    assigned: false,
  },
  {
    id: "6",
    name: "John Doe",
    familySize: 2,
    relation: "Friend",
    tableId: null,
    assigned: false,
  },
  {
    id: "7",
    name: "Emily Chen",
    familySize: 4,
    relation: "Friend",
    tableId: null,
    assigned: false,
  },
  {
    id: "8",
    name: "David Kumar",
    familySize: 6,
    relation: "Family",
    tableId: null,
    assigned: false,
  },
  {
    id: "9",
    name: "Lisa Wang",
    familySize: 2,
    relation: "Colleague",
    tableId: null,
    assigned: false,
  },
  {
    id: "10",
    name: "Tom Brown",
    familySize: 3,
    relation: "Friend",
    tableId: null,
    assigned: false,
  },
];

export default function TableManagement() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const eventId = params.eventId as string;

  const [guests, setGuests] = useState<Guest[]>(MOCK_GUESTS);
  const [tables, setTables] = useState<Table[]>([]);
  const [tableName, setTableName] = useState("");
  const [tableCapacity, setTableCapacity] = useState("");
  const [selectedTab, setSelectedTab] = useState<"unassigned" | "tables">(
    "unassigned",
  );

  // Auto-assign logic based on family size
  const handleAutoAssign = () => {
    Alert.alert(
      "Auto Assign Tables",
      "This will automatically assign guests to tables based on their family size. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Assign", onPress: () => performAutoAssign() },
      ],
    );
  };

  const performAutoAssign = () => {
    const unassignedGuests = guests.filter((g) => !g.assigned);
    const newTables: Table[] = [...tables];
    let currentTableIndex = newTables.length;

    // Sort guests by family size (largest first) for better packing
    const sortedGuests = unassignedGuests.sort(
      (a, b) => b.familySize - a.familySize,
    );

    for (const guest of sortedGuests) {
      // Try to find existing table with space
      let assigned = false;

      for (let i = 0; i < newTables.length; i++) {
        const table = newTables[i];
        const availableSpace = table.capacity - table.assignedGuests;

        if (availableSpace >= guest.familySize) {
          // Assign to existing table
          table.guests.push(guest);
          table.assignedGuests += guest.familySize;

          setGuests((prev) =>
            prev.map((g) =>
              g.id === guest.id
                ? { ...g, tableId: table.id, assigned: true }
                : g,
            ),
          );
          assigned = true;
          break;
        }
      }

      // Create new table if not assigned
      if (!assigned) {
        const newTableId = `table-${Date.now()}-${currentTableIndex}`;
        const newTable: Table = {
          id: newTableId,
          name: `Table ${currentTableIndex + 1}`,
          capacity: Math.max(guest.familySize * 2, 8), // At least 8 seats or double family size
          assignedGuests: guest.familySize,
          guests: [guest],
        };

        newTables.push(newTable);
        currentTableIndex++;

        setGuests((prev) =>
          prev.map((g) =>
            g.id === guest.id
              ? { ...g, tableId: newTableId, assigned: true }
              : g,
          ),
        );
      }
    }

    setTables(newTables);
  };

  const handleAddTable = () => {
    if (!tableName.trim()) {
      Alert.alert("Error", "Please enter table name");
      return;
    }

    const capacity = parseInt(tableCapacity) || 8;

    const newTable: Table = {
      id: `table-${Date.now()}`,
      name: tableName.trim(),
      capacity,
      assignedGuests: 0,
      guests: [],
    };

    setTables((prev) => [...prev, newTable]);
    setTableName("");
    setTableCapacity("");
  };

  const handleDeleteTable = (tableId: string) => {
    // Unassign guests from deleted table
    setGuests((prev) =>
      prev.map((g) =>
        g.tableId === tableId ? { ...g, tableId: null, assigned: false } : g,
      ),
    );

    // Remove table
    setTables((prev) => prev.filter((t) => t.id !== tableId));
  };

  const handleRemoveGuestFromTable = (guestId: string, tableId: string) => {
    const table = tables.find((t) => t.id === tableId);
    if (!table) return;

    const guest = table.guests.find((g) => g.id === guestId);
    if (!guest) return;

    // Update table
    setTables((prev) =>
      prev.map((t) => {
        if (t.id === tableId) {
          return {
            ...t,
            assignedGuests: t.assignedGuests - guest.familySize,
            guests: t.guests.filter((g) => g.id !== guestId),
          };
        }
        return t;
      }),
    );

    // Update guest
    setGuests((prev) =>
      prev.map((g) =>
        g.id === guestId ? { ...g, tableId: null, assigned: false } : g,
      ),
    );
  };

  const unassignedGuests = guests.filter((g) => !g.assigned);
  const totalGuests = guests.reduce((acc, g) => acc + g.familySize, 0);
  const assignedGuests = guests
    .filter((g) => g.assigned)
    .reduce((acc, g) => acc + g.familySize, 0);

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#181114" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Tables</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={styles.headerButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Stats */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{guests.length}</Text>
          <Text style={styles.summaryLabel}>Families</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{totalGuests}</Text>
          <Text style={styles.summaryLabel}>Total Guests</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{assignedGuests}</Text>
          <Text style={styles.summaryLabel}>Seated</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{tables.length}</Text>
          <Text style={styles.summaryLabel}>Tables</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "unassigned" && styles.tabActive]}
          onPress={() => setSelectedTab("unassigned")}
        >
          <Ionicons
            name="people-outline"
            size={20}
            color={selectedTab === "unassigned" ? "#ee2b8c" : "#6B7280"}
          />
          <Text
            style={[
              styles.tabText,
              selectedTab === "unassigned" && styles.tabTextActive,
            ]}
          >
            Unassigned ({unassignedGuests.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "tables" && styles.tabActive]}
          onPress={() => setSelectedTab("tables")}
        >
          <Ionicons
            name="grid-outline"
            size={20}
            color={selectedTab === "tables" ? "#ee2b8c" : "#6B7280"}
          />
          <Text
            style={[
              styles.tabText,
              selectedTab === "tables" && styles.tabTextActive,
            ]}
          >
            Tables ({tables.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {selectedTab === "unassigned" ? (
          /* Unassigned Guests Section */
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Unassigned Guests</Text>
              <TouchableOpacity
                style={styles.autoAssignButton}
                onPress={handleAutoAssign}
              >
                <Ionicons name="flash-outline" size={16} color="white" />
                <Text style={styles.autoAssignButtonText}>Auto Assign</Text>
              </TouchableOpacity>
            </View>

            {/* Add Table Form */}
            <View style={styles.addTableForm}>
              <Text style={styles.formLabel}>Create New Table</Text>
              <View style={styles.formRow}>
                <TextInput
                  style={[styles.formInput, { flex: 1 }]}
                  placeholder="Table name (e.g., Table 1)"
                  placeholderTextColor="#9CA3AF"
                  value={tableName}
                  onChangeText={setTableName}
                />
                <TextInput
                  style={[styles.formInput, { width: 80 }]}
                  placeholder="Seats"
                  placeholderTextColor="#9CA3AF"
                  value={tableCapacity}
                  onChangeText={setTableCapacity}
                  keyboardType="numeric"
                />
              </View>
              <TouchableOpacity
                style={styles.addTableButton}
                onPress={handleAddTable}
              >
                <Ionicons name="add" size={20} color="white" />
                <Text style={styles.addTableButtonText}>Add Table</Text>
              </TouchableOpacity>
            </View>

            {/* Guest List */}
            {unassignedGuests.map((guest) => (
              <View key={guest.id} style={styles.guestCard}>
                <View style={styles.guestAvatar}>
                  <Text style={styles.guestAvatarText}>
                    {guest.name.charAt(0)}
                  </Text>
                </View>
                <View style={styles.guestInfo}>
                  <Text style={styles.guestName}>{guest.name}</Text>
                  <Text style={styles.guestRelation}>{guest.relation}</Text>
                </View>
                <View style={styles.guestFamilyBadge}>
                  <Text style={styles.guestFamilyText}>
                    {guest.familySize} seats
                  </Text>
                </View>
              </View>
            ))}

            {unassignedGuests.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={48}
                  color="#10B981"
                />
                <Text style={styles.emptyTitle}>All guests assigned!</Text>
                <Text style={styles.emptySubtitle}>
                  Go to Tables tab to view assigned tables
                </Text>
              </View>
            )}
          </View>
        ) : (
          /* Tables Section */
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tables</Text>

            {tables.map((table) => {
              const occupancyRate = Math.round(
                (table.assignedGuests / table.capacity) * 100,
              );

              return (
                <View key={table.id} style={styles.tableCard}>
                  <View style={styles.tableHeader}>
                    <View style={styles.tableInfo}>
                      <Text style={styles.tableName}>{table.name}</Text>
                      <Text style={styles.tableCapacity}>
                        {table.assignedGuests}/{table.capacity} seats (
                        {occupancyRate}%)
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteTableButton}
                      onPress={() => handleDeleteTable(table.id)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color="#EF4444"
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Occupancy Bar */}
                  <View style={styles.occupancyBar}>
                    <View
                      style={[
                        styles.occupancyFill,
                        { width: `${occupancyRate}%` },
                        occupancyRate > 90 && styles.occupancyHigh,
                        occupancyRate > 70 &&
                          occupancyRate <= 90 &&
                          styles.occupancyMedium,
                      ]}
                    />
                  </View>

                  {/* Assigned Guests */}
                  <View style={styles.tableGuests}>
                    {table.guests.map((guest) => (
                      <View key={guest.id} style={styles.tableGuestItem}>
                        <View style={styles.tableGuestAvatar}>
                          <Text style={styles.tableGuestAvatarText}>
                            {guest.name.charAt(0)}
                          </Text>
                        </View>
                        <View style={styles.tableGuestInfo}>
                          <Text style={styles.tableGuestName}>
                            {guest.name}
                          </Text>
                          <Text style={styles.tableGuestFamily}>
                            {guest.familySize} seats
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.removeGuestButton}
                          onPress={() =>
                            handleRemoveGuestFromTable(guest.id, table.id)
                          }
                        >
                          <Ionicons
                            name="close-circle"
                            size={16}
                            color="#EF4444"
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>

                  {table.guests.length === 0 && (
                    <Text style={styles.emptyTableText}>
                      No guests assigned yet
                    </Text>
                  )}
                </View>
              );
            })}

            {tables.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="grid-outline" size={48} color="#D1D5DB" />
                <Text style={styles.emptyTitle}>No tables created</Text>
                <Text style={styles.emptySubtitle}>
                  Create tables in the Unassigned tab or use Auto Assign
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
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
    paddingTop: 60,
    paddingBottom: 8,
    backgroundColor: "white",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 18,
    color: "#181114",
  },
  headerButton: {
    backgroundColor: "#ee2b8c",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerButtonText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 14,
    color: "white",
  },
  summaryContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  summaryNumber: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 20,
    color: "#181114",
  },
  summaryLabel: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  tabActive: {
    backgroundColor: "#FDF2F8",
    borderColor: "#ee2b8c",
  },
  tabText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 13,
    color: "#6B7280",
  },
  tabTextActive: {
    color: "#ee2b8c",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 18,
    color: "#181114",
  },
  addTableForm: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  formLabel: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "#374151",
    marginBottom: 10,
  },
  formRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  formInput: {
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: "#181114",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  addTableButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10B981",
    borderRadius: 10,
    paddingVertical: 12,
    gap: 6,
  },
  addTableButtonText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 14,
    color: "white",
  },
  autoAssignButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F59E0B",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  autoAssignButtonText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 13,
    color: "white",
  },
  guestCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  guestAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F472B6",
    alignItems: "center",
    justifyContent: "center",
  },
  guestAvatarText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 18,
    color: "white",
  },
  guestInfo: {
    flex: 1,
    marginLeft: 12,
  },
  guestName: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 15,
    color: "#181114",
  },
  guestRelation: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 13,
    color: "#6B7280",
  },
  guestFamilyBadge: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  guestFamilyText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 12,
    color: "#374151",
  },
  tableCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  tableInfo: {
    flex: 1,
  },
  tableName: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: "#181114",
  },
  tableCapacity: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  deleteTableButton: {
    padding: 4,
  },
  occupancyBar: {
    height: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 12,
  },
  occupancyFill: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 3,
  },
  occupancyMedium: {
    backgroundColor: "#F59E0B",
  },
  occupancyHigh: {
    backgroundColor: "#EF4444",
  },
  tableGuests: {
    gap: 8,
  },
  tableGuestItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 10,
  },
  tableGuestAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F472B6",
    alignItems: "center",
    justifyContent: "center",
  },
  tableGuestAvatarText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 14,
    color: "white",
  },
  tableGuestInfo: {
    flex: 1,
    marginLeft: 10,
  },
  tableGuestName: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 13,
    color: "#181114",
  },
  tableGuestFamily: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 11,
    color: "#6B7280",
  },
  removeGuestButton: {
    padding: 4,
  },
  emptyTableText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 8,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: "#374151",
    marginTop: 12,
  },
  emptySubtitle: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },
  bottomSpacing: {
    height: 100,
  },
});
