import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface FormState {
  businessName: string;
  description: string;
  city: string;
  country: string;
}

export default function CreateBusinessScreen() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    businessName: "",
    description: "",
    city: "",
    country: "",
  });
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);

  const slug = useMemo(
    () =>
      form.businessName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
    [form.businessName]
  );

  const handleSubmit = () => {
    if (!form.businessName.trim()) {
      Alert.alert("Required", "Please enter a business name.");
      return;
    }
    // TODO: call API to create business
    Alert.alert("Success", "Business created!", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  const pickImage = async (
    setter: (uri: string) => void,
    aspect: [number, number]
  ) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setter(result.assets[0].uri);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 bg-[#f8f6f7]">
      {/* Header */}

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Visual Assets */}
        <View className="mb-8 gap-5">
          {/* Cover Image — full width */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => pickImage(setCoverImage, [16, 7])}
            className="w-full rounded-xl overflow-hidden border-2 border-dashed border-gray-200 bg-[#f0edee]"
            style={{ aspectRatio: 16 / 7 }}
          >
            {coverImage ? (
              <Image
                source={{ uri: coverImage }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="flex-1 items-center justify-center gap-1">
                <MaterialIcons name="add-a-photo" size={28} color="#9ca3af" />
                <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Upload Cover
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Avatar — centered below cover */}
          <View className="items-center">
            <View className="relative">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => pickImage(setAvatarImage, [1, 1])}
                className="w-36 h-36 rounded-full border-2 border-dashed border-[#ee2b8c]/40 bg-[#ee2b8c]/10 items-center justify-center overflow-hidden"
              >
                {avatarImage ? (
                  <Image
                    source={{ uri: avatarImage }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="items-center">
                    <MaterialIcons
                      name="account-circle"
                      size={44}
                      color="#ee2b8c"
                    />
                    <Text className="text-[9px] font-bold text-[#ee2b8c] mt-1 tracking-widest">
                      AVATAR
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              {/* Edit badge */}
              <View className="absolute bottom-1 right-1 bg-[#ee2b8c] p-2 rounded-full border-2 border-white shadow-sm">
                <MaterialIcons name="edit" size={14} color="white" />
              </View>
            </View>
          </View>
        </View>

        {/* Form */}
        <View className="gap-5">
          {/* Business Name */}
          <View>
            <Text className="text-[11px] font-bold text-[#594048] uppercase tracking-widest ml-1 mb-1.5">
              Business Name
            </Text>
            <TextInput
              className="w-full bg-white border border-gray-100 rounded-xl px-5 py-4 text-[#181114] font-semibold text-[15px] shadow-sm"
              placeholder="e.g. Velvet Atelier"
              placeholderTextColor="#d1d5db"
              value={form.businessName}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, businessName: text }))
              }
            />
          </View>

          {/* Slug */}
          <View>
            <Text className="text-[11px] font-bold text-[#594048] uppercase tracking-widest ml-1 mb-1.5">
              Slug
            </Text>
            <View className="flex-row items-center bg-[#e8e5e6]/50 rounded-xl px-5 py-4 border border-gray-100">
              <Text className="text-gray-400 text-sm font-medium">
                velvetamaranth.com/
              </Text>
              <Text className="text-[#181114] font-bold text-sm flex-1 ml-0.5">
                {slug || "your-business"}
              </Text>
              <MaterialIcons name="lock" size={16} color="#9ca3af" />
            </View>
          </View>

          {/* Description */}
          <View>
            <Text className="text-[11px] font-bold text-[#594048] uppercase tracking-widest ml-1 mb-1.5">
              Description
            </Text>
            <TextInput
              className="w-full bg-white border border-gray-100 rounded-xl px-5 py-4 text-[#181114] font-medium text-[15px] shadow-sm"
              placeholder="Tell the world about your unique brand..."
              placeholderTextColor="#d1d5db"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={{ minHeight: 110 }}
              value={form.description}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, description: text }))
              }
            />
          </View>

          {/* City + Country */}
          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="text-[11px] font-bold text-[#594048] uppercase tracking-widest ml-1 mb-1.5">
                City
              </Text>
              <View className="flex-row items-center bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                <MaterialIcons
                  name="location-city"
                  size={18}
                  color="#9ca3af"
                  style={{ marginLeft: 14 }}
                />
                <TextInput
                  className="flex-1 px-2.5 py-4 text-[#181114] font-semibold text-[15px]"
                  placeholder="Kathmandu"
                  placeholderTextColor="#d1d5db"
                  value={form.city}
                  onChangeText={(text) =>
                    setForm((prev) => ({ ...prev, city: text }))
                  }
                />
              </View>
            </View>

            <View className="flex-1">
              <Text className="text-[11px] font-bold text-[#594048] uppercase tracking-widest ml-1 mb-1.5">
                Country
              </Text>
              <View className="flex-row items-center bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                <MaterialIcons
                  name="public"
                  size={18}
                  color="#9ca3af"
                  style={{ marginLeft: 14 }}
                />
                <TextInput
                  className="flex-1 px-2.5 py-4 text-[#181114] font-semibold text-[15px]"
                  placeholder="Nepal"
                  placeholderTextColor="#d1d5db"
                  value={form.country}
                  onChangeText={(text) =>
                    setForm((prev) => ({ ...prev, country: text }))
                  }
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Submit Button */}
      <SafeAreaView edges={["bottom"]} className="px-6 pb-4 bg-[#f8f6f7]/95">
        <TouchableOpacity
          activeOpacity={0.85}
          className="w-full bg-[#ee2b8c] rounded-2xl py-5 flex-row items-center justify-center gap-3 shadow-lg"
          style={{
            shadowColor: "#ee2b8c",
            shadowOpacity: 0.25,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
            elevation: 6,
          }}
        >
          <Text className="text-white font-extrabold text-[18px] tracking-tight">
            Create Business
          </Text>
          <MaterialIcons name="arrow-forward" size={22} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
