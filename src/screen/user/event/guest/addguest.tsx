import { useInviteGuest } from "@/src/features/guests/api/use-guests";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Controller, useForm, type FieldErrors } from "react-hook-form";
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type AddGuestFormValues = {
  fullName: string;
  email: string;
  phone: string;
  familyName: string;
};

const AddGuestScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const inviteGuestMutation = useInviteGuest();

  const [inviteWithFamily, setInviteWithFamily] = useState(true);

  const eventId = useMemo(() => {
    const raw = Array.isArray(params.eventId)
      ? params.eventId[0]
      : params.eventId;
    const parsed = raw ? Number(raw) : NaN;
    return Number.isFinite(parsed) ? parsed : null;
  }, [params.eventId]);

  const { control, handleSubmit, reset } = useForm<AddGuestFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      familyName: "",
    },
  });

  const onValidSubmit = useCallback(
    async (values: AddGuestFormValues) => {
      if (!eventId) {
        Alert.alert("Error", "Invalid event id");
        return;
      }

      try {
        await inviteGuestMutation.mutateAsync({
          eventId,
          payload: {
            fullName: values.fullName.trim(),
            email: values.email.trim(),
            phone: values.phone.trim(),
            eventId,
            isFamily: inviteWithFamily,
          },
        });

        Alert.alert("Success", "Guest added successfully!");
        reset();
        router.back();
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to add guest. Please try again.";
        Alert.alert("Error", message);
      }
    },
    [eventId, inviteGuestMutation, inviteWithFamily, reset, router]
  );

  const onInvalidSubmit = useCallback(
    (errors: FieldErrors<AddGuestFormValues>) => {
      if (errors.fullName) {
        Alert.alert(
          "Error",
          errors.fullName.message ?? "Please enter a guest name"
        );
        return;
      }
      if (errors.email) {
        Alert.alert(
          "Error",
          errors.email.message ?? "Please enter a valid email"
        );
        return;
      }
      if (errors.phone) {
        Alert.alert(
          "Error",
          errors.phone.message ?? "Please enter a phone number"
        );
        return;
      }
    },
    []
  );

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pb-4 pt-8">
          <Text className="text-3xl font-bold tracking-tight text-[#1a1b3a]">
            New Guest
          </Text>
          <Text className="mt-1 text-sm text-slate-500">
            Fill in the details to send an official invitation.
          </Text>
        </View>

        <View className="flex flex-col gap-6 px-6" style={{ gap: 24 }}>
          <View style={{ gap: 8 }}>
            <Text className="text-sm font-semibold tracking-wide text-[#1a1b3a]">
              GUEST FULL NAME
            </Text>
            <Controller
              control={control}
              name="fullName"
              rules={{ required: "Please enter a guest name" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="h-14 w-full rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-900"
                  placeholder="e.g. Alexander Hamilton"
                  placeholderTextColor="#94a3b8"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          <View style={{ gap: 8 }}>
            <Text className="text-sm font-semibold tracking-wide text-[#1a1b3a]">
              EMAIL ADDRESS
            </Text>
            <Controller
              control={control}
              name="email"
              rules={{
                required: "Please enter a guest email",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="h-14 w-full rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-900"
                  placeholder="alexander@example.com"
                  placeholderTextColor="#94a3b8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          <View style={{ gap: 8 }}>
            <Text className="text-sm font-semibold tracking-wide text-[#1a1b3a]">
              PHONE NUMBER
            </Text>
            <Controller
              control={control}
              name="phone"
              rules={{ required: "Please enter a phone number" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="h-14 w-full rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-900"
                  placeholder="+1 (555) 000-0000"
                  placeholderTextColor="#94a3b8"
                  keyboardType="phone-pad"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          <View
            className="rounded-2xl border border-[#ee2b8c]/10 p-5"
            style={{ backgroundColor: "rgba(238,43,140,0.05)", gap: 16 }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center" style={{ gap: 12 }}>
                <View
                  className="rounded-lg p-2"
                  style={{ backgroundColor: "rgba(238,43,140,0.1)" }}
                >
                  <MaterialIcons
                    name="family-restroom"
                    size={20}
                    color="#ee2b8c"
                  />
                </View>
                <View>
                  <Text className="font-bold text-[#1a1b3a]">
                    Invite with Family
                  </Text>
                  <Text className="text-xs text-slate-500">
                    Allow guest to bring others
                  </Text>
                </View>
              </View>
              <Switch
                value={inviteWithFamily}
                onValueChange={setInviteWithFamily}
                trackColor={{ false: "#cbd5e1", true: "#ee2b8c" }}
                thumbColor="#ffffff"
              />
            </View>

            {inviteWithFamily && (
              <View
                className="border-t border-[#ee2b8c]/10 pt-4"
                style={{ gap: 12 }}
              >
                <View style={{ gap: 8 }}>
                  <Text
                    className="font-semibold uppercase tracking-wide text-[#1a1b3a]"
                    style={{ fontSize: 10 }}
                  >
                    Family / Household Name
                  </Text>
                  <Controller
                    control={control}
                    name="familyName"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900"
                        placeholder="e.g. The Hamilton Family"
                        placeholderTextColor="#94a3b8"
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />
                </View>

                <View className="flex-row items-start" style={{ gap: 8 }}>
                  <MaterialIcons
                    name="info"
                    size={14}
                    color="#ee2b8c"
                    style={{ marginTop: 2 }}
                  />
                  <Text className="flex-1 text-xs italic leading-relaxed text-slate-500">
                    The primary guest will be able to add names and details for
                    each family member during their digital RSVP process.
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <View className="mt-8 px-6">
          <TouchableOpacity
            className="w-full flex-row items-center justify-center rounded-xl bg-[#ee2b8c] py-4"
            style={{
              gap: 8,
              shadowColor: "#ee2b8c",
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 6,
            }}
            activeOpacity={0.9}
            disabled={inviteGuestMutation.isPending}
            onPress={handleSubmit(onValidSubmit, onInvalidSubmit)}
          >
            <Text className="text-base font-bold text-white">
              {inviteGuestMutation.isPending ? "Sending..." : "Send Invitation"}
            </Text>
            <MaterialIcons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default AddGuestScreen;
