import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GroupChip, SeatList, TableCard } from "../../../components/table";
import { useTableManager } from "../../../hooks/useTableManager";
import { TABLE_TEMPLATES } from "../../../utils/tableHelpers";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function TableManagement() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const router = useRouter();

  const handleGoBack = () => {
    // Try to go back, but if there's no history, navigate to event detail
    if (router.canGoBack()) {
      router.back();
    } else {
      // Fallback: navigate to the event detail page
      router.push(`/(protected)/(client-stack)/events/${eventId}/(organizer)/`);
    }
  };

  const {
    tables,
    guests,
    groups,
    unassignedGroups,
    selectedTable,
    selectedTableId,
    showAddTable,
    showGroupSelector,
    isSaving,
    seatedGuests,
    totalGuests,
    guestMap,
    setSelectedTableId,
    setShowAddTable,
    setShowGroupSelector,
    handleSave,
    handleAddTable,
    handleAssignGroupToTable,
    handleRemoveGroupFromTable,
    handleRemoveGuestFromSeat,
    handleAutoAssign,
    handleClearAllAssignments,
    handleUpdateTablePosition,
  } = useTableManager({ eventId: String(eventId) });

  // Handle seat press in drawer
  const handleSeatPress = (seatId: string, guest: any) => {
    if (guest) {
      // Remove guest from seat
      handleRemoveGuestFromSeat(guest.id);
    }
  };

  // Handle group selection
  const handleGroupPress = (group: any) => {
    if (!group.assigned) {
      handleAssignGroupToTable(group);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>Table Plan</Text>
        <TouchableOpacity
          onPress={handleSave}
          style={styles.saveButton}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Ionicons name="people" size={20} color="#8B5CF6" />
          <Text style={styles.statText}>
            {seatedGuests}/{totalGuests} seated
          </Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="grid" size={20} color="#10B981" />
          <Text style={styles.statText}>{tables.length} tables</Text>
        </View>
        <TouchableOpacity
          onPress={handleAutoAssign}
          style={styles.autoAssignButton}
        >
          <Ionicons name="flash" size={16} color="#FFFFFF" />
          <Text style={styles.autoAssignText}>Auto</Text>
        </TouchableOpacity>
      </View>

      {/* Table Canvas */}
      <View style={styles.canvas}>
        <ScrollView
          style={styles.canvasScroll}
          contentContainerStyle={styles.canvasContent}
          showsVerticalScrollIndicator={false}
        >
          {tables.map((table) => (
            <View
              key={table.id}
              style={{
                position: "absolute",
                left: table.x,
                top: table.y,
              }}
            >
              <TableCard
                table={table}
                guests={guests}
                isSelected={selectedTableId === table.id}
                onSelect={setSelectedTableId}
                onPositionChange={handleUpdateTablePosition}
              />
            </View>
          ))}

          {/* Empty state */}
          {tables.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="grid-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No Tables Yet</Text>
              <Text style={styles.emptySubtitle}>
                Add tables to start assigning guests
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Floating Controls */}
        <View style={styles.floatingControls}>
          <TouchableOpacity
            style={[styles.fab, styles.fabSecondary]}
            onPress={handleClearAllAssignments}
          >
            <Ionicons name="refresh" size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.fab, styles.fabPrimary]}
            onPress={() => setShowAddTable(true)}
          >
            <Ionicons name="add" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Drawer - Shows when table is selected */}
      {selectedTable && (
        <View style={styles.drawer}>
          <View style={styles.drawerHandle} />
          <View style={styles.drawerContent}>
            <View style={styles.drawerHeader}>
              <View>
                <Text style={styles.drawerTitle}>
                  Table {selectedTable.name}
                </Text>
                <Text style={styles.drawerSubtitle}>
                  {selectedTable.seats.filter((s) => !s.guestId).length} seats
                  available
                </Text>
              </View>
              <TouchableOpacity
                style={styles.assignButton}
                onPress={() => setShowGroupSelector(true)}
              >
                <Ionicons name="person-add" size={18} color="#FFFFFF" />
                <Text style={styles.assignButtonText}>Assign</Text>
              </TouchableOpacity>
            </View>

            {/* Seat Grid */}
            <SeatList
              seats={selectedTable.seats}
              guestMap={guestMap}
              onSeatPress={handleSeatPress}
            />
          </View>
        </View>
      )}

      {/* Add Table Modal */}
      <Modal
        visible={showAddTable}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAddTable(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Table</Text>
              <TouchableOpacity onPress={() => setShowAddTable(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {TABLE_TEMPLATES.map((template, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.templateCard}
                  onPress={() => handleAddTable(template)}
                >
                  <View
                    style={[
                      styles.templatePreview,
                      template.type === "circle"
                        ? styles.templateCircle
                        : styles.templateRectangle,
                    ]}
                  >
                    <Text style={styles.templateCapacity}>
                      {template.capacity}
                    </Text>
                  </View>
                  <View style={styles.templateInfo}>
                    <Text style={styles.templateName}>{template.name}</Text>
                    <Text style={styles.templateType}>
                      {template.type === "circle" ? "Round" : "Rectangle"} •{" "}
                      {template.capacity} seats
                    </Text>
                  </View>
                  <Ionicons name="add-circle" size={24} color="#EE2B8C" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Group Selector Modal */}
      <Modal
        visible={showGroupSelector}
        animationType="slide"
        transparent
        onRequestClose={() => setShowGroupSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Assign Group</Text>
              <TouchableOpacity onPress={() => setShowGroupSelector(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {unassignedGroups.length === 0 ? (
                <View style={styles.noGroups}>
                  <Ionicons name="checkmark-circle" size={48} color="#10B981" />
                  <Text style={styles.noGroupsText}>
                    All guests are assigned!
                  </Text>
                </View>
              ) : (
                unassignedGroups.map((group) => (
                  <GroupChip
                    key={group.id}
                    group={group}
                    onPress={handleGroupPress}
                  />
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
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#EE2B8C",
    borderRadius: 8,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  statsBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    gap: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  autoAssignButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#8B5CF6",
    borderRadius: 16,
    marginLeft: "auto",
  },
  autoAssignText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  canvas: {
    flex: 1,
    position: "relative",
  },
  canvasScroll: {
    flex: 1,
  },
  canvasContent: {
    padding: 16,
    minHeight: 400,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 4,
  },
  floatingControls: {
    position: "absolute",
    bottom: 16,
    right: 16,
    flexDirection: "row",
    gap: 12,
  },
  fab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  fabPrimary: {
    backgroundColor: "#EE2B8C",
  },
  fabSecondary: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  drawer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 24,
    paddingHorizontal: 16,
    maxHeight: "40%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  drawerHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#D1D5DB",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  drawerContent: {},
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  drawerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  assignButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#EE2B8C",
    borderRadius: 8,
  },
  assignButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  modalBody: {
    padding: 16,
  },
  templateCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    marginBottom: 12,
  },
  templatePreview: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  templateRectangle: {
    backgroundColor: "#EDE9FE",
    borderRadius: 8,
  },
  templateCircle: {
    backgroundColor: "#FCE7F3",
    borderRadius: 24,
  },
  templateCapacity: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  templateType: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  noGroups: {
    alignItems: "center",
    paddingVertical: 32,
  },
  noGroupsText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#10B981",
    marginTop: 12,
  },
});
