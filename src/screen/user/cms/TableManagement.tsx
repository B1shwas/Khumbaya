import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const STORAGE_KEY = "@table_assignments";

// ============================================
// Types
// ============================================

interface Guest {
  id: string;
  name: string;
  familySize: number;
  relation: string;
  groupId: string;
  tableId: string | null;
  seatNumber: number | null;
  assigned: boolean;
}

interface GuestGroup {
  id: string;
  name: string;
  members: Guest[];
  totalSize: number;
  assigned: boolean;
}

interface Seat {
  id: string;
  number: number;
  guestId: string | null;
}

interface Table {
  id: string;
  name: string;
  type: "rectangle" | "circle";
  x: number;
  y: number;
  capacity: number;
  seats: Seat[];
}

interface TableTemplate {
  type: "rectangle" | "circle";
  name: string;
  capacity: number;
}

// ============================================
// Mock Data with Groups
// ============================================

const MOCK_GUESTS: Guest[] = [
  // Group 1: Vance Family (4 members)
  { id: "1", name: "Eleanor Vance", familySize: 4, relation: "Family", groupId: "group-1", tableId: null, seatNumber: null, assigned: false },
  { id: "2", name: "Henry Vance", familySize: 4, relation: "Family", groupId: "group-1", tableId: null, seatNumber: null, assigned: false },
  { id: "3", name: "Mrs. Vance", familySize: 4, relation: "Family", groupId: "group-1", tableId: null, seatNumber: null, assigned: false },
  { id: "4", name: "Julia Vance", familySize: 4, relation: "Family", groupId: "group-1", tableId: null, seatNumber: null, assigned: false },
  // Group 2: Crain Family (3 members)
  { id: "5", name: "Steven Crain", familySize: 3, relation: "Family", groupId: "group-2", tableId: null, seatNumber: null, assigned: false },
  { id: "6", name: "Nell Crain", familySize: 3, relation: "Family", groupId: "group-2", tableId: null, seatNumber: null, assigned: false },
  { id: "7", name: "Luke Crain", familySize: 3, relation: "Family", groupId: "group-2", tableId: null, seatNumber: null, assigned: false },
  // Group 3: Friends (2 members)
  { id: "8", name: "Luke S.", familySize: 2, relation: "Friend", groupId: "group-3", tableId: null, seatNumber: null, assigned: false },
  { id: "9", name: "Shirley H.", familySize: 2, relation: "Friend", groupId: "group-3", tableId: null, seatNumber: null, assigned: false },
  // Group 4: Colleagues (2 members)
  { id: "10", name: "Arthur Vance", familySize: 2, relation: "Colleague", groupId: "group-4", tableId: null, seatNumber: null, assigned: false },
  { id: "11", name: "Olivia V.", familySize: 2, relation: "Colleague", groupId: "group-4", tableId: null, seatNumber: null, assigned: false },
  // Group 5: Singleton
  { id: "12", name: "Theodora C.", familySize: 1, relation: "Friend", groupId: "group-5", tableId: null, seatNumber: null, assigned: false },
];

const TABLE_TEMPLATES: TableTemplate[] = [
  { type: "rectangle", name: "Head Table", capacity: 12 },
  { type: "circle", name: "Round Table", capacity: 8 },
  { type: "circle", name: "Round Table", capacity: 10 },
];

// ============================================
// Draggable Table Component with Guest Display
// ============================================

interface TableCardProps {
  table: Table;
  guests: Guest[];
  isSelected: boolean;
  onSelect: (tableId: string) => void;
  panHandlers: any;
}

const TableCard = ({ table, guests, isSelected, onSelect, panHandlers }: TableCardProps) => {
  const occupancy = table.seats.filter(s => s.guestId).length;
  const occupancyPercent = (occupancy / table.capacity) * 100;

  const getOccupancyColor = () => {
    if (occupancyPercent === 100) return "#10B981";
    if (occupancyPercent >= 70) return "#F59E0B";
    return "#6B7280";
  };

  const getOccupancyText = () => {
    if (occupancy === table.capacity) return "FULL";
    return `${occupancy} / ${table.capacity} SEATS`;
  };

  return (
    <Animated.View
      style={[
        styles.tableCard,
        {
          left: table.x,
          top: table.y,
        },
        table.type === "circle" && styles.tableCardCircle,
        isSelected && styles.tableCardSelected,
      ]}
      {...panHandlers}
      onPress={() => onSelect(table.id)}
    >
      {/* Seat placeholders for rectangle table with guest names */}
      {table.type === "rectangle" && (
        <View style={styles.rectangleSeats}>
          <View style={styles.rectangleSeatTop}>
            {Array.from({ length: 4 }).map((_, i) => {
              const seat = table.seats[i];
              const guest = seat?.guestId ? guests.find(g => g.id === seat.guestId) : null;
              return (
                <View
                  key={`top-${i}`}
                  style={[
                    styles.rectangleSeatBox,
                    guest ? styles.seatFilled : styles.seatEmpty,
                  ]}
                >
                  {guest ? (
                    <Text style={styles.seatGuestLabel} numberOfLines={1}>
                      {guest.name.split(" ")[0]}
                    </Text>
                  ) : (
                    <Text style={styles.seatNumberLabel}>{i + 1}</Text>
                  )}
                </View>
              );
            })}
          </View>
          <View style={styles.rectangleSeatBottom}>
            {Array.from({ length: 4 }).map((_, i) => {
              const seat = table.seats[i + 4];
              const guest = seat?.guestId ? guests.find(g => g.id === seat.guestId) : null;
              return (
                <View
                  key={`bottom-${i}`}
                  style={[
                    styles.rectangleSeatBox,
                    guest ? styles.seatFilled : styles.seatEmpty,
                  ]}
                >
                  {guest ? (
                    <Text style={styles.seatGuestLabel} numberOfLines={1}>
                      {guest.name.split(" ")[0]}
                    </Text>
                  ) : (
                    <Text style={styles.seatNumberLabel}>{i + 5}</Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Circle table */}
      {table.type === "circle" && (
        <>
          <View style={styles.circleTable}>
            <Text style={styles.tableLabel}>TABLE</Text>
            <Text style={styles.tableNumber}>{table.name}</Text>
          </View>
          <View
            style={[
              styles.occupancyBadge,
              { backgroundColor: getOccupancyColor() },
            ]}
          >
            <Text style={styles.occupancyText}>{getOccupancyText()}</Text>
          </View>
          {/* Show seated guests on circle table */}
          <View style={styles.circleGuests}>
            {table.seats.slice(0, 6).map((seat, i) => {
              const guest = seat?.guestId ? guests.find(g => g.id === seat.guestId) : null;
              if (!guest) return null;
              return (
                <View key={seat.id} style={styles.circleGuestDot}>
                  <Text style={styles.circleGuestInitial}>{guest.name.charAt(0)}</Text>
                </View>
              );
            })}
            {table.seats.filter(s => s.guestId).length > 6 && (
              <Text style={styles.moreGuests}>+{table.seats.filter(s => s.guestId).length - 6}</Text>
            )}
          </View>
        </>
      )}

      {/* Selected indicator */}
      {isSelected && <View style={styles.selectedRing} />}
    </Animated.View>
  );
};

// ============================================
// Guest Group Chip Component
// ============================================

interface GroupChipProps {
  group: GuestGroup;
  isSelected: boolean;
  onSelect: () => void;
}

const GroupChip = ({ group, isSelected, onSelect }: GroupChipProps) => {
  return (
    <TouchableOpacity
      style={[styles.groupChip, isSelected && styles.groupChipSelected]}
      onPress={onSelect}
    >
      <View style={styles.groupChipHeader}>
        <Text style={styles.groupChipName}>{group.name}</Text>
        <View style={styles.groupChipBadge}>
          <Text style={styles.groupChipBadgeText}>{group.totalSize}</Text>
        </View>
      </View>
      <Text style={styles.groupChipMembers}>
        {group.members.slice(0, 3).map(m => m.name.split(" ")[0]).join(", ")}
        {group.members.length > 3 && ` +${group.members.length - 3}`}
      </Text>
    </TouchableOpacity>
  );
};

// ============================================
// Main Component
// ============================================

export default function TableManagement() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const eventId = params.eventId as string || "default";

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
  const [selectedTableAnim] = useState(new Animated.Value(0));
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
      await AsyncStorage.setItem(`${STORAGE_KEY}_${eventId}`, JSON.stringify(dataToSave));
      Alert.alert("Success", "Table assignments saved successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to save assignments. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Build groups from guests
  const groups: GuestGroup[] = useMemo(() => {
    const groupMap = new Map<string, Guest[]>();
    
    guests.forEach(guest => {
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
      assigned: members.every(m => m.assigned),
    }));
  }, [guests]);

  const unassignedGroups = groups.filter(g => !g.assigned);
  const selectedTable = tables.find(t => t.id === selectedTableId);

  // Pan handlers for tables
  const createTablePanHandlers = (tableId: string) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setSelectedTableId(tableId);
      },
      onPanResponderMove: (_, gesture) => {
        setTables(prev => prev.map(t => {
          if (t.id === tableId) {
            return {
              ...t,
              x: Math.max(0, Math.min(SCREEN_WIDTH - 150, t.x + gesture.dx)),
              y: Math.max(80, Math.min(SCREEN_HEIGHT - 250, t.y + gesture.dy)),
            };
          }
          return t;
        }));
      },
      onPanResponderRelease: () => {},
    }).panHandlers;
  };

  const handleBack = () => {
    router.back();
  };

  const handleSave = () => {
    saveData();
  };

  const handleAutoAssign = () => {
    // Auto-assign groups to tables
    let groupIndex = 0;
    
    setTables(prev => prev.map(table => {
      const tableGroups = [...groups].slice(groupIndex);
      const remainingCapacity = table.capacity - table.seats.filter(s => s.guestId).length;
      
      let seatsToFill = remainingCapacity;
      const newSeats = [...table.seats];
      
      for (const group of tableGroups) {
        if (seatsToFill <= 0) break;
        
        const groupMembers = group.members.filter(m => !m.assigned);
        for (let i = 0; i < groupMembers.length && seatsToFill > 0; i++) {
          const seatIndex = newSeats.findIndex(s => !s.guestId);
          if (seatIndex >= 0) {
            newSeats[seatIndex] = { ...newSeats[seatIndex], guestId: groupMembers[i].id };
            seatsToFill--;
            groupIndex++;
          }
        }
      }
      
      return { ...table, seats: newSeats };
    }));

    // Update guests
    setGuests(prev => prev.map(guest => {
      const table = tables.find(t => t.seats.some(s => s.guestId === guest.id));
      if (table) {
        return { ...guest, assigned: true, tableId: table.id };
      }
      return guest;
    }));
  };

  const handleAddTable = (template: TableTemplate) => {
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
    setTables(prev => [...prev, newTable]);
    setShowAddTable(false);
  };

  const handleRemoveGuestFromSeat = (seatId: string) => {
    if (!selectedTable) return;

    const seat = selectedTable.seats.find(s => s.id === seatId);
    if (!seat?.guestId) return;

    setTables(prev =>
      prev.map(table => {
        if (table.id === selectedTableId) {
          return {
            ...table,
            seats: table.seats.map(s =>
              s.id === seatId ? { ...s, guestId: null } : s,
            ),
          };
        }
        return table;
      }),
    );

    setGuests(prev =>
      prev.map(guest => {
        if (guest.id === seat.guestId) {
          return { ...guest, assigned: false, tableId: null, seatNumber: null };
        }
        return guest;
      }),
    );
  };

  const handleRemoveGroupFromTable = (groupId: string) => {
    // Remove all members of the group from the table
    const groupMembers = guests.filter(g => g.groupId === groupId && g.tableId === selectedTableId);
    
    setTables(prev =>
      prev.map(table => {
        if (table.id === selectedTableId) {
          return {
            ...table,
            seats: table.seats.map(s => {
              const member = groupMembers.find(m => m.id === s.guestId);
              return member ? { ...s, guestId: null } : s;
            }),
          };
        }
        return table;
      }),
    );

    setGuests(prev =>
      prev.map(guest => {
        if (guest.groupId === groupId) {
          return { ...guest, assigned: false, tableId: null, seatNumber: null };
        }
        return guest;
      }),
    );
  };

  const handleAssignGroupToTable = (group: GuestGroup) => {
    if (!selectedTable) return;

    const availableSeats = selectedTable.seats.filter(s => !s.guestId);
    const availableCapacity = availableSeats.length;
    const groupMembers = group.members.filter(m => !m.assigned);
    const totalNeeded = groupMembers.reduce((sum, m) => sum + m.familySize, 0);

    if (availableCapacity < totalNeeded) {
      Alert.alert(
        "Not Enough Seats",
        `This group needs ${totalNeeded} seats but only ${availableCapacity} are available.`,
        [{ text: "OK" }]
      );
      return;
    }

    // Assign group members to seats
    const memberIds = groupMembers.map(m => m.id);

    setTables(prev =>
      prev.map(table => {
        if (table.id === selectedTableId) {
          const newSeats = table.seats.map(s => {
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

    setGuests(prev =>
      prev.map(guest => {
        if (guest.groupId === group.id) {
          return { ...guest, assigned: true, tableId: selectedTable.id };
        }
        return guest;
      }),
    );

    setShowGroupSelector(false);
    setSelectedGroupId(null);
  };

  const handleSelectSeatForGroup = (seatId: string) => {
    if (!selectedTable) return;
    
    const seat = selectedTable.seats.find(s => s.id === seatId);
    if (!seat?.guestId) {
      setShowGroupSelector(true);
    }
  };

  const totalGuests = guests.length;
  const seatedGuests = guests.filter(g => g.assigned).length;

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
          <Text style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}>
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
            {unassignedGroups.map(group => (
              <GroupChip
                key={group.id}
                group={group}
                isSelected={selectedGroupId === group.id}
                onSelect={() => {
                  if (selectedTable) {
                    handleAssignGroupToTable(group);
                  } else {
                    setSelectedGroupId(group.id);
                  }
                }}
              />
            ))}
          </ScrollView>
        </View>

        {/* Floor Plan Canvas */}
        <View style={styles.canvasContainer}>
          <View style={styles.canvasGrid}>
            {tables.map(table => (
              <TableCard
                key={table.id}
                table={table}
                guests={guests}
                isSelected={selectedTableId === table.id}
                onSelect={setSelectedTableId}
                panHandlers={createTablePanHandlers(table.id)}
              />
            ))}
          </View>

          {/* Canvas Info Overlay */}
          <View style={styles.canvasInfo}>
            <View style={styles.guestAvatars}>
              <View style={styles.avatarDot}>
                <Text style={styles.avatarText}>JD</Text>
              </View>
              <View style={styles.avatarDot}>
                <Text style={styles.avatarText}>EV</Text>
              </View>
              <View style={styles.avatarDot}>
                <Text style={styles.avatarText}>+12</Text>
              </View>
            </View>
            <Text style={styles.canvasInfoText}>
              {seatedGuests}/{totalGuests} seated
            </Text>
          </View>

          {/* Floating Controls */}
          <View style={styles.floatingControls}>
            <TouchableOpacity style={styles.fab}>
              <Ionicons name="expand" size={20} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.fab, styles.fabAdd]}
              onPress={() => setShowAddTable(true)}
            >
              <Ionicons name="add" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Bottom Drawer */}
      {selectedTable && (
        <Animated.View
          style={[
            styles.drawer,
            { transform: [{ translateY: selectedTableAnim }] },
          ]}
        >
          <View style={styles.drawerHandle} />
          <View style={styles.drawerContent}>
            <View style={styles.drawerHeader}>
              <View>
                <Text style={styles.drawerTitle}>
                  Table {selectedTable.name}
                </Text>
                <Text style={styles.drawerSubtitle}>
                  {selectedTable.seats.filter(s => !s.guestId).length} seats available
                </Text>
              </View>
              <TouchableOpacity style={styles.editButton}>
                <Ionicons name="create" size={20} color="#ee2b8c" />
              </TouchableOpacity>
            </View>

            <View style={styles.seatsGrid}>
              {selectedTable.seats.map((seat, index) => {
                const guest = guests.find(g => g.id === seat.guestId);
                const group = guest ? groups.find(g => g.id === guest.groupId) : null;
                const isFirstSeatOfGroup = guest && 
                  selectedTable.seats.findIndex(s => s.guestId === guest.id) === index;

                return (
                  <TouchableOpacity
                    key={seat.id}
                    style={[
                      styles.seatSlot,
                      guest && styles.seatSlotFilled,
                      group && styles.seatSlotGroup,
                    ]}
                    onPress={() => {
                      if (guest) {
                        if (isFirstSeatOfGroup) {
                          handleRemoveGroupFromTable(group!.id);
                        } else {
                          handleRemoveGuestFromSeat(seat.id);
                        }
                      } else {
                        handleSelectSeatForGroup(seat.id);
                      }
                    }}
                  >
                    <View
                      style={[
                        styles.seatNumber,
                        guest && styles.seatNumberFilled,
                        isFirstSeatOfGroup && styles.seatNumberGroup,
                      ]}
                    >
                      <Text
                        style={[
                          styles.seatNumberText,
                          guest && styles.seatNumberTextFilled,
                        ]}
                      >
                        {index + 1}
                      </Text>
                    </View>
                    {guest ? (
                      <View style={styles.seatGuestInfo}>
                        <Text style={styles.seatGuestName}>{guest.name}</Text>
                        {isFirstSeatOfGroup && (
                          <Text style={styles.seatGroupLabel}>
                            {group!.name} ({group!.totalSize})
                          </Text>
                        )}
                      </View>
                    ) : (
                      <Text style={styles.seatEmptyText}>Empty</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </Animated.View>
      )}

      {/* Group Selector Modal */}
      <Modal
        visible={showGroupSelector}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGroupSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select Group</Text>
            <Text style={styles.modalSubtitle}>
              Tap a group to assign all members to this table
            </Text>

            <ScrollView style={styles.groupList}>
              {unassignedGroups.map(group => {
                const groupMembers = group.members.filter(m => !m.assigned);
                const totalNeeded = groupMembers.reduce((sum, m) => sum + m.familySize, 0);
                const availableSeats = selectedTable?.seats.filter(s => !s.guestId).length || 0;
                const canAssign = availableSeats >= totalNeeded;

                return (
                  <TouchableOpacity
                    key={group.id}
                    style={[styles.groupOption, !canAssign && styles.groupOptionDisabled]}
                    onPress={() => canAssign && handleAssignGroupToTable(group)}
                    disabled={!canAssign}
                  >
                    <View style={styles.groupOptionInfo}>
                      <Text style={styles.groupOptionName}>{group.name}</Text>
                      <Text style={styles.groupOptionMembers}>
                        {groupMembers.map(m => m.name).join(", ")}
                      </Text>
                      <Text style={styles.groupOptionSize}>
                        Seats needed: {totalNeeded}
                      </Text>
                    </View>
                    <View style={[styles.groupOptionCheck, canAssign && styles.groupOptionCheckActive]}>
                      <Ionicons
                        name={canAssign ? "checkmark" : "close"}
                        size={18}
                        color={canAssign ? "white" : "#9CA3AF"}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowGroupSelector(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Table Modal */}
      {showAddTable && (
        <Modal
          visible={showAddTable}
          transparent
          animationType="slide"
          onRequestClose={() => setShowAddTable(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Add Table</Text>
              <View style={styles.tableOptions}>
                {TABLE_TEMPLATES.map((template, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.tableOption}
                    onPress={() => handleAddTable(template)}
                  >
                    <Ionicons
                      name={template.type === "rectangle" ? "square" : "ellipse"}
                      size={24}
                      color="#ee2b8c"
                    />
                    <Text style={styles.tableOptionName}>{template.name}</Text>
                    <Text style={styles.tableOptionCapacity}>
                      {template.capacity} seats
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setShowAddTable(false)}
              >
                <Text style={styles.modalCloseText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
  groupChip: {
    backgroundColor: "#f8f6f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 120,
  },
  groupChipSelected: {
    borderColor: "#ee2b8c",
    backgroundColor: "#ee2b8c10",
  },
  groupChipHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  groupChipName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
  },
  groupChipBadge: {
    backgroundColor: "#ee2b8c",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  groupChipBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "white",
  },
  groupChipMembers: {
    fontSize: 10,
    color: "#6B7280",
  },
  canvasContainer: {
    flex: 1,
    position: "relative",
  },
  canvasGrid: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 32,
    paddingTop: 64,
  },
  tableCard: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tableCardCircle: {
    borderRadius: 80,
    width: 160,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
  },
  tableCardSelected: {
    borderColor: "#ee2b8c",
    borderWidth: 2,
  },
  rectangleSeats: {
    padding: 8,
  },
  rectangleSeatTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  rectangleSeatBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rectangleSeatBox: {
    width: 40,
    height: 24,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  seatEmpty: {
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
  },
  seatFilled: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  seatGuestLabel: {
    fontSize: 8,
    fontWeight: "600",
    color: "white",
  },
  seatNumberLabel: {
    fontSize: 8,
    color: "#9CA3AF",
  },
  circleTable: {
    alignItems: "center",
  },
  tableLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#ee2b8c",
    letterSpacing: 1,
  },
  tableNumber: {
    fontSize: 28,
    fontWeight: "700",
    color: "#374151",
  },
  circleGuests: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 8,
    paddingHorizontal: 16,
  },
  circleGuestDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#8B5CF6",
    alignItems: "center",
    justifyContent: "center",
    margin: 2,
  },
  circleGuestInitial: {
    fontSize: 10,
    fontWeight: "700",
    color: "white",
  },
  moreGuests: {
    fontSize: 10,
    color: "#6B7280",
    marginLeft: 4,
  },
  occupancyBadge: {
    position: "absolute",
    bottom: -12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  occupancyText: {
    fontSize: 10,
    fontWeight: "700",
    color: "white",
  },
  selectedRing: {
    position: "absolute",
    inset: -4,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#ee2b8c",
    borderStyle: "dashed",
  },
  canvasInfo: {
    position: "absolute",
    bottom: 24,
    left: 24,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ee2b8c10",
  },
  guestAvatars: {
    flexDirection: "row",
    marginRight: 12,
  },
  avatarDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    borderWidth: 2,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -8,
  },
  avatarText: {
    fontSize: 8,
    fontWeight: "700",
    color: "#6B7280",
  },
  canvasInfoText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#374151",
  },
  floatingControls: {
    position: "absolute",
    bottom: 24,
    right: 24,
    flexDirection: "column",
    gap: 12,
  },
  fab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  fabAdd: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#ee2b8c",
    shadowColor: "#ee2b8c",
    shadowOpacity: 0.3,
  },
  drawer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  drawerHandle: {
    width: 48,
    height: 4,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
  },
  drawerContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 24,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
  },
  drawerSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#ee2b8c10",
    alignItems: "center",
    justifyContent: "center",
  },
  seatsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  seatSlot: {
    width: "47%",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f8f6f6",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ee2b8c20",
    borderStyle: "dashed",
  },
  seatSlotFilled: {
    backgroundColor: "white",
    borderStyle: "solid",
    borderColor: "#10B981",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  seatSlotGroup: {
    borderColor: "#8B5CF6",
  },
  seatNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  seatNumberFilled: {
    backgroundColor: "#10B981",
  },
  seatNumberGroup: {
    backgroundColor: "#8B5CF6",
  },
  seatNumberText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
  },
  seatNumberTextFilled: {
    color: "white",
  },
  seatGuestInfo: {
    flex: 1,
  },
  seatGuestName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  seatGroupLabel: {
    fontSize: 10,
    color: "#8B5CF6",
    fontWeight: "600",
  },
  seatEmptyText: {
    flex: 1,
    fontSize: 14,
    color: "#9CA3AF",
  },
  modalOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    maxHeight: "70%",
  },
  modalHandle: {
    width: 48,
    height: 4,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
  },
  groupList: {
    maxHeight: 300,
  },
  groupOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f6f6",
    borderRadius: 12,
    marginBottom: 8,
  },
  groupOptionDisabled: {
    opacity: 0.5,
  },
  groupOptionInfo: {
    flex: 1,
  },
  groupOptionName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
  },
  groupOptionMembers: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  groupOptionSize: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 4,
  },
  groupOptionCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  groupOptionCheckActive: {
    backgroundColor: "#10B981",
  },
  tableOptions: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  tableOption: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f6f6",
    borderRadius: 16,
  },
  tableOptionName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginTop: 8,
  },
  tableOptionCapacity: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  modalClose: {
    alignItems: "center",
    paddingVertical: 16,
  },
  modalCloseText: {
    fontSize: 16,
    color: "#6B7280",
  },
});
