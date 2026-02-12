import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Dimensions } from "react-native";
import {
    Guest,
    GuestGroup,
    MOCK_GUESTS,
    STORAGE_KEY,
    Table,
    TableTemplate,
} from "../types/tableManagement";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface UseTableManagementProps {
  eventId: string;
}

export const useTableManagement = ({ eventId }: UseTableManagementProps) => {
  const [guests, setGuests] = useState<Guest[]>(MOCK_GUESTS);
  const [tables, setTables] = useState<Table[]>([
    {
      id: "table-1",
      name: "01",
      type: "rectangle",
      x: 20,
      y: 60,
      capacity: 12,
      seats: [
        { id: "s1", number: 1, guestId: null },
        { id: "s2", number: 2, guestId: null },
        { id: "s3", number: 3, guestId: null },
        { id: "s4", number: 4, guestId: null },
        { id: "s5", number: 5, guestId: null },
        { id: "s6", number: 6, guestId: null },
        { id: "s7", number: 7, guestId: null },
        { id: "s8", number: 8, guestId: null },
        { id: "s9", number: 9, guestId: null },
        { id: "s10", number: 10, guestId: null },
        { id: "s11", number: 11, guestId: null },
        { id: "s12", number: 12, guestId: null },
      ],
    },
    {
      id: "table-2",
      name: "02",
      type: "circle",
      x: 200,
      y: 100,
      capacity: 10,
      seats: [
        { id: "s21", number: 1, guestId: null },
        { id: "s22", number: 2, guestId: null },
        { id: "s23", number: 3, guestId: null },
        { id: "s24", number: 4, guestId: null },
        { id: "s25", number: 5, guestId: null },
        { id: "s26", number: 6, guestId: null },
        { id: "s27", number: 7, guestId: null },
        { id: "s28", number: 8, guestId: null },
        { id: "s29", number: 9, guestId: null },
        { id: "s30", number: 10, guestId: null },
      ],
    },
  ]);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [showAddTable, setShowAddTable] = useState(false);
  const [showGroupSelector, setShowGroupSelector] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const savedData = await AsyncStorage.getItem(`${STORAGE_KEY}_${eventId}`);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.tables) setTables(parsed.tables);
        if (parsed.guests) setGuests(parsed.guests);
      }
    } catch (error) {
      console.log("Failed to load saved data:", error);
    }
  };

  const saveData = async () => {
    setIsSaving(true);
    try {
      const dataToSave = {
        tables: tables,
        guests: guests,
        savedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(
        `${STORAGE_KEY}_${eventId}`,
        JSON.stringify(dataToSave),
      );
      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      setIsSaving(false);
    }
  };

  // Build groups from guests
  const groups: GuestGroup[] = useMemo(() => {
    const groupMap = new Map<string, Guest[]>();

    guests.forEach((guest) => {
      if (!groupMap.has(guest.groupId)) {
        groupMap.set(guest.groupId, []);
      }
      groupMap.get(guest.groupId)!.push(guest);
    });

    return Array.from(groupMap.entries()).map(([id, members]) => ({
      id,
      name: members[0].relation || "Group",
      members,
      totalSize: members.reduce((sum, m) => sum + m.familySize, 0),
      assigned: members.every((m) => m.assigned),
    }));
  }, [guests]);

  const unassignedGroups = groups.filter((g) => !g.assigned);
  const selectedTable = tables.find((t) => t.id === selectedTableId);
  const totalGuests = guests.length;
  const seatedGuests = guests.filter((g) => g.assigned).length;

  const handleAutoAssign = useCallback(() => {
    let groupIndex = 0;

    setTables((prev) =>
      prev.map((table) => {
        const tableGroups = [...groups].slice(groupIndex);
        const remainingCapacity =
          table.capacity - table.seats.filter((s) => s.guestId).length;

        let seatsToFill = remainingCapacity;
        const newSeats = [...table.seats];

        for (const group of tableGroups) {
          if (seatsToFill <= 0) break;

          const groupMembers = group.members.filter((m) => !m.assigned);
          for (let i = 0; i < groupMembers.length && seatsToFill > 0; i++) {
            const seatIndex = newSeats.findIndex((s) => !s.guestId);
            if (seatIndex >= 0) {
              newSeats[seatIndex] = {
                ...newSeats[seatIndex],
                guestId: groupMembers[i].id,
              };
              seatsToFill--;
              groupIndex++;
            }
          }
        }

        return { ...table, seats: newSeats };
      }),
    );

    setGuests((prev) =>
      prev.map((guest) => {
        const table = tables.find((t) =>
          t.seats.some((s) => s.guestId === guest.id),
        );
        if (table) {
          return { ...guest, assigned: true, tableId: table.id };
        }
        return guest;
      }),
    );
  }, [groups, tables]);

  const handleAddTable = useCallback(
    (template: TableTemplate) => {
      const newTable: Table = {
        id: `table-${Date.now()}`,
        name: `${tables.length + 1}`.padStart(2, "0"),
        type: template.type,
        x: 50 + Math.random() * 100,
        y: 100 + Math.random() * 100,
        capacity: template.capacity,
        seats: Array.from({ length: template.capacity }, (_, i) => ({
          id: `s-${Date.now()}-${i}`,
          number: i + 1,
          guestId: null,
        })),
      };
      setTables((prev) => [...prev, newTable]);
      setShowAddTable(false);
    },
    [tables.length],
  );

  const handleRemoveGuestFromSeat = useCallback(
    (seatId: string) => {
      if (!selectedTable) return;

      const seat = selectedTable.seats.find((s) => s.id === seatId);
      if (!seat?.guestId) return;

      setTables((prev) =>
        prev.map((table) => {
          if (table.id === selectedTableId) {
            return {
              ...table,
              seats: table.seats.map((s) =>
                s.id === seatId ? { ...s, guestId: null } : s,
              ),
            };
          }
          return table;
        }),
      );

      setGuests((prev) =>
        prev.map((guest) => {
          if (guest.id === seat.guestId) {
            return {
              ...guest,
              assigned: false,
              tableId: null,
              seatNumber: null,
            };
          }
          return guest;
        }),
      );
    },
    [selectedTable, selectedTableId],
  );

  const handleRemoveGroupFromTable = useCallback(
    (groupId: string) => {
      const groupMembers = guests.filter(
        (g) => g.groupId === groupId && g.tableId === selectedTableId,
      );

      setTables((prev) =>
        prev.map((table) => {
          if (table.id === selectedTableId) {
            return {
              ...table,
              seats: table.seats.map((s) => {
                const member = groupMembers.find((m) => m.id === s.guestId);
                return member ? { ...s, guestId: null } : s;
              }),
            };
          }
          return table;
        }),
      );

      setGuests((prev) =>
        prev.map((guest) => {
          if (guest.groupId === groupId) {
            return {
              ...guest,
              assigned: false,
              tableId: null,
              seatNumber: null,
            };
          }
          return guest;
        }),
      );
    },
    [guests, selectedTableId],
  );

  const handleAssignGroupToTable = useCallback(
    (group: GuestGroup) => {
      if (!selectedTable) return;

      const availableSeats = selectedTable.seats.filter((s) => !s.guestId);
      const availableCapacity = availableSeats.length;
      const groupMembers = group.members.filter((m) => !m.assigned);
      const totalNeeded = groupMembers.reduce(
        (sum, m) => sum + m.familySize,
        0,
      );

      if (availableCapacity < totalNeeded) {
        return { success: false, error: "Not Enough Seats" };
      }

      const memberIds = groupMembers.map((m) => m.id);

      setTables((prev) =>
        prev.map((table) => {
          if (table.id === selectedTableId) {
            const newSeats = table.seats.map((s) => {
              if (!s.guestId && memberIds.length > 0) {
                const guestId = memberIds.shift();
                return { ...s, guestId: guestId! };
              }
              return s;
            });
            return { ...table, seats: newSeats };
          }
          return table;
        }),
      );

      setGuests((prev) =>
        prev.map((guest) => {
          if (guest.groupId === group.id) {
            return { ...guest, assigned: true, tableId: selectedTable.id };
          }
          return guest;
        }),
      );

      setShowGroupSelector(false);
      setSelectedGroupId(null);
      return { success: true };
    },
    [selectedTable, selectedTableId],
  );

  return {
    guests,
    setGuests,
    tables,
    setTables,
    selectedTableId,
    setSelectedTableId,
    showAddTable,
    setShowAddTable,
    showGroupSelector,
    setShowGroupSelector,
    selectedGroupId,
    setSelectedGroupId,
    isSaving,
    groups,
    unassignedGroups,
    selectedTable,
    totalGuests,
    seatedGuests,
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    loadSavedData,
    saveData,
    handleAutoAssign,
    handleAddTable,
    handleRemoveGuestFromSeat,
    handleRemoveGroupFromTable,
    handleAssignGroupToTable,
  };
};
