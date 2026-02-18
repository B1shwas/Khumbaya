import { Ionicons } from "@expo/vector-icons";
import * as Contacts from "expo-contacts";
import * as DocumentPicker from "expo-document-picker";
import {
  router,
  type RelativePathString
} from "expo-router";
import { useCallback, useState } from "react";
import {
  ActionSheetIOS,
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type RSVPStatus = "All" | "Confirmed" | "Pending" | "Not Invited";
type GuestStatus = "Going" | "Pending" | "Not Going" | "Not Invited";
type CategoryType =
  | "All"
  | "Family"
  | "Friend"
  | "Colleague"
  | "Relative"
  | "Neighbor"
  | "Other";
type InvitationStatus = "All" | "Invited" | "Not Invited";
type SortOption = "name" | "recent" | "status";

interface Guest {
  id: string;
  name: string;
  initials: string;
  avatar?: string;
  relation?: string;
  phone?: string;
  email?: string;
  dietaryRestrictions?: string[];
  hasPlusOne: boolean;
  plusOneName?: string;
  status: GuestStatus;
  category?: string;
  invitedAt?: string;
  source: "manual" | "excel" | "contact";
  createdAt?: string;
}

// ============================================
// BACKEND INTEGRATION NOTES:
// ============================================
// 1. API Endpoints:
//    - GET /api/events/{id}/guests - Get guest list
//    - POST /api/events/{id}/guests - Add new guest
//    - POST /api/events/{id}/guests/import - Import from Excel
//    - POST /api/events/{id}/guests/import-contacts - Import from contacts
//    - PUT /api/guests/{id} - Update guest
//    - DELETE /api/guests/{id} - Delete guest
//    - POST /api/guests/{id}/send-invite - Send invitation
// ============================================

const guestsData: Guest[] = [
  {
    id: "1",
    name: "Priya Sharma",
    initials: "PS",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB--T3hlmaUPe1nkyPSaDvWNywMflSEaIln6Jd_fxEzHVDNZiNn9LaiQ3LPJ10P7zUj_RmcaoL0L-hYsdQD0pZX2z0j0mVCNO1JXLTfoE14txTsMBcs2reltFdX6m6Zp79e_aJ9gby2EeYq89l3QPJp397ulpBoFF74LIn3cDC6Kq9K0-7oG5duAlrEhpI_j1tdOJfZo2e0zraD5BzK49gOhgOoXgNxYbX5jr83XTgDztLMNXfabWaS-4g2ZhwxDe8DvDHd4VrVDNE",
    relation: "Friend",
    phone: "+91 98765 43210",
    dietaryRestrictions: ["Vegetarian"],
    hasPlusOne: true,
    status: "Going",
    category: "Groom's Colleague",
    source: "manual",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Rahul Kapoor",
    initials: "RK",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuASp_dQWEiTm4HrOaD1W0IvYQR5RNkVUT07upBDZTNy-pWGqVRsE9i-ZWenPB55z9CAZCO_jr73ikPbuX2LUksvn-oy5wSFJM8HGogVb294eWJ1VGRUMsgks-Q2bor1M5Neja5eRWvRLgJ-u6Gj_Sj8HYOuvf_HBo3Z8A46DMtg-srQALATZNUHJu0uVSh4SYjG1LKHarCbLZJaVn3nWY9qqeHQiGAPgseDUmw9Q-0GFFS1kLRlkkIR7nMVBVgRLOHryFbbqdiD3Yw",
    relation: "Family",
    phone: "+91 98765 43211",
    hasPlusOne: false,
    status: "Going",
    category: "Bride's Family",
    source: "manual",
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    name: "Sarah Jenkins",
    initials: "SJ",
    relation: "Friend",
    phone: "+1 555-123-4567",
    dietaryRestrictions: ["Gluten-free"],
    hasPlusOne: false,
    status: "Pending",
    category: "Bride's Friend",
    source: "excel",
    createdAt: "2024-01-18",
  },
  {
    id: "4",
    name: "Mike Ross",
    initials: "MR",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCDFZsiIRYoBahyVsWDta69-bveLb9zIX5oaxyp7a0WhEkGUvNd_DMHtPWpWQOqHq8ND7K5V2rGVQ_a5yQbiofEB10Ka1_E3KMysdk7TrJ96MpNpeh1bExor1hQZTDiBegkduy-Y4-HWKv6LAIj-vJd12tQZ8nVy4IGl7OmosSPxWUhpQkG7KjvaMRMB3nutFOivg5_tV8uAkow4TDGYXCn3BZOT7FgUSmkk8ejLH44WZrhxcovUhpuOWSJQsYncl-44aFePDR-4sM",
    relation: "Colleague",
    phone: "+1 555-234-5678",
    hasPlusOne: true,
    status: "Not Going",
    category: "Groom's Colleague",
    source: "contact",
    createdAt: "2024-01-20",
  },
  {
    id: "5",
    name: "Amara Singh",
    initials: "AS",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBdMA7i_1GDWxSQ3hJ960VCgcMZczNnTmaSXHfq8jAJTiubUL0hAsY_q3a-GvCqhVmRX1fxmE9o4regPfn2oSd3RTUYFCR7dotbtmdYHlT-5J-0EB6WPy2eDjylVrL-BNY8FdR1UK3eMZRM8K9KrE2_qzV4jvIyZ9RGis8zvc6nhFl5oBQOSN4fiPhrg-1X_yAF4epzSeiRLV7by04RWs2Zx1_QH9-_gzD7CWdLpFaTetTCQG-t600CNnDC1PJ_EufnZfyxPhWhhr8",
    relation: "Family",
    phone: "+91 98765 43212",
    dietaryRestrictions: ["Vegan", "Nut allergy"],
    hasPlusOne: false,
    status: "Going",
    category: "Groom's Family",
    source: "manual",
    createdAt: "2024-01-12",
  },
  {
    id: "6",
    name: "James Wilson",
    initials: "JW",
    relation: "Neighbor",
    phone: "+1 555-345-6789",
    hasPlusOne: false,
    status: "Not Invited",
    category: "Neighbor",
    source: "manual",
    createdAt: "2024-01-22",
  },
  {
    id: "7",
    name: "Emily Brown",
    initials: "EB",
    relation: "Friend",
    phone: "+1 555-456-7890",
    hasPlusOne: true,
    status: "Pending",
    category: "Bride's Friend",
    source: "excel",
    createdAt: "2024-01-25",
  },
  {
    id: "8",
    name: "David Lee",
    initials: "DL",
    relation: "Colleague",
    phone: "+1 555-567-8901",
    hasPlusOne: false,
    status: "Going",
    category: "Groom's Colleague",
    source: "manual",
    createdAt: "2024-01-08",
  },
];

// Stats Card Component
const StatsCard = ({
  label,
  value,
  icon,
  color,
  bgColor,
}: {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  bgColor: string;
}) => (
  <View className="flex-1 mx-1">
    <View className={`${bgColor} rounded-2xl p-3`}>
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-xs text-gray-500 font-medium">{label}</Text>
          <Text className={`text-xl font-bold ${color} mt-1`}>{value}</Text>
        </View>
        <View className={`${bgColor.replace("bg-", "bg-opacity-20 ")} p-2 rounded-full`}>
          <Ionicons name={icon as any} size={20} color={color} />
        </View>
      </View>
    </View>
  </View>
);

const getStatusColor = (status: GuestStatus) => {
  switch (status) {
    case "Going":
      return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
    case "Pending":
      return "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400";
    case "Not Going":
      return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
    case "Not Invited":
      return "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const getStatusBgColor = (status: GuestStatus) => {
  switch (status) {
    case "Going":
      return "#DCFCE7";
    case "Pending":
      return "#FFEDD5";
    case "Not Going":
      return "#FEE2E2";
    default:
      return "#F3F4F6";
  }
};

const getSourceInfo = (source: Guest["source"]) => {
  switch (source) {
    case "excel":
      return { icon: "document-text-outline", color: "#10B981", label: "Excel" };
    case "contact":
      return { icon: "people-outline", color: "#3B82F6", label: "Contacts" };
    default:
      return { icon: "person-outline", color: "#8B5CF6", label: "Manual" };
  }
};

const RelationChip = ({
  relation,
  isSelected,
  onPress,
}: {
  relation: string;
  isSelected: boolean;
  onPress: () => void;
}) => (
  <Pressable
    className={`p-4 py-6 rounded-full w-fit  ${isSelected
      ? "bg-primary border-primary"
      : "bg-white border-gray-200"
      }`}
    onPress={onPress}
  >
    <Text
      className={`text-xs font-medium ${isSelected ? "text-white" : "text-gray-600"
        }`}
    >
      {relation}
    </Text>
  </Pressable>

);

const QuickAction = ({
  icon,
  label,
  color,
  onPress,
}: {
  icon: string;
  label: string;
  color: string;
  onPress: () => void;
}) => (
  <TouchableOpacity className="items-center" onPress={onPress}>
    <View
      className="w-12 h-12 rounded-full items-center justify-center mb-1"
      style={{ backgroundColor: `${color}15` }}
    >
      <Ionicons name={icon as any} size={22} color={color} />
    </View>
    <Text className="text-xs font-medium text-gray-600">{label}</Text>
  </TouchableOpacity>
);

const GuestCard = ({
  guest,
  onPress,
  onSendInvite,
}: {
  guest: Guest;
  onPress: () => void;
  onSendInvite: () => void;
}) => {
  const sourceInfo = getSourceInfo(guest.source);
  const statusBgColor = getStatusBgColor(guest.status);

  return (
    <TouchableOpacity
      className="relative flex-row items-center justify-between gap-3 rounded-xl bg-white p-3 shadow-sm border border-gray-100 active:opacity-80 mb-2"
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Left Line Indicator */}
      <View
        className="absolute left-0 top-2 bottom-2 w-1 rounded-l-xl"
        style={{ backgroundColor: statusBgColor }}
      />

      <View className="flex-row items-center gap-3 flex-1 min-w-0 pl-3">
        {guest.avatar ? (
          <Image
            source={{ uri: guest.avatar }}
            className="h-12 w-12 shrink-0 rounded-full"
            resizeMode="cover"
          />
        ) : (
          <View className="h-12 w-12 shrink-0 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 items-center justify-center">
            <Text className="text-orange-600 font-bold text-lg">
              {guest.initials}
            </Text>
          </View>
        )}
        <View className="flex-col justify-center flex-1 min-w-0">
          <View className="flex-row items-center gap-2 flex-wrap">
            <Text className="text-sm font-bold text-gray-900 truncate">
              {guest.name}
            </Text>
            {guest.hasPlusOne && (
              <Text className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                +1
              </Text>
            )}
          </View>
          <View className="flex-row items-center gap-2 mt-0.5">
            {guest.relation && (
              <Text className="text-xs text-gray-500">{guest.relation}</Text>
            )}
            {guest.phone && (
              <Text className="text-xs text-gray-400">{guest.phone}</Text>
            )}
          </View>
          {guest.dietaryRestrictions &&
            guest.dietaryRestrictions.length > 0 ? (
            <View className="flex-row items-center gap-1 flex-wrap mt-1">
              {guest.dietaryRestrictions.map((restriction, index) => (
                <View
                  key={index}
                  className="flex-row items-center gap-1 px-1.5 py-0.5 rounded bg-gray-50"
                >
                  <Ionicons name="leaf-outline" size={10} color="#6B7280" />
                  <Text className="text-[10px] text-gray-500">{restriction}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </View>

      <View className="shrink-0 flex-col items-end gap-1">
        <View
          className={`h-7 w-7 rounded-full items-center justify-center`}
          style={{ backgroundColor: statusBgColor }}
        >
          <Ionicons
            name={
              guest.status === "Going"
                ? "checkmark"
                : guest.status === "Not Going"
                  ? "close"
                  : guest.status === "Not Invited"
                    ? "mail-outline"
                    : "time"
            }
            size={16}
            color={
              guest.status === "Going"
                ? "#16A34A"
                : guest.status === "Not Going"
                  ? "#DC2626"
                  : guest.status === "Not Invited"
                    ? "#9CA3AF"
                    : "#EA580C"
            }
          />
        </View>

        {/* Quick Action Buttons */}
        {guest.status === "Not Invited" && (
          <TouchableOpacity
            className="flex-row items-center gap-1 px-2 py-1 rounded-full bg-primary/10"
            onPress={onSendInvite}
          >
            <Ionicons name="send" size={12} color="#ee2b8c" />
            <Text className="text-[10px] font-medium text-primary">Invite</Text>
          </TouchableOpacity>
        )}

        {/* Source indicator */}
        <View className="flex-row items-center gap-1 px-1.5 py-0.5 rounded-full bg-gray-50">
          <Ionicons name={sourceInfo.icon as any} size={10} color={sourceInfo.color} />
          <Text className="text-[10px] font-medium text-gray-400">{sourceInfo.label}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Quick Stats Row
const StatsRow = ({
  going,
  pending,
  notGoing,
  notInvited,
}: {
  going: number;
  pending: number;
  notGoing: number;
  notInvited: number;
}) => (
  <View className="px-4 py-2">
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <StatsCard
        label="Going"
        value={going}
        icon="checkmark-circle"
        color="#16A34A"
        bgColor="bg-green-100"
      />
      <StatsCard
        label="Pending"
        value={pending}
        icon="time"
        color="#EA580C"
        bgColor="bg-orange-100"
      />
      <StatsCard
        label="Not Going"
        value={notGoing}
        icon="close-circle"
        color="#DC2626"
        bgColor="bg-red-100"
      />
      <StatsCard
        label="Not Invited"
        value={notInvited}
        icon="mail-outline"
        color="#6B7280"
        bgColor="bg-gray-100"
      />
    </ScrollView>
  </View>
);

// Category Pills
const CategoryPills = ({
  categories,
  selected,
  onSelect,
}: {
  categories: CategoryType[];
  selected: CategoryType;
  onSelect: (cat: CategoryType) => void;
}) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    className="px-4 py-3"
    contentContainerStyle={{ alignItems: 'center' }}
  >
    {categories.map((cat) => (
      <RelationChip
        key={cat === "All" ? "all" : cat}
        relation={cat === "All" ? "All" : cat}
        isSelected={selected === cat}
        onPress={() => onSelect(cat)}
      />
    ))}
  </ScrollView>
);
export default function GuestListPage() {
  // const params = useLocalSearchParams();
  const params = 1;
  const eventId = params || 1;

  const [activeTab, setActiveTab] = useState<RSVPStatus>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [guests, setGuests] = useState<Guest[]>(guestsData);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("All");
  const [selectedInvitation, setSelectedInvitation] = useState<InvitationStatus>("All");
  const [isImporting, setIsImporting] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [refreshing, setRefreshing] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);

  // New guest form state
  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestRelation, setNewGuestRelation] = useState("");
  const [newGuestPhone, setNewGuestPhone] = useState("");
  const [newGuestEmail, setNewGuestEmail] = useState("");

  const relations = [
    "Family",
    "Friend",
    "Colleague",
    "Neighbor",
    "Relative",
    "Other",
  ];

  // Calculate stats
  const goingCount = guests.filter((g) => g.status === "Going").length;
  const pendingCount = guests.filter((g) => g.status === "Pending").length;
  const notGoingCount = guests.filter((g) => g.status === "Not Going").length;
  const notInvitedCount = guests.filter((g) => g.status === "Not Invited").length;
  const totalGuests = guests.reduce((acc, g) => acc + (g.hasPlusOne ? 2 : 1), 0);
  const invitedGuests = guests.filter((g) => g.status !== "Not Invited").length;

  const filteredGuests = guests
    .filter((guest) => {
      const matchesTab =
        activeTab === "All" ||
        (activeTab === "Confirmed" && guest.status === "Going") ||
        (activeTab === "Pending" &&
          (guest.status === "Pending" || guest.status === "Not Going")) ||
        (activeTab === "Not Invited" && guest.status === "Not Invited");

      const matchesSearch = guest.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || guest.relation === selectedCategory;

      const matchesInvitation =
        selectedInvitation === "All" ||
        (selectedInvitation === "Invited" && guest.status !== "Not Invited") ||
        (selectedInvitation === "Not Invited" && guest.status === "Not Invited");

      return matchesTab && matchesSearch && matchesCategory && matchesInvitation;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "recent") {
        return (b.createdAt || "").localeCompare(a.createdAt || "");
      } else {
        return a.status.localeCompare(b.status);
      }
    });

  const categories: CategoryType[] = [
    "All",
    ...Array.from(
      new Set(guests.map((g) => g.relation).filter(Boolean))
    ),
  ] as CategoryType[];

  const handleAddGuest = () => {
    if (!newGuestName.trim()) return;

    const newGuest: Guest = {
      id: Date.now().toString(),
      name: newGuestName.trim(),
      initials: newGuestName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
      relation: newGuestRelation || undefined,
      phone: newGuestPhone || undefined,
      email: newGuestEmail || undefined,
      hasPlusOne: false,
      status: "Not Invited",
      source: "manual",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setGuests((prev) => [...prev, newGuest]);

    setNewGuestName("");
    setNewGuestRelation("");
    setNewGuestPhone("");
    setNewGuestEmail("");
    setShowAddModal(false);

    Alert.alert("Success", "Guest added successfully!");
  };

  const handleImportExcel = async () => {
    try {
      setIsImporting(true);

      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
          "text/csv",
        ],
      });

      if (result.canceled) {
        setIsImporting(false);
        return;
      }

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

      setGuests((prev) => [...prev, ...importedGuests]);

      Alert.alert(
        "Import Successful",
        `Imported ${importedGuests.length} guests from Excel file.`
      );
    } catch (error) {
      Alert.alert("Import Failed", "Could not import guests from file.");
    } finally {
      setIsImporting(false);
    }
  };

  const handleImportContacts = async () => {
    try {
      setIsImporting(true);

      const { status } = await Contacts.requestPermissionsAsync();

      if (status === "denied") {
        Alert.alert(
          "Permission Required",
          "Please allow access to contacts to import guests."
        );
        setIsImporting(false);
        return;
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
      });

      if (data.length === 0) {
        Alert.alert("No Contacts", "No contacts found on your device.");
        setIsImporting(false);
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
        status: "Not Invited" as GuestStatus,
        relation: "Contact",
        source: "contact" as const,
        createdAt: new Date().toISOString().split("T")[0],
      }));

      setGuests((prev) => [...prev, ...contactGuests]);

      Alert.alert(
        "Contacts Imported",
        `Imported ${contactGuests.length} guests from your contacts.`
      );
    } catch (error) {
      Alert.alert("Import Failed", "Could not import contacts.");
    } finally {
      setIsImporting(false);
    }
  };

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

  const handleSendInvite = (guestId: string) => {
    setGuests((prev) =>
      prev.map((g) =>
        g.id === guestId ? { ...g, status: "Pending" as GuestStatus } : g
      )
    );
    Alert.alert("Invite Sent", "Invitation has been sent to the guest.");
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background-light">
      {/* Top App Bar */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity
          className="h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-gray-100"
          onPress={() => router.back()}
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
          onPress={() => setShowFilterSidebar(true)}
        >
          <Ionicons name="options" size={24} color="#181114" />
        </TouchableOpacity>
      </View>

      {/* Stats Row */}
      <StatsRow
        going={goingCount}
        pending={pendingCount}
        notGoing={notGoingCount}
        notInvited={notInvitedCount}
      />

      {/* Search Bar with Sort */}
      <View className="px-4 py-2 ">
        <View className="flex-row items-center h-12 rounded-xl bg-white px-3 shadow-sm border border-gray-100">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 h-full px-3 text-base text-gray-900 "
            placeholder="Search guests..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className="ml-2 p-2 rounded-lg bg-gray-50"
            onPress={() => setShowSortOptions(!showSortOptions)}
          >
            <Ionicons
              name="funnel-outline"
              size={20}
              color={sortBy !== "name" ? "#ee2b8c" : "#6B7280"}
            />
          </TouchableOpacity>
        </View>

        {/* Sort Options Dropdown */}
        {showSortOptions && (
          <View className="absolute top-14 right-4 z-50 bg-white rounded-xl shadow-lg border border-gray-100 p-2 w-40">
            {[
              { label: "By Name", value: "name" },
              { label: "Recently Added", value: "recent" },
              { label: "By Status", value: "status" },
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                className={`px-3 py-2 rounded-lg flex-row items-center justify-between ${sortBy === option.value ? "bg-primary/10" : ""
                  }`}
                onPress={() => {
                  setSortBy(option.value as SortOption);
                  setShowSortOptions(false);
                }}
              >
                <Text
                  className={`text-sm font-medium ${sortBy === option.value ? "text-primary" : "text-gray-700"
                    }`}
                >
                  {option.label}
                </Text>
                {sortBy === option.value && (
                  <Ionicons name="checkmark" size={16} color="#ee2b8c" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Category Pills */}
      <CategoryPills
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      /> 

      {/* Quick Actions */}
      <View className="px-6 py-2 flex-row justify-between items-center ">
        <Text className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          {filteredGuests.length} Guests
        </Text>
        <View className="flex-row items-center gap-4">
          <QuickAction
            icon="mail-outline"
            label="Invite All"
            color="#ee2b8c"
            onPress={() =>
              Alert.alert(
                "Send Invites",
                `Send invitations to ${notInvitedCount} guests?`
              )
            }
          />
          <QuickAction
            icon="people-outline"
            label="Groups"
            color="#3B82F6"
            onPress={() => router.push("/groups" as RelativePathString)}
          />
          <QuickAction
            icon="document-text-outline"
            label="Export"
            color="#10B981"
            onPress={() =>
              Alert.alert("Export", "Export guest list to file.")
            }
          />
        </View>
      </View>

      {/* Active Filters */}
      {(selectedCategory !== "All" || selectedInvitation !== "All") && (
        <View className="px-4 py-2 flex-row items-center gap-2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {selectedCategory !== "All" && (
              <View className="flex-row items-center gap-1 px-3 py-1 rounded-full bg-primary/10">
                <Text className="text-xs font-medium text-primary">
                  {selectedCategory}
                </Text>
                <TouchableOpacity onPress={() => setSelectedCategory("All")}>
                  <Ionicons name="close" size={12} color="#ee2b8c" />
                </TouchableOpacity>
              </View>
            )}
            {selectedInvitation !== "All" && (
              <View className="flex-row items-center gap-1 px-3 py-1 rounded-full bg-gray-100">
                <Text className="text-xs font-medium text-gray-600">
                  {selectedInvitation}
                </Text>
                <TouchableOpacity onPress={() => setSelectedInvitation("All")}>
                  <Ionicons name="close" size={12} color="#6B7280" />
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {/* Segmented Control */}
      <View className="px-4 py-2">
        <View className="flex-row h-10 w-full rounded-lg bg-gray-100 p-1">
          {(["All", "Confirmed", "Pending", "Not Invited"] as RSVPStatus[]).map(
            (tab) => (
              <TouchableOpacity
                key={tab}
                className={`flex-1 items-center justify-center rounded-md ${activeTab === tab ? "bg-white shadow-sm" : ""
                  }`}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  className={`text-xs font-semibold ${activeTab === tab ? "text-primary" : "text-gray-500"
                    }`}
                >
                  {tab === "Not Invited" ? "Not Invited" : tab}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>

      {/* Guest List */}
      <FlatList
        data={filteredGuests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GuestCard
            guest={item}
            onPress={() => router.push(`/guests/${item.id}` as RelativePathString)}
            onSendInvite={() => handleSendInvite(item.id)}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
              {searchQuery
                ? "Try adjusting your search or filters"
                : "Add guests to get started with your event planning"}
            </Text>
            <TouchableOpacity
              className="mt-4 px-6 py-2 rounded-full bg-primary"
              onPress={() => setShowAddModal(true)}
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
        >
          <Ionicons name="cloud-upload" size={28} color="white" />
        </TouchableOpacity>
      )}

      {/* Add Guest FAB (smaller, left side) */}
      <TouchableOpacity
        className="absolute bottom-6 left-6 z-30 w-12 h-12 items-center justify-center rounded-full bg-white shadow-xl border border-gray-100"
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="person-add" size={24} color="#ee2b8c" />
      </TouchableOpacity>

      {/* Add Guest Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 pb-8 max-h-[85%]">
            <View className="w-16 h-1 bg-gray-200 rounded-full mx-auto mb-6" />

            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-gray-900">Add New Guest</Text>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                className="p-2"
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Guest Name *
                </Text>
                <TextInput
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-base"
                  placeholder="Enter guest name"
                  placeholderTextColor="#9CA3AF"
                  value={newGuestName}
                  onChangeText={setNewGuestName}
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Email
                </Text>
                <TextInput
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-base"
                  placeholder="Enter email address"
                  placeholderTextColor="#9CA3AF"
                  value={newGuestEmail}
                  onChangeText={setNewGuestEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </Text>
                <TextInput
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-base"
                  placeholder="Enter phone number"
                  placeholderTextColor="#9CA3AF"
                  value={newGuestPhone}
                  onChangeText={setNewGuestPhone}
                  keyboardType="phone-pad"
                />
              </View>

              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-700 mb-3">
                  Relationship
                </Text>
                <View className="flex-row flex-wrap gap-2 ">
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

              <TouchableOpacity
                className={`w-full py-4 rounded-xl items-center ${newGuestName.trim() ? "bg-primary" : "bg-gray-300"
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

      {/* Filter Sidebar Modal */}
      <Modal
        visible={showFilterSidebar}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterSidebar(false)}
      >
        <View className="flex-1 flex-row">
          <Pressable
            className="flex-1 bg-black/30"
            onPress={() => setShowFilterSidebar(false)}
          />
          <View className="w-72 bg-white shadow-2xl p-4 pt-12">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-gray-900">Filters</Text>
              <TouchableOpacity
                onPress={() => setShowFilterSidebar(false)}
                className="p-2"
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="mb-6">
                <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Invitation Status
                </Text>
                <View className="flex-col gap-2">
                  {[
                    { label: "All Guests", value: "All", count: guests.length },
                    {
                      label: "Invited",
                      value: "Invited",
                      count: invitedGuests,
                    },
                    {
                      label: "Not Invited",
                      value: "Not Invited",
                      count: notInvitedCount,
                    },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      className={`flex-row items-center justify-between px-3 py-2 rounded-lg ${selectedInvitation === option.value
                        ? "bg-primary/10"
                        : ""
                        }`}
                      onPress={() =>
                        setSelectedInvitation(option.value as InvitationStatus)
                      }
                    >
                      <View className="flex-row items-center gap-2">
                        <View
                          className={`w-4 h-4 rounded-full border-2 ${selectedInvitation === option.value
                            ? "border-primary bg-primary"
                            : "border-gray-300"
                            }`}
                        />
                        <Text
                          className={`text-sm font-medium ${selectedInvitation === option.value
                            ? "text-primary"
                            : "text-gray-700"
                            }`}
                        >
                          {option.label}
                        </Text>
                      </View>
                      <Text className="text-xs text-gray-400">
                        {option.count}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View className="mb-6">
                <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Sort By
                </Text>
                <View className="flex-col gap-2">
                  {[
                    { label: "Name (A-Z)", value: "name" },
                    { label: "Recently Added", value: "recent" },
                    { label: "By Status", value: "status" },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      className={`flex-row items-center justify-between px-3 py-2 rounded-lg ${sortBy === option.value ? "bg-primary/10" : ""
                        }`}
                      onPress={() => {
                        setSortBy(option.value as SortOption);
                        setShowFilterSidebar(false);
                      }}
                    >
                      <Text
                        className={`text-sm font-medium ${sortBy === option.value
                          ? "text-primary"
                          : "text-gray-700"
                          }`}
                      >
                        {option.label}
                      </Text>
                      {sortBy === option.value && (
                        <Ionicons name="checkmark" size={16} color="#ee2b8c" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                className="mt-4 py-3 px-4 rounded-lg bg-gray-100 items-center"
                onPress={() => {
                  setSelectedCategory("All");
                  setSelectedInvitation("All");
                }}
              >
                <Text className="text-sm font-semibold text-gray-600">
                  Clear All Filters
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
