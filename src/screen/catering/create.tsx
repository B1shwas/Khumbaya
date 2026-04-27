import { DatePicker } from "@/components/nativewindui/DatePicker";
import { Text } from "@/src/components/ui/Text";
import {
  useCreateCatering,
  useCreateCateringMenu,
} from "@/src/features/catering/hooks/use-catering";
import { cn } from "@/src/utils/cn";
import { shadowStyle } from "@/src/utils/helper";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Types ───────────────────────────────────────────────────────────────────

type MealType = "Breakfast" | "Lunch" | "High Tea" | "Dinner" | "Late Night";

type MenuType = "Buffet" | "Plated" | "Family Style" | "Station";

type CourseType = "Starter" | "Main" | "Dessert" | "Beverage";

interface MealOption {
  type: MealType;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
}

interface MenuDraft {
  name: string;
  description: string;
  type: CourseType;
  menuType: MenuType;
}

const MEAL_OPTIONS: MealOption[] = [
  { type: "Breakfast", icon: "breakfast-dining", color: "#f59e0b" },
  { type: "Lunch", icon: "lunch-dining", color: "#10b981" },
  { type: "High Tea", icon: "local-cafe", color: "#8b5cf6" },
  { type: "Dinner", icon: "dinner-dining", color: "#ee2b8c" },
  { type: "Late Night", icon: "nightlife", color: "#6366f1" },
];

const COURSE_OPTIONS: CourseType[] = ["Starter", "Main", "Dessert", "Beverage"];
const MENU_TYPES: MenuType[] = ["Buffet", "Plated", "Family Style", "Station"];

// ─── Sub-components ───────────────────────────────────────────────────────────

const FormSection = ({
  title,
  children,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  icon: keyof typeof Ionicons.glyphMap;
}) => (
  <View className="mb-8">
    <View className="flex-row items-center mb-4 px-1">
      <View className="w-8 h-8 rounded-md bg-primary/10 items-center justify-center mr-3">
        <Ionicons name={icon} size={18} color="#ee2b8c" />
      </View>
      <Text className="text-lg font-bold text-on-surface tracking-tight">
        {title}
      </Text>
    </View>
    <View
      className="bg-white rounded-md p-5 border border-white/40"
      style={shadowStyle}
    >
      {children}
    </View>
  </View>
);

const CustomInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  icon,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  icon?: keyof typeof MaterialIcons.glyphMap;
}) => (
  <View className="mb-5 last:mb-0">
    <Text className="text-[11px] font-bold text-muted-light uppercase tracking-widest mb-2 ml-1">
      {label}
    </Text>
    <View className="flex-row items-center bg-background-light/50 border border-outline-variant/50 rounded-md px-4 py-3.5 focus:border-primary/50">
      {icon && (
        <MaterialIcons name={icon} size={20} color="#896175" className="mr-3" />
      )}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#896175"
        className="flex-1 text-[16px] font-medium text-on-surface"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  </View>
);

const MenuItemRow = ({
  item,
  index,
  onUpdate,
  onRemove,
}: {
  item: MenuDraft;
  index: number;
  onUpdate: (key: keyof MenuDraft, value: string, idx: number) => void;
  onRemove: (idx: number) => void;
}) => (
  <View className="mb-5 rounded-3xl border border-outline-variant/40 bg-surface-container-high p-4">
    <View className="flex-row items-center justify-between mb-3">
      <Text className="text-sm font-black text-on-surface">
        Menu item {index + 1}
      </Text>
      <Pressable
        onPress={() => onRemove(index)}
        className="rounded-full bg-red-50 px-3 py-1"
      >
        <Text className="text-[11px] font-bold text-red-700">Remove</Text>
      </Pressable>
    </View>

    <CustomInput
      label="Dish name"
      placeholder="e.g. Chicken Curry"
      value={item.name}
      onChangeText={(value) => onUpdate("name", value, index)}
    />
    <CustomInput
      label="Description"
      placeholder="Spicy, vegetarian or plated details"
      value={item.description}
      onChangeText={(value) => onUpdate("description", value, index)}
    />

    <View className="flex-row items-center gap-2 flex-wrap">
      <View className="flex-1">
        <Text className="text-[11px] font-bold text-muted-light uppercase tracking-widest mb-2 ml-1">
          Course type
        </Text>
        <View className="rounded-md border border-outline-variant/50 bg-background-light p-2">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
          >
            {COURSE_OPTIONS.map((option) => {
              const isSelected = item.type === option;
              return (
                <Pressable
                  key={option}
                  onPress={() => onUpdate("type", option, index)}
                  className={cn(
                    "rounded-full px-3 py-2 border",
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-outline-variant/40 bg-white"
                  )}
                >
                  <Text
                    className={cn(
                      "text-[12px] font-bold",
                      isSelected ? "text-primary" : "text-on-surface"
                    )}
                  >
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
      <View className="flex-1">
        <Text className="text-[11px] font-bold text-muted-light uppercase tracking-widest mb-2 ml-1">
          Menu style
        </Text>
        <View className="rounded-md border border-outline-variant/50 bg-background-light p-2">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
          >
            {MENU_TYPES.map((option) => {
              const isSelected = item.menuType === option;
              return (
                <Pressable
                  key={option}
                  onPress={() => onUpdate("menuType", option, index)}
                  className={cn(
                    "rounded-full px-3 py-2 border",
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-outline-variant/40 bg-white"
                  )}
                >
                  <Text
                    className={cn(
                      "text-[12px] font-bold",
                      isSelected ? "text-primary" : "text-on-surface"
                    )}
                  >
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </View>
  </View>
);

const DEFAULT_MENU_ITEM: MenuDraft = {
  name: "",
  description: "",
  type: "Main",
  menuType: "Buffet",
};

export default function CreateCateringScreen() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams();
  const [selectedMeal, setSelectedMeal] = useState<MealType>("Lunch");
  const [pax, setPax] = useState("");
  const [title, setTitle] = useState("");
  const [vendor, setVendor] = useState("");
  const [notes, setNotes] = useState("");
  const [startDateTime, setStartDateTime] = useState<Date>(new Date());
  const [endDateTime, setEndDateTime] = useState<Date>(
    new Date(new Date().getTime() + 4 * 60 * 60 * 1000)
  );
  const [menuItems, setMenuItems] = useState<MenuDraft[]>([DEFAULT_MENU_ITEM]);

  const createCateringMutation = useCreateCatering();
  const createMenuMutation = useCreateCateringMenu();
  const isSaving =
    createCateringMutation.status === "pending" ||
    createMenuMutation.status === "pending";

  const handleUpdateMenuItem = (
    key: keyof MenuDraft,
    value: string,
    index: number
  ) => {
    setMenuItems((previous) =>
      previous.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      )
    );
  };

  const handleRemoveMenuItem = (index: number) => {
    setMenuItems((previous) =>
      previous.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const addMenuItem = () => {
    setMenuItems((previous) => [...previous, { ...DEFAULT_MENU_ITEM }]);
  };

  const handleSave = async () => {
    if (!eventId) {
      return;
    }

    const eventIdValue = String(eventId);

    try {
      const cateringResponse = await createCateringMutation.mutateAsync({
        eventId: eventIdValue,
        payload: {
          name: title || "Catering Package",
          per_plate_price: Number(pax) || 0,
          startDateTime: startDateTime.toISOString(),
          endDateTime: endDateTime.toISOString(),
          meal_type: selectedMeal,
        },
      });

      const cateringId = cateringResponse?.id;

      if (cateringId) {
        const validMenuItems = menuItems.filter((item) => item.name.trim());
        await Promise.all(
          validMenuItems.map((item) =>
            createMenuMutation.mutateAsync({
              cateringId,
              eventId: eventIdValue,
              payload: {
                name: item.name,
                description: item.description,
                type: item.type,
                menuType: item.menuType,
              },
            })
          )
        );
      }

      router.back();
    } catch (error) {
      console.error("Catering save failed", error);
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-background-light"
      edges={["top", "bottom"]}
    >
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <LinearGradient
            colors={["rgba(238,43,140,0.12)", "transparent"]}
            className="px-6 pt-6 pb-12 rounded-b-[40px]"
          >
            <View className="flex-row items-center justify-between mb-8">
              <Pressable
                onPress={() => router.back()}
                className="w-10 h-10 rounded-full bg-white items-center justify-center"
              >
                <MaterialIcons
                  name="arrow-back-ios"
                  size={18}
                  color="#ee2b8c"
                  style={{ marginLeft: 6 }}
                />
              </Pressable>
              <View className="bg-white/60 px-4 py-2 rounded-full border border-white/40">
                <Text className="text-[12px] font-black text-primary uppercase tracking-widest">
                  Catering
                </Text>
              </View>
            </View>

            <Text className="text-3xl font-black text-on-surface tracking-tighter mb-2">
              New Catering Plan
            </Text>
            <Text className="text-muted-light font-medium text-lg leading-6">
              Create your event catering package with menu sections, pricing and
              schedule.
            </Text>
          </LinearGradient>

          <View className="px-6 -mt-8">
            <FormSection title="Plan details" icon="restaurant-outline">
              <CustomInput
                label="Package title"
                placeholder="e.g. Signature Wedding Buffet"
                value={title}
                onChangeText={setTitle}
                icon="title"
              />
              <CustomInput
                label="Per plate price"
                placeholder="2000"
                value={pax}
                onChangeText={setPax}
                keyboardType="numeric"
                icon="payments"
              />
            </FormSection>

            <FormSection title="Schedule" icon="time-outline">
              <View className="mb-5">
                <Text className="text-[11px] font-bold text-muted-light uppercase tracking-widest mb-2 ml-1">
                  Start date
                </Text>
                <DatePicker
                  mode="date"
                  value={startDateTime}
                  onChange={(_event: any, date?: Date) => {
                    if (date) {
                      const updated = new Date(startDateTime);
                      updated.setFullYear(
                        date.getFullYear(),
                        date.getMonth(),
                        date.getDate()
                      );
                      setStartDateTime(updated);
                    }
                  }}
                />
              </View>

              <View className="mb-5">
                <Text className="text-[11px] font-bold text-muted-light uppercase tracking-widest mb-2 ml-1">
                  Start time
                </Text>
                <DatePicker
                  mode="time"
                  value={startDateTime}
                  onChange={(_event: any, date?: Date) => {
                    if (date) {
                      const updated = new Date(startDateTime);
                      updated.setHours(date.getHours(), date.getMinutes());
                      setStartDateTime(updated);
                    }
                  }}
                />
              </View>

              <View className="mb-5">
                <Text className="text-[11px] font-bold text-muted-light uppercase tracking-widest mb-2 ml-1">
                  End date
                </Text>
                <DatePicker
                  mode="date"
                  value={endDateTime}
                  onChange={(_event: any, date?: Date) => {
                    if (date) {
                      const updated = new Date(endDateTime);
                      updated.setFullYear(
                        date.getFullYear(),
                        date.getMonth(),
                        date.getDate()
                      );
                      setEndDateTime(updated);
                    }
                  }}
                />
              </View>

              <View>
                <Text className="text-[11px] font-bold text-muted-light uppercase tracking-widest mb-2 ml-1">
                  End time
                </Text>
                <DatePicker
                  mode="time"
                  value={endDateTime}
                  onChange={(_event: any, date?: Date) => {
                    if (date) {
                      const updated = new Date(endDateTime);
                      updated.setHours(date.getHours(), date.getMinutes());
                      setEndDateTime(updated);
                    }
                  }}
                />
              </View>
            </FormSection>

            <FormSection title="Menu planner" icon="reader-outline">
              {menuItems.map((item, index) => (
                <MenuItemRow
                  key={`${item.name}-${index}`}
                  item={item}
                  index={index}
                  onUpdate={handleUpdateMenuItem}
                  onRemove={handleRemoveMenuItem}
                />
              ))}
              <Pressable
                onPress={addMenuItem}
                className="rounded-3xl border border-dashed border-primary/50 bg-white/80 px-4 py-3 items-center"
              >
                <Text className="text-primary font-black">
                  + Add another menu item
                </Text>
              </Pressable>
            </FormSection>

            <FormSection title="Extras" icon="document-text-outline">
              <Text className="text-[11px] font-bold text-muted-light uppercase tracking-widest mb-2 ml-1">
                Notes for the catering team
              </Text>
              <TextInput
                multiline
                numberOfLines={4}
                placeholder="Allergies, serve time, meal preferences..."
                placeholderTextColor="#896175"
                className="bg-background-light/50 border border-outline-variant/50 rounded-md px-4 py-4 min-h-[120px] text-[16px] font-medium text-on-surface"
                style={{ textAlignVertical: "top" }}
                value={notes}
                onChangeText={setNotes}
              />
            </FormSection>

            <TouchableOpacity
              onPress={handleSave}
              activeOpacity={0.8}
              className="mt-4 mb-10 overflow-hidden rounded-md bg-white"
              style={{
                ...shadowStyle,
                shadowColor: "#ee2b8c",
                shadowOpacity: 0.4,
              }}
              disabled={isSaving}
            >
              <LinearGradient
                colors={
                  isSaving ? ["#dcb3c1", "#e2a1c1"] : ["#ee2b8c", "#d11d73"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="py-5 items-center flex-row justify-center"
              >
                <Text className="text-white text-lg font-black tracking-tight mr-2">
                  {isSaving ? "Saving..." : "Create Catering Plan"}
                </Text>
                <MaterialIcons name="check-circle" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>

            <View className="items-center pb-8">
              <Text className="text-[10px] font-black text-muted-light uppercase tracking-[4px]">
                Powered by Khumbaya
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
