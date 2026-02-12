import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./components/styles/SubEventDetail.styles";
import { useSubEventDetail } from "./hooks/useSubEventDetail";

// Sections
import { ActivitiesSection } from "./components/SubEventDetail/ActivitiesSection";
import { EventDetailsSection } from "./components/SubEventDetail/EventDetailsSection";
import { GuestsSection } from "./components/SubEventDetail/GuestsSection";
import { VendorsSection } from "./components/SubEventDetail/VendorsSection";

// Modals
import {
  AddGuestModal,
  ExcelImportModal,
  GuestManagementModal,
  VendorContactModal,
  VendorDetailModal,
} from "./components/SubEventDetail/modals";

export default function SubEventDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const subEventId = params.subEventId as string;
  const eventId = params.eventId as string;
  const isNew = params.isNew === "true";

  const {
    template,
    date,
    setDate,
    theme,
    setTheme,
    budget,
    setBudget,
    activities,
    guests,
    vendors,
    selectedVendorsCount,
    showGuestModal,
    setShowGuestModal,
    showAddGuestModal,
    setShowAddGuestModal,
    showExcelModal,
    setShowExcelModal,
    showVendorContactModal,
    setShowVendorContactModal,
    showVendorDetailModal,
    setShowVendorDetailModal,
    selectedVendor,
    newGuestName,
    setNewGuestName,
    newGuestPhone,
    setNewGuestPhone,
    newGuestEmail,
    setNewGuestEmail,
    newGuestRelation,
    setNewGuestRelation,
    excelFileName,
    setExcelFileName,
    isUploading,
    setIsUploading,
    handleToggleVendor,
    handleShowVendorDetail,
    handleContactVendor,
    handleAssignVendor,
    handleToggleGuest,
    handleDeleteGuest,
    handleAddGuest,
    handleUploadExcel,
  } = useSubEventDetail({ subEventId, eventId, isNew });

  const handleSave = () => {
    console.log("Saving sub-event:", {
      template,
      date,
      theme,
      budget,
      activities,
      vendors: vendors.filter((v) => v.selected),
      invitedGuests: guests.filter((g) => g.invited),
    });
    router.back();
  };

  const handleBack = () => {
    router.back();
  };

  if (!template) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#181114" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{template.name}</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <EventDetailsSection
          date={date}
          theme={theme}
          budget={budget}
          onDateChange={setDate}
          onThemeChange={setTheme}
          onBudgetChange={setBudget}
        />

        <VendorsSection
          vendors={vendors}
          selectedVendorsCount={selectedVendorsCount}
          onToggleVendor={handleToggleVendor}
          onShowVendorDetail={handleShowVendorDetail}
        />

        <ActivitiesSection activities={activities} />

        <GuestsSection
          guestsCount={guests.length}
          invitedCount={guests.filter((g) => g.invited).length}
          pendingCount={guests.length - guests.filter((g) => g.invited).length}
          onManageGuests={() => setShowGuestModal(true)}
        />

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Guest Management Modal */}
      <GuestManagementModal
        visible={showGuestModal}
        guests={guests}
        onClose={() => setShowGuestModal(false)}
        onToggleGuest={handleToggleGuest}
        onDeleteGuest={handleDeleteGuest}
        onAddManually={() => setShowAddGuestModal(true)}
        onUploadExcel={() => setShowExcelModal(true)}
      />

      {/* Vendor Detail Modal */}
      <VendorDetailModal
        visible={showVendorDetailModal}
        vendor={selectedVendor}
        onClose={() => setShowVendorDetailModal(false)}
        onAssign={handleAssignVendor}
        onContact={handleContactVendor}
      />

      {/* Add Guest Modal */}
      <AddGuestModal
        visible={showAddGuestModal}
        name={newGuestName}
        phone={newGuestPhone}
        email={newGuestEmail}
        relation={newGuestRelation}
        onNameChange={setNewGuestName}
        onPhoneChange={setNewGuestPhone}
        onEmailChange={setNewGuestEmail}
        onRelationChange={setNewGuestRelation}
        onClose={() => setShowAddGuestModal(false)}
        onAdd={handleAddGuest}
      />

      {/* Excel Import Modal */}
      <ExcelImportModal
        visible={showExcelModal}
        fileName={excelFileName}
        isUploading={isUploading}
        onClose={() => setShowExcelModal(false)}
        onUpload={() => {
          if (!excelFileName) {
            setExcelFileName("guest_list.xlsx");
            setIsUploading(true);
            setTimeout(() => {
              const excelGuests = [
                {
                  id: "excel1",
                  name: "Amit Gupta",
                  phone: "+91 98765 44444",
                  email: "amit@email.com",
                  relation: "Family",
                  invited: true,
                },
                {
                  id: "excel2",
                  name: "Neha Gupta",
                  phone: "+91 98765 55555",
                  email: "neha@email.com",
                  relation: "Friend",
                  invited: true,
                },
                {
                  id: "excel3",
                  name: "Vikram Singh",
                  phone: "+91 98765 66666",
                  email: "vikram@email.com",
                  relation: "Colleague",
                  invited: true,
                },
              ];
              // In real app, merge with existing guests
              Alert.alert("Success", "Guests imported successfully!");
              setShowExcelModal(false);
              setExcelFileName("");
              setIsUploading(false);
            }, 2000);
          } else {
            handleUploadExcel();
          }
        }}
        onSetFileName={setExcelFileName}
      />

      {/* Vendor Contact Modal */}
      <VendorContactModal
        visible={showVendorContactModal}
        vendor={selectedVendor}
        onClose={() => setShowVendorContactModal(false)}
      />
    </View>
  );
}
