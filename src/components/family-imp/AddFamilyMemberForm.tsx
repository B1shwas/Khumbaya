import { FamilyMemberPayload } from "@/src/features/family/api/family.service";
import { useAddFamilyMember } from "@/src/features/family/hooks/use-family";
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
};

const toIsoDate = (rawDate: string) => {
  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
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
            className={`${inputBaseClass} ${error ? "border-red-500" : "border-border"}`}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            value={value}
            onChangeText={onChange}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
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
}: AddFamilyMemberFormProps) {
  const { mutate: addMember, isPending } = useAddFamilyMember();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<AddFamilyMemberFormValues>({
    defaultValues: {
      name: "",
      email: "",
      relation: "",
      dob: "",
    },
  });

  const onSubmit = (values: AddFamilyMemberFormValues) => {
    const dobIso = toIsoDate(values.dob);

    if (!dobIso) {
      setError("dob", { message: "Enter valid DOB (YYYY-MM-DD)" });
      return;
    }

    const payload: FamilyMemberPayload = {
      relation: values.relation.trim(),
      dob: dobIso,
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
  };

  return (
    <View className="bg-primary/5 border-2 border-dashed border-primary/30 rounded-xl p-5 mt-3 mb-6">
      <View className="flex-row items-center justify-center gap-2 mb-4">
        <Ionicons
          name="person-add-outline"
          size={18}
          className="text-primary"
        />
        <Text className="text-base font-jakarta-bold text-primary">
          Add New Member
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
            placeholder="YYYY-MM-DD"
            control={control}
            rules={{ required: "DOB is required" }}
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

      <TouchableOpacity
        className="w-full bg-primary rounded-lg py-3.5 flex-row items-center justify-center mt-1"
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
      >
        <Text className="text-white text-sm font-jakarta-bold">
          {isPending ? "Saving..." : "Save & Add Member"}
        </Text>
        {!isPending && (
          <Ionicons
            name="add"
            size={20}
            color="white"
            style={{ marginLeft: 8 }}
          />
        )}
      </TouchableOpacity>
    </View>
  );
}
