import {
  FamilyMember,
  FamilyMemberPayload,
} from "@/src/features/family/api/family.service";
import {
  useAddFamilyMember,
  useUpdateFamilyMember,
} from "@/src/features/family/hooks/use-family";
import { Ionicons } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";
import { Alert, TextInput, TouchableOpacity, View } from "react-native";
import { Text } from "../ui/Text";

type AddFamilyMemberFormValues = {
  name: string;
  email: string;
  relation: string;
  dob: string;
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

const toIsoDate = (rawDate: string) => {
  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
};

const formatDateForDisplay = (isoDate?: string) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

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
    formState: { errors },
  } = useForm<AddFamilyMemberFormValues>({
    defaultValues: {
      name: initialData?.username || "",
      email: initialData?.email || "",
      relation: initialData?.relation || "",
      dob: formatDateForDisplay(initialData?.dob),
    },
  });

  const onSubmit = (values: AddFamilyMemberFormValues) => {
    const dobIso = toIsoDate(values.dob);

    if (!dobIso && isEditMode === false) {
      setError("dob", { message: "Enter valid DOB (YYYY-MM-DD)" });
      return;
    }

    if (isEditMode) {
      // Edit mode - update member
      const payload: Partial<FamilyMemberPayload> = {
        name: values.name.trim(),
        relation: values.relation.trim(),
        dob: dobIso || undefined,
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
      const payload: FamilyMemberPayload = {
        relation: values.relation.trim(),
        dob: dobIso!,
        name: values.name.trim(),
        email: values.email.trim(),
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
        name="name"
        placeholder="Enter name"
        control={control}
        rules={{ required: "Name is required" }}
        error={errors.name?.message}
      />

      <View className="flex-row gap-3">
        <View className="flex-1">
          <FormField
            label="DOB"
            name="dob"
            placeholder={isEditMode ? "YYYY-MM-DD" : "YYYY-MM-DD"}
            control={control}
            rules={isEditMode ? {} : { required: "DOB is required" }}
            error={errors.dob?.message}
            autoCapitalize="none"
          />
        </View>

        <View className="flex-1">
          <FormField
            label="Relation"
            name="relation"
            placeholder="Spouse"
            control={control}
            rules={{ required: "Relation is required" }}
            error={errors.relation?.message}
          />
        </View>
      </View>

      {!isEditMode && (
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
      )}

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
