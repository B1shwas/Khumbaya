import { Button } from "@/src/components/ui/Button";
import {
  CountryOption,
  CountryPickerModal,
} from "@/src/components/ui/CountryPhone";
import { Text } from "@/src/components/ui/Text";
import { COUNTRY_DATA } from "@/src/constants/countrydata";
import {
  useGetEventOwner,
  useMakeEventMember,
} from "@/src/features/events/hooks/use-event";
import { useFindUserWithPhone } from "@/src/features/user/api/use-user";
import { cn } from "@/src/utils/cn";
import { useDebounce } from "@/src/utils/helper";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Role = "co-host" | "planner" | "editor";

export function TransferOwnerShipPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [phone, setPhone] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>("co-host");
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(
    COUNTRY_DATA[0]
  );
  const [pickerVisible, setPickerVisible] = useState(false);
  const { data: eventMembers, isLoading: memberLoading } = useGetEventOwner(
    Number(params.eventId)
  );
  const phoneDigits = phone.replace(/\D/g, "");
  const fullPhone = useMemo(() => {
    if (!phoneDigits) return "";
    return `+${selectedCountry.dialCode}-${phoneDigits}`;
  }, [phoneDigits, selectedCountry.dialCode]);
  const debouncedPhone = useDebounce(fullPhone, 1000);
  const searchPhone = phoneDigits ? debouncedPhone : "";
  const hasSearched = !!searchPhone;

  const eventId = useMemo(() => {
    const raw = Array.isArray(params.eventId)
      ? params.eventId[0]
      : params.eventId;
    const parsed = raw ? Number(raw) : NaN;
    return Number.isFinite(parsed) ? parsed : null;
  }, [params.eventId]);

  const {
    data: foundUsersResponse,
    isFetching: isFinding,
    error: findUserError,
  } = useFindUserWithPhone(searchPhone, { enabled: hasSearched });

  const foundUserData =
    (foundUsersResponse as { items?: unknown } | undefined)?.items ??
    foundUsersResponse;

  const foundUser = useMemo(() => {
    if (!foundUserData) return null;
    if (Array.isArray(foundUserData)) return foundUserData[0] ?? null;
    return foundUserData;
  }, [foundUserData]);

  const { mutateAsync: addEventMember, isPending: isAddingMember } =
    useMakeEventMember(eventId ?? 0);
  const resolvedUserId = Number(
    (foundUser as { id?: number } | null)?.id ?? NaN
  );
  const canAddMember =
    !!eventId && Number.isFinite(resolvedUserId) && hasSearched;

  const getErrorMessage = (error: unknown) => {
    if (typeof error === "object" && error !== null) {
      const maybeResponse = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      return (
        maybeResponse.response?.data?.message ||
        maybeResponse.message ||
        "Something went wrong. Please try again."
      );
    }
    return "Something went wrong. Please try again.";
  };

  useEffect(() => {
    if (!findUserError || !hasSearched) return;
    Alert.alert("Error", getErrorMessage(findUserError));
  }, [findUserError, hasSearched]);

  const handleAddMember = async () => {
    if (!eventId) {
      Alert.alert("Error", "Invalid eventinp id");
      return;
    }

    if (!Number.isFinite(resolvedUserId)) {
      Alert.alert("Error", "Please find a valid user first");
      return;
    }

    try {
      await addEventMember({
        userId: resolvedUserId,
        role: selectedRole,
      });
      Alert.alert("Success", "Event member added successfully");
      router.back();
    } catch (error) {
      Alert.alert("Error", getErrorMessage(error));
    }
  };

  const roles: {
    id: Role;
    title: string;
    desc: string;
    icon: keyof typeof Ionicons.glyphMap;
  }[] = [
    {
      id: "co-host",
      title: "Co-Host",
      desc: "Can edit event and manage guests",
      icon: "star",
    },
    {
      id: "planner",
      title: "Planner",
      desc: "Can manage logistics and vendors",
      icon: "calendar",
    },
    {
      id: "editor",
      title: "Editor",
      desc: "Can only edit event details",
      icon: "create",
    },
  ];
  return (
    <View className="flex-1 ">
      <CountryPickerModal
        visible={pickerVisible}
        selected={selectedCountry}
        onSelect={setSelectedCountry}
        onClose={() => setPickerVisible(false)}
      />
      <ScrollView
        className="flex-1 px-6 pt-2 pb-36"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="pt-2">
          <Text className="text-slate-900 text-sm font-jakarta-bold uppercase mb-3">
            Event Members
          </Text>
          {memberLoading ? (
            <View className="p-4 rounded-md border border-slate-200 bg-slate-50">
              <Text className="text-sm text-slate-600">Loading members...</Text>
            </View>
          ) : !!eventMembers && eventMembers.length ? (
            <View className="gap-3">
              {eventMembers?.map((member, index) => {
                const user = (member as { user?: any })?.user ?? member;
                const name = user?.username || "Member";
                const phone = user?.phone || user?.phoneNumber || null;
                const role = member?.role;

                return (
                  <View
                    key={String(
                      (member as { id?: number | string })?.id ?? index
                    )}
                    className="flex-row items-center p-4 bg-slate-50 rounded-md border border-slate-200"
                  >
                    <View className="size-12 rounded-full bg-slate-200 items-center justify-center mr-4">
                      <Ionicons name="person" size={24} color="#64748b" />
                    </View>
                    <View className="flex-1">
                      <Text className="font-jakarta-bold text-slate-900">
                        {name}
                      </Text>
                      {phone && (
                        <Text className="text-sm text-dark-500">{phone}</Text>
                      )}
                      <Text className="text-sm text-dark-500">
                        {role ? `Role: ${role}` : "Event member"}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View className="p-4 rounded-md border border-slate-200 bg-slate-50">
              <Text className="text-sm text-slate-600">No members yet.</Text>
            </View>
          )}
        </View>
        <View className="mt-8">
          <Text className="text-slate-900 text-sm font-jakarta-bold uppercase mb-3">
            Transfer Ownership
          </Text>
          <Text className="text-sm text-slate-600 mb-4">
            Search for a member to transfer ownership to.
          </Text>
        </View>

        <View className="mt-2">
          <View>
            <Text className="text-slate-900  text-sm font-jakarta-bold uppercase mb-3">
              Add Phone Number
            </Text>
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
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>
          </View>

          {hasSearched && !!foundUser && (
            <View className="flex-row items-center p-4 bg-primary/5 rounded-md border border-primary/20">
              <View className="size-12 rounded-full bg-primary/20 items-center justify-center mr-4">
                <Ionicons name="person" size={24} color="#ee2b8c" />
              </View>
              <View>
                <Text className="font-jakarta-bold text-slate-900 ">
                  {(foundUser as { username?: string; name?: string })
                    ?.username ||
                    (foundUser as { username?: string; name?: string })?.name ||
                    "User found"}
                </Text>
                <Text className="text-sm text-slate-500">
                  Found in database
                </Text>
              </View>
            </View>
          )}

          {hasSearched && !isFinding && !foundUser && (
            <View className="p-4 rounded-md border border-slate-200 bg-slate-50">
              <Text className="text-sm text-slate-600">
                No user found with this phone number.
              </Text>
            </View>
          )}

          <View className="pt-4">
            <Text className="text-slate-900 text-sm font-jakarta-bold uppercase mb-4">
              Assign Role
            </Text>
            <View className="gap-3">
              {roles.map((role) => (
                <TouchableOpacity
                  key={role.id}
                  onPress={() => setSelectedRole(role.id)}
                  activeOpacity={0.7}
                  className={cn(
                    "flex-row items-center p-4 rounded-md border-2",
                    selectedRole === role.id
                      ? "border-primary bg-primary/5"
                      : "border-slate-200  bg-white "
                  )}
                >
                  <Ionicons
                    name={role.icon}
                    size={24}
                    color={selectedRole === role.id ? "#ee2b8c" : "#94a3b8"}
                    className="mr-3"
                  />
                  <View className="flex-1 ml-3">
                    <Text className="font-jakarta-bold text-slate-900 ">
                      {role.title}
                    </Text>
                    <Text className="text-xs text-slate-500">{role.desc}</Text>
                  </View>
                  <View
                    className={cn(
                      "size-5 rounded-full border-2 items-center justify-center",
                      selectedRole === role.id
                        ? "border-primary"
                        : "border-slate-200 "
                    )}
                  >
                    {selectedRole === role.id && (
                      <View className="size-2.5 rounded-full bg-primary" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        <Button
          className="flex-row items-center gap-2 mt-5"
          onPress={handleAddMember}
          disabled={!canAddMember || isAddingMember}
        >
          {isAddingMember ? "Adding..." : "Add as Host"}
          <Ionicons name="person-add" size={20} color="white" />
        </Button>
        <Text className="text-center text-xs text-slate-400 mt-4 px-4">
          The user will receive an invite notification to join your event team.
        </Text>
      </ScrollView>

      {/* Sticky Bottom CTA */}
    </View>
  );
}
