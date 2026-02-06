import { useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { type RelativePathString } from "expo-router";

type RSVPStatus = "All" | "Confirmed" | "Pending";
type GuestStatus = "Going" | "Pending" | "Not Going";

interface Guest {
  id: string;
  name: string;
  initials: string;
  avatar?: string;
  relation?: string;
  phone?: string;
  dietaryRestrictions?: string[];
  hasPlusOne: boolean;
  status: GuestStatus;
  category?: string;
}

// ============================================
// BACKEND INTEGRATION NOTES:
// ============================================
// 1. API Endpoints:
//    - GET /api/events/{id}/guests - Get guest list
//    - POST /api/events/{id}/guests - Add new guest
//    - PUT /api/guests/{id} - Update guest
//    - DELETE /api/guests/{id} - Delete guest
//
// 2. Guest Data Fields:
//    - name: Guest full name
//    - relation: Family, Friend, Colleague, etc.
//    - phone: Contact number
//    - status: Going/Pending/Not Going
// ============================================

const guestsData: Guest[] = [
  {
    id: "1",
    name: "Priya Sharma",
    initials: "PS",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB--T3hlmaUPe1nkyPSaDvWNywMflSEaIln6Jd_fxEzHVDNZiNn9LaiQ3LPJ10P7zUj_RmcaoL0L-hYsdQD0pZX2z0j0mVCNO1JXLTfoE14txTsMBcs2reltFdX6m6Zp79e_aJ9gby2EeYq89l3QPJp397ulpBoFF74LIn3cDC6Kq9K0-7oG5duAlrEhpI_j1tdOJfZo2e0zraD5BzK49gOhgOoXgNxYbX5jr83XTgDztLMNXfabWaS-4g2ZhwxDe8DvDHd4VrVDNE",
    relation: "Friend",
    phone: "+91 98765 43210",
    dietaryRestrictions: ["Vegetarian"],
    hasPlusOne: true,
    status: "Going",
    category: "Groom's Colleague",
  },
  {
    id: "2",
    name: "Rahul Kapoor",
    initials: "RK",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuASp_dQWEiTm4HrOaD1W0IvYQR5RNkVUT07upBDZTNy-pWGqVRsE9i-ZWenPB55z9CAZCO_jr73ikPbuX2LUksvn-oy5wSFJM8HGogVb294eWJ1VGRUMsgks-Q2bor1M5Neja5eRWvRLgJ-u6Gj_Sj8HYOuvf_HBo3Z8A46DMtg-srQALATZNUHJu0uVSh4SYjG1LKHarCbLZJaVn3nWY9qqeHQiGAPgseDUmw9Q-0GFFS1kLRlkkIR7nMVBVgRLOHryFbbqdiD3Yw",
    relation: "Family",
    phone: "+91 98765 43211",
    hasPlusOne: false,
    status: "Going",
  },
  {
    id: "3",
    name: "Sarah Jenkins",
    initials: "SJ",
    avatar: undefined,
    relation: "Friend",
    phone: "+1 555-123-4567",
    dietaryRestrictions: ["Gluten-free"],
    hasPlusOne: false,
    status: "Pending",
  },
  {
    id: "4",
    name: "Mike Ross",
    initials: "MR",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDFZsiIRYoBahyVsWDta69-bveLb9zIX5oaxyp7a0WhEkGUvNd_DMHtPWpWQOqHq8ND7K5V2rGVQ_a5yQbiofEB10Ka1_E3KMysdk7TrJ96MpNpeh1bExor1hQZTDiBegkduy-Y4-HWKv6LAIj-vJd12tQZ8nVy4IGl7OmosSPxWUhpQkG7KjvaMRMB3nutFOivg5_tV8uAkow4TDGYXCn3BZOT7FgUSmkk8ejLH44WZrhxcovUhpuOWSJQsYncl-44aFePDR-4sM",
    relation: "Colleague",
    phone: "+1 555-234-5678",
    hasPlusOne: true,
    status: "Pending",
    category: "Groom's Colleague",
  },
  {
    id: "5",
    name: "Amara Singh",
    initials: "AS",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdMA7i_1GDWxSQ3hJ960VCgcMZczNnTmaSXHfq8jAJTiubUL0hAsY_q3a-GvCqhVmRX1fxmE9o4regPfn2oSd3RTUYFCR7dotbtmdYHlT-5J-0EB6WPy2eDjylVrL-BNY8FdR1UK3eMZRM8K9KrE2_qzV4jvIyZ9RGis8zvc6nhFl5oBQOSN4fiPhrg-1X_yAF4epzSeiRLV7by04RWs2Zx1_QH9-_gzD7CWdLpFaTetTCQG-t600CNnDC1PJ_EufnZfyxPhWhhr8",
    relation: "Family",
    phone: "+91 98765 43212",
    dietaryRestrictions: ["Vegan", "Nut allergy"],
    hasPlusOne: false,
    status: "Going",
  },
];

const getStatusColor = (status: GuestStatus) => {
  switch (status) {
    case "Going":
      return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
    case "Pending":
      return "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400";
    case "Not Going":
      return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const RelationChip = ({ relation, isSelected, onPress }: { relation: string; isSelected: boolean; onPress: () => void }) => (
  <TouchableOpacity
    className={`px-4 py-2 rounded-full border ${
      isSelected
        ? "bg-primary border-primary"
        : "bg-white border-gray-200"
    }`}
    onPress={onPress}
  >
    <Text className={`text-sm font-medium ${
      isSelected ? "text-white" : "text-gray-600"
    }`}>
      {relation}
    </Text>
  </TouchableOpacity>
);

const GuestCard = ({ guest }: { guest: Guest }) => (
  <TouchableOpacity
    className="relative flex-row items-center justify-between gap-4 rounded-xl bg-white p-3 shadow-sm border border-gray-100 active:opacity-80"
    onPress={() => router.push(`/guests/${guest.id}` as RelativePathString)}
    activeOpacity={0.8}
  >
    <View className="flex-row items-center gap-4 flex-1 min-w-0">
      {guest.avatar ? (
        <Image
          source={{ uri: guest.avatar }}
          className="h-14 w-14 shrink-0 rounded-full"
          resizeMode="cover"
        />
      ) : (
        <View className="h-14 w-14 shrink-0 rounded-full bg-orange-100 items-center justify-center">
          <Text className="text-orange-600 font-bold text-xl">
            {guest.initials}
          </Text>
        </View>
      )}
      <View className="flex-col justify-center flex-1 min-w-0">
        <View className="flex-row items-center gap-2">
          <Text className="truncate text-base font-bold text-gray-900">
            {guest.name}
          </Text>
          {guest.hasPlusOne && (
            <Text className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
              +1
            </Text>
          )}
        </View>
        <View className="flex-row items-center gap-2">
          {guest.relation && (
            <Text className="text-xs text-gray-500">{guest.relation}</Text>
          )}
          {guest.phone && (
            <Text className="text-xs text-gray-400">• {guest.phone}</Text>
          )}
        </View>
        {guest.dietaryRestrictions && guest.dietaryRestrictions.length > 0 ? (
          <View className="flex-row items-center gap-1 flex-wrap mt-1">
            {guest.dietaryRestrictions.map((restriction, index) => (
              <Text key={index} className="text-xs text-gray-500">
                {index > 0 && " • "}
                {restriction === "Vegan" ? (
                  <Text className="text-primary font-medium">{restriction}</Text>
                ) : (
                  restriction
                )}
              </Text>
            ))}
          </View>
        ) : null}
        {guest.category && (
          <Text className="text-xs text-gray-400 mt-0.5">{guest.category}</Text>
        )}
      </View>
    </View>
    <View className="shrink-0 flex-col items-center gap-1">
      <View className={`h-8 w-8 rounded-full items-center justify-center ${getStatusColor(guest.status)}`}>
        <Ionicons
          name={guest.status === "Going" ? "checkmark" : "time"}
          size={20}
          color={guest.status === "Going" ? "#16A34A" : "#EA580C"}
        />
      </View>
      <Text className={`text-[10px] font-medium ${guest.status === "Going" ? "text-green-600" : "text-orange-600"}`}>
        {guest.status === "Going" ? "Going" : "Pending"}
      </Text>
    </View>
  </TouchableOpacity>
);

export default function GuestListPage() {
  const [activeTab, setActiveTab] = useState<RSVPStatus>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [guests, setGuests] = useState<Guest[]>(guestsData);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New guest form state
  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestRelation, setNewGuestRelation] = useState("");
  const [newGuestPhone, setNewGuestPhone] = useState("");

  const relations = ["Family", "Friend", "Colleague", "Neighbor", "Relative", "Other"];

  const confirmedCount = guests.filter((g) => g.status === "Going").length;
  const totalGuests = guests.reduce((acc, g) => acc + (g.hasPlusOne ? 2 : 1), 0);
  const confirmedGuests = guests
    .filter((g) => g.status === "Going")
    .reduce((acc, g) => acc + (g.hasPlusOne ? 2 : 1), 0);

  const filteredGuests = guests.filter((guest) => {
    const matchesTab = activeTab === "All" || 
      (activeTab === "Confirmed" && guest.status === "Going") ||
      (activeTab === "Pending" && guest.status === "Pending");
    const matchesSearch = guest.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleAddGuest = () => {
    if (!newGuestName.trim()) return;

    // TODO: Backend Integration - POST /api/events/{id}/guests
    const newGuest: Guest = {
      id: Date.now().toString(),
      name: newGuestName.trim(),
      initials: newGuestName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
      relation: newGuestRelation || undefined,
      phone: newGuestPhone || undefined,
      hasPlusOne: false,
      status: "Pending",
    };

    setGuests(prev => [...prev, newGuest]);
    
    // Reset form and close modal
    setNewGuestName("");
    setNewGuestRelation("");
    setNewGuestPhone("");
    setShowAddModal(false);
  };

  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewGuestName("");
    setNewGuestRelation("");
    setNewGuestPhone("");
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light">
      {/* Top App Bar */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <TouchableOpacity
          className="h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-black/5 dark:active:bg-white/10"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#181114" />
        </TouchableOpacity>
        <View className="flex-col items-center">
          <Text className="text-lg font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
            Guest List
          </Text>
          <Text className="text-xs font-medium text-primary">Wedding of Maya & Liam</Text>
        </View>
        <TouchableOpacity className="h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-black/5 dark:active:bg-white/10">
          <Ionicons name="ellipsis-horizontal" size={24} color="#181114" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="px-4 py-2">
        <View className="flex-row items-center h-12 rounded-xl bg-white px-3 shadow-sm border border-gray-100">
          <Ionicons name="search" size={24} color="#9CA3AF" />
          <TextInput
            className="flex-1 h-full px-3 text-base text-gray-900 placeholder:text-gray-400"
            placeholder="Search guests by name..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Segmented Control */}
      <View className="px-4 py-2">
        <View className="flex-row h-10 w-full rounded-lg bg-gray-100 p-1">
          {(["All", "Confirmed", "Pending"] as RSVPStatus[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              className={`flex-1 items-center justify-center rounded-md ${activeTab === tab ? "bg-white shadow-sm" : ""}`}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                className={`text-sm font-semibold ${
                  activeTab === tab
                    ? "text-primary"
                    : "text-gray-500"
                }`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Summary Text */}
      <View className="px-6 py-2">
        <Text className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          {totalGuests} Guests • {confirmedCount} Confirmed
        </Text>
      </View>

      {/* Guest List */}
      <ScrollView
        className="flex-1 px-4 pt-1 pb-24"
        showsVerticalScrollIndicator={false}
      >
        {filteredGuests.map((guest) => (
          <GuestCard key={guest.id} guest={guest} />
        ))}

        {filteredGuests.length === 0 && (
          <View className="flex-col items-center justify-center py-20">
            <Ionicons name="people-outline" size={64} color="#D1D5DB" />
            <Text className="text-lg font-bold text-gray-500 mt-4">No guests found</Text>
            <Text className="text-sm text-gray-400 mt-1">Try adjusting your search</Text>
          </View>
        )}

        {/* Bottom spacer for FAB */}
        <View className="h-24" />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        className="absolute bottom-6 right-6 z-30 w-14 h-14 items-center justify-center rounded-full bg-primary shadow-xl"
        onPress={handleOpenAddModal}
      >
        <Ionicons name="person-add" size={28} color="white" />
      </TouchableOpacity>

      {/* Add Guest Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseAddModal}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 pb-8 max-h-[85%]">
            {/* Handle Bar */}
            <View className="w-16 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
            
            {/* Header */}
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-gray-900">Add New Guest</Text>
              <TouchableOpacity onPress={handleCloseAddModal} className="p-2">
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Form */}
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Name Input */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Guest Name *</Text>
                <TextInput
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-base"
                  placeholder="Enter guest name"
                  placeholderTextColor="#9CA3AF"
                  value={newGuestName}
                  onChangeText={setNewGuestName}
                />
              </View>

              {/* Phone Input */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Phone Number</Text>
                <TextInput
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-base"
                  placeholder="Enter phone number"
                  placeholderTextColor="#9CA3AF"
                  value={newGuestPhone}
                  onChangeText={setNewGuestPhone}
                  keyboardType="phone-pad"
                />
              </View>

              {/* Relation Selection */}
              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-700 mb-3">Relationship</Text>
                <View className="flex-row flex-wrap gap-2">
                  {relations.map((relation) => (
                    <RelationChip
                      key={relation}
                      relation={relation}
                      isSelected={newGuestRelation === relation}
                      onPress={() => setNewGuestRelation(relation)}
                    />
                  ))}
                </View>
              </View>

              {/* Add Button */}
              <TouchableOpacity
                className={`w-full py-4 rounded-xl items-center ${
                  newGuestName.trim() 
                    ? "bg-primary" 
                    : "bg-gray-300"
                }`}
                onPress={handleAddGuest}
                disabled={!newGuestName.trim()}
              >
                <Text className="text-white font-bold text-base">Add Guest</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
