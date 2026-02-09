import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Alert,
  Modal,
  PanResponder,
  PanResponderGestureState,
  GestureResponderEvent,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// ============================================
// Types
// ============================================

interface Table {
  id: string;
  name: string;
  x: number;
  y: number;
  capacity: number;
  assignedGuests: Guest[];
  isRound: boolean;
}

interface Guest {
  id: string;
  name: string;
  initials: string;
  category: string;
  dietaryNotes?: string;
  hasPlusOne: boolean;
  assigned: boolean;
  assignedTableId?: string;
}

// ============================================
// Mock Data
// ============================================

const INITIAL_TABLES: Table[] = [
  { id: 't1', name: 'Table 1', x: 20, y: 100, capacity: 10, assignedGuests: [], isRound: true },
  { id: 't2', name: 'Table 2', x: 180, y: 100, capacity: 10, assignedGuests: [], isRound: false },
  { id: 't3', name: 'Table 3', x: 20, y: 260, capacity: 10, assignedGuests: [], isRound: true },
  { id: 't4', name: 'Table 4', x: 180, y: 260, capacity: 8, assignedGuests: [], isRound: false },
];

const MOCK_GUESTS: Guest[] = [
  { id: 'g1', name: 'Julianne Smith', initials: 'JS', category: 'Bridal Party', dietaryNotes: 'Vegan', hasPlusOne: false, assigned: false },
  { id: 'g2', name: 'Robert Thompson', initials: 'RT', category: "Groom's Family", hasPlusOne: true, assigned: false },
  { id: 'g3', name: 'Alice Miller', initials: 'AM', category: 'University Friend', hasPlusOne: false, assigned: false },
  { id: 'g4', name: 'David Kim', initials: 'DK', category: "Groom's Family", dietaryNotes: 'Nut Allergy', hasPlusOne: false, assigned: false },
  { id: 'g5', name: 'Sarah Wilson', initials: 'SW', category: 'Colleague', hasPlusOne: true, assigned: false },
  { id: 'g6', name: 'Michael Brown', initials: 'MB', category: 'Family Friend', hasPlusOne: false, assigned: false },
  { id: 'g7', name: 'Emily Davis', initials: 'ED', category: 'Bridal Party', hasPlusOne: true, assigned: false },
  { id: 'g8', name: 'James Wilson', initials: 'JW', category: 'Family', hasPlusOne: false, assigned: false },
];

// Table component with drag functionality
function DraggableTable({
  table,
  isSelected,
  onSelect,
  onDragEnd,
  onDelete,
}: {
  table: Table;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (id: string, x: number, y: number) => void;
  onDelete: (id: string) => void;
}) {
  const [position, setPosition] = useState({ x: table.x, y: table.y });
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setPosition({ x: table.x, y: table.y });
  }, [table.x, table.y]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        onSelect();
      },
      onPanResponderMove: (event: GestureResponderEvent, gesture: PanResponderGestureState) => {
        const screenWidth = 360; // approximate screen width in dp
        const maxY = 450;
        const newX = Math.max(0, Math.min(gesture.dx + position.x, screenWidth - 120));
        const newY = Math.max(80, Math.min(gesture.dy + position.y, maxY));
        setPosition({ x: newX, y: newY });
      },
      onPanResponderRelease: () => {
        onDragEnd(table.id, position.x, position.y);
      },
    })
  ).current;

  const occupancyPercent = (table.assignedGuests.length / table.capacity) * 100;

  return (
    <Animated.View
      style={[
        styles.tableContainer,
        {
          left: position.x,
          top: position.y,
          width: table.isRound ? 100 : 120,
          height: table.isRound ? 100 : 80,
        },
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity
        style={[
          styles.table,
          table.isRound ? styles.tableRound : styles.tableRect,
          isSelected && styles.tableSelected,
        ]}
        onPress={onSelect}
        onLongPress={() => onDelete(table.id)}
      >
        <Text style={styles.tableName}>{table.name}</Text>
        <Text style={styles.tableCapacity}>
          {table.assignedGuests.length}/{table.capacity}
        </Text>
        
        {/* Occupancy indicator */}
        <View style={styles.occupancyBar}>
          <View 
            style={[
              styles.occupancyFill,
              { width: `${occupancyPercent}%` },
              occupancyPercent >= 100 && styles.occupancyFull,
            ]} 
          />
        </View>

        {/* Guest initials on table */}
        {table.assignedGuests.length > 0 && (
          <View style={styles.tableGuestsPreview}>
            {table.assignedGuests.slice(0, 4).map((guest) => (
              <View key={guest.id} style={[styles.guestBadge, { backgroundColor: getCategoryColor(guest.category) }]}>
                <Text style={styles.guestBadgeText}>{guest.initials}</Text>
              </View>
            ))}
            {table.assignedGuests.length > 4 && (
              <View style={styles.guestBadgeMore}>
                <Text style={styles.guestBadgeMoreText}>+{table.assignedGuests.length - 4}</Text>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>

      {/* Empty indicator */}
      {table.assignedGuests.length === 0 && (
        <View style={styles.emptyIndicator}>
          <Text style={styles.emptyIndicatorText}>Empty</Text>
        </View>
      )}

      {/* Selected indicator */}
      {isSelected && (
        <View style={styles.selectedIndicator}>
          <Ionicons name="checkmark-circle" size={20} color="#ee2b8c" />
        </View>
      )}
    </Animated.View>
  );
}

export default function SeatPlanning() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const eventId = params.eventId as string;

  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [guests, setGuests] = useState<Guest[]>(MOCK_GUESTS);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showAddTable, setShowAddTable] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [newTableCapacity, setNewTableCapacity] = useState('8');

  // Calculate stats
  const totalSeats = tables.reduce((acc, t) => acc + t.capacity, 0);
  const assignedSeats = tables.reduce((acc, t) => acc + t.assignedGuests.length, 0);
  const unassignedGuests = guests.filter(g => !g.assigned);

  const handleTableSelect = (tableId: string) => {
    setSelectedTable(selectedTable === tableId ? null : tableId);
  };

  const handleTableDragEnd = (tableId: string, x: number, y: number) => {
    setTables(prev => prev.map(t => 
      t.id === tableId ? { ...t, x, y } : t
    ));
  };

  const handleGuestPress = (guestId: string) => {
    if (selectedTable) {
      assignGuestToTable(guestId, selectedTable);
    }
  };

  const assignGuestToTable = (guestId: string, tableId: string) => {
    const table = tables.find(t => t.id === tableId);
    if (!table || table.assignedGuests.length >= table.capacity) {
      Alert.alert('Table Full', 'This table has reached its capacity.');
      return;
    }

    const guest = guests.find(g => g.id === guestId);
    if (!guest) return;

    const updatedTables = tables.map(t => ({
      ...t,
      assignedGuests: t.assignedGuests.filter(g => g.id !== guestId),
    }));

    updatedTables.forEach(t => {
      if (t.id === tableId) {
        t.assignedGuests = [...t.assignedGuests, { ...guest, assigned: true, assignedTableId: tableId }];
      }
    });

    setTables(updatedTables);
    setGuests(guests.map(g => 
      g.id === guestId ? { ...g, assigned: true, assignedTableId: tableId } : g
    ));
  };

  const handleRemoveGuest = (guestId: string, tableId: string) => {
    const updatedTables = tables.map(t => {
      if (t.id === tableId) {
        return {
          ...t,
          assignedGuests: t.assignedGuests.filter(g => g.id !== guestId),
        };
      }
      return t;
    });

    setTables(updatedTables);
    setGuests(guests.map(g => 
      g.id === guestId ? { ...g, assigned: false, assignedTableId: undefined } : g
    ));
  };

  const handleAutoAssign = () => {
    Alert.alert(
      'Auto Assign',
      'Automatically assign unassigned guests to tables?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Assign', 
          onPress: () => {
            const unassigned = guests.filter(g => !g.assigned);
            let tableIndex = 0;
            
            const updatedTables = tables.map((t) => {
              const guestsForTable = unassigned.slice(tableIndex, tableIndex + (t.capacity - t.assignedGuests.length));
              tableIndex += guestsForTable.length;
              
              return {
                ...t,
                assignedGuests: [...t.assignedGuests, ...guestsForTable.map(g => ({ ...g, assigned: true, assignedTableId: t.id }))],
              };
            });

            setTables(updatedTables);
            setGuests(guests.map(g => {
              const table = updatedTables.find(t => t.assignedGuests.some(ag => ag.id === g.id));
              return table ? { ...g, assigned: true, assignedTableId: table.id } : g;
            }));
          }
        },
      ]
    );
  };

  const handleAddTable = () => {
    if (!newTableName.trim()) {
      Alert.alert('Error', 'Please enter a table name');
      return;
    }

    const capacity = parseInt(newTableCapacity) || 8;
    const newTable: Table = {
      id: `t${Date.now()}`,
      name: newTableName.trim(),
      x: 50,
      y: 200,
      capacity,
      assignedGuests: [],
      isRound: true,
    };

    setTables(prev => [...prev, newTable]);
    setNewTableName('');
    setNewTableCapacity('8');
    setShowAddTable(false);
  };

  const handleDeleteTable = (tableId: string) => {
    Alert.alert(
      'Delete Table',
      'Are you sure you want to delete this table? Guests will be unassigned.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const table = tables.find(t => t.id === tableId);
            if (table) {
              setGuests(guests.map(g => 
                g.assignedTableId === tableId 
                  ? { ...g, assigned: false, assignedTableId: undefined }
                  : g
              ));
              setTables(tables.filter(t => t.id !== tableId));
              setSelectedTable(null);
            }
          },
        },
      ]
    );
  };

  const handleSave = () => {
    Alert.alert('Saved', 'Seat planning has been saved successfully!');
  };

  const handleBack = () => {
    router.back();
  };

  const filteredGuests = guests.filter(g => 
    !g.assigned && 
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#181114" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Seat Planning</Text>
          <Text style={styles.headerSubtitle}>
            {assignedSeats}/{totalSeats} Seated
          </Text>
        </View>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Add Table Button */}
      <View style={styles.addTableHeader}>
        <TouchableOpacity 
          style={styles.addTableButton}
          onPress={() => setShowAddTable(true)}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.addTableButtonText}>Add Table</Text>
        </TouchableOpacity>
      </View>

      {/* Floor Plan */}
      <View style={styles.floorPlanContainer}>
        {/* Floor Labels */}
        <Text style={styles.floorLabelMain}>Stage</Text>
        <Text style={styles.floorLabelBottom}>Dance Floor</Text>
        <Text style={styles.floorLabelLeft}>Main Entrance</Text>

        {/* Tables with Drag */}
        {tables.map((table) => (
          <DraggableTable
            key={table.id}
            table={table}
            isSelected={selectedTable === table.id}
            onSelect={() => handleTableSelect(table.id)}
            onDragEnd={handleTableDragEnd}
            onDelete={handleDeleteTable}
          />
        ))}

        {/* Zoom Controls */}
        <View style={styles.zoomControls}>
          <TouchableOpacity 
            style={styles.zoomButton}
            onPress={() => setZoomLevel(Math.max(0.8, zoomLevel - 0.1))}
          >
            <Ionicons name="remove" size={24} color="#181114" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.zoomButton}
            onPress={() => setZoomLevel(Math.min(1.5, zoomLevel + 0.1))}
          >
            <Ionicons name="add" size={24} color="#181114" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Sheet - Unassigned Guests */}
      <View style={styles.bottomSheet}>
        <View style={styles.bottomSheetHandle} />
        
        <View style={styles.bottomSheetHeader}>
          <View style={styles.bottomSheetTitleRow}>
            <Text style={styles.bottomSheetTitle}>Unassigned Guests</Text>
            <View style={styles.unassignedBadge}>
              <Text style={styles.unassignedBadgeText}>{unassignedGuests.length}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleAutoAssign} style={styles.autoAssignButton}>
            <Ionicons name="flash-outline" size={16} color="white" />
            <Text style={styles.autoAssignButtonText}>Auto-Assign</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#896175" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search guests..."
            placeholderTextColor="#896175"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Guest List */}
        <ScrollView style={styles.guestList} showsVerticalScrollIndicator={false}>
          {selectedTable && (
            <View style={styles.assignHint}>
              <Ionicons name="information-circle-outline" size={16} color="#ee2b8c" />
              <Text style={styles.assignHintText}>
                Tap a guest below to assign to {tables.find(t => t.id === selectedTable)?.name}
              </Text>
            </View>
          )}
          
          {filteredGuests.map((guest) => (
            <TouchableOpacity
              key={guest.id}
              style={styles.guestItem}
              onPress={() => handleGuestPress(guest.id)}
            >
              <View style={[styles.guestAvatar, { backgroundColor: getCategoryColor(guest.category) }]}>
                <Text style={styles.guestAvatarText}>{guest.initials}</Text>
              </View>
              <View style={styles.guestInfo}>
                <View style={styles.guestNameRow}>
                  <Text style={styles.guestName}>{guest.name}</Text>
                  {guest.hasPlusOne && (
                    <View style={styles.plusOneBadge}>
                      <Text style={styles.plusOneBadgeText}>+1</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.guestCategory}>{guest.category}</Text>
                {guest.dietaryNotes && (
                  <Text style={styles.guestDietary}>{guest.dietaryNotes}</Text>
                )}
              </View>
              <Ionicons name="add-circle-outline" size={24} color="#ee2b8c" />
            </TouchableOpacity>
          ))}

          {filteredGuests.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-circle" size={48} color="#10B981" />
              <Text style={styles.emptyStateTitle}>All guests assigned!</Text>
            </View>
          )}

          {/* Selected Table Details */}
          {selectedTable && (
            <View style={styles.selectedTableSection}>
              <Text style={styles.selectedTableTitle}>
                {tables.find(t => t.id === selectedTable)?.name} Guests
              </Text>
              {tables.find(t => t.id === selectedTable)?.assignedGuests.map((guest) => (
                <View key={guest.id} style={styles.assignedGuestItem}>
                  <View style={[styles.guestAvatar, { backgroundColor: getCategoryColor(guest.category) }]}>
                    <Text style={styles.guestAvatarText}>{guest.initials}</Text>
                  </View>
                  <View style={styles.guestInfo}>
                    <Text style={styles.guestName}>{guest.name}</Text>
                    <Text style={styles.guestCategory}>{guest.category}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRemoveGuest(guest.id, selectedTable)}
                    style={styles.removeButton}
                  >
                    <Ionicons name="close-circle" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>

      {/* Add Table Modal */}
      <Modal
        visible={showAddTable}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddTable(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Table</Text>
              <TouchableOpacity onPress={() => setShowAddTable(false)}>
                <Ionicons name="close" size={24} color="#181114" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>Table Name</Text>
              <View style={styles.modalInputContainer}>
                <Ionicons name="grid-outline" size={20} color="#6B7280" />
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g., Table 5, VIP Table"
                  placeholderTextColor="#9CA3AF"
                  value={newTableName}
                  onChangeText={setNewTableName}
                />
              </View>

              <Text style={styles.modalLabel}>Capacity</Text>
              <View style={styles.modalInputContainer}>
                <Ionicons name="people-outline" size={20} color="#6B7280" />
                <TextInput
                  style={styles.modalInput}
                  placeholder="Number of seats"
                  placeholderTextColor="#9CA3AF"
                  value={newTableCapacity}
                  onChangeText={setNewTableCapacity}
                  keyboardType="numeric"
                />
              </View>

              <TouchableOpacity
                style={styles.modalAddButton}
                onPress={handleAddTable}
              >
                <Ionicons name="add" size={20} color="white" />
                <Text style={styles.modalAddButtonText}>Add Table</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Helper function for category colors
function getCategoryColor(category: string): string {
  if (category.includes('Bridal')) return '#ec1380';
  if (category.includes('Groom')) return '#3B82F6';
  if (category.includes('Family')) return '#8B5CF6';
  if (category.includes('Friend')) return '#F59E0B';
  return '#6B7280';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f6f7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e6dbe0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 18,
    color: '#181114',
  },
  headerSubtitle: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: '#896175',
  },
  saveButton: {
    backgroundColor: '#ee2b8c',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveButtonText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: 'white',
  },
  addTableHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
  },
  addTableButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    borderRadius: 10,
    paddingVertical: 10,
    gap: 6,
  },
  addTableButtonText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: 'white',
  },
  floorPlanContainer: {
    flex: 1,
    backgroundColor: '#f0eff1',
    position: 'relative',
    overflow: 'hidden',
  },
  floorLabelMain: {
    position: 'absolute',
    top: 20,
    left: '50%',
    marginLeft: -40,
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: '#d1d5db',
    letterSpacing: 4,
  },
  floorLabelBottom: {
    position: 'absolute',
    bottom: 220,
    left: '50%',
    marginLeft: -50,
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: '#d1d5db',
    letterSpacing: 4,
  },
  floorLabelLeft: {
    position: 'absolute',
    left: 10,
    top: '50%',
    marginTop: -20,
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 12,
    color: '#d1d5db',
    letterSpacing: 2,
  },
  tableContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  table: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tableRound: {
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#e6dbe0',
  },
  tableRect: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e6dbe0',
  },
  tableSelected: {
    borderColor: '#ee2b8c',
    shadowColor: '#ee2b8c',
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  tableName: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 10,
    color: '#896175',
  },
  tableCapacity: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: '#181114',
  },
  occupancyBar: {
    width: '70%',
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginTop: 6,
    overflow: 'hidden',
  },
  occupancyFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
  occupancyFull: {
    backgroundColor: '#EF4444',
  },
  tableGuestsPreview: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 3,
  },
  guestBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestBadgeText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 8,
    color: 'white',
  },
  guestBadgeMore: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestBadgeMoreText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 8,
    color: '#6B7280',
  },
  emptyIndicator: {
    position: 'absolute',
    top: -20,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  emptyIndicatorText: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 10,
    color: '#9CA3AF',
  },
  selectedIndicator: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  zoomControls: {
    position: 'absolute',
    right: 12,
    bottom: 220,
    flexDirection: 'column',
    gap: 8,
  },
  zoomButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    maxHeight: '40%',
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#e6dbe0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  bottomSheetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bottomSheetTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: '#181114',
  },
  unassignedBadge: {
    backgroundColor: '#ee2b8c',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  unassignedBadgeText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 12,
    color: 'white',
  },
  autoAssignButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  autoAssignButtonText: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 12,
    color: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f6f7',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 14,
    color: '#181114',
  },
  guestList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  assignHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF2F8',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    gap: 8,
  },
  assignHintText: {
    flex: 1,
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 13,
    color: '#be185d',
  },
  guestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0eff1',
    gap: 12,
  },
  guestAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestAvatarText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: 'white',
  },
  guestInfo: {
    flex: 1,
  },
  guestNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  guestName: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: '#181114',
  },
  guestCategory: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: '#896175',
  },
  guestDietary: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 11,
    color: '#F59E0B',
    marginTop: 2,
  },
  plusOneBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  plusOneBadgeText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 10,
    color: '#2563EB',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: '#10B981',
    marginTop: 8,
  },
  selectedTableSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e6dbe0',
  },
  selectedTableTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: '#181114',
    marginBottom: 12,
  },
  assignedGuestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  removeButton: {
    padding: 4,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e6dbe0',
  },
  modalTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 18,
    color: '#181114',
  },
  modalBody: {
    padding: 20,
  },
  modalLabel: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  modalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modalInput: {
    flex: 1,
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 15,
    color: '#181114',
  },
  modalAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    borderRadius: 14,
    paddingVertical: 16,
    gap: 6,
  },
  modalAddButtonText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: 'white',
  },
});
