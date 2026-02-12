// GuestList Screen - Refactored
// ============================================

import { Ionicons } from "@expo/vector-icons";
import * as Contacts from "expo-contacts";
import * as DocumentPicker from "expo-document-picker";
import {
  router,
  useLocalSearchParams,
  type RelativePathString,
} from "expo-router";
import { useCallback } from "react";
import {
  ActionSheetIOS,
  Alert,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGuests } from "../../../features/guests/hooks/useGuests";
import {
  GuestCard,
  StatsRow,
  CategoryPills,
  SearchBar,
  QuickActions,
  SegmentedControl,
  AddGuestModal,
  FilterSidebar,
} from "../../../features/guests/components";
import type { Guest } from "../../../features/guests/types";

// ============================================
// BACKEND ============================================
// INTEGRATION NOTES:
// 1. API Endpoints:
//    - GET /api/events/{id}/guests - Get guest list
//    - POST /api/events/{id}/guests - Add new guest
//    - POST /api/events/{id}/guests/import - Import from Excel
//    - POST /api/events/{id}/guests/import-contacts - Import from contacts
//    - PUT /api/guests/{id} - Update guest
//    - DELETE /api/guests/{id} - Delete guest
//    - POST /api/guests/{id}/send-invite - Send invitation
// ============================================

export default function GuestListPage() {
  const params = useLocalSearchParams();
  const eventId = params.eventId as string;

  const {
    guests,
    isLoading,
    isImporting,
    showAddModal,
    showFilterSidebar,
    showSortOptions,
    filters,
    formData,
    stats,
    filteredGuests,
    categories,
    setSearchQuery,
    setSelectedCategory,
    setSelectedInvitation,
    setSortBy,
    setActiveTab,
    setFormData,
    toggleAddModal,
    toggleFilterSidebar,
    toggleSortOptions,
    resetFilters,
    addGuest,
    sendInvite,
    refresh,
  } = useGuests();

  // Handle add guest form submission
  const handleAddGuest = () => {
    if (!formData.name.trim()) return;
    addGuest(formData);
    setFormData({ name: "", email: "", phone: "", relation: "" });
    toggleAddModal();
    Alert.alert("Success", "Guest added successfully!");
  };

  // Handle import from Excel
  const handleImportExcel = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
          "text/csv",
        ],
      });

      if (result.canceled) return;

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const importedGuests: Guest[] = [
        {
          id: `excel-${Date.now()}-1`,
          name: "John Doe",
          initials: "JD",
          relation: "Friend",
          phone: "+1 555-111-2222",
          hasPlusOne: true,
          status: "Pending",
          source: "excel",
          createdAt: new Date().toISOString().split("T")[0],
        },
        {
          id: `excel-${Date.now()}-2`,
          name: "Jane Smith",
          initials: "JS",
          relation: "Colleague",
          phone: "+1 555-333-4444",
          hasPlusOne: false,
          status: "Pending",
          source: "excel",
          createdAt: new Date().toISOString().split("T")[0],
        },
      ];

      // In a real app, we would merge these with the hook's addGuest
      Alert.alert(
        "Import Successful",
        `Imported ${importedGuests.length} guests from Excel file.`
      );
    } catch {
      Alert.alert("Import Failed", "Could not import guests from file.");
    }
  };

  // Handle import from contacts
  const handleImportContacts = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();

      if (status === "denied") {
        Alert.alert(
          "Permission Required",
          "Please allow access to contacts to import guests."
        );
        return;
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
      });

      if (data.length === 0) {
        Alert.alert("No Contacts", "No contacts found on your device.");
        return;
      }

      const contactGuests: Guest[] = data.slice(0, 10).map((contact, index) => ({
        id: `contact-${Date.now()}-${index}`,
        name: contact.name || "Unknown",
        initials: (contact.name || "U")
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2),
        phone: contact.phoneNumbers?.[0]?.number,
        hasPlusOne: false,
        status: "Not Invited" as const,
        relation: "Contact",
        source: "contact" as const,
        createdAt: new Date().toISOString().split("T")[0],
      }));

      Alert.alert(
        "Contacts Imported",
        `Imported ${contactGuests.length} guests from your contacts.`
      );
    } catch {
      Alert.alert("Import Failed", "Could not import contacts.");
    }
  };

  // Show import options (iOS action sheet)
  const showImportOptions = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Import from Excel", "Import from Contacts"],
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          handleImportExcel();
        } else if (buttonIndex === 2) {
          handleImportContacts();
        }
      }
    );
  };

  // Handle quick action press
  const handleActionPress = (actionKey: string) => {
    switch (actionKey) {
      case "inviteAll":
        Alert.alert(
          "Send Invites",
          `Send invitations to ${stats.notInvited} guests?`
        );
        break;
      case "groups":
        router.push("/groups" as RelativePathString);
        break;
      case "export":
        Alert.alert("Export", "Export guest list to file.");
        break;
    }
  };

  // Handle send invite
  const handleSendInvite = (guestId: string) => {
    sendInvite(guestId);
    Alert.alert("Invite Sent", "Invitation has been sent to the guest.");
  };

  // Refresh handler
  const onRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  return (
    <SafeAreaView className="flex-1 bg-background-light">
      {/* Top App Bar */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity
          className="h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-gray-100"
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color="#181114" />
        </TouchableOpacity>
        <View className="flex-col items-center">
          <Text className="text-lg font-bold leading-tight tracking-tight text-gray-900">
            Guest List
          </Text>
          <Text className="text-xs font-medium text-primary">
            Wedding of Maya & Liam
          </Text>
        </View>
        <TouchableOpacity
          className="h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-gray-100"
          onPress={toggleFilterSidebar}
          accessibilityLabel="Open filters"
          accessibilityRole="button"
        >
          <Ionicons name="options" size={24} color="#181114" />
        </TouchableOpacity>
      </View>

      {/* Stats Row */}
      <StatsRow stats={stats} />

      {/* Search Bar with Sort */}
      <SearchBar
        searchQuery={filters.searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={filters.sortBy}
        onSortChange={setSortBy}
        showSortOptions={showSortOptions}
        onToggleSort={toggleSortOptions}
      />

      {/* Category Pills */}
      <CategoryPills
        categories={categories}
        selected={filters.selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Quick Actions */}
      <QuickActions onActionPress={handleActionPress} />

      {/* Active Filters */}
      {(filters.selectedCategory !== "All" ||
        filters.selectedInvitation !== "All") && (
        <View className="px-4 py-2 flex-row items-center gap-2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filters.selectedCategory !== "All" && (
              <View className="flex-row items-center gap-1 px-3 py-1 rounded-full bg-primary/10">
                <Text className="text-xs font-medium text-primary">
                  {filters.selectedCategory}
                </Text>
                <TouchableOpacity
                  onPress={() => setSelectedCategory("All")}
                  accessibilityLabel="Remove category filter"
                >
                  <Ionicons name="close" size={12} color="#ee2b8c" />
                </TouchableOpacity>
              </View>
            )}
            {filters.selectedInvitation !== "All" && (
              <View className="flex-row items-center gap-1 px-3 py-1 rounded-full bg-gray-100">
                <Text className="text-xs font-medium text-gray-600">
                  {filters.selectedInvitation}
                </Text>
                <TouchableOpacity
                  onPress={() => setSelectedInvitation("All")}
                  accessibilityLabel="Remove invitation filter"
                >
                  <Ionicons name="close" size={12} color="#6B7280" />
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {/* Segmented Control */}
      <SegmentedControl
        activeTab={filters.activeTab}
        onTabChange={setActiveTab}
      />

      {/* Guest List */}
      <FlatList
        data={filteredGuests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GuestCard
            guest={item}
            onPress={() =>
              router.push(`/guests/${item.id}` as RelativePathString)
            }
            onSendInvite={() => handleSendInvite(item.id)}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="flex-col items-center justify-center py-20">
            <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-4">
              <Ionicons name="people-outline" size={40} color="#D1D5DB" />
            </View>
            <Text className="text-lg font-bold text-gray-500">
              No guests found
            </Text>
            <Text className="text-sm text-gray-400 mt-1 text-center px-8">
              {filters.searchQuery
                ? "Try adjusting your search or filters"
                : "Add guests to get started with your event planning"}
            </Text>
            <TouchableOpacity
              className="mt-4 px-6 py-2 rounded-full bg-primary"
              onPress={toggleAddModal}
              accessibilityLabel="Add first guest"
              accessibilityRole="button"
            >
              <Text className="text-white font-semibold text-sm">
                Add First Guest
              </Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Import FAB */}
      {isImporting ? (
        <View className="absolute bottom-6 right-6 z-30 w-14 h-14 items-center justify-center rounded-full bg-gray-200">
          <Ionicons name="hourglass" size={28} color="#6B7280" />
        </View>
      ) : (
        <TouchableOpacity
          className="absolute bottom-6 right-6 z-30 w-14 h-14 items-center justify-center rounded-full bg-primary shadow-xl"
          onPress={showImportOptions}
          accessibilityLabel="Import guests"
          accessibilityRole="button"
        >
          <Ionicons name="cloud-upload" size={28} color="white" />
        </TouchableOpacity>
      )}

      {/* Add Guest FAB */}
      <TouchableOpacity
        className="absolute bottom-6 left-6 z-30 w-12 h-12 items-center justify-center rounded-full bg-white shadow-xl border border-gray-100"
        onPress={toggleAddModal}
        accessibilityLabel="Add new guest"
        accessibilityRole="button"
      >
        <Ionicons name="person-add" size={24} color="#ee2b8c" />
      </TouchableOpacity>

      {/* Add Guest Modal */}
      <AddGuestModal
        visible={showAddModal}
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleAddGuest}
        onClose={toggleAddModal}
      />

      {/* Filter Sidebar Modal */}
      <FilterSidebar
        visible={showFilterSidebar}
        selectedInvitation={filters.selectedInvitation}
        selectedCategory={filters.selectedCategory}
        sortBy={filters.sortBy}
        guestCounts={{
          total: stats.totalGuests,
          invited: stats.invitedGuests,
          notInvited: stats.notInvited,
        }}
        onInvitationChange={setSelectedInvitation}
        onSortChange={setSortBy}
        onCategoryChange={setSelectedCategory}
        onClearFilters={resetFilters}
        onClose={toggleFilterSidebar}
      />
    </SafeAreaView>
  );
}
