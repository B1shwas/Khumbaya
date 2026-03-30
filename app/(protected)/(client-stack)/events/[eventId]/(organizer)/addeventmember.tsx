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
import { router as expoRouter, useLocalSearchParams } from "expo-router";
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
import { Role, roles } from "@/src/constants/planningrole";


export default function AddEventMemberScreen() {
  const params = useLocalSearchParams<{ eventId?: string | string[] }>();
  const [phone, setPhone] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>("co-host");
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(
    COUNTRY_DATA[0]
  );
  const [pickerVisible, setPickerVisible] = useState(false);

  const eventId = useMemo(() => {
    const raw = Array.isArray(params.eventId) ? params.eventId[0] : params.eventId;
    const parsed = raw ? Number(raw) : NaN;
    return Number.isFinite(parsed) ? parsed : null;
  }, [params.eventId]);

  const {
    data: eventMembers,
    isLoading: memberLoading,
  } = useGetEventOwner(eventId ?? 0);

  const phoneDigits = phone.replace(/\D/g, "");
  const fullPhone = useMemo(() => {
    if (!phoneDigits) return "";
    return `+${selectedCountry.dialCode}-${phoneDigits}`;
  }, [phoneDigits, selectedCountry.dialCode]);

  const debouncedPhone = useDebounce(fullPhone, 1000);
  const searchPhone = phoneDigits ? debouncedPhone : "";
  const hasSearched = !!searchPhone;

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

  const resolvedUserId = Number(
    (foundUser as { id?: number } | null)?.id ?? NaN
  );

  const existingMemberIds = useMemo(() => {
    if (!eventMembers?.length) return new Set<number>();
    return new Set(
      eventMembers
        .map((member) => {
          const user = (member as { user?: { id?: number } })?.user;
          const memberAsUser = member as { id?: number };
          return Number(user?.id ?? memberAsUser?.id ?? NaN);
        })
        .filter((id) => Number.isFinite(id))
    );
  }, [eventMembers]);

  const isAlreadyMember =
    Number.isFinite(resolvedUserId) && existingMemberIds.has(resolvedUserId);

  const canAddMember =
    !!eventId && Number.isFinite(resolvedUserId) && hasSearched && !isAlreadyMember;

  const { mutateAsync: addEventMember, isPending: isAddingMember } =
    useMakeEventMember(eventId ?? 0);

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
      Alert.alert("Error", "Invalid event id");
      return;
    }

    if (!Number.isFinite(resolvedUserId)) {
      Alert.alert("Error", "Please find a valid user first");
      return;
    }

    if (isAlreadyMember) {
      Alert.alert("Already added", "This user is already in the organizer team.");
      return;
    }

    try {
      await addEventMember({
        userId: resolvedUserId,
        role: selectedRole,
      });
      Alert.alert("Success", "Event member added successfully");
      expoRouter.back();
    } catch (error) {
      Alert.alert("Error", getErrorMessage(error));
    }
  };

  return (
    <View className="flex-1 bg-white px-5 pt-4">
      <CountryPickerModal
        visible={pickerVisible}
        selected={selectedCountry}
        onSelect={setSelectedCountry}
        onClose={() => setPickerVisible(false)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View>
          <Text className="text-slate-900 text-sm font-jakarta-bold uppercase mb-3">
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

        {memberLoading && (
          <View className="p-4 mt-3 rounded-md border border-slate-200 bg-slate-50">
            <Text className="text-sm text-slate-600">Loading current members...</Text>
          </View>
        )}

        {hasSearched && !!foundUser && (
          <View className="flex-row items-center p-4 mt-3 bg-primary/5 rounded-md border border-primary/20">
            <View className="size-12 rounded-full bg-primary/20 items-center justify-center mr-4">
              <Ionicons name="person" size={24} color="#ee2b8c" />
            </View>
            <View>
              <Text className="font-jakarta-bold text-slate-900">
                {(foundUser as { username?: string; name?: string })?.username ||
                  (foundUser as { username?: string; name?: string })?.name ||
                  "User found"}
              </Text>
              <Text className="text-sm text-slate-500">
                {isAlreadyMember ? "Already in organizer team" : "Found in database"}
              </Text>
            </View>
          </View>
        )}

        {hasSearched && !isFinding && !foundUser && (
          <View className="p-4 mt-3 rounded-md border border-slate-200 bg-slate-50">
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
                    : "border-slate-200 bg-white"
                )}
              >
                <Ionicons
                  name={role.icon}
                  size={24}
                  color={selectedRole === role.id ? "#ee2b8c" : "#94a3b8"}
                  className="mr-3"
                />
                <View className="flex-1 ml-3">
                  <Text className="font-jakarta-bold text-slate-900">{role.title}</Text>
                  <Text className="text-xs text-slate-500">{role.desc}</Text>
                </View>
                <View
                  className={cn(
                    "size-5 rounded-full border-2 items-center justify-center",
                    selectedRole === role.id ? "border-primary" : "border-slate-200"
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

        <Button
          className="flex-row items-center gap-2 mt-5"
          onPress={handleAddMember}
          disabled={!canAddMember || isAddingMember}
        >
          {isAddingMember ? "Adding..." : "Add Event Member"}
          <Ionicons name="person-add" size={20} color="white" />
        </Button>

        <Text className="text-center text-xs text-slate-400 mt-4 px-4">
          The user will receive an invite notification to join your event team.
        </Text>
      </ScrollView>
    </View>
  );
}