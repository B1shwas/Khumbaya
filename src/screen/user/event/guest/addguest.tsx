import {
  CountryOption,
  CountryPickerModal,
} from "@/src/components/ui/CountryPhone";
import { Text } from "@/src/components/ui/Text";
import { COUNTRY_DATA } from "@/src/constants/countrydata";
import { useInviteGuest } from "@/src/features/guests/api/use-guests";
import { useFindUserWithPhone } from "@/src/features/user/api/use-user";
import { User } from "@/src/store/AuthStore";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm, type FieldErrors } from "react-hook-form";
import {
  ActivityIndicator,
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
import { Dropdown } from "react-native-element-dropdown";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type AddGuestFormValues = {
  fullName: string;
  phone: string;
  category: string;
  invitation_name: string;
};

type FoundUser = User;

const GUEST_CATEGORIES = [
  { label: "Friend", value: "friend" },
  { label: "Colleague", value: "colleague" },
  { label: "Family", value: "family" },
  { label: "VVIP", value: "vvip" },
];

const AddGuestScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const inviteGuestMutation = useInviteGuest();

  const [inviteWithFamily, setInviteWithFamily] = useState(true);
  const [autoFilledPhone, setAutoFilledPhone] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(
    COUNTRY_DATA[0]
  );
  const [pickerVisible, setPickerVisible] = useState(false);

  const eventId = useMemo(() => {
    const raw = Array.isArray(params.eventId)
      ? params.eventId[0]
      : params.eventId;
    const parsed = raw ? Number(raw) : NaN;
    return Number.isFinite(parsed) ? parsed : null;
  }, [params.eventId]);

  const { control, handleSubmit, reset, watch, setValue } =
    useForm<AddGuestFormValues>({
      defaultValues: {
        fullName: "",
        invitation_name: "",
        phone: "",
        category: "",
      },
    });

  const watchedPhone = watch("phone");
  const phoneDigits = watchedPhone.replace(/\D/g, "");

  const shouldSearch = useMemo(() => {
    return phoneDigits.length > 0;
  }, [phoneDigits]);

  const fullGuestPhone = `+${selectedCountry.dialCode}-${phoneDigits}`;

  const {
    data: foundUsersResponse,
    isFetching: isFindingUser,
    error: findUserError,
    isError: isFindUserError,
  } = useFindUserWithPhone(fullGuestPhone, {
    enabled: shouldSearch,
    debounceMs: 1000,
  });

  const foundUserData =
    (foundUsersResponse as { items?: unknown } | undefined)?.items ??
    foundUsersResponse;

  const foundUser = useMemo<FoundUser | null>(() => {
    if (!foundUserData) return null;
    if (Array.isArray(foundUserData)) {
      return (foundUserData[0] as FoundUser | undefined) ?? null;
    }
    return foundUserData as FoundUser;
  }, [foundUserData]);

  const isMatchedUser = shouldSearch && !isFindingUser && !!foundUser;

  useEffect(() => {
    if (!phoneDigits) {
      setAutoFilledPhone(null);
      return;
    }
  }, [phoneDigits]);

  useEffect(() => {
    if (isMatchedUser && foundUser) {
      setValue("fullName", foundUser.username || "", {
        shouldValidate: true,
      });
      setAutoFilledPhone(phoneDigits);
    }
  }, [isMatchedUser, foundUser, phoneDigits, setValue]);

  useEffect(() => {
    if (shouldSearch && !isFindingUser && !foundUser && autoFilledPhone) {
      setValue("fullName", "", { shouldValidate: true });
      setAutoFilledPhone(null);
    }
  }, [shouldSearch, isFindingUser, foundUser, autoFilledPhone, setValue]);

  useEffect(() => {
    if (isFindUserError && findUserError) {
      const maybeResponse = findUserError as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      Alert.alert(
        "Error",
        maybeResponse.response?.data?.message ||
          maybeResponse.message ||
          "Failed to find user with this phone number."
      );
    }
  }, [isFindUserError, findUserError]);

  const onValidSubmit = useCallback(
    async (values: AddGuestFormValues) => {
      if (!eventId) {
        Alert.alert("Error", "Invalid event id");
        return;
      }

      const currentPhone = fullGuestPhone.trim();

      if (!currentPhone) {
        Alert.alert("Error", "Please enter a phone number.");
        return;
      }

      const isSearchComplete = !isFindingUser;

      if (!isSearchComplete) {
        Alert.alert(
          "Please wait",
          "Wait for phone lookup to finish before sending invitation."
        );
        return;
      }

      const resolvedName = foundUser?.username || values.fullName.trim();
      const invitationName =
        values.invitation_name.trim() || resolvedName || currentPhone;
      const payloadFullName = resolvedName || invitationName;

      if (!payloadFullName) {
        Alert.alert(
          "Error",
          "Please enter guest full name or use a phone that matches an existing user."
        );
        return;
      }

      try {
        await inviteGuestMutation.mutateAsync({
          eventId,
          payload: {
            invitation_name: invitationName,
            phone: fullGuestPhone,
            fullName: payloadFullName,
            isFamily: inviteWithFamily,
            role: "Guest",
            category: values.category,
            status: "pending",
            isAccomodation: false,
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
    [
      eventId,
      foundUser,
      isFindingUser,
      inviteGuestMutation,
      inviteWithFamily,
      reset,
      router,
      shouldSearch,
      phoneDigits,
    ]
  );

  const onInvalidSubmit = useCallback(
    (errors: FieldErrors<AddGuestFormValues>) => {
      const firstError =
        errors.fullName || errors.phone || errors.invitation_name;
      if (firstError?.message) {
        Alert.alert("Error", firstError.message as string);
      }
    },
    []
  );
  return (
    <KeyboardAvoidingView
      className="flex-1 "
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 16 : 0}
    >
      <CountryPickerModal
        visible={pickerVisible}
        selected={selectedCountry}
        onSelect={setSelectedCountry}
        onClose={() => setPickerVisible(false)}
      />
      <KeyboardAwareScrollView
        className="flex-1 "
        contentContainerStyle={{
          paddingBottom: 35,
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={100}
        scrollEnabled={true}
      >
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
                INVITATION NAME
              </Text>
              <Controller
                control={control}
                name="invitation_name"
                rules={{
                  validate: (value) => {
                    return (
                      value.trim().length > 0 || "Please enter invitation name"
                    );
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="h-14 w-full rounded-md border border-slate-200 bg-white px-4 text-base text-slate-900"
                    placeholder="e.g. Sharma Family"
                    placeholderTextColor="#94a3b8"
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
                rules={{
                  validate: (value) => {
                    return (
                      value.trim().length > 0 || "Please enter a phone number"
                    );
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <View className="h-14 w-full flex-row items-center overflow-hidden rounded-md border border-slate-200 bg-white">
                    <Pressable
                      onPress={() => setPickerVisible(true)}
                      className="h-full flex-row items-center gap-1.5 border-r border-slate-200 px-3"
                    >
                      <Image
                        source={selectedCountry.image}
                        style={{ width: 26, height: 18, borderRadius: 3 }}
                        resizeMode="cover"
                      />
                      <Text className="text-sm font-medium text-slate-800">
                        +{selectedCountry.dialCode}
                      </Text>
                      <MaterialIcons
                        name="arrow-drop-down"
                        size={18}
                        color="#94a3b8"
                      />
                    </Pressable>
                    <TextInput
                      className="flex-1 px-4 text-base text-slate-900"
                      placeholder="9761890004"
                      placeholderTextColor="#94a3b8"
                      keyboardType="phone-pad"
                      value={value}
                      onChangeText={onChange}
                    />
                  </View>
                )}
              />
              <View className="min-h-5 mt-1">
                {isFindingUser ? (
                  <View className="flex-row items-center" style={{ gap: 6 }}>
                    <ActivityIndicator size="small" color="#ee2b8c" />
                    <Text className="text-xs text-slate-500">
                      Searching user...
                    </Text>
                  </View>
                ) : null}

                {isMatchedUser ? (
                  <View className="flex-row items-center rounded-md border border-[#ee2b8c]/20 bg-[#ee2b8c]/5 p-3 mb-4">
                    <View
                      className="rounded-full mr-3 items-center justify-center"
                      style={{
                        width: 32,
                        height: 32,
                        backgroundColor: "rgba(238,43,140,0.15)",
                      }}
                    >
                      <MaterialIcons name="person" size={16} color="#ee2b8c" />
                    </View>
                    <View className="flex-1 flex-row justify-between">
                      <Text className="text-sm font-bold text-[#1a1b3a]">
                        {foundUser?.username || "User found"}
                      </Text>
                      <Text className="text-xs text-black ">User Found</Text>
                    </View>
                  </View>
                ) : null}

                <View style={{ gap: 8 }}>
                  <Text className="text-sm font-semibold tracking-wide text-[#1a1b3a]">
                    GUEST CATEGORY
                  </Text>
                  <Controller
                    control={control}
                    name="category"
                    render={({ field: { onChange, value } }) => (
                      <Dropdown
                        style={{
                          height: 56,
                          borderWidth: 1,
                          borderColor: "#e2e8f0",
                          borderRadius: 6,
                          paddingHorizontal: 16,
                          backgroundColor: "#ffffff",
                        }}
                        placeholderStyle={{ color: "#94a3b8", fontSize: 16 }}
                        selectedTextStyle={{ color: "#1a1b3a", fontSize: 16 }}
                        data={GUEST_CATEGORIES}
                        labelField="label"
                        valueField="value"
                        placeholder="Select guest category"
                        value={value}
                        onChange={(item: any) => onChange(item.value)}
                      />
                    )}
                  />
                </View>

                {shouldSearch && !isFindingUser && !foundUser ? (
                  <Text className="text-xs text-slate-500">
                    User was not found. You are creating a new guest entry.
                  </Text>
                ) : null}
              </View>
            </View>
            {!isMatchedUser && (
              <>
                <View style={{ gap: 8 }}>
                  <Text className="text-sm font-semibold tracking-wide text-[#1a1b3a]">
                    GUEST FULL NAME
                  </Text>
                  <Controller
                    control={control}
                    name="fullName"
                    rules={{
                      validate: (value) => {
                        if (isMatchedUser) return true;
                        return (
                          value.trim().length > 0 || "Please enter a guest name"
                        );
                      },
                    }}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        className="h-14 w-full rounded-md border border-slate-200 bg-white px-4 text-base text-slate-900"
                        placeholder="e.g. Alexander Hamilton"
                        placeholderTextColor="#94a3b8"
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />
                </View>
              </>
            )}

            <View
              className="rounded-md border border-[#ee2b8c]/10 p-5"
              style={{ backgroundColor: "rgba(238,43,140,0.05)", gap: 16 }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center" style={{ gap: 12 }}>
                  <View
                    className="rounded-md p-2"
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
                  <View className="flex-row items-start" style={{ gap: 8 }}>
                    <MaterialIcons
                      name="info"
                      size={14}
                      color="#ee2b8c"
                      style={{ marginTop: 2 }}
                    />
                    <Text className="flex-1 text-xs italic leading-relaxed text-slate-500">
                      The primary guest will be able to add names and details
                      for each family member during their digital RSVP process.
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          <View className="mt-8 px-6">
            <TouchableOpacity
              className="w-full flex-row items-center justify-center rounded-md bg-[#ee2b8c] py-4"
              style={{
                gap: 8,
                shadowColor: "#ee2b8c",
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 6,
              }}
              activeOpacity={0.9}
              disabled={
                inviteGuestMutation.isPending || isFindingUser || !phoneDigits
              }
              onPress={handleSubmit(onValidSubmit, onInvalidSubmit)}
            >
              <Text className="text-base font-bold text-white">
                {inviteGuestMutation.isPending
                  ? "Sending..."
                  : "Send Invitation"}
              </Text>
              <MaterialIcons name="send" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddGuestScreen;
