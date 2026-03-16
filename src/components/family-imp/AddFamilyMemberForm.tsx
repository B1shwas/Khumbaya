import { DatePicker } from "@/components/nativewindui/DatePicker/DatePicker.android";
import {
  FamilyMember,
  FamilyMemberPayload,
} from "@/src/features/family/api/family.service";
import {
  useAddFamilyMember,
  useUpdateFamilyMember,
} from "@/src/features/family/hooks/use-family";
import { toISODateString, toIsoDate } from "@/src/utils/helper";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, TextInput, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Text } from "../ui/Text";

// Food preference options
const FOOD_PREFERENCES = [
  { label: "Veg", value: "Vegetarian" },
  { label: "Non-Veg", value: "Non-Veg" },
  { label: "Vegan", value: "Vegan" },
  { label: "Jain", value: "Jain" },
];

type AddFamilyMemberFormValues = {
  username: string;
  email: string;
  relation: string;
  dob: string;
  foodPreference: string;
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
  console.log(initialData);
  const isEditMode = !!memberId;

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

  const onSubmit = (values: AddFamilyMemberFormValues) => {
    const dobIso = toIsoDate(values.dob);

    if (!dobIso && isEditMode === false) {
      setError("dob", { message: "Enter valid DOB (YYYY-MM-DD)" });
      return;
    }

    if (isEditMode) {
      const payload: Partial<FamilyMemberPayload> = {
        username: values.username.trim(),
        relation: values.relation.trim(),
        dob: values.dob || undefined,
        foodPreference: values.foodPreference || undefined,
      };

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
      // Add mode - create new member
      console.log(
        "Adding new member - DOB:",
        dobIso,
        "Food Preference:",
        values.foodPreference
      );
      const payload: FamilyMemberPayload = {
        relation: values.relation.trim(),
        dob: dobIso!,
        username: values.username.trim(),
        email: values.email.trim(),
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

      <FormField
        label="Full Name"
        name="username"
        placeholder="Enter name"
        control={control}
        rules={{ required: "Name is required" }}
        error={errors.username?.message}
      />

      <View className="mb-3">
        <Text className="text-xs font-jakarta-bold uppercase tracking-wide text-text-tertiary mb-1.5 ml-1">
          Date of Birth
        </Text>
        <Controller
          control={control}
          name="dob"
          rules={isEditMode ? {} : { required: "DOB is required" }}
          render={({ field: { value }, fieldState: { error } }) => (
            <DatePicker
              mode="date"
              value={dobDate}
              onChange={(event: any, date?: Date) => {
                console.log("Date selected from picker:", date);
                if (date) {
                  setDobDate(date);
                  const formattedDate = toISODateString(date.toISOString());
                  console.log("Formatted date for form:", formattedDate);
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

      {!isEditMode ? (
        <FormField
          label="Email Address"
          name="email"
          placeholder="example@mail.com"
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          }}
          error={errors.email?.message}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      ) : (
        <View className="mb-3">
          <Text className="text-xs font-jakarta-bold uppercase tracking-wide text-text-tertiary mb-1.5 ml-1">
            Email Address
          </Text>
          <View className="w-full bg-gray-100 rounded-sm px-4 py-3 border border-border">
            <Text className="text-sm text-gray-600">
              {initialData?.email || "N/A"}
            </Text>
          </View>
        </View>
      )}

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
        disabled={isPending}
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
    </View>
  );
}
