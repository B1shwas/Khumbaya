import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { VehicleSummaryCard } from "../../components/logistics/VehicleSummaryCard";
import { MOCK_VEHICLE_SUMMARY } from "../../constants/logistics";
import { useAssignVehicle, useGetVehicleAssignement, useGuestTransportation } from "../../features/logistics/hooks/use-transport";
import { LogisticsTimelineItem } from "../../features/logistics/type";
import { cn } from "../../utils/cn";
import { formatDate, formatTime } from "../../utils/helper";

type AssignTransportFormValues = {
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime: Date;
  dropoffTime: Date;
};

export default function ManageVehicleScreen() {
  const router = useRouter();
  const { eventId, vehicleId } = useLocalSearchParams<{
    eventId?: string
    vehicleId?: string
  }>();


  const [activeTab, setActiveTab] = React.useState<"timeline" | "assign">("timeline");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isAssignModalOpen, setIsAssignModalOpen] = React.useState(false);
  const [selectedGuestId, setSelectedGuestId] = React.useState<number | null>(null);
  const [showPickupPicker, setShowPickupPicker] = React.useState(false);
  const [showDropoffPicker, setShowDropoffPicker] = React.useState(false);
  const [pickerMode, setPickerMode] = React.useState<"date" | "time">("date");

  const { data: guests, isLoading: guestsLoading } = useGuestTransportation(eventId ?? "");
  const { data: assignedVehicles, isLoading: assignedLoading } = useGetVehicleAssignement(vehicleId ?? "");
  console.log('This is the data for the assigne vehicle data ', assignedVehicles);
  const assignVehicleMutation = useAssignVehicle(eventId ?? "");

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<AssignTransportFormValues>({
    defaultValues: {
      pickupLocation: "",
      dropoffLocation: "",
      pickupTime: new Date(),
      dropoffTime: new Date(),
    },
    mode: "onTouched",
  });

  const pickupTime = watch("pickupTime");
  const dropoffTime = watch("dropoffTime");

  const timelineAssignments = React.useMemo<LogisticsTimelineItem[]>(() => {
    return assignedVehicles || [];
  }, [assignedVehicles]);

  const toDate = (value?: string | Date | null) => {
    if (!value) return null;
    const parsed = value instanceof Date ? value : new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const getAssignmentStatus = (assignment: LogisticsTimelineItem) => {
    const now = new Date();
    const start = assignment.pickupTime;
    const end = assignment.dropoffTime;

    if (start && now < start) return "Upcoming";
    if (start && end && now >= start && now <= end) return "On Route";
    if (end && now > end) return "Completed";
    return "Scheduled";
  };

  const getStatusStyles = (status: string) => {
    if (status === "Completed") return { badge: "bg-surface-container-high", text: "text-on-surface-variant/70" };
    if (status === "On Route") return { badge: "bg-primary/10", text: "text-primary" };
    return { badge: "bg-zinc-100", text: "text-zinc-700" };
  };

  const filteredGuests = React.useMemo(() => {
    if (!guests) return [];
    return guests.filter(guest =>
      guest.invitation_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (guest.arrival_info && guest.arrival_info.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [guests, searchQuery]);

  const tabs: { label: string; value: "timeline" | "assign" }[] = [
    { label: "Timeline", value: "timeline" },
    { label: "Assign Guest", value: "assign" },
  ];

  const resetAssignForm = () => {
    setSelectedGuestId(null);
    reset({
      pickupLocation: "",
      dropoffLocation: "",
      pickupTime: new Date(),
      dropoffTime: new Date(),
    });
    setShowPickupPicker(false);
    setShowDropoffPicker(false);
    setPickerMode("date");
  };

  const parseOptionalGuestDate = (value?: string | null) => {
    if (!value) return null;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const openAssignModal = (guest: {
    id: number;
    arrival_info?: string | null;
    departure_info?: string | null;
    arrival_date_time?: string | null;
    departure_date_time?: string | null;
  }) => {
    const pickupDefault = parseOptionalGuestDate(guest.arrival_date_time) ?? new Date();
    const dropoffDefault =
      parseOptionalGuestDate(guest.departure_date_time) ??
      new Date(pickupDefault.getTime() + 60 * 60 * 1000);

    setSelectedGuestId(guest.id);
    reset({
      pickupLocation: guest.arrival_info ?? "",
      dropoffLocation: guest.departure_info ?? "",
      pickupTime: pickupDefault,
      dropoffTime: dropoffDefault,
    });
    clearErrors();
    setIsAssignModalOpen(true);
  };

  const closeAssignModal = () => {
    setIsAssignModalOpen(false);
    resetAssignForm();
  };

  const onPickupTimeChange = (event: any, date?: Date) => {
    if (event.type === "dismissed") {
      setShowPickupPicker(false);
      setPickerMode("date");
      return;
    }

    if (date) {
      const updated = new Date(pickupTime);

      if (pickerMode === "date") {
        updated.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
        setValue("pickupTime", updated, { shouldDirty: true, shouldValidate: true });

        if (Platform.OS === "android") {
          setShowPickupPicker(false);
          setTimeout(() => {
            setPickerMode("time");
            setShowPickupPicker(true);
          }, 0);
        } else {
          setPickerMode("time");
        }
      } else {
        updated.setHours(date.getHours(), date.getMinutes());
        setValue("pickupTime", updated, { shouldDirty: true, shouldValidate: true });
        setShowPickupPicker(false);
        setPickerMode("date");
      }
    }
  };

  const onDropoffTimeChange = (event: any, date?: Date) => {
    if (event.type === "dismissed") {
      setShowDropoffPicker(false);
      setPickerMode("date");
      return;
    }

    if (date) {
      const updated = new Date(dropoffTime);

      if (pickerMode === "date") {
        updated.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
        setValue("dropoffTime", updated, { shouldDirty: true, shouldValidate: true });

        if (Platform.OS === "android") {
          setShowDropoffPicker(false);
          setTimeout(() => {
            setPickerMode("time");
            setShowDropoffPicker(true);
          }, 0);
        } else {
          setPickerMode("time");
        }
      } else {
        updated.setHours(date.getHours(), date.getMinutes());
        setValue("dropoffTime", updated, { shouldDirty: true, shouldValidate: true });
        setShowDropoffPicker(false);
        setPickerMode("date");
      }
    }
  };

  const assignVehicle = handleSubmit(async (values) => {
    const vehicleIdNumber = Number(vehicleId);

    if (!selectedGuestId) {
      Alert.alert("Missing guest", "Please select a guest first.");
      return;
    }

    if (!vehicleId || Number.isNaN(vehicleIdNumber)) {
      Alert.alert("Missing vehicle", "Vehicle id is missing from route params.");
      return;
    }

    if (values.dropoffTime <= values.pickupTime) {
      setError("dropoffTime", {
        type: "validate",
        message: "Drop-off time must be after pickup time.",
      });
      return;
    }

    clearErrors("dropoffTime");

    try {
      await assignVehicleMutation.mutateAsync({
        vehicleId: vehicleIdNumber,
        invitationId: selectedGuestId,
        pickupLocation: values.pickupLocation.trim(),
        dropoffLocation: values.dropoffLocation.trim(),
        pickupTime: values.pickupTime,
        dropoffTime: values.dropoffTime,
      });

      Alert.alert("Assigned", "Vehicle assigned successfully.");
      closeAssignModal();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to assign vehicle.";
      Alert.alert("Assignment failed", message);
    }
  });

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="px-4 py-2 border-b border-gray-100 bg-white z-50">
        <View className="flex-row items-center justify-between h-14 w-full">
          {/* Left: Back Button */}
          <Pressable
            onPress={() => router.back()}
            className="p-2 -ml-2 rounded-full active:bg-gray-50"
          >
            <MaterialIcons name="arrow-back" size={24} color="#ee2b8c" />
          </Pressable>

          {/* Center: Title (Absolute) */}
          <View className="absolute left-0 right-0 items-center justify-center pointer-events-none -z-10">
            <Text className="text-lg font-jakarta-bold text-gray-900 text-center">
              Vehicle Logistics
            </Text>
          </View>

          {/* Right: Spacer for symmetry */}
          <View className="w-10" />
        </View>
      </View>

      {/* Custom Tab Selector */}
      <View className="bg-surface-container-high/60 rounded-2xl p-1 h-11 mx-5 mt-4 flex-row items-center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <Pressable
              key={tab.value}
              onPress={() => setActiveTab(tab.value)}
              className={cn(
                "flex-1 items-center justify-center h-full rounded-xl",
                isActive ? "bg-primary" : "bg-transparent"
              )}
            >
              <Text
                className={cn(
                  "text-[10px] font-jakarta-bold uppercase tracking-wider",
                  isActive ? "text-white" : "text-on-surface-variant"
                )}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 40, paddingHorizontal: 20 }}
      >
        {activeTab === "timeline" ? (
          <>
            {/* Vehicle Summary Section */}
            <VehicleSummaryCard summary={MOCK_VEHICLE_SUMMARY} />

            {/* Timeline Header */}
            <View className="flex-row items-center justify-between mb-5 px-1">
              <Text className="text-xs font-jakarta-bold text-gray-400 uppercase tracking-[2px]">
                Today's Schedule
              </Text>
              <View className="bg-gray-100 px-2.5 py-1 rounded-lg">
                <Text className="text-[10px] font-jakarta-bold text-gray-500">
                  {timelineAssignments.length} TASKS
                </Text>
              </View>
            </View>

            {/* Timeline List */}
            {assignedLoading ? (
              <View className="flex-1 items-center justify-center py-20">
                <ActivityIndicator size="large" color="#ee2b8c" />
              </View>
            ) : timelineAssignments.length > 0 ? (
              timelineAssignments.map((assignment, index) => {
                const status = getAssignmentStatus(assignment);
                const statusStyles = getStatusStyles(status);

                const timeRange =
                  assignment.pickupTime && assignment.dropoffTime
                    ? `${formatDate(assignment.pickupTime.toISOString())} • ${formatTime(assignment.pickupTime.toISOString())} - ${formatTime(assignment.dropoffTime.toISOString())}`
                    : "Time not set";

                return (
                  <View
                    key={String(assignment.id ?? `${index}-${timeRange}`)}
                    className="bg-white rounded-2xl border border-gray-100 p-4 mb-3.5"
                  >
                    <View className="flex-row justify-between items-center mb-3">
                      <View className="flex-1 pr-3">
                        <Text className="text-[13px] font-jakarta-bold text-on-surface" numberOfLines={1}>
                          {assignment.vehicleName}
                        </Text>
                        <View className="flex-row items-center gap-1 mt-0.5">
                          <Text className="text-[10px] text-gray-500 font-jakarta-medium" numberOfLines={1}>
                            {assignment.driverName}
                          </Text>
                          <Text className="text-[10px] text-gray-300">•</Text>
                          <Text className="text-[10px] text-primary/70 font-jakarta-bold">
                            Guest: {assignment.guestName}
                          </Text>
                        </View>
                      </View>

                      <View className={cn("px-2.5 py-1 rounded-full", statusStyles.badge)}>
                        <Text className={cn("text-[9px] uppercase font-jakarta-bold tracking-wider", statusStyles.text)}>
                          {status}
                        </Text>
                      </View>
                    </View>

                    <Text className="text-[11px] text-primary font-jakarta-semibold mb-3">{timeRange}</Text>

                    <View className="bg-surface-container/50 rounded-xl p-3">
                      <View className="flex-row items-start gap-3 mb-2">
                        <View className="items-center mt-1">
                          <View className="w-2 h-2 rounded-full bg-primary z-10" />
                          <View className="w-[1px] h-8 bg-outline-variant absolute top-2" />
                        </View>
                        <View className="flex-1">
                          <Text className="text-[12px] font-jakarta-semibold text-on-surface">
                            Khumbaya , Kathmandu
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row items-start gap-3">
                        <View className="items-center mt-1">
                          <View className="w-2 h-2 rounded-full border-2 border-primary bg-white z-10" />
                        </View>
                        <View className="flex-1">
                          <Text className="text-[12px] font-jakarta-semibold text-on-surface">
                            Bharatpur , Chitwan
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })
            ) : (
              <View className="items-center justify-center py-20">
                <MaterialIcons name="directions-car" size={36} color="#9ca3af" />
                <Text className="text-gray-400 font-jakarta-medium text-sm mt-2">No assigned trips yet for this vehicle.</Text>
              </View>
            )}
          </>
        ) : guestsLoading ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#ee2b8c" />
          </View>
        ) : guests && guests.length > 0 ? (
          <View className="flex-1 py-4">
            {/* Search and Filter */}
            <View className="flex-row items-center gap-3 mb-6">
              <View className="flex-1 flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 h-12">
                <Ionicons name="search" size={20} color="#9ca3af" />
                <TextInput
                  placeholder="Search guests or locations..."
                  className="flex-1 ml-2 font-jakarta-medium text-sm text-gray-900"
                  placeholderTextColor="#9ca3af"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery !== "" && (
                  <TouchableOpacity onPress={() => setSearchQuery("")}>
                    <Ionicons name="close-circle" size={18} color="#9ca3af" />
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity className="w-12 h-12 bg-white border border-gray-100 rounded-2xl items-center justify-center shadow-sm">
                <Ionicons name="options-outline" size={20} color="#ee2b8c" />
              </TouchableOpacity>
            </View>

            {searchQuery && <View className="flex-row items-center justify-between mb-5 px-1">
              <Text className="text-xs font-jakarta-bold text-gray-400 uppercase tracking-[2px]">
                Search Results
              </Text>
              <View className="bg-gray-100 px-2.5 py-1 rounded-lg">
                <Text className="text-[10px] font-jakarta-bold text-gray-500">
                  {filteredGuests.length} GUESTS
                </Text>
              </View>
            </View>
            }

            {filteredGuests.length > 0 ? (
              filteredGuests.map((guest) => (
                <View
                  key={guest.id}
                  className="bg-white p-4 rounded-2xl mb-3 border border-gray-100 shadow-sm"
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                      <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
                        <Text className="text-primary font-jakarta-bold">
                          {guest.invitation_name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View>
                        <Text className="text-sm font-jakarta-bold text-gray-900">
                          {guest.invitation_name}
                        </Text>
                        <View className="flex-row items-center mt-0.5">
                          <Ionicons name="location-outline" size={12} color="#6b7280" />
                          <Text className="text-[10px] text-gray-500 font-jakarta ml-1">
                            {guest.arrival_info || "No arrival info"}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity className="bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10"
                      onPress={() => openAssignModal(guest)}>
                      <Text className="text-primary text-[10px] font-jakarta-bold uppercase">
                        Assign {guest.invitation_name}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View className="flex-row gap-4 mt-1 border-t border-gray-50 pt-3">
                    <View className="flex-1">
                      <Text className="text-[9px] font-jakarta-bold text-gray-400 uppercase mb-1">
                        Arrival
                      </Text>
                      <View className="flex-row items-center">
                        <View className={cn(
                          "w-2 h-2 rounded-full mr-1.5",
                          guest.isArrivalPickupRequired ? "bg-green-500" : "bg-gray-300"
                        )} />
                        <Text className="text-[11px] font-jakarta-semibold text-gray-700">
                          {guest.isArrivalPickupRequired ? "Pickup Needed" : "Self Arrival"}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-1">
                      <Text className="text-[9px] font-jakarta-bold text-gray-400 uppercase mb-1">
                        Departure
                      </Text>
                      <View className="flex-row items-center">
                        <View className={cn(
                          "w-2 h-2 rounded-full mr-1.5",
                          guest.isDeparturePickupRequired ? "bg-orange-500" : "bg-gray-300"
                        )} />
                        <Text className="text-[11px] font-jakarta-semibold text-gray-700">
                          {guest.isDeparturePickupRequired ? "Drop-off Needed" : "Self Departure"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View className="items-center justify-center py-20">
                <Ionicons name="search-outline" size={40} color="#9ca3af" />
                <Text className="text-gray-400 font-jakarta-medium text-sm mt-2">No guests match your search.</Text>
              </View>
            )}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center py-20">
            <View className="w-20 h-20 bg-gray-50 rounded-full items-center justify-center mb-4">
              <MaterialIcons name="person-add" size={32} color="#ee2b8c" />
            </View>
            <Text className="text-base font-jakarta-bold text-gray-900 mb-2">No Guest Assignments</Text>
            <Text className="text-sm text-gray-400 text-center font-jakarta-medium px-10">
              There are no guests requiring transportation services for this event currently.
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        transparent
        animationType="fade"
        visible={isAssignModalOpen}
        onRequestClose={closeAssignModal}
      >
        <View className="flex-1 bg-black/40 items-center justify-center px-5 ">
          <View className="w-full bg-white rounded-2xl p-5 border border-gray-100">
            <Text className="text-base font-jakarta-bold text-gray-900 mb-4">
              Assign Transport Details
            </Text>

            <Text className="text-[11px] font-jakarta-bold text-gray-500 uppercase mb-1 gap-2">Pickup Location</Text>
            <Controller
              control={control}
              name="pickupLocation"
              rules={{
                required: "Pickup location is required",
                validate: (value) => value.trim().length > 0 || "Pickup location is required",
              }}
              render={({ field: { value, onChange } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter pickup location"
                  className="h-11 border border-gray-200 rounded-md px-3 text-sm font-jakarta-medium text-gray-900"
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
            {errors.pickupLocation?.message && (
              <Text className="text-xs text-red-500 mt-1 mb-3">{errors.pickupLocation.message}</Text>
            )}

            <Text className="text-[11px] font-jakarta-bold text-gray-500 uppercase mb-1 gap-2">Drop-off Location</Text>
            <Controller
              control={control}
              name="dropoffLocation"
              rules={{
                required: "Drop-off location is required",
                validate: (value) => value.trim().length > 0 || "Drop-off location is required",
              }}
              render={({ field: { value, onChange } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter drop-off location"
                  className="h-11 border border-gray-200 rounded-md px-3 text-sm font-jakarta-medium text-gray-900"
                  placeholderTextColor="#9ca3af"
                />
              )}
            />
            {errors.dropoffLocation?.message && (
              <Text className="text-xs text-red-500 mt-1 mb-3">{errors.dropoffLocation.message}</Text>
            )}

            <View className="bg-white border border-gray-100 rounded-md p-4 shadow-sm mb-4 mt-3">
              <View className="flex-row items-center justify-between w-full mb-3">
                <View className="flex-row items-center gap-3">
                  <View className="w-3 h-3 rounded-full bg-primary" />
                  <Text className="text-sm text-zinc-600 font-medium">Pickup</Text>
                </View>
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => { setPickerMode("date"); setShowPickupPicker(true); }}
                    className="px-3 py-1.5 bg-zinc-100 rounded-full"
                  >
                    <Text className="text-zinc-700 text-xs font-medium">{formatDate(pickupTime.toISOString())}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => { setPickerMode("time"); setShowPickupPicker(true); }}
                    className="px-3 py-1.5 bg-zinc-100 rounded-full"
                  >
                    <Text className="text-zinc-700 text-xs font-medium">{formatTime(pickupTime.toISOString())}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className="w-full h-[1px] bg-zinc-100 ml-6 mb-3 " />

              <View className="flex-row items-center justify-between w-full">
                <View className="flex-row items-center gap-3">
                  <View className="w-3 h-3 rounded-full border-2 border-primary bg-white" />
                  <Text className="text-sm text-zinc-600 font-medium">Drop-off</Text>
                </View>
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => { setPickerMode("date"); setShowDropoffPicker(true); }}
                    className="px-3 py-1.5 bg-zinc-100 rounded-full"
                  >
                    <Text className="text-zinc-700 text-xs font-medium">{formatDate(dropoffTime.toISOString())}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => { setPickerMode("time"); setShowDropoffPicker(true); }}
                    className="px-3 py-1.5 bg-zinc-100 rounded-full"
                  >
                    <Text className="text-zinc-700 text-xs font-medium">{formatTime(dropoffTime.toISOString())}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {errors.dropoffTime?.message && (
              <Text className="text-xs text-red-500 mb-4">{errors.dropoffTime.message}</Text>
            )}

            {showPickupPicker && (
              <DateTimePicker
                value={pickupTime}
                mode={pickerMode}
                is24Hour={false}
                onChange={onPickupTimeChange}
              />
            )}

            {showDropoffPicker && (
              <DateTimePicker
                value={dropoffTime}
                mode={pickerMode}
                is24Hour={false}
                onChange={onDropoffTimeChange}
              />
            )}

            <View className="flex-row items-center justify-end gap-2">
              <TouchableOpacity
                onPress={closeAssignModal}
                className="px-4 py-2 rounded-xl border border-gray-200"
                disabled={assignVehicleMutation.isPending}
              >
                <Text className="text-gray-600 font-jakarta-semibold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={assignVehicle}
                disabled={assignVehicleMutation.isPending}
                className="px-4 py-2 rounded-xl bg-primary min-w-24 items-center"
              >
                {assignVehicleMutation.isPending ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-white font-jakarta-bold">Assign</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}