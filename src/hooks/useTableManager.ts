import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import {
  Guest,
  GuestGroup,
  Table,
  TableTemplate,
  assignGuestsToSeats,
  buildGroups,
  createGuestMap,
  removeGuestsFromTable,
  unassignTableGuests,
  updateGuestAssignments,
} from "../utils/tableHelpers";
import {
  loadTableAssignments,
  saveTableAssignments,
} from "../utils/tableStorage";

// ============================================
// Mock Data
// ============================================

const MOCK_GUESTS: Guest[] = [
  // Group 1: Vance Family
  {
    id: "1",
    name: "Eleanor Vance",
    familySize: 4,
    relation: "Family",
    groupId: "group-1",
    tableId: null,
    seatNumber: null,
    assigned: false,
  },
  {
    id: "2",
    name: "Henry Vance",
    familySize: 4,
    relation: "Family",
    groupId: "group-1",
    tableId: null,
    seatNumber: null,
    assigned: false,
  },
  {
    id: "3",
    name: "Mrs. Vance",
    familySize: 4,
    relation: "Family",
    groupId: "group-1",
    tableId: null,
    seatNumber: null,
    assigned: false,
  },
  {
    id: "4",
    name: "Alice Vance",
    familySize: 4,
    relation: "Family",
    groupId: "group-1",
    tableId: null,
    seatNumber: null,
    assigned: false,
  },
  // Group 2: Davis Family
  {
    id: "5",
    name: "John Davis",
    familySize: 3,
    relation: "Family",
    groupId: "group-2",
    tableId: null,
    seatNumber: null,
    assigned: false,
  },
  {
    id: "6",
    name: "Sarah Davis",
    familySize: 3,
    relation: "Family",
    groupId: "group-2",
    tableId: null,
    seatNumber: null,
    assigned: false,
  },
  {
    id: "7",
    name: "Emily Davis",
    familySize: 3,
    relation: "Family",
    groupId: "group-2",
    tableId: null,
    seatNumber: null,
    assigned: false,
  },
  // Group 3: Thompson Friends
  {
    id: "8",
    name: "Michael Thompson",
    familySize: 2,
    relation: "Friend",
    groupId: "group-3",
    tableId: null,
    seatNumber: null,
    assigned: false,
  },
  {
    id: "9",
    name: "Emma Thompson",
    familySize: 2,
    relation: "Friend",
    groupId: "group-3",
    tableId: null,
    seatNumber: null,
    assigned: false,
  },
  // Group 4: Wilson Colleagues
  {
    id: "10",
    name: "Robert Wilson",
    familySize: 1,
    relation: "Colleague",
    groupId: "group-4",
    tableId: null,
    seatNumber: null,
    assigned: false,
  },
];

const INITIAL_TABLES: Table[] = [
  {
    id: "table-1",
    name: "01",
    type: "rectangle",
    x: 20,
    y: 60,
    capacity: 12,
    seats: Array.from({ length: 12 }, (_, i) => ({
      id: `s1-${i + 1}`,
      number: i + 1,
      guestId: null,
    })),
  },
  {
    id: "table-2",
    name: "02",
    type: "circle",
    x: 200,
    y: 100,
    capacity: 10,
    seats: Array.from({ length: 10 }, (_, i) => ({
      id: `s2-${i + 1}`,
      number: i + 1,
      guestId: null,
    })),
  },
];

// ============================================
// Hook
// ============================================

interface UseTableManagerProps {
  eventId: string;
}

export const useTableManager = ({ eventId }: UseTableManagerProps) => {
  // State
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [guests, setGuests] = useState<Guest[]>(MOCK_GUESTS);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [showAddTable, setShowAddTable] = useState(false);
  const [showGroupSelector, setShowGroupSelector] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [eventId]);

  const loadData = async () => {
    setIsLoading(true);
    const data = await loadTableAssignments(eventId);
    if (data) {
      if (data.tables.length > 0) setTables(data.tables);
      if (data.guests.length > 0) setGuests(data.guests);
    }
    setIsLoading(false);
  };

  // Derived state - memoized for performance
  const guestMap = useMemo(() => createGuestMap(guests), [guests]);

  const groups = useMemo(() => buildGroups(guests), [guests]);

  const assignedGroups = useMemo(
    () => groups.filter((g) => g.assigned),
    [groups]
  );

  const unassignedGroups = useMemo(
    () => groups.filter((g) => !g.assigned),
    [groups]
  );

  const selectedTable = useMemo(
    () => tables.find((t) => t.id === selectedTableId) || null,
    [tables, selectedTableId]
  );

  const seatedGuests = useMemo(
    () => guests.filter((g) => g.assigned).length,
    [guests]
  );

  const totalGuests = guests.length;

  // Actions
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    const success = await saveTableAssignments(eventId, tables, guests);
    setIsSaving(false);
    if (success) {
      Alert.alert("Success", "Table assignments saved successfully!");
    } else {
      Alert.alert("Error", "Failed to save assignments. Please try again.");
    }
  }, [eventId, tables, guests]);

  const handleAddTable = useCallback((template: TableTemplate) => {
    const newTable: Table = {
      id: `table-${Date.now()}`,
      name: template.name,
      type: template.type,
      x: 20,
      y: 60,
      capacity: template.capacity,
      seats: Array.from({ length: template.capacity }, (_, i) => ({
        id: `s-${Date.now()}-${i}`,
        number: i + 1,
        guestId: null,
      })),
    };
    setTables((prev) => [...prev, newTable]);
    setShowAddTable(false);
  }, []);

  const handleRemoveTable = useCallback(
    (tableId: string) => {
      // Unassign guests first
      setGuests((prev) => unassignTableGuests(prev, tableId));
      // Remove table
      setTables((prev) => prev.filter((t) => t.id !== tableId));
      if (selectedTableId === tableId) {
        setSelectedTableId(null);
      }
    },
    [selectedTableId]
  );

  const handleSelectTable = useCallback((tableId: string) => {
    setSelectedTableId(tableId);
  }, []);

  const handleAssignGroupToTable = useCallback(
    (group: GuestGroup) => {
      if (!selectedTable) return;

      const availableSeats = selectedTable.seats.filter((s) => !s.guestId);
      const groupMembers = group.members.filter((m) => !m.assigned);
      const totalNeeded = groupMembers.reduce(
        (sum, m) => sum + m.familySize,
        0
      );

      if (availableSeats.length < totalNeeded) {
        Alert.alert(
          "Not Enough Seats",
          `This group needs ${totalNeeded} seats but only ${availableSeats.length} are available.`
        );
        return;
      }

      const memberIds = groupMembers.map((m) => m.id);

      // Compute new state first
      const newTables = tables.map((t) =>
        t.id === selectedTable.id ? assignGuestsToSeats(t, memberIds) : t
      );
      const newGuests = updateGuestAssignments(
        guests,
        memberIds,
        selectedTable.id,
        true
      );

      // Update both states
      setTables(newTables);
      setGuests(newGuests);
      setShowGroupSelector(false);
      setSelectedGroupId(null);
    },
    [selectedTable, tables, guests]
  );

  const handleRemoveGroupFromTable = useCallback(
    (groupId: string) => {
      if (!selectedTable) return;

      const groupMembers = guests.filter(
        (g) => g.groupId === groupId && g.tableId === selectedTable.id
      );
      const memberIds = groupMembers.map((m) => m.id);

      // Compute new state first
      const newTables = tables.map((t) =>
        t.id === selectedTable.id ? removeGuestsFromTable(t, memberIds) : t
      );
      const newGuests = updateGuestAssignments(guests, memberIds, null, false);

      // Update both states
      setTables(newTables);
      setGuests(newGuests);
    },
    [selectedTable, tables, guests]
  );

  const handleRemoveGuestFromSeat = useCallback(
    (guestId: string) => {
      if (!selectedTable) return;

      // Compute new state first
      const newTables = tables.map((t) =>
        t.id === selectedTable.id ? removeGuestsFromTable(t, [guestId]) : t
      );
      const newGuests = updateGuestAssignments(guests, [guestId], null, false);

      // Update both states
      setTables(newTables);
      setGuests(newGuests);
    },
    [selectedTable, tables, guests]
  );

  const handleAutoAssign = useCallback(() => {
    if (unassignedGroups.length === 0) {
      Alert.alert("No Guests", "All guests are already assigned!");
      return;
    }

    let newTables = [...tables];
    let newGuests = [...guests];

    // Sort groups by size (largest first)
    const sortedGroups = [...unassignedGroups].sort(
      (a, b) => b.totalSize - a.totalSize
    );

    for (const group of sortedGroups) {
      const availableTables = newTables
        .map((t) => ({
          table: t,
          available: t.seats.filter((s) => !s.guestId).length,
        }))
        .filter((t) => t.available > 0)
        .sort((a, b) => b.available - a.available);

      if (availableTables.length === 0) break;

      const memberIds = group.members
        .filter((m) => !m.assigned)
        .map((m) => m.id);

      for (const { table } of availableTables) {
        if (memberIds.length === 0) break;

        const availableSeats = table.seats
          .filter((s) => !s.guestId)
          .map((s) => s.id);

        const seatsToFill = Math.min(memberIds.length, availableSeats.length);

        // Update table
        const tableIndex = newTables.findIndex((t) => t.id === table.id);
        if (tableIndex >= 0) {
          newTables[tableIndex] = assignGuestsToSeats(
            table,
            memberIds.slice(0, seatsToFill)
          );
          memberIds.splice(0, seatsToFill);
        }
      }
    }

    // Update guest assignments
    const assignedMemberIds = newGuests
      .filter((g) =>
        tables.some((t) => t.seats.some((s) => s.guestId === g.id))
      )
      .map((g) => g.id);

    newGuests = updateGuestAssignments(
      newGuests,
      assignedMemberIds,
      null,
      true
    );

    setTables(newTables);
    setGuests(newGuests);

    Alert.alert("Auto Assign Complete", "Guests have been assigned to tables!");
  }, [tables, guests, unassignedGroups]);

  const handleClearAllAssignments = useCallback(() => {
    Alert.alert(
      "Clear All Assignments",
      "Are you sure you want to remove all guest assignments?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            // Clear all table seats
            const newTables = tables.map((t) => ({
              ...t,
              seats: t.seats.map((s) => ({ ...s, guestId: null })),
            }));
            // Unassign all guests
            const newGuests = guests.map((g) => ({
              ...g,
              assigned: false,
              tableId: null,
              seatNumber: null,
            }));
            setTables(newTables);
            setGuests(newGuests);
          },
        },
      ]
    );
  }, [tables, guests]);

  // Handle table position change (drag and drop)
  const handleUpdateTablePosition = useCallback(
    (tableId: string, x: number, y: number) => {
      setTables((prev) =>
        prev.map((table) => (table.id === tableId ? { ...table, x, y } : table))
      );
    },
    []
  );

  return {
    // State
    tables,
    guests,
    groups,
    assignedGroups,
    unassignedGroups,
    selectedTable,
    selectedTableId,
    showAddTable,
    showGroupSelector,
    selectedGroupId,
    isSaving,
    isLoading,
    seatedGuests,
    totalGuests,
    guestMap,

    // Actions
    setSelectedTableId: handleSelectTable,
    setShowAddTable,
    setShowGroupSelector,
    setSelectedGroupId,
    handleSave,
    handleAddTable,
    handleRemoveTable,
    handleAssignGroupToTable,
    handleRemoveGroupFromTable,
    handleRemoveGuestFromSeat,
    handleAutoAssign,
    handleClearAllAssignments,
    handleUpdateTablePosition,
  };
};
