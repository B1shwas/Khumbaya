import AvatarPicker from "@/src/components/ui/AvatarPicker";
import { useUpdateUserMe } from "@/src/features/user/api/use-user";
import { useAuthStore } from "@/src/store/AuthStore";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FOOD_OPTIONS = [
  "Vegetarian",
  "Non-Veg",
  "Vegan",
  "No Preference",
] as const;

const BIO_MAX = 500;

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
  bio: string;
  foodPreference: string;
  avatarImage: string;
}

type FormErrors = Partial<Record<keyof ProfileForm, string>>;

export default function EditProfileScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [loading, setLoading] = useState(true);

  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const fetchUserProfile = useAuthStore((state) => state.fetchUserProfile);
  const isProfileLoading = useAuthStore((state) => state.isProfileLoading);
  const updateUserMeMutation = useUpdateUserMe();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const [form, setForm] = useState<ProfileForm>({
    name: "",
    email: "",
    phone: "",
    bio: "",
    foodPreference: "",
    avatarImage: "",
  });

  useEffect(() => {
    if (!isProfileLoading && user) {
      setForm({
        name: user.username || user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        foodPreference: user.foodPreference || user.food_preference || "",
        avatarImage: user.photo || user.avatarImage || user.avatar || "",
      });
      setLoading(false);
    } else if (!isProfileLoading && !user) {
      setLoading(false);
    }
  }, [user, isProfileLoading]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
    "idle"
  );

  const set = (field: keyof ProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.email.trim()) e.email = "Email address is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = "Enter a valid email address";
    setErrors(e);
    if (Object.keys(e).length > 0)
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaveState("saving");
    try {
      const payload = {
        username: form.name.trim() || undefined,
        email: form.email.trim() || undefined,
        phone: form.phone.trim() || undefined,
        bio: form.bio.trim() || undefined,
        foodPreference: form.foodPreference.trim() || undefined,
        photo: form.avatarImage || undefined,
      };

      const updatedUser = await updateUserMeMutation.mutateAsync(payload);

      updateUser({
        ...(updatedUser ?? {}),
        username: updatedUser?.username ?? payload.username,
        name: updatedUser?.name ?? payload.username,
        email: updatedUser?.email ?? payload.email,
        phone: updatedUser?.phone ?? payload.phone,
        bio: updatedUser?.bio ?? payload.bio,
        foodPreference: updatedUser?.foodPreference ?? payload.foodPreference,
        photo: updatedUser?.photo ?? payload.photo,
        avatarImage: updatedUser?.avatarImage ?? payload.photo,
      });

      setSaveState("saved");
      setTimeout(() => router.back(), 600);
    } catch (error) {
      console.error("Error saving profile:", error);
      setSaveState("idle");
      Alert.alert("Save Failed", "Please check your connection and try again.");
    }
  };

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library."
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0])
      set("avatarImage", result.assets[0].uri);
  };

  const isSaving = saveState === "saving";

  if (loading || isProfileLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#f8f6f7]">
        <ActivityIndicator size="large" color="#ec4899" />
        <Text className="mt-3 text-base text-gray-500">
          {isProfileLoading
            ? "Fetching latest profile..."
            : "Loading profile..."}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#f8f6f7]" edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 20,
            paddingBottom: 40,
          }}
        >
          {/* Avatar */}
          <AvatarPicker
            name={form.name}
            avatarUri={form.avatarImage}
            onPick={pickAvatar}
          />

          {/* Personal Details */}
          <View className="mt-5 mb-3">
            <Text className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              Personal Details
            </Text>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </Text>
            <TextInput
              className="bg-white rounded-xl px-4 py-3.5 text-sm text-gray-900 border border-gray-200"
              placeholder="Enter your legal name"
              placeholderTextColor="#9CA3AF"
              value={form.name}
              onChangeText={(v) => set("name", v)}
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Email Address <Text className="text-pink-500">*</Text>
            </Text>
            <TextInput
              className={`bg-white rounded-xl px-4 py-3.5 text-sm text-gray-900 border ${errors.email ? "border-red-500" : "border-gray-200"}`}
              placeholder="name@example.com"
              placeholderTextColor="#9CA3AF"
              value={form.email}
              onChangeText={(v) => set("email", v)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && (
              <Text className="text-xs text-red-500 mt-1">{errors.email}</Text>
            )}
          </View>

          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </Text>
            <TextInput
              className="bg-white rounded-xl px-4 py-3.5 text-sm text-gray-900 border border-gray-200"
              placeholder="+977 98XXXXXXXX"
              placeholderTextColor="#9CA3AF"
              value={form.phone}
              onChangeText={(v) => set("phone", v)}
              keyboardType="phone-pad"
            />
          </View>

          {/* Stay Preferences */}
          <View className="mt-5 mb-3">
            <Text className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              Stay Preferences
            </Text>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Food Preference
            </Text>
            <View className="flex-row gap-2 flex-wrap">
              {FOOD_OPTIONS.map((opt) => {
                const active = form.foodPreference === opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    className={`flex-1 min-w-[80px] items-center justify-center py-3 rounded-xl border ${
                      active
                        ? "bg-pink-500 border-pink-500"
                        : "bg-white border-gray-200"
                    }`}
                    onPress={() => set("foodPreference", opt)}
                  >
                    <Text
                      className={`text-xs font-medium ${active ? "text-white" : "text-gray-500"}`}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* About You */}
          <View className="mt-5 mb-3">
            <Text className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              About You
            </Text>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Bio
            </Text>
            <TextInput
              className="bg-white rounded-xl px-4 py-3.5 text-sm text-gray-900 border border-gray-200 h-24"
              style={{ textAlignVertical: "top" }}
              placeholder="Tell others about yourself, your profession, your interests…"
              placeholderTextColor="#9CA3AF"
              value={form.bio}
              onChangeText={(v) => {
                if (v.length <= BIO_MAX) set("bio", v);
              }}
              multiline
              maxLength={BIO_MAX}
            />
            <Text className="text-xs text-right mt-1 text-gray-400">
              {form.bio.length}/{BIO_MAX}
            </Text>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            className="bg-pink-500 rounded-xl py-4 flex-row items-center justify-center gap-2 mt-6 mb-4"
            onPress={handleSave}
            disabled={isSaving}
            activeOpacity={0.85}
          >
            {isSaving ? (
              <>
                <ActivityIndicator size="small" color="#fff" />
                <Text className="text-base font-bold text-white">Saving…</Text>
              </>
            ) : saveState === "saved" ? (
              <Text className="text-base font-bold text-white">Saved!</Text>
            ) : (
              <Text className="text-base font-bold text-white">
                Update Profile
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
