import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import GuestCard from "./components/GuestCard";
import GuestFilters from "./components/GuestFilters";
import GuestHeader from "./components/GuestHeader";
import { useGuests, type Guest } from "./hooks/useGuests";

// Sample data - In production, this would come from the API
const SAMPLE_GUESTS: Guest[] = [
  // {
  //   id: "1",
  //   name: "Priya Sharma",
  //   initials: "PS",
  //   avatar: "https://example.com/avatar1.jpg",
  //   relation: "Friend",
  //   phone: "+91 98765 43210",
  //   dietaryRestrictions: ["Vegetarian"],
  //   hasPlusOne: true,
  //   plusOneName: "Amit",
  //   status: "Going",
  //   category: "Groom's Colleague",
  //   source: "manual",
  //   createdAt: "2024-01-15",
  // },
  // {
  //   id: "2",
  //   name: "Rahul Kapoor",
  //   initials: "RK",
  //   relation: "Family",
  //   phone: "+91 98765 43211",
  //   hasPlusOne: false,
  //   status: "Going",
  //   category: "Bride's Family",
  //   source: "manual",
  //   createdAt: "2024-01-10",
  // },
  // {
  //   id: "3",
  //   name: "Sarah Jenkins",
  //   initials: "SJ",
  //   relation: "Friend",
  //   phone: "+91 98765 43212",
  //   hasPlusOne: true,
  //   status: "Pending",
  //   category: "Groom's Friend",
  //   source: "excel",
  //   createdAt: "2024-01-08",
  // },
  // {
  //   id: "4",
  //   name: "Mike Johnson",
  //   initials: "MJ",
  //   relation: "Colleague",
  //   phone: "+91 98765 43213",
  //   dietaryRestrictions: ["Vegan", "Gluten-Free"],
  //   hasPlusOne: false,
  //   status: "Not Going",
  //   category: "Work",
  //   source: "manual",
  //   createdAt: "2024-01-05",
  // },
  // {
  //   id: "5",
  //   name: "Emily Davis",
  //   initials: "ED",
  //   relation: "Neighbor",
  //   hasPlusOne: false,
  //   status: "Not Invited",
  //   source: "contact",
  // },
  {
    id: "6",
    name: "John Smith",
    initials: "JS",
    relation: "Relative",
    phone: "+91 98765 43214",
    hasPlusOne: true,
    plusOneName: "Jane",
    status: "Going",
    category: "Groom's Family",
    source: "manual",
    createdAt: "2024-01-12",
  },
  // {
  //   id: "7",
  //   name: "Lisa Anderson",
  //   initials: "LA",
  //   relation: "Friend",
  //   phone: "+91 98765 43215",
  //   hasPlusOne: false,
  //   status: "Pending",
  //   source: "excel",
  //   createdAt: "2024-01-14",
  // },
  {
    id: "8",
    name: "David Wilson",
    initials: "DW",
    relation: "Colleague",
    hasPlusOne: true,
    plusOneName: "Sarah",
    status: "Not Invited",
    category: "Work",
    source: "manual",
  },
];

export default function GuestListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const eventId = params.eventId as string | undefined;

  const {
    filteredGuests,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    activeTab,
    setActiveTab,
    sortBy,
    setSortBy,
    sendInvite,
    deleteGuest,
    refreshGuests,
    stats,
  } = useGuests(SAMPLE_GUESTS);

  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Bulk import states
  const [showImportModal, setShowImportModal] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importedGuests, setImportedGuests] = useState<Guest[]>([]);
  const [importedFileName, setImportedFileName] = useState("");

  // New guest form state
  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestRelation, setNewGuestRelation] = useState("");
  const [newGuestPhone, setNewGuestPhone] = useState("");

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshGuests();
    setRefreshing(false);
  }, [refreshGuests]);

  const handleSendInvite = useCallback(
    (id: string) => {
      Alert.alert(
        "Send Invitation",
        "Are you sure you want to send an invitation to this guest?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Send",
            onPress: () => {
              sendInvite(id);
              Alert.alert("Success", "Invitation sent successfully!");
            },
          },
        ]
      );
    },
    [sendInvite]
  );

  // const handleDeleteGuest = useCallback(
  //   (id: string, name: string) => {
  //     Alert.alert(
  //       "Delete Guest",
  //       `Are you sure you want to remove ${name} from the guest list?`,
  //       [
  //         { text: "Cancel", style: "cancel" },
  //         {
  //           text: "Delete",
  //           style: "destructive",
  //           onPress: () => deleteGuest(id),
  //         },
  //       ]
  //     );
  //   },
  //   [deleteGuest]
  // );

  const handleAddGuest = useCallback(() => {
    if (!newGuestName.trim()) {
      Alert.alert("Error", "Please enter a guest name");
      return;
    }

    // In production, call addGuest from useGuests hook
    Alert.alert("Success", "Guest added successfully!");
    setShowAddModal(false);
    setNewGuestName("");
    setNewGuestRelation("");
    setNewGuestPhone("");
  }, []);

  // Bulk Import Functions - Simulated Excel Import
  // In production, integrate with expo-document-picker and xlsx library
  const handlePickFile = useCallback(async () => {
    try {
      setIsImporting(true);

      // Simulate file picking delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In production, use DocumentPicker to pick the file:
      // const result = await DocumentPicker.pickDocument({
      //   type: ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
      // });
      // const file = result[0];
      // Parse with xlsx library: const data = XLSX.read(file.uri, { type: "buffer" });

      // For demo, simulate parsed Excel data
      setImportedFileName("guests_import.xlsx");
      const parsedGuests: Guest[] = [
        {
          id: "import-1",
          name: "Amit Patel",
          initials: "AP",
          relation: "Friend",
          phone: "+91 98000 00001",
          hasPlusOne: false,
          status: "Not Invited",
          category: "Groom's Friend",
          source: "excel",
        },
      ];

      setImportedGuests(parsedGuests);
      setIsImporting(false);
    } catch (error) {
      setIsImporting(false);
      // In production: if (DocumentPicker.isCancel(error)) { return; }
      Alert.alert("Error", "Failed to import file. Please try again.");
    }
  }, []);

  const handleConfirmImport = useCallback(() => {
    if (importedGuests.length === 0) {
      Alert.alert("Error", "No guests to import");
      return;
    }

    Alert.alert(
      "Confirm Import",
      `Add ${importedGuests.length} guests to your list?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Import",
          onPress: () => {
            // In production, merge imported guests with existing list
            // For now, just show success
            Alert.alert(
              "Success",
              `${importedGuests.length} guests imported successfully!`
            );
            setShowImportModal(false);
            setImportedGuests([]);
            setImportedFileName("");
          },
        },
      ]
    );
  }, [importedGuests]);

  const handleCancelImport = useCallback(() => {
    setShowImportModal(false);
    setImportedGuests([]);
    setImportedFileName("");
  }, []);

  // ✅ Navigate to guest details
  const handleGuestPress = useCallback(
    (guest: Guest) => {
      router.push({
        pathname: "/events/[eventId]/(organizer)/guest-details",
        params: { eventId, guest: JSON.stringify(guest) },
      });
    },
    [router]
  );

  const renderGuest = useCallback(
    ({ item }: { item: Guest }) => (
      <GuestCard
        guest={item}
        onPress={() => handleGuestPress(item)}
        onSendInvite={() => handleSendInvite(item.id)}
        // onDelete={() => handleDeleteGuest(item.id, item.name)}
      />
    ),
    [handleSendInvite, handleGuestPress]
  );

  const ListEmptyComponent = useCallback(
    () => (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 60,
        }}
      >
        <Ionicons name="people-outline" size={64} color="#D1D5DB" />
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: "#6B7280",
            marginTop: 16,
          }}
        >
          No guests found
        </Text>
        <Text style={{ fontSize: 14, color: "#9CA3AF", marginTop: 4 }}>
          {searchQuery
            ? "Try adjusting your search or filters"
            : "Add guests to get started"}
        </Text>
      </View>
    ),
    [searchQuery]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* Header */}
      <GuestHeader
        totalGuests={stats.totalGuests}
        goingCount={stats.going}
        pendingCount={stats.pending}
        invitedCount={stats.invitedGuests}
        onAddPress={() => setShowAddModal(true)}
      />

      {/* Filters */}
      <GuestFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Guest List */}
      <FlatList
        data={filteredGuests}
        renderItem={renderGuest}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#EE2B8C"]}
            tintColor="#EE2B8C"
          />
        }
        // Performance optimizations
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
      />

      {/* Floating Action Buttons */}
      <View
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          alignItems: "center",
        }}
      >
        {/* Import Button */}
        <TouchableOpacity
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: "#fff",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 4,
            borderWidth: 1,
            borderColor: "#E5E7EB",
          }}
          onPress={() => setShowImportModal(true)}
        >
          <Ionicons name="document-text-outline" size={22} color="#10B981" />
        </TouchableOpacity>

        {/* Add Button */}
        <TouchableOpacity
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: "#EE2B8C",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#EE2B8C",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Add Guest Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              paddingBottom: 32,
            }}
          >
            <View
              style={{
                width: 64,
                height: 4,
                borderRadius: 2,
                backgroundColor: "#E5E7EB",
                alignSelf: "center",
                marginBottom: 24,
              }}
            />
            <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 20 }}>
              Add New Guest
            </Text>

            <View style={{ gap: 16 }}>
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: 6,
                  }}
                >
                  Name *
                </Text>
                <TextInput
                  value={newGuestName}
                  onChangeText={setNewGuestName}
                  placeholder="Enter guest name"
                  style={{
                    backgroundColor: "#F3F4F6",
                    padding: 14,
                    borderRadius: 12,
                    fontSize: 14,
                  }}
                />
              </View>

              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: 6,
                  }}
                >
                  Relation
                </Text>
                <TextInput
                  value={newGuestRelation}
                  onChangeText={setNewGuestRelation}
                  placeholder="e.g., Family, Friend, Colleague"
                  style={{
                    backgroundColor: "#F3F4F6",
                    padding: 14,
                    borderRadius: 12,
                    fontSize: 14,
                  }}
                />
              </View>

              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: 6,
                  }}
                >
                  Phone
                </Text>
                <TextInput
                  value={newGuestPhone}
                  onChangeText={setNewGuestPhone}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                  style={{
                    backgroundColor: "#F3F4F6",
                    padding: 14,
                    borderRadius: 12,
                    fontSize: 14,
                  }}
                />
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 12, marginTop: 24 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 12,
                  backgroundColor: "#F3F4F6",
                  alignItems: "center",
                }}
                onPress={() => setShowAddModal(false)}
              >
                <Text
                  style={{ fontSize: 16, fontWeight: "600", color: "#4B5563" }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 12,
                  backgroundColor: "#EE2B8C",
                  alignItems: "center",
                }}
                onPress={handleAddGuest}
              >
                <Text
                  style={{ fontSize: 16, fontWeight: "600", color: "#fff" }}
                >
                  Add Guest
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bulk Import Modal */}
      <Modal
        visible={showImportModal}
        transparent
        animationType="slide"
        onRequestClose={handleCancelImport}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              paddingBottom: 32,
              maxHeight: "80%",
            }}
          >
            <View
              style={{
                width: 64,
                height: 4,
                borderRadius: 2,
                backgroundColor: "#E5E7EB",
                alignSelf: "center",
                marginBottom: 20,
              }}
            />

            <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 8 }}>
              Bulk Import Guests
            </Text>
            <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 20 }}>
              Import guests from an Excel file (.xlsx, .xls)
            </Text>

            {/* Loading State */}
            {isImporting ? (
              <View
                style={{
                  alignItems: "center",
                  paddingVertical: 40,
                }}
              >
                <ActivityIndicator size="large" color="#EE2B8C" />
                <Text style={{ marginTop: 12, color: "#6B7280" }}>
                  Reading file...
                </Text>
              </View>
            ) : importedGuests.length > 0 ? (
              /* Preview */
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#F3F4F6",
                    padding: 12,
                    borderRadius: 12,
                    marginBottom: 16,
                  }}
                >
                  <Ionicons name="document-text" size={24} color="#10B981" />
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: "500" }}>
                      {importedFileName}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#6B7280" }}>
                      {importedGuests.length} guests found
                    </Text>
                  </View>
                </View>

                <Text
                  style={{ fontSize: 14, fontWeight: "600", marginBottom: 8 }}
                >
                  Preview:
                </Text>

                <ScrollView
                  style={{ maxHeight: 200 }}
                  showsVerticalScrollIndicator={false}
                >
                  {importedGuests.map((guest, index) => (
                    <View
                      key={guest.id}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 8,
                        borderBottomWidth:
                          index < importedGuests.length - 1 ? 1 : 0,
                        borderBottomColor: "#F3F4F6",
                      }}
                    >
                      <View
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          backgroundColor: "#EE2B8C",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: 12,
                        }}
                      >
                        <Text
                          style={{
                            color: "#fff",
                            fontSize: 12,
                            fontWeight: "600",
                          }}
                        >
                          {guest.initials}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 14, fontWeight: "500" }}>
                          {guest.name}
                        </Text>
                        <Text style={{ fontSize: 12, color: "#6B7280" }}>
                          {guest.phone} • {guest.relation}
                        </Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>

                <View style={{ flexDirection: "row", gap: 12, marginTop: 20 }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      paddingVertical: 14,
                      borderRadius: 12,
                      backgroundColor: "#F3F4F6",
                      alignItems: "center",
                    }}
                    onPress={handleCancelImport}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: "#4B5563",
                      }}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      paddingVertical: 14,
                      borderRadius: 12,
                      backgroundColor: "#10B981",
                      alignItems: "center",
                    }}
                    onPress={handleConfirmImport}
                  >
                    <Text
                      style={{ fontSize: 16, fontWeight: "600", color: "#fff" }}
                    >
                      Import {importedGuests.length}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              /* File Selection */
              <View>
                <TouchableOpacity
                  style={{
                    borderWidth: 2,
                    borderColor: "#E5E7EB",
                    borderStyle: "dashed",
                    borderRadius: 16,
                    padding: 32,
                    alignItems: "center",
                  }}
                  onPress={handlePickFile}
                >
                  <View
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 32,
                      backgroundColor: "#F3F4F6",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 12,
                    }}
                  >
                    <Ionicons
                      name="cloud-upload-outline"
                      size={32}
                      color="#6B7280"
                    />
                  </View>
                  <Text
                    style={{ fontSize: 16, fontWeight: "600", marginBottom: 4 }}
                  >
                    Tap to select Excel file
                  </Text>
                  <Text style={{ fontSize: 14, color: "#9CA3AF" }}>
                    Supports .xlsx and .xls formats
                  </Text>
                </TouchableOpacity>

                <View style={{ marginTop: 20 }}>
                  <Text
                    style={{ fontSize: 14, fontWeight: "600", marginBottom: 8 }}
                  >
                    File Format:
                  </Text>
                  <View
                    style={{
                      backgroundColor: "#F9FAFB",
                      padding: 12,
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#6B7280",
                        fontFamily: "monospace",
                      }}
                    >
                      Name | Phone | Relation | Category
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#6B7280",
                        fontFamily: "monospace",
                        marginTop: 4,
                      }}
                    >
                      John Doe | 9800000000 | Friend | Groom's Friend
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#6B7280",
                        fontFamily: "monospace",
                      }}
                    >
                      Jane Smith | 9800000001 | Family | Bride's Family
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={{
                    marginTop: 20,
                    paddingVertical: 14,
                    borderRadius: 12,
                    backgroundColor: "#F3F4F6",
                    alignItems: "center",
                  }}
                  onPress={handleCancelImport}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#4B5563",
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
