import { CategoryChip } from "@/src/components/onboarding/CategoryChip";
import { Text } from "@/src/components/ui/Text";
import { useSubmitRsvpResponse } from "@/src/features/events/hooks/use-event";
import {
  useCreateEventGuestCategory,
  useGetEventGuestCategories,
  useRemoveInvitation,
} from "@/src/features/guests/api/use-guests";
import { useGuestDetailStore } from "@/src/features/guests/store/useGuestDetailStore";
import { formatDate, formatTime } from "@/src/utils/helper";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

type CategoryPriority = 1 | 2 | 3;

const PRIORITY_OPTIONS: Array<{ label: string; value: CategoryPriority }> = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
];

const formatDisplayValue = (value?: string) => {
  if (!value) return "-";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export default function ViewGuestDetail() {
  const router = useRouter();
  const guestDetail = useGuestDetailStore((state) => state.guestDraft);

  const statusValue = guestDetail?.event_guest?.status?.toLowerCase?.() ?? "";
  const isConfirmed = statusValue === "accepted" || statusValue === "confirmed";

  const eventId = Number(guestDetail?.event_guest?.eventId ?? 0);
  const { mutate: submitRsvpResponse, isPending } =
    useSubmitRsvpResponse(eventId);
  const removeInvitationMutation = useRemoveInvitation();
  const createCategoryMutation = useCreateEventGuestCategory();

  const {
    data: guestCategories = [],
    isLoading: isGuestCategoriesLoading,
  } = useGetEventGuestCategories(eventId || null);

  const initialRoom = guestDetail?.event_guest?.assigned_room ?? "";
  const initialArrivalInfo =
    guestDetail?.event_guest?.arrival_info ??
    guestDetail?.event_guest?.pickup_info ??
    "";
  const initialDepartureInfo = guestDetail?.event_guest?.departure_info ?? "";
  const initialCategory = guestDetail?.event_guest?.category ?? "";
  const initialNotes = guestDetail?.event_guest?.notes ?? "";

  const [isEditMode, setIsEditMode] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [newCategoryPriority, setNewCategoryPriority] =
    useState<CategoryPriority>(1);
  const [assignedRoom, setAssignedRoom] = useState(initialRoom);
  const [arrivalInfo, setArrivalInfo] = useState(initialArrivalInfo);
  const [departureInfo, setDepartureInfo] = useState(initialDepartureInfo);
  const [category, setCategory] = useState(initialCategory);
  const [notes, setNotes] = useState(initialNotes);

  const categoryOptions = useMemo(
    () =>
      guestCategories.map((item) => ({
        label: item.label,
        value: item.value,
      })),
    [guestCategories]
  );

  const hasAssignmentChanges = useMemo(() => {
    return (
      assignedRoom.trim() !== initialRoom.trim() ||
      arrivalInfo.trim() !== initialArrivalInfo.trim() ||
      departureInfo.trim() !== initialDepartureInfo.trim() ||
      category.trim().toLowerCase() !== initialCategory.trim().toLowerCase() ||
      notes.trim() !== initialNotes.trim()
    );
  }, [
    assignedRoom,
    arrivalInfo,
    departureInfo,
    category,
    notes,
    initialRoom,
    initialArrivalInfo,
    initialDepartureInfo,
    initialCategory,
    initialNotes,
  ]);

  const handleSaveAssignments = () => {
    if (
      !guestDetail?.event_guest ||
      !guestDetail?.user_detail?.id ||
      !eventId
    ) {
      return;
    }

    const payload = {
      userId: guestDetail.user_detail.id,
      familyId: guestDetail.event_guest.familyId,
      isAccomodation: guestDetail.event_guest.isAccomodation ?? undefined,
      isArrivalPickupRequired:
        guestDetail.event_guest.isArrivalPickupRequired ?? undefined,
      isDeparturePickupRequired:
        guestDetail.event_guest.isDeparturePickupRequired ?? undefined,
      assigned_room: assignedRoom.trim() || null,
      arrival_info: arrivalInfo.trim() || null,
      departure_info: departureInfo.trim() || null,
      notes: notes.trim(),
      category: category.trim() || undefined,
      role: category.trim() || undefined,
    };

    submitRsvpResponse(payload, {
      onSuccess: () => {
        setIsEditMode(false);
        router.back();
      },
    });
  };

  const handleDeleteGuest = () => {
    if (!guestDetail?.user_detail?.id || !eventId) {
      Alert.alert("Error", "Missing event or guest id.");
      return;
    }

    const displayName =
      guestDetail.user_detail.username?.trim() ||
      guestDetail.user_detail.email ||
      "this guest";

    Alert.alert(
      "Remove guest",
      `Remove ${displayName}'s invitation from this event?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await removeInvitationMutation.mutateAsync({
                eventId,
                guestId: guestDetail.user_detail.id,
              });
              router.back();
            } catch (error: any) {
              const message =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to remove guest. Please try again.";
              Alert.alert("Error", message);
            }
          },
        },
      ]
    );
  };

  const handleCreateCategory = async () => {
    if (!eventId) {
      Alert.alert("Error", "Invalid event id");
      return;
    }

    const trimmedTitle = newCategoryTitle.trim();
    if (!trimmedTitle) {
      Alert.alert("Error", "Please enter category type.");
      return;
    }

    try {
      await createCategoryMutation.mutateAsync({
        eventId,
        payload: {
          category_title: trimmedTitle,
          priority: newCategoryPriority,
        },
      });

      setCategory(trimmedTitle);
      setNewCategoryTitle("");
      setNewCategoryPriority(1);
      setCategoryModalVisible(false);
      Alert.alert("Success", "Guest category created successfully.");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create guest category.";
      Alert.alert("Error", message);
    }
  };


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 16 : 0}
    >
      <SafeAreaView className="flex-1 bg-white" edges={[]}>
        <Modal
          transparent
          animationType="fade"
          visible={categoryModalVisible}
          onRequestClose={() => setCategoryModalVisible(false)}
        >
          <View className="flex-1 bg-black/35 items-center justify-center px-6">
            <View className="w-full rounded-xl bg-white p-5" style={{ gap: 14 }}>
              <Text className="text-lg font-bold text-[#1a1b3a]">
                Add Guest Category
              </Text>

              <View style={{ gap: 8 }}>
                <Text className="text-xs font-semibold tracking-wide text-[#1a1b3a]">
                  CATEGORY TYPE
                </Text>
                <TextInput
                  className="h-12 w-full rounded-md border border-slate-200 bg-white px-3 text-base text-slate-900"
                  placeholder="e.g. friend"
                  placeholderTextColor="#94a3b8"
                  value={newCategoryTitle}
                  onChangeText={setNewCategoryTitle}
                />
              </View>

              <View style={{ gap: 8 }}>
                <Text className="text-xs font-semibold tracking-wide text-[#1a1b3a]">
                  PRIORITY (1-3)
                </Text>
                <View className="flex-row" style={{ gap: 8 }}>
                  {PRIORITY_OPTIONS.map((option) => {
                    const isActive = newCategoryPriority === option.value;
                    return (
                      <Pressable
                        key={option.value}
                        className={`flex-1 items-center justify-center rounded-md border py-2.5 ${
                          isActive
                            ? "border-primary bg-primary/10"
                            : "border-slate-200 bg-white"
                        }`}
                        onPress={() => setNewCategoryPriority(option.value)}
                      >
                        <Text
                          className={`font-semibold ${
                            isActive ? "text-primary" : "text-slate-700"
                          }`}
                        >
                          {option.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View className="flex-row" style={{ gap: 10 }}>
                <Pressable
                  className="flex-1 items-center justify-center rounded-md border border-slate-200 py-3"
                  onPress={() => setCategoryModalVisible(false)}
                  disabled={createCategoryMutation.isPending}
                >
                  <Text className="font-semibold text-slate-600">Cancel</Text>
                </Pressable>
                <Pressable
                  className="flex-1 items-center justify-center rounded-md bg-[#ee2b8c] py-3"
                  onPress={handleCreateCategory}
                  disabled={createCategoryMutation.isPending}
                >
                  <Text className="font-semibold text-white">
                    {createCategoryMutation.isPending ? "Saving..." : "Save"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingBottom: 35,
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          extraScrollHeight={240}
          scrollEnabled={true}
        >
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <LinearGradient
              colors={["rgba(238,43,140,0.07)", "transparent"]}
              className="items-center px-6 pt-8 pb-8"
            >
              {!isConfirmed ? (
                <TouchableOpacity
                  onPress={handleDeleteGuest}
                  className="absolute right-4 top-4 p-2 rounded-full bg-white"
                  activeOpacity={0.8}
                  style={{
                    shadowColor: "#000",
                    shadowOpacity: 0.12,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                onPress={() => setIsEditMode((prev) => !prev)}
                className={`absolute ${isConfirmed ? "right-4" : "right-16"} top-4 p-2 rounded-full bg-white`}
                activeOpacity={0.8}
                style={{
                  shadowColor: "#000",
                  shadowOpacity: 0.12,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Ionicons
                  name={isEditMode ? "close-outline" : "create-outline"}
                  size={18}
                  color="#EE2B8C"
                />
              </TouchableOpacity>

              <View className="relative">
                <View
                  className="w-32 h-32 rounded-full bg-primary border-4 border-white items-center justify-center"
                  style={{
                    shadowColor: "#000",
                    shadowOpacity: 0.15,
                    shadowRadius: 12,
                    elevation: 4,
                  }}
                >
                  <Text variant="h1" className="text-white text-4xl">
                    {guestDetail?.user_detail.username
                      ? guestDetail.user_detail.username
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)
                      : "US"}
                  </Text>
                </View>
                <View className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white bg-emerald-500" />
              </View>

              <Text
                variant="h1"
                className="text-slate-900 text-2xl mt-4 text-center"
              >
                {guestDetail?.user_detail.username || "User Name"}
              </Text>
              <Text variant="h2" className="text-primary text-sm mt-1">
                {isConfirmed ? "Confirmed" : "Pending"} •{" "}
                {category || guestDetail?.event_guest.category || "Guest"}
              </Text>
            </LinearGradient>

            <View className="flex-row gap-3 px-6 pb-6 border-b border-primary/5">
              <TouchableOpacity
                className="flex-1 bg-primary py-2.5 rounded-xl flex-row items-center justify-center gap-2"
                activeOpacity={0.8}
                style={{
                  shadowColor: "#EE2B8C",
                  shadowOpacity: 0.25,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 4 },
                  elevation: 4,
                }}
              >
                <Ionicons name="chatbubble-outline" size={16} color="#fff" />
                <Text variant="h2" className="text-white text-sm">
                  Message
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-primary/10 py-2.5 rounded-xl flex-row items-center justify-center gap-2"
                activeOpacity={0.8}
              >
                <Ionicons name="call-outline" size={16} color="#EE2B8C" />
                <Text variant="h2" className="text-primary text-sm">
                  Call
                </Text>
              </TouchableOpacity>
            </View>

            <View className="px-6 pt-6 pb-10 gap-8">
              <View>
                <View className="flex-row items-center gap-2 mb-4">
                  <Ionicons
                    name="person-circle-outline"
                    size={20}
                    color="#EE2B8C"
                  />
                  <Text
                    variant="caption"
                    className="text-xs font-bold uppercase tracking-widest"
                  >
                    Guest Requirements
                  </Text>
                </View>
                <View className="bg-slate-50 rounded-2xl px-4">
                  {[
                    {
                      label: "Category",
                      value: category || guestDetail?.event_guest?.category || "Uncategorized",
                      pill: true,
                    },
                    {
                      label: "Arrival Time",
                      value: guestDetail?.event_guest?.arrival_date_time
                        ? formatTime(
                            guestDetail?.event_guest?.arrival_date_time ??
                              undefined
                          )
                        : "TBD",
                      pill: false,
                    },
                    {
                      label: "Arrival Date",
                      value: formatDate(
                        guestDetail?.event_guest?.arrival_date_time ?? undefined
                      ),
                      pill: false,
                    },
                    {
                      label: "Departure Time",
                      value: guestDetail?.event_guest?.departure_date_time
                        ? formatTime(
                            guestDetail?.event_guest?.departure_date_time ??
                              undefined
                          )
                        : "TBD",
                      pill: false,
                    },
                    {
                      label: "Departure Date",
                      value: formatDate(
                        guestDetail?.event_guest?.departure_date_time ??
                          undefined
                      ),
                      pill: false,
                    },
                    {
                      label: "Accommodation",
                      value: `${guestDetail?.event_guest.isAccomodation ? "Room Needed" : "Room not needed"}`,
                      pill: true,
                    },
                    {
                      label: "Arrival Pickup",
                      value: `${guestDetail?.event_guest.isArrivalPickupRequired ? "Required" : "Not Required"}`,
                      pill: true,
                    },
                    {
                      label: "Departure Pickup",
                      value: `${guestDetail?.event_guest.isDeparturePickupRequired ? "Required" : "Not Required"}`,
                      pill: true,
                    },
                 
                  ].map((row, i, arr) => (
                    <View
                      key={i}
                      className={`flex-row justify-between items-center py-3 ${i < arr.length - 1 ? "border-b border-slate-100" : ""}`}
                    >
                      <Text variant="body" className="text-slate-500 text-sm">
                        {row.label}
                      </Text>
                      {row.pill ? (
                        <View className="bg-primary/10 px-3 py-1 rounded-full">
                          <Text variant="h2" className="text-primary text-xs">
                            {formatDisplayValue(row.value)}
                          </Text>
                        </View>
                      ) : (
                        <Text variant="h2" className="text-slate-900 text-sm">
                          {formatDisplayValue(row.value)}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>

                {isEditMode && (
                  <View className="mt-3">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text variant="caption" className="text-[11px] uppercase text-slate-500">
                        Edit Category
                      </Text>
                      <Pressable
                        onPress={() => setCategoryModalVisible(true)}
                        className="flex-row items-center"
                        style={{ gap: 4 }}
                      >
                        <Ionicons name="add-circle-outline" size={16} color="#ee2b8c" />
                        <Text className="text-xs font-semibold text-[#ee2b8c]">
                          Add category
                        </Text>
                      </Pressable>
                    </View>
                    <View className="flex-row flex-wrap gap-2">
                      {categoryOptions.map((option) => {
                        const isActive =
                          category?.toLowerCase() === option.value.toLowerCase();
                        return (
                          <CategoryChip
                            key={option.value}
                            label={option.label}
                            isActive={isActive}
                            onPress={() => setCategory(option.value)}
                          />
                        );
                      })}
                    </View>

                    {!isGuestCategoriesLoading && !categoryOptions.length ? (
                      <Text className="text-xs text-slate-500 mt-2">
                        No guest category found for this event. Use “Add category”.
                      </Text>
                    ) : null}
                  </View>
                )}
              </View>

              <View className="bg-white border border-slate-200 p-4 rounded-2xl mb-3">
                <View className="flex-row justify-between items-start">
                  <View className="flex-row gap-3 flex-1">
                    <View className="p-2 bg-primary/5 rounded-xl">
                      <Ionicons name="book-outline" size={24} color="#EE2B8C" />
                    </View>
                    <View>
                      <Text variant="caption" className="text-xs mb-0.5">
                        Notes
                      </Text>
                      <Text variant="h2" className="text-slate-900 text-sm">
                        {notes ||
                          "No additional notes"}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    className="p-1.5 rounded-lg"
                    activeOpacity={0.7}
                  ></TouchableOpacity>
                </View>

                {isEditMode && (
                  <TextInput
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Add internal note"
                    placeholderTextColor="#94a3b8"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    className="w-full mt-3 bg-slate-50 rounded-md p-4 text-sm text-slate-900"
                  />
                )}
              </View>

              {(guestDetail?.event_guest?.isAccomodation ||
                guestDetail?.event_guest?.isArrivalPickupRequired ||
                guestDetail?.event_guest?.isDeparturePickupRequired) && (
                <View>
                  <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center gap-2">
                      <Ionicons
                        name="shield-checkmark-outline"
                        size={20}
                        color="#EE2B8C"
                      />
                      <Text
                        variant="caption"
                        className="text-xs font-bold uppercase tracking-widest"
                      >
                        Host Assignments
                      </Text>
                    </View>
                    <View className="bg-slate-100 px-2 py-0.5 rounded">
                      <Text
                        variant="caption"
                        className="text-[10px] uppercase font-bold"
                      >
                        Internal Use
                      </Text>
                    </View>
                  </View>

                  {guestDetail.event_guest.isAccomodation && (
                    <View className="bg-white border border-slate-200 p-4 rounded-2xl mb-3">
                      <View className="flex-row items-center gap-2 mb-3">
                        <Ionicons
                          name="bed-outline"
                          size={20}
                          color="#EE2B8C"
                        />
                        <Text variant="caption" className="text-xs">
                          Room Assigned
                        </Text>
                      </View>
                      <TextInput
                        value={assignedRoom}
                        onChangeText={setAssignedRoom}
                        editable={isEditMode}
                        placeholder="Assign room"
                        placeholderTextColor="#94a3b8"
                        className="w-full bg-slate-50 rounded-md p-4 text-sm text-slate-900"
                      />
                    </View>
                  )}

                  {guestDetail.event_guest.isArrivalPickupRequired && (
                    <View className="bg-white border border-slate-200 p-4 rounded-2xl mb-3">
                      <View className="flex-row items-center gap-2 mb-3">
                        <Ionicons
                          name="car-outline"
                          size={20}
                          color="#EE2B8C"
                        />
                        <Text variant="caption" className="text-xs">
                          Arrival Pickup Assigned
                        </Text>
                      </View>
                      <TextInput
                        value={arrivalInfo}
                        onChangeText={setArrivalInfo}
                        editable={isEditMode}
                        placeholder="Driver / pickup details"
                        placeholderTextColor="#94a3b8"
                        className="w-full bg-slate-50 rounded-md p-4 text-sm text-slate-900"
                      />
                    </View>
                  )}

                  {guestDetail.event_guest.isDeparturePickupRequired && (
                    <View className="bg-white border border-slate-200 p-4 rounded-2xl mb-3">
                      <View className="flex-row items-center gap-2 mb-3">
                        <Ionicons
                          name="car-sport-outline"
                          size={20}
                          color="#EE2B8C"
                        />
                        <Text variant="caption" className="text-xs">
                          Departure Pickup Assigned
                        </Text>
                      </View>
                      <TextInput
                        value={departureInfo}
                        onChangeText={setDepartureInfo}
                        editable={isEditMode}
                        placeholder="Driver / departure details"
                        placeholderTextColor="#94a3b8"
                        className="w-full bg-slate-50 rounded-md p-4 text-sm text-slate-900"
                      />
                    </View>
                  )}

                  <TouchableOpacity
                    className="bg-primary py-3 rounded-xl items-center justify-center"
                    activeOpacity={0.85}
                    onPress={handleSaveAssignments}
                    disabled={isPending || !hasAssignmentChanges || !isEditMode}
                    style={{
                      opacity:
                        isPending || !hasAssignmentChanges || !isEditMode
                          ? 0.6
                          : 1,
                    }}
                  >
                    {isPending ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text variant="h2" className="text-white text-sm">
                        Save Changes
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
