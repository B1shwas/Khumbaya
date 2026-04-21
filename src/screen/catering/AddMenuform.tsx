import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  ImageBackground,
  StatusBar,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";

type CourseType = "starter" | "main" | "dessert" | "beverage";

interface MenuFormData {
  itemName: string;
  courseType: CourseType;
  description: string;
  isVegetarian: boolean;
}

interface AddMenuFormProps {
  onBack?: () => void;
  onSave?: (data: MenuFormData) => void;
  initialData?: MenuFormData;
  isEditing?: boolean;
}

const COURSE_OPTIONS: { label: string; value: CourseType }[] = [
  { label: "Starter", value: "starter" },
  { label: "Main Course", value: "main" },
  { label: "Dessert", value: "dessert" },
  { label: "Beverage", value: "beverage" },
];

export default function AddMenuItemScreen({
  onBack,
  onSave,
  initialData,
  isEditing = false,
}: AddMenuFormProps) {
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "services" | "menu" | "settings"
  >("menu");

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MenuFormData>({
    defaultValues: initialData || {
      itemName: "",
      courseType: "starter",
      description: "",
      isVegetarian: true,
    },
  });

  const onSubmit = (data: MenuFormData) => {
    onSave?.(data);
    if (!isEditing) {
      reset();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f8f6f7]">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="rgba(255,255,255,0.9)"
      />

      {/* ── Top App Bar ─────────────────────────────────────────────────── */}
      <View className="flex-row items-center justify-between px-5 h-16 bg-white/80 border-b border-gray-100">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={onBack}
            className="w-10 h-10 rounded-full items-center justify-center bg-zinc-50 active:bg-zinc-100"
            activeOpacity={0.7}
          >
            <Text className="text-zinc-500 text-lg">←</Text>
          </TouchableOpacity>
          <Text className="text-[#181114] text-xl font-extrabold tracking-tight">
            {isEditing ? "Edit Menu Item" : "Add Menu Item"}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className="bg-[#ee2b8c] px-6 py-2 rounded-full active:opacity-80"
          activeOpacity={0.85}
        >
          <Text className="text-white font-bold text-sm tracking-wide">
            Save
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Scrollable Body ─────────────────────────────────────────────── */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <View className="w-full h-48 rounded-3xl overflow-hidden mb-10 shadow-xl">
          <ImageBackground
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKCep2F-vaeuj47t6ftWpoD4-iLVVX7z7kUYaeHK2KN7l7JNcuDmRKHrieudstaTMeG8ylmzyAdfXsqBxkWaWok4hR8byve598jufTmkbkvc_aRWZ9ewnPaVE2vbIr7q1gsY5RWp0jDgRj7G4xlB5jpxOsjzErgaqrM7oYhI9uMRuJaK8_SYTGlYifGY7BFhvHvJI2dlAcE7nHUp3_xQ32pq-lD3DNsoink06g8unkUy8HMSVrsbaDKRnuO9GwxaEw7TORckEuOBo",
            }}
            className="flex-1"
            resizeMode="cover"
          >
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                top: "40%",
                backgroundColor: "rgba(0,0,0,0.45)",
              }}
            />

            <View className="absolute bottom-4 left-5">
              <View className="bg-white/20 self-start px-3 py-1 rounded-full border border-white/30 mb-1">
                <Text className="text-white text-[10px] font-bold uppercase tracking-widest">
                  {isEditing ? "Editing" : "New Creation"}
                </Text>
              </View>
              <Text className="text-white font-bold text-xl">
                {isEditing
                  ? "Update your masterpiece"
                  : "Define your next masterpiece"}
              </Text>
            </View>
          </ImageBackground>
        </View>

        {/* ── Basic Information ─────────────────────────────────────────── */}
        <View className="mb-2">
          <View className="flex-row items-center gap-2 mb-6">
            <View className="w-1 h-6 bg-[#ee2b8c] rounded-full" />
            <Text className="text-xs font-extrabold uppercase tracking-widest text-zinc-400">
              Basic Information
            </Text>
          </View>

          {/* Item Name */}
          <View className="mb-6">
            <Text className="text-xs font-bold text-[#594048] mb-2 ml-1 uppercase tracking-wide">
              Item Name
            </Text>
            <Controller
              control={control}
              name="itemName"
              rules={{ required: "Item name is required" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="w-full bg-white rounded-xl px-4 py-4 text-[#181114] shadow-sm"
                  placeholder="e.g. Truffle Infused Risotto"
                  placeholderTextColor="#d1d5db"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={{ fontSize: 15 }}
                />
              )}
            />
            {errors.itemName && (
              <Text className="text-red-500 text-xs ml-1 mt-1">
                {errors.itemName.message}
              </Text>
            )}
          </View>

          {/* Course Type — Custom Picker */}
          <View className="mb-6">
            <Text className="text-xs font-bold text-[#594048] mb-2 ml-1 uppercase tracking-wide">
              Course Type
            </Text>
            <Controller
              control={control}
              name="courseType"
              render={({ field: { onChange, value } }) => (
                <>
                  <TouchableOpacity
                    className="w-full bg-white rounded-xl px-4 py-4 flex-row items-center justify-between shadow-sm"
                    onPress={() => setShowCourseDropdown(!showCourseDropdown)}
                    activeOpacity={0.8}
                  >
                    <Text className="text-[#181114] text-[15px]">
                      {COURSE_OPTIONS.find((o) => o.value === value)?.label}
                    </Text>
                    <Text className="text-[#ee2b8c] text-lg">
                      {showCourseDropdown ? "▲" : "▼"}
                    </Text>
                  </TouchableOpacity>

                  {showCourseDropdown && (
                    <View className="bg-white rounded-xl mt-1 shadow-md overflow-hidden border border-gray-100">
                      {COURSE_OPTIONS.map((opt, idx) => (
                        <TouchableOpacity
                          key={opt.value}
                          onPress={() => {
                            onChange(opt.value);
                            setShowCourseDropdown(false);
                          }}
                          className={`px-4 py-3.5 ${
                            value === opt.value ? "bg-[#fdf2f8]" : "bg-white"
                          } ${idx < COURSE_OPTIONS.length - 1 ? "border-b border-gray-50" : ""}`}
                          activeOpacity={0.7}
                        >
                          <Text
                            className={`text-[15px] ${
                              value === opt.value
                                ? "text-[#ee2b8c] font-bold"
                                : "text-[#181114]"
                            }`}
                          >
                            {opt.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </>
              )}
            />
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-xs font-bold text-[#594048] mb-2 ml-1 uppercase tracking-wide">
              Description
            </Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="w-full bg-white rounded-xl px-4 py-4 text-[#181114] shadow-sm"
                  placeholder="Describe the flavors, texture, and origin..."
                  placeholderTextColor="#d1d5db"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  style={{ fontSize: 15, minHeight: 112 }}
                />
              )}
            />
          </View>
        </View>

        {/* ── Dietary Details ───────────────────────────────────────────── */}
        <View className="mb-8">
          <View className="flex-row items-center gap-2 mb-6">
            <View className="w-1 h-6 bg-[#ee2b8c] rounded-full" />
            <Text className="text-xs font-extrabold uppercase tracking-widest text-zinc-400">
              Dietary Details
            </Text>
          </View>

          <Controller
            control={control}
            name="isVegetarian"
            render={({ field: { onChange, value } }) => (
              <View className="bg-white p-5 rounded-xl shadow-sm flex-row items-center justify-between">
                <View className="flex-row items-center gap-4">
                  <View className="w-10 h-10 rounded-full bg-green-50 items-center justify-center">
                    <Text className="text-green-700 text-lg">🌿</Text>
                  </View>
                  <View>
                    <Text className="font-bold text-[#181114] text-[15px]">
                      Vegetarian
                    </Text>
                    <Text className="text-xs text-zinc-400 mt-0.5">
                      Suitable for meat-free diets
                    </Text>
                  </View>
                </View>
                <Switch
                  value={value}
                  onValueChange={onChange}
                  trackColor={{ false: "#e4e4e7", true: "#ee2b8c" }}
                  thumbColor="#ffffff"
                  ios_backgroundColor="#e4e4e7"
                />
              </View>
            )}
          />
        </View>

        {/* ── Hint Card ─────────────────────────────────────────────────── */}
        <View className="bg-[#fdf2f8] rounded-2xl p-6 flex-row gap-4 border border-[#ee2b8c]/10">
          <Text className="text-[#ee2b8c] text-xl mt-0.5">💡</Text>
          <View className="flex-1">
            <Text className="text-[#ee2b8c] font-bold text-sm mb-1">
              Design Tip
            </Text>
            <Text className="text-[#9d1759]/70 text-xs leading-5">
              Premium items with detailed descriptions and dietary tags tend to
              receive 30% more interest in catering proposals.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* ── Bottom Nav Bar ────────────────────────────────────────────────── */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-zinc-100 rounded-t-2xl"
        style={{
          paddingBottom: Platform.OS === "ios" ? 20 : 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 12,
          elevation: 12,
        }}
      >
        <View className="flex-row justify-around items-center pt-3 px-4">
          {(
            [
              { key: "overview", label: "Overview", icon: "⊞" },
              { key: "services", label: "Services", icon: "🍴" },
              { key: "menu", label: "Menu", icon: "📋" },
              { key: "settings", label: "Settings", icon: "⚙️" },
            ] as const
          ).map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                className={`items-center justify-center px-4 py-1 rounded-xl ${
                  isActive ? "bg-[#ee2b8c]/5" : ""
                }`}
                activeOpacity={0.7}
              >
                <Text
                  className={`text-xl ${isActive ? "opacity-100" : "opacity-40"}`}
                >
                  {tab.icon}
                </Text>
                <Text
                  className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${
                    isActive ? "text-[#ee2b8c]" : "text-zinc-400"
                  }`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}
