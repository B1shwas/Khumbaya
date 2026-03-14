import { Text } from "@/src/components/ui/Text";
import { useInviteGuest } from "@/src/features/guests/api/use-guests";
import { useFindUserWithPhone } from "@/src/features/user/api/use-user";
import { useDebounce } from "@/src/utils/helper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm, type FieldErrors } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type AddGuestFormValues = {
  fullName: string;
  email: string;
  phone: string;
  familyName: string;
};

type FoundUser = {
  id?: number;
  username?: string;
  name?: string;
  email?: string;
  phone?: string;
};

const AddGuestScreen = () => {
   const router = useRouter();
  const params = useLocalSearchParams();
  const inviteGuestMutation = useInviteGuest();

  const [inviteWithFamily, setInviteWithFamily] = useState(true);
  const [autoFilledPhone, setAutoFilledPhone] = useState<string | null>(null);

  const eventId = useMemo(() => {
    const raw = Array.isArray(params.eventId) ? params.eventId[0] : params.eventId;
    const parsed = raw ? Number(raw) : NaN;
    return Number.isFinite(parsed) ? parsed : null;
  }, [params.eventId]);

  const { control, handleSubmit, reset, watch, setValue, getValues } = useForm<AddGuestFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      familyName: "",
    },
  });

  const watchedPhone = watch("phone");

  const debouncedPhone = useDebounce(watchedPhone, 1000);

  const shouldSearch = useMemo(() => {
    return debouncedPhone.trim().length > 0;
  }, [debouncedPhone]);

  const {
    data: foundUsersResponse,
    isFetching: isFindingUser,
    error: findUserError,
    isError: isFindUserError,
  } = useFindUserWithPhone(debouncedPhone, {
    enabled: shouldSearch,
  });

  const foundUserData = (foundUsersResponse as { items?: unknown } | undefined)?.items ?? foundUsersResponse;

  const foundUser = useMemo<FoundUser | null>(() => {
    if (!foundUserData) return null;
    if (Array.isArray(foundUserData)) {
      return (foundUserData[0] as FoundUser | undefined) ?? null;
    }
    return foundUserData as FoundUser;
  }, [foundUserData]);

  const isMatchedUser = shouldSearch && !isFindingUser && !!foundUser;

  useEffect(() => {
    if (!watchedPhone.trim()) {
      setAutoFilledPhone(null);
      return;
    }
  }, [watchedPhone]);

  useEffect(() => {
    if (isMatchedUser && foundUser) {
      setValue("fullName", foundUser.username || foundUser.name || "", {
        shouldValidate: true,
      });
      setValue("email", foundUser.email || "", { shouldValidate: true });
      setAutoFilledPhone(debouncedPhone);
    }
  }, [isMatchedUser, foundUser, debouncedPhone, setValue]);

  useEffect(() => {
    if (shouldSearch && !isFindingUser && !foundUser && autoFilledPhone) {
      setValue("fullName", "", { shouldValidate: true });
      setValue("email", "", { shouldValidate: true });
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

      const currentPhone = values.phone.trim();
      const isSearchComplete = !isFindingUser && debouncedPhone === currentPhone;

      if (!isSearchComplete) {
        Alert.alert("Please wait", "Wait for phone lookup to finish before sending invitation.");
        return;
      }

      const resolvedName = foundUser?.username || foundUser?.name || values.fullName.trim();
      const resolvedEmail = foundUser?.email || values.email.trim();

      try {
        await inviteGuestMutation.mutateAsync({
          eventId,
          payload: {
            invitation_name: resolvedName,
            email: resolvedEmail,
            phone: currentPhone,
            eventId,
            fullName: resolvedName,
            isFamily: inviteWithFamily,
            role: "Guest",
            category: "Friend",
            status: "pending",
            isAccomodation: false,
          },
        });

        Alert.alert("Success", "Guest added successfully!");
        reset();
        router.back();
      } catch (error: any) {
        const message =
          error?.response?.data?.message || error?.message || "Failed to add guest. Please try again.";
        Alert.alert("Error", message);
      }
    },
    [
      debouncedPhone,
      eventId,
      foundUser,
      isFindingUser,
      inviteGuestMutation,
      inviteWithFamily,
      reset,
      router,
    ]
  );

  const onInvalidSubmit = useCallback((errors: FieldErrors<AddGuestFormValues>) => {
    const firstError = errors.fullName || errors.email || errors.phone || errors.familyName;
    if (firstError?.message) {
      Alert.alert("Error", firstError.message as string);
    }
  }, []);
  return (
    <KeyboardAvoidingView
      className="flex-1 "
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 16 : 0}
    >
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
                name="familyName"
                rules={{
                  validate: (value) => {
                    return value.trim().length > 0 || "Please enter invitation name";
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
                    return value.trim().length > 0 || "Please enter a phone number";
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="h-14 w-full rounded-md border border-slate-200 bg-white px-4 text-base text-slate-900"
                    placeholder="+1 (555) 000-0000"
                    placeholderTextColor="#94a3b8"
                    keyboardType="phone-pad"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              <View className="min-h-5 mt-1">
                {isFindingUser  ? (
                  <View className="flex-row items-center" style={{ gap: 6 }}>
                    <ActivityIndicator size="small" color="#ee2b8c" />
                    <Text className="text-xs text-slate-500">Searching user...</Text>
                  </View>
                ) : null}

                {isMatchedUser ? (
                  <View className="flex-row items-center rounded-md border border-[#ee2b8c]/20 bg-[#ee2b8c]/5 p-3">
                    <View
                      className="rounded-full mr-3 items-center justify-center"
                      style={{ width: 32, height: 32, backgroundColor: "rgba(238,43,140,0.15)" }}
                    >
                      <MaterialIcons name="person" size={16} color="#ee2b8c" />
                    </View>
                    <View className="flex-1 flex-row justify-between">
                      <Text className="text-sm font-bold text-[#1a1b3a]">
                        {foundUser?.username || foundUser?.name || "User found"}
                      </Text>
                      <Text className="text-xs text-black ">User Found</Text>
                    </View>
                  </View>
                ) : null}

                {  !isFindingUser && !foundUser ? (
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
                        return value.trim().length > 0 || "Please enter a guest name";
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

                <View style={{ gap: 8 }}>
                  <Text className="text-sm font-semibold tracking-wide text-[#1a1b3a]">
                    EMAIL ADDRESS
                  </Text>
                  <Controller
                    control={control}
                    name="email"
                    rules={{
                      validate: (value) => {
                        if (!value.trim()) return "Please enter a guest email";
                        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
                          return "Please enter a valid email";
                        }
                        return true;
                      },
                    }}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        className="h-14 w-full rounded-md border border-slate-200 bg-white px-4 text-base text-slate-900"
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
              className="w-full flex-row items-center justify-center rounded-md bg-[#ee2b8c] py-4"
              style={{
                gap: 8,
                shadowColor: "#ee2b8c",
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 6,
              }}
              activeOpacity={0.9}
              disabled={inviteGuestMutation.isPending || isFindingUser || (!debouncedPhone.trim() && !foundUser && !isFindingUser)}
              onPress={handleSubmit(onValidSubmit, onInvalidSubmit)}
            >
              <Text className="text-base font-bold text-white">
                {inviteGuestMutation.isPending ? "Sending..." : "Send Invitation"}
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
