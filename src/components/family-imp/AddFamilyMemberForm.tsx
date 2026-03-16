import { DatePicker } from "@/components/nativewindui/DatePicker/DatePicker.android";
import {
  FamilyMember,
  FamilyMemberPayload,
} from "@/src/features/family/api/family.service";
import {
  useAddFamilyMember,
  useUpdateFamilyMember,
} from "@/src/features/family/hooks/use-family";
import { useFindUserWithPhone } from "@/src/features/user/api/use-user";
import { toISODateString, toIsoDate } from "@/src/utils/helper";
import { User } from "@/store/AuthStore";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Text } from "../ui/Text";
// Food preference options
const FOOD_PREFERENCES = [
  { label: "Veg", value: "Vegetarian" },
  { label: "Non-Veg", value: "Non-Veg" },
  { label: "Vegan", value: "Vegan" },
  { label: "Jain", value: "Jain" },
];

const normalizePhone = (value?: string) => (value ?? "").replace(/\D/g, "");

type AddFamilyMemberFormValues = {
  phone: string | undefined;
  username: string;
  email: string | undefined;
  relation: string;
  dob: string;
  foodPreference: string;
};

type FamilyMemberMutationPayload = Omit<FamilyMemberPayload, "email"> & {
  email?: string;
};

type AddFamilyMemberFormProps = {
  familyId: number;
  memberId?: number;
  initialData?: FamilyMember;
  onSuccess?: () => void;
};

type FieldProps = {
  label: string;
  name: keyof AddFamilyMemberFormValues;
  placeholder: string;
  control: any;
  error?: string;
  rules?: Record<string, any>;
  keyboardType?: "default" | "email-address";
  autoCapitalize?: "none" | "sentences";
  editable?: boolean;
};

const formatDateForDisplay = (isoDate?: string) => toISODateString(isoDate);

function FormField({
  label,
  name,
  placeholder,
  control,
  error,
  rules,
  keyboardType = "default",
  autoCapitalize = "sentences",
  editable = true,
}: FieldProps) {
  const inputBaseClass =
    "w-full bg-background rounded-sm px-4 py-3 text-sm text-text-primary border";

  return (
    <View className="mb-3">
      <Text className="text-xs font-jakarta-bold uppercase tracking-wide text-text-tertiary mb-1.5 ml-1">
        {label}
      </Text>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { value, onChange } }) => (
          <TextInput
            className={`${inputBaseClass} ${error ? "border-red-500" : "border-border"} ${!editable ? "bg-gray-100" : ""}`}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            value={value}
            onChangeText={onChange}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            editable={editable}
          />
        )}
      />
      {error ? (
        <Text className="text-xs text-red-500 mt-1 ml-1">{error}</Text>
      ) : null}
    </View>
  );
}

export default function AddFamilyMemberForm({
  familyId,
  memberId,
  initialData,
  onSuccess,
}: AddFamilyMemberFormProps) {
  const isEditMode = !!initialData;

  const { mutate: addMember, isPending: isAdding } = useAddFamilyMember();
  const { mutate: updateMember, isPending: isUpdating } =
    useUpdateFamilyMember();

  const isPending = isAdding || isUpdating;

  const {
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddFamilyMemberFormValues>({
    defaultValues: {
      phone: initialData?.phone || "",
      username: initialData?.username || "",
      email: initialData?.email || "",
      relation: initialData?.relation || "",
      dob: formatDateForDisplay(initialData?.dob),
      foodPreference: initialData?.foodPreference || "",
    },
  });

  const [dobDate, setDobDate] = React.useState<Date>(
    initialData?.dob ? new Date(initialData.dob) : new Date()
  );
  const [autoFilledPhone, setAutoFilledPhone] = React.useState<string | null>(
    null
  );

  const watchedPhone = watch("phone") ?? "";
  const trimmedWatchedPhone = watchedPhone.trim();
  const shouldSearchUserByPhone = !isEditMode && trimmedWatchedPhone.length > 0;

  const {
    data: foundUsersResponse,
    isFetching: isFindingUser,
    error: findUserError,
    isError: isFindUserError,
  } = useFindUserWithPhone(trimmedWatchedPhone, {
    enabled: shouldSearchUserByPhone,
    debounceMs: 1000,
  });

  const foundUserData =
    (foundUsersResponse as { items?: unknown } | undefined)?.items ??
    foundUsersResponse;

  const foundUser = React.useMemo<User | null>(() => {
    if (!foundUserData) return null;
    const targetPhone = normalizePhone(trimmedWatchedPhone);

    if (Array.isArray(foundUserData)) {
      const exactMatch = (foundUserData as User[]).find(
        (user) => normalizePhone(user?.phone) === targetPhone
      );
      return exactMatch ?? null;
    }

    const singleUser = foundUserData as User;
    if (normalizePhone(singleUser?.phone) === targetPhone) {
      return singleUser;
    }

    return null;
  }, [foundUserData, trimmedWatchedPhone]);

  const isMatchedUser =
    shouldSearchUserByPhone && !isFindingUser && !!foundUser;
  const shouldLockFullName = !isEditMode && isMatchedUser;
  const hasExistingFamily =
    !isEditMode && isMatchedUser && foundUser?.familyId != null;
  const canSubmit =
    !isPending &&
    !isFindingUser &&
    familyId != null &&
    familyId > 0 &&
    !hasExistingFamily;

  React.useEffect(() => {
    if (!trimmedWatchedPhone) {
      setAutoFilledPhone(null);
    }
  }, [trimmedWatchedPhone]);

  React.useEffect(() => {
    if (!isEditMode && isMatchedUser && foundUser) {
      setValue("username", foundUser.username  || "", {
        shouldValidate: true,
      });
      if (foundUser.email) {
        setValue("email", foundUser.email, { shouldValidate: true });
      }
      setAutoFilledPhone(trimmedWatchedPhone);
    }
  }, [isEditMode, isMatchedUser, foundUser, setValue, trimmedWatchedPhone]);

  React.useEffect(() => {
    if (
      !isEditMode &&
      shouldSearchUserByPhone &&
      !isFindingUser &&
      !foundUser &&
      autoFilledPhone
    ) {
      setValue("username", "", { shouldValidate: true });
      setValue("email", "", { shouldValidate: true });
      setAutoFilledPhone(null);
    }
  }, [
    autoFilledPhone,
    foundUser,
    isEditMode,
    isFindingUser,
    setValue,
    shouldSearchUserByPhone,
  ]);

  React.useEffect(() => {
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
  }, [findUserError, isFindUserError]);

  const onSubmit = (values: AddFamilyMemberFormValues) => {
    const dobIso = toIsoDate(values.dob);
    const resolvedUsername = (values.username || foundUser?.username || "").trim();
    const trimmedEmail = values.email?.trim();

    if (!familyId) {
      Alert.alert("Error", "Family not found. Please create/select a family first.");
      return;
    }

    if (!isEditMode && hasExistingFamily) {
      Alert.alert(
        "Cannot add member",
        "This user is already linked to another family."
      );
      return;
    }

    if (!dobIso && isEditMode === false) {
      setError("dob", { message: "Enter valid DOB (YYYY-MM-DD)" });
      return;
    }

    if (!resolvedUsername) {
      setError("username", { message: "Name is required" });
      return;
    }

    if (isEditMode) {
      const trimmedEditEmail = values.email?.trim();
      const payload: Partial<FamilyMemberMutationPayload> = {
        username: resolvedUsername,
        relation: values.relation.trim(),
        dob: values.dob || undefined,
        foodPreference: values.foodPreference || undefined,
        ...(trimmedEditEmail ? { email: trimmedEditEmail } : {}),
      };

      if (!memberId) {
        Alert.alert("Error", "Invalid member for editing.");
        return;
      }

      updateMember(
        { familyId, memberId: memberId!, data: payload },
        {
          onSuccess: () => {
            Alert.alert("Success", "Family member updated");
            onSuccess?.();
          },
          onError: (error: any) => {
            const message =
              error?.response?.data?.message ||
              "Failed to update family member";
            Alert.alert("Error", message);
          },
        }
      );
    } else {
      const payload: FamilyMemberMutationPayload = {
        relation: values.relation.trim(),
        dob: dobIso!,
        username: resolvedUsername,
        ...(trimmedEmail ? { email: trimmedEmail } : {}),
        foodPreference: values.foodPreference || undefined,
      };

      addMember(
        { familyId, data: payload },
        {
          onSuccess: () => {
            Alert.alert("Success", "Family member added");
            reset();
          },
          onError: (error: any) => {
            const message =
              error?.response?.data?.message || "Failed to add family member";
            Alert.alert("Error", message);
          },
        }
      );
    }
  };

  return (
    <View className="bg-primary/5 border-2 border-dashed border-primary/30 rounded-xl p-5 mt-6 ">
      <View className="flex-row items-center justify-center gap-2 mb-4">
        <Ionicons
          name={isEditMode ? "create-outline" : "person-add-outline"}
          size={18}
          className="!text-primary"
        />
        <Text className="text-base font-jakarta-bold text-primary">
          {isEditMode ? "Edit Member" : "Add New Member"}
        </Text>
      </View>

   
      {!isEditMode && (
        <View className="min-h-5 mt-1 mb-2">
          {isFindingUser ? (
            <View className="flex-row items-center" style={{ gap: 6 }}>
              <ActivityIndicator size="small" color="#ee2b8c" />
              <Text className="text-xs text-slate-500">Searching user...</Text>
            </View>
          ) : null}

          {isMatchedUser ? (
            <View className="flex-row items-center rounded-md border border-[#ee2b8c]/20 bg-[#ee2b8c]/5 p-3">
              <View className="flex-1">
                <Text className="text-sm font-bold text-[#1a1b3a]">
                  {foundUser?.username || "User found"}
                </Text>
                <Text className="text-xs text-slate-600">
                  {hasExistingFamily
                    ? "This user is already in a family and cannot be added."
                    : "User found. Name/email auto-filled."}
                </Text>
              </View>
            </View>
          ) : null}

          {shouldSearchUserByPhone && !isFindingUser && !foundUser ? (
            <Text className="text-xs text-slate-500">
              No user found with this phone. Continue adding manually.
            </Text>
          ) : null}
        </View>
      )}

      <FormField
        label="Full Name"
        name="username"
        placeholder={shouldLockFullName ? "Auto-filled from phone lookup" : "Enter name"}
        control={control}
        rules={{ required: "Name is required" }}
        error={errors.username?.message}
        editable={!shouldLockFullName}
      />

      <View className="mb-3">
        <Controller
          control={control}
          name="dob"
          rules={isEditMode ? {} : { required: "DOB is required" }}
          render={({ field: { value }, fieldState: { error } }) => (
            <DatePicker
              mode="date"
           
              value={dobDate}
              materialDateLabel="Date of Birth"
        
              materialDateLabelClassName="text-xs font-jakarta-bold uppercase tracking-wide text-text-tertiary mb-1.5 ml-1 text-left "
              onChange={(event: any, date?: Date) => {
                if (date) {
                  setDobDate(date);
                  const formattedDate = toISODateString(date.toISOString());
                  setValue("dob", formattedDate);
                }
              }}
              maximumDate={new Date()}
            />
          )}
        />
        {errors.dob && (
          <Text className="text-xs text-red-500 mt-1 ml-1">
            {errors.dob.message}
          </Text>
        )}
      </View>
         <FormField
        label="Phone Number (Optional) "
        name="phone"
        placeholder="9761890004"
        control={control}
        rules={{}}
        error={errors.phone?.message}
      />


      <View className="mb-3">
        <FormField
          label="Relation"
          name="relation"
          placeholder="Spouse"
          control={control}
          rules={{ required: "Relation is required" }}
          error={errors.relation?.message}
        />
      </View>

     
        <FormField
          label="Email Address (optional)"
          name="email"
          placeholder="example@mail.com "
          control={control}
          rules={{
            validate: (value: string) => {
              if (!value) return true;
              return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Invalid email address";
            },
          }}
          error={errors.email?.message}
          keyboardType="email-address"
          autoCapitalize="none"
        />
  

      {/* Food Preference Dropdown */}
      <View className="mb-3">
        <Text className="text-xs font-jakarta-bold uppercase tracking-wide text-text-tertiary mb-1.5 ml-1">
          Meal Preference
        </Text>

        <Controller
          control={control}
          name="foodPreference"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <>
              <Dropdown
                style={{
                  height: 50,
                  borderWidth: 1,
                  borderColor: error ? "#ef4444" : "#e5e7eb",
                  borderRadius: 6,
                  paddingHorizontal: 12,
                  backgroundColor: "white",
                }}
                placeholderStyle={{ color: "#9CA3AF" }}
                selectedTextStyle={{ color: "#111827", fontSize: 14 }}
                data={FOOD_PREFERENCES}
                labelField="label"
                valueField="value"
                placeholder="Select meal preference"
                value={value}
                onChange={(item: any) => {
                  onChange(item.value);
                }}
              />

              {error ? (
                <Text className="text-xs text-red-500 mt-1 ml-1">
                  {error.message}
                </Text>
              ) : null}
            </>
          )}
        />
      </View>

      <TouchableOpacity
        className="w-full bg-primary rounded-sm py-3.5 flex-row items-center justify-center mt-1"
        onPress={handleSubmit(onSubmit)}
        disabled={!isEditMode && !canSubmit ? true : isPending}
      >
        <Text className="text-white text-base" variant="h2">
          {isPending
            ? "Saving..."
            : isEditMode
              ? "Update Member"
              : "Save & Add Member"}
        </Text>
        {!isPending && (
          <Ionicons
            name={isEditMode ? "checkmark" : "add"}
            size={20}
            color="white"
            style={{ marginLeft: 8 }}
          />
        )}
      </TouchableOpacity>

      {!isEditMode && familyId == null ? (
        <Text className="text-xs text-red-500 mt-2 text-center">
          Please create a family first before adding members.
        </Text>
      ) : null}

      {!isEditMode && hasExistingFamily ? (
        <Text className="text-xs text-red-500 mt-2 text-center">
          This phone belongs to a user who already has a family.
        </Text>
      ) : null}
    </View>
  );
}
