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

const toIsoDate = (rawDate: string) => {
  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
};

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
    <View className="bg-white rounded-xl p-4 mt-3 mb-6 border border-gray-200">
      <Text className="text-base font-semibold text-gray-800 mb-3">
        Add Member
      </Text>

      <Controller
        control={control}
        name="name"
        rules={{ required: "Name is required" }}
        render={({ field: { value, onChange } }) => (
          <TextInput
            className={`rounded-xl px-4 py-3.5 border mb-2 text-gray-800 ${errors.name ? "border-red-500" : "border-gray-200"}`}
            placeholder="Full name"
            placeholderTextColor="#9CA3AF"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.name && (
        <Text className="text-xs text-red-500 mb-2">{errors.name.message}</Text>
      )}

      <Controller
        control={control}
        name="email"
        rules={{
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Invalid email address",
          },
        }}
        render={({ field: { value, onChange } }) => (
          <TextInput
            className={`rounded-xl px-4 py-3.5 border mb-2 text-gray-800 ${errors.email ? "border-red-500" : "border-gray-200"}`}
            placeholder="Email"
            placeholderTextColor="#9CA3AF"
            value={value}
            onChangeText={onChange}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}
      />
      {errors.email && (
        <Text className="text-xs text-red-500 mb-2">
          {errors.email.message}
        </Text>
      )}

      <Controller
        control={control}
        name="relation"
        rules={{ required: "Relation is required" }}
        render={({ field: { value, onChange } }) => (
          <TextInput
            className={`rounded-xl px-4 py-3.5 border mb-2 text-gray-800 ${errors.relation ? "border-red-500" : "border-gray-200"}`}
            placeholder="Relation (e.g. wife)"
            placeholderTextColor="#9CA3AF"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.relation && (
        <Text className="text-xs text-red-500 mb-2">
          {errors.relation.message}
        </Text>
      )}

      <Controller
        control={control}
        name="dob"
        rules={{ required: "DOB is required" }}
        render={({ field: { value, onChange } }) => (
          <TextInput
            className={`rounded-xl px-4 py-3.5 border mb-2 text-gray-800 ${errors.dob ? "border-red-500" : "border-gray-200"}`}
            placeholder="DOB (YYYY-MM-DD)"
            placeholderTextColor="#9CA3AF"
            value={value}
            onChangeText={onChange}
            autoCapitalize="none"
          />
        )}
      />
      {errors.dob && (
        <Text className="text-xs text-red-500 mb-2">{errors.dob.message}</Text>
      )}

      <TouchableOpacity
        className="bg-pink-500 rounded-xl py-4 flex-row items-center justify-center mt-2"
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
      >
        <Text className="text-white text-base font-semibold">
          {isPending ? "Adding..." : "Add Member"}
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
