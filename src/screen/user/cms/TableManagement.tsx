import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTableManagement } from "./hooks/useTableManagement";

// Components
import { FloorPlan } from "./components/TableManagement/FloorPlan";
import { GroupChip } from "./components/TableManagement/GroupChip";
import { TableDetailDrawer } from "./components/TableManagement/TableDetailDrawer";

// Modals
import {
  AddTableModal,
  GroupSelectorModal,
} from "./components/TableManagement/modals";

export default function TableManagement() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const eventId = (params.eventId as string) || "default";

  const {
    guests,
    tables,
    selectedTableId,
    showAddTable,
    showGroupSelector,
    unassignedGroups,
    selectedTable,
    totalGuests,
    seatedGuests,
    isSaving,
    handleAutoAssign,
    handleAddTable,
    handleRemoveGuestFromSeat,
    handleRemoveGroupFromTable,
    handleAssignGroupToTable,
    setShowAddTable,
    setShowGroupSelector,
    setSelectedTableId,
  } = useTableManagement({ eventId });

  const [selectedTableAnim] = useState(new Animated.Value(0));

  // Update animation when table is selected
  useEffect(() => {
    Animated.timing(selectedTableAnim, {
      toValue: selectedTable ? 0 : 300,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [selectedTable]);

  // Pan handlers for tables
  const createTablePanHandlers = (tableId: string) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setSelectedTableId(tableId);
      },
      onPanResponderMove: (_: any, gesture: any) => {
        // Update table position would go here
      },
      onPanResponderRelease: () => {},
    }).panHandlers;
  };

  const handleBack = () => {
    router.back();
  };

  const handleSave = () => {
    Alert.alert("Success", "Table assignments saved successfully!");
  };

  const handleEdit = () => {
    // Edit table logic
  };

  const handleSelectSeatForGroup = (seatId: string) => {
    if (!selectedTable) return;

    const seat = selectedTable.seats.find((s) => s.id === seatId);
    if (!seat?.guestId) {
      setShowGroupSelector(true);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Seating Plan</Text>
        <TouchableOpacity
          onPress={handleSave}
          style={styles.headerButton}
          disabled={isSaving}
        >
          <Text
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          >
            {isSaving ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Unassigned Groups Section */}
        <View style={styles.unassignedSection}>
          <View style={styles.unassignedHeader}>
            <View style={styles.pulseDot} />
            <Text style={styles.unassignedTitle}>
              Unassigned ({unassignedGroups.length} groups)
            </Text>
            <TouchableOpacity
              onPress={handleAutoAssign}
              style={styles.autoAssignButton}
            >
              <Ionicons name="sparkles" size={14} color="#ee2b8c" />
              <Text style={styles.autoAssignText}>Auto-Assign</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.guestChipsContainer}
          >
            {unassignedGroups.map((group) => (
              <GroupChip
                key={group.id}
                group={group}
                isSelected={false}
                onSelect={() => {
                  if (selectedTable) {
                    handleAssignGroupToTable(group);
                  }
                }}
              />
            ))}
          </ScrollView>
        </View>

        {/* Floor Plan Canvas */}
        <FloorPlan
          tables={tables}
          guests={guests}
          selectedTableId={selectedTableId}
          onSelectTable={setSelectedTableId}
          onCreatePanHandlers={createTablePanHandlers}
          seatedGuests={seatedGuests}
          totalGuests={totalGuests}
          onAddTable={() => setShowAddTable(true)}
        />
      </View>

      {/* Bottom Drawer */}
      <TableDetailDrawer
        selectedTable={selectedTable}
        guests={guests}
        groups={[]}
        animationValue={selectedTableAnim}
        onRemoveGuest={handleRemoveGuestFromSeat}
        onRemoveGroup={handleRemoveGroupFromTable}
        onSelectSeat={handleSelectSeatForGroup}
        onEdit={handleEdit}
      />

      {/* Group Selector Modal */}
      <GroupSelectorModal
        visible={showGroupSelector}
        groups={unassignedGroups}
        selectedTableCapacity={selectedTable?.capacity || 0}
        onSelectGroup={handleAssignGroupToTable}
        onClose={() => setShowGroupSelector(false)}
      />

      {/* Add Table Modal */}
      <AddTableModal
        visible={showAddTable}
        onSelectTemplate={handleAddTable}
        onClose={() => setShowAddTable(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f6f6",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#ee2b8c10",
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  saveButton: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ee2b8c",
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  mainContent: {
    flex: 1,
  },
  unassignedSection: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 40,
  },
  unassignedHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
    marginRight: 8,
  },
  unassignedTitle: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  autoAssignButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  autoAssignText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ee2b8c",
  },
  guestChipsContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
