import { DatePicker } from "@/components/nativewindui/DatePicker";
import { Text } from "@/src/components/ui/Text";
import {
  EVENT_TYPES,
  EVENT_TYPE_TO_BACKEND,
  type Event,
} from "@/src/constants/event";
import { useUpdateEvent } from "@/src/features/events/hooks/use-event";
import { useEventStore } from "@/src/features/events/store/useEventStore";
import { shadowStyle } from "@/src/utils/helper";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type EditEventForm = {
  title: string;
  eventType: string;
  side: string;
  description: string;
  startDateTime: Date;
  endDateTime: Date;
  rsvpDeadline: Date;
  city: string;
  venue: string;
  theme: string;
  dressCode: string;
  budget: string;
  isPublic: boolean;
};
//TODO:TYPE mismatch with backend, also some fields are missing, need to confirm with backend team and update accordingly
const parseDate = (value?: string): Date => {
  if (!value) return new Date();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const buildInitialForm = (draft?: Event | null): EditEventForm => {
  const today = new Date();
  const normalizedType = draft?.type
    ? (EVENT_TYPE_TO_BACKEND[
      draft.type as keyof typeof EVENT_TYPE_TO_BACKEND
    ] ?? draft.type)
    : "";
  return {
    title: draft?.title ?? "",
    eventType: normalizedType ?? "",
    side: "",
    description: draft?.description ?? "",
    startDateTime: parseDate(draft?.startDateTime) ?? today,
    endDateTime: parseDate(draft?.endDateTime) ?? today,
    rsvpDeadline: today,
    city: draft?.location ?? "",
    venue: draft?.venue ?? "",
    theme: draft?.theme ?? "",
    dressCode: "",
    budget: typeof draft?.budget === "number" ? String(draft?.budget) : "",
    isPublic: true,
  };
};

const PRIMARY = "#ee2b8c";

type SectionCardProps = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
};

function SectionCard({ title, icon, children }: SectionCardProps) {
  return (
    <View className="rounded-md bg-white p-5 shadow-sm border border-slate-100">
      <View className="mb-4 flex-row items-center gap-2">
        <View className="h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#ee2b8c] to-[#ff5ca1]">
          <Ionicons name={icon} size={18} color="#ffffff" />
        </View>
        <Text className="text-lg font-bold text-[#181114]">{title}</Text>
      </View>
      <View className="gap-4">{children}</View>
    </View>
  );
}

type FieldProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (value: string) => void;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
};

function LabeledField({
  label,
  placeholder,
  value,
  onChangeText,
  multiline,
  numberOfLines,
  keyboardType,
}: FieldProps) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold tracking-wide text-[#1a1b3a]">
        {label}
      </Text>
      <TextInput
        className={`w-full rounded-md border border-slate-200 bg-white px-4 text-base text-slate-900 ${multiline ? "min-h-[112px] " : "h-14"
          }`}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
      />
    </View>
  );
}

type ToggleRowProps = {
  title: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

function ToggleRow({ title, description, value, onChange }: ToggleRowProps) {
  return (
    <View className="flex-row items-center justify-between rounded-md border border-[#ee2b8c]/10 bg-[#ee2b8c]/5 p-4">
      <View className="flex-row items-center gap-3">
        <View className="h-9 w-9 items-center justify-center rounded-lg bg-[#ee2b8c]/10">
          <MaterialIcons name="visibility" size={18} color={PRIMARY} />
        </View>
        <View>
          <Text className="text-sm font-bold text-[#181114]">{title}</Text>
          <Text className="text-[10px] uppercase tracking-wider text-slate-500">
            {description}
          </Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: "#cbd5e1", true: PRIMARY }}
        thumbColor="#ffffff"
      />
    </View>
  );
}

export default function EditEventScreen() {
  const router = useRouter();
  const { eventDraft } = useEventStore();
  const eventId = eventDraft?.id ? Number(eventDraft.id) : NaN;
  const { mutate: updateEvent, isPending: isUpdating } = useUpdateEvent(
    Number.isFinite(eventId) ? eventId : 0
  );
  const defaultValues = useMemo(
    () => buildInitialForm(eventDraft),
    [eventDraft]
  );
  const { control, setValue, watch, reset, handleSubmit } =
    useForm<EditEventForm>({
      defaultValues,
    });

  useEffect(() => {
    reset(buildInitialForm(eventDraft));
  }, [eventDraft, reset]);

  const startDateTime = watch("startDateTime");
  const endDateTime = watch("endDateTime");
  const rsvpDeadline = watch("rsvpDeadline");
  const selectedEventType = watch("eventType");

  const handleStartDateChange = (
    event: DateTimePickerEvent,
    pickedDate?: Date
  ) => {
    if (event.type === "dismissed" || !pickedDate) return;
    setValue("startDateTime", pickedDate);
  };

  const handleEndDateChange = (
    event: DateTimePickerEvent,
    pickedDate?: Date
  ) => {
    if (event.type === "dismissed" || !pickedDate) return;
    setValue("endDateTime", pickedDate);
  };

  const handleRsvpDateChange = (
    event: DateTimePickerEvent,
    pickedDate?: Date
  ) => {
    if (event.type === "dismissed" || !pickedDate) return;
    setValue("rsvpDeadline", pickedDate);
  };

  const handleUpdate = handleSubmit((values) => {
    if (!Number.isFinite(eventId)) {
      Alert.alert("Error", "Missing event id.");
      return;
    }

    const resolvedType =
      EVENT_TYPE_TO_BACKEND[
      values.eventType as keyof typeof EVENT_TYPE_TO_BACKEND
      ];

    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      type: resolvedType,
      startDateTime: values.startDateTime.toISOString(),
      endDateTime: values.endDateTime.toISOString(),
      location: values.city.trim() || undefined,
      theme: values.theme.trim() || undefined,
      budget: values.budget ? Number(values.budget) : undefined,
    };

    updateEvent(payload as any, {
      onSuccess: () => {
        Alert.alert("Success", "Event updated successfully.");
        router.back();
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update event.";
        Alert.alert("Error", message);
      },
    });
  });

  const handleDelete = () => {
    Alert.alert("Delete", "Wire this to your delete event flow.");
  };

  return (
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1 "
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-4 ">
            <View className="relative h-24 w-full overflow-hidden rounded-md">
              <Image
                source={{
                  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBOAnlcfOm-SbS8PZH_0v8eUP911cDeJ61o8WbBJAuIO9sHibeTvP7X8AmuAdoqjRH5H5lxVhH8QPcv3xssrkbNU4ebTPiF95SZrTOI_8iSYf67CtzoUpaJUP1BUw-RPzE1bsPZ6LNFe44iGEPcqpU2aHrZqux1E7HkSrdhWUHIs6U62w8DV_c_vNWmt1lkRU_uygfRbFoGRRRgJ8_l6Qt81nqPp2h4h74elXxwOgHx6Tj8hTriCh50fvjBjuTzs07EBBr6iMa6hRU",
                }}
                className="h-full w-full"
                resizeMode="cover"
              />
              {/* Gradient overlay */}
              <View className="absolute inset-0 overflow-hidden z-10">
                <LinearGradient
                  colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.1)", "transparent"]}
                  start={{ x: 0.5, y: 1 }}
                  end={{ x: 0.5, y: 0 }}
                  style={{ flex: 1 }}
                />
              </View>
              <Pressable
                onPress={() => Alert.alert("Cover", "Open image picker here.")}
                className="absolute inset-0 z-20 items-center justify-center"
              >
                <View className="flex-row items-center gap-2 rounded-full border border-white/30 bg-white/20 px-5 py-2">
                  <MaterialIcons
                    name="photo-camera"
                    size={20}
                    color="#ffffff"
                  />
                  <Text className="text-xs font-bold uppercase tracking-wider text-white">
                    Change Image
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>

          <View className="mt-6 gap-6 px-4">
            <SectionCard title="Basic Details" icon="information-circle">
              <Controller
                control={control}
                name="title"
                render={({ field: { value, onChange } }) => (
                  <LabeledField
                    label="Event Title"
                    placeholder="e.g. Aarav & Ishani's Sangeet Night"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              <View className="gap-2">
                <Text className="text-sm font-semibold tracking-wide text-[#1a1b3a]">
                  Event Type
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {EVENT_TYPES.map((type) => {
                    const isSelected = selectedEventType === type;
                    const chipClassName = isSelected
                      ? "px-5 py-2.5 rounded-full bg-[#ee2b8c] border border-[#ee2b8c]"
                      : "px-5 py-2.5 rounded-full bg-white border border-gray-200";
                    const textClassName = isSelected
                      ? "font-plusjakartasans-medium text-sm text-white"
                      : "font-plusjakartasans-medium text-sm text-gray-600";

                    return (
                      <TouchableOpacity
                        key={type}
                        onPress={() => setValue("eventType", type)}
                        className={chipClassName}
                      >
                        <Text className={textClassName}>{type}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
              <Controller
                control={control}
                name="description"
                render={({ field: { value, onChange } }) => (
                  <LabeledField
                    label="Description"
                    placeholder="Give guests a quick overview"
                    value={value}
                    onChangeText={onChange}
                    multiline
                    numberOfLines={4}
                  />
                )}
              />
            </SectionCard>

            <SectionCard title="Time & Logistics" icon="calendar">
              <View className="mt-2 mb-6">
                <DatePicker
                  value={startDateTime}
                  mode="datetime"
                  onChange={handleStartDateChange}
                  materialDateLabel="Start date"
                  materialTimeLabel="Start time"
                  materialDateLabelClassName="text-xs"
                />
              </View>
              <View className="mb-6">
                <DatePicker
                  value={endDateTime}
                  mode="datetime"
                  onChange={handleEndDateChange}
                  materialDateLabel="End date"
                  materialTimeLabel="End time"
                  materialDateLabelClassName="text-xs"
                />
              </View>
              <DatePicker
                value={rsvpDeadline}
                mode="datetime"
                onChange={handleRsvpDateChange}
                materialDateLabel="RSVP deadline"
                materialTimeLabel="RSVP time"
                materialDateLabelClassName="text-xs"
              />
              <View className="flex-row gap-4">
                <View className="flex-1">
                  <Controller
                    control={control}
                    name="city"
                    render={({ field: { value, onChange } }) => (
                      <LabeledField
                        label="City / Area"
                        placeholder="Udaipur, Rajasthan"
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />
                </View>
                <View className="flex-1">
                  <Controller
                    control={control}
                    name="venue"
                    render={({ field: { value, onChange } }) => (
                      <LabeledField
                        label="Venue Name"
                        placeholder="The Leela Palace"
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />
                </View>
              </View>
              <View className="h-28 w-full overflow-hidden rounded-md border border-slate-200">
                <Image
                  source={{
                    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsXGKMRLJ35_GbMDcozUWmZ04ZsCUF4hqolXbTjKxMZs4J2_16cNLqghLwwNSosYlDIt01M37Rog9lXSuwinI8iypxPY9Rx2z5Yuy6QOquSaBC_Wb9QgABYz6Mt6I2-PIbrlunei6pFyC_JxcTuGkwrZWJ-aVBQPMILrz8pIKNsA32urrRE8mh16zLRg-aL0JgxW4_aHQs-ns-P7eAEM9HUTcnZGOJiZJ3M4LgNr5lY_SQ5ognJpCZ9_taZa7KMpbjoK_3qfMJvgc",
                  }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              </View>
            </SectionCard>

            <SectionCard title="Aesthetics & Privacy" icon="color-palette">
              <View className="flex-row gap-4">
                <View className="flex-1">
                  <Controller
                    control={control}
                    name="theme"
                    render={({ field: { value, onChange } }) => (
                      <LabeledField
                        label="Event Theme"
                        placeholder="Royal Vintage"
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />
                </View>
                <View className="flex-1">
                  <Controller
                    control={control}
                    name="dressCode"
                    render={({ field: { value, onChange } }) => (
                      <LabeledField
                        label="Dress Code"
                        placeholder="Ethnic Festive"
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />
                </View>
              </View>
              <ToggleRow
                title="Public Visibility"
                description="Visible to all invited guests"
                value={watch("isPublic")}
                onChange={(value) => setValue("isPublic", value)}
              />
              <View className="gap-2">
                <Text className="text-sm font-semibold tracking-wide text-[#1a1b3a]">
                  Estimated Budget (INR)
                </Text>
                <View className="flex-row items-center rounded-md border border-slate-200 bg-white px-4 h-14">
                  <Text className="text-base font-semibold text-slate-400">
                    ₹
                  </Text>
                  <Controller
                    control={control}
                    name="budget"
                    render={({ field: { value, onChange } }) => (
                      <TextInput
                        className="flex-1 px-3 text-base font-semibold text-slate-900"
                        placeholder="1500000"
                        placeholderTextColor="#94a3b8"
                        value={value}
                        onChangeText={onChange}
                        keyboardType="numeric"
                      />
                    )}
                  />
                </View>
              </View>
            </SectionCard>

            <View className="mt-2">
              <TouchableOpacity
                className="w-full flex-row items-center justify-center rounded-md bg-[#ee2b8c] py-4"
                style={{
                  shadowColor: "#ee2b8c",
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  elevation: 6,
                }}
                activeOpacity={0.9}
                disabled={isUpdating}
                onPress={handleUpdate}
              >
                <Text className="text-base font-bold text-white">
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-between rounded-md border border-red-200 bg-red-50 p-4">
              <View>
                <Text className="text-sm font-bold text-red-600">
                  Cancel Event
                </Text>
                <Text className="text-[11px] text-red-400">
                  This action cannot be undone.
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleDelete}
                className="rounded-md px-4 py-2"
                activeOpacity={0.8}
              >
                <Text className="text-xs font-bold uppercase tracking-widest text-red-600">
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
  );
}
