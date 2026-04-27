import { DatePicker } from "@/components/nativewindui/DatePicker";
import { Text } from "@/src/components/ui/Text";
import {
  useCreateCateringMenu,
  useGetCateringById,
  useUpdateCatering,
  useUpdateMenu,
} from "@/src/features/catering/hooks/use-catering";
import { CateringMenu } from "@/src/features/catering/types/catering.types";
import { cn } from "@/src/utils/cn";
import { shadowStyle } from "@/src/utils/helper";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  ActivityIndicator,
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

type MealType = "Breakfast" | "Lunch" | "High Tea" | "Dinner" | "Late Night";

type MenuType = "Buffet" | "Plated" | "Family Style" | "Station";

type CourseType = "Starter" | "Main" | "Dessert" | "Beverage";

interface MenuDraft {
  id?: string | number;
  name: string;
  description: string;
  type: CourseType;
  menuType: MenuType;
}

const MEAL_OPTIONS: MealType[] = [
  "Breakfast",
  "Lunch",
  "High Tea",
  "Dinner",
  "Late Night",
];
const COURSE_OPTIONS: CourseType[] = ["Starter", "Main", "Dessert", "Beverage"];
const MENU_TYPES: MenuType[] = ["Buffet", "Plated", "Family Style", "Station"];

const DEFAULT_MENU_ITEM: MenuDraft = {
  name: "",
  description: "",
  type: "Main",
  menuType: "Buffet",
};

interface CateringFormValues {
  title: string;
  pax: string;
  selectedMeal: MealType;
  notes: string;
  startDateTime: string;
  endDateTime: string;
  menuItems: MenuDraft[];
}

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

export default function EditCateringScreen() {
  const router = useRouter();
  const { eventId, cateringId } = useLocalSearchParams();

  const { control, handleSubmit, watch, reset, setValue } =
    useForm<CateringFormValues>({
      defaultValues: {
        title: "",
        pax: "",
        selectedMeal: "Lunch",
        notes: "",
        startDateTime: new Date().toISOString(),
        endDateTime: new Date(
          new Date().getTime() + 4 * 60 * 60 * 1000
        ).toISOString(),
        menuItems: [{ ...DEFAULT_MENU_ITEM }],
      },
    });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "menuItems",
  });

  const selectedMeal = watch("selectedMeal");
  const startDateTime = watch("startDateTime");
  const endDateTime = watch("endDateTime");
  const menuItems = watch("menuItems");

  const cateringIdValue =
    typeof cateringId === "string" ? cateringId : String(cateringId ?? "");
  const eventIdValue =
    typeof eventId === "string"
      ? eventId
      : Array.isArray(eventId)
        ? (eventId[0] ?? undefined)
        : undefined;
  const { data, isLoading } = useGetCateringById(cateringIdValue || undefined);
  const updateCateringMutation = useUpdateCatering();
  const updateMenuMutation = useUpdateMenu();
  const createMenuMutation = useCreateCateringMenu();

  useEffect(() => {
    if (data) {
      reset({
        title: data.name ?? "",
        pax: String(data.per_plate_price ?? ""),
        selectedMeal: (data.meal_type as MealType) ?? "Lunch",
        notes: "",
        startDateTime: data.startDateTime
          ? new Date(data.startDateTime).toISOString()
          : new Date().toISOString(),
        endDateTime: data.endDateTime
          ? new Date(data.endDateTime).toISOString()
          : new Date(new Date().getTime() + 4 * 60 * 60 * 1000).toISOString(),
        menuItems:
          data.menus && data.menus.length > 0
            ? (data.menus ?? []).map((menu: CateringMenu) => ({
                id: menu.id,
                name: menu.name,
                description: menu.description,
                type: menu.type as CourseType,
                menuType: menu.menuType as MenuType,
              }))
            : [{ ...DEFAULT_MENU_ITEM }],
      });
    }
  }, [data, reset]);

  const handleUpdateMenuItem = (
    key: keyof MenuDraft,
    value: string,
    index: number
  ) => {
    const currentItem = menuItems?.[index];
    if (!currentItem) return;

    update(index, {
      ...currentItem,
      [key]: value,
    });
  };

  const handleRemoveMenuItem = (index: number) => {
    remove(index);
  };

  const addMenuItem = () => {
    append({ ...DEFAULT_MENU_ITEM });
  };

  const isSaving =
    updateCateringMutation.status === "pending" ||
    updateMenuMutation.status === "pending" ||
    createMenuMutation.status === "pending";

  const handleSave = handleSubmit(async (formValues) => {
    if (!eventIdValue || !cateringIdValue) {
      return;
    }

    const payload = {
      name: formValues.title || "Catering Package",
      per_plate_price: Number(formValues.pax) || 0,
      startDateTime: new Date(formValues.startDateTime).toISOString(),
      endDateTime: new Date(formValues.endDateTime).toISOString(),
      meal_type: formValues.selectedMeal,
    };

    try {
      await updateCateringMutation.mutateAsync({
        cateringId: cateringIdValue,
        payload,
        eventId: eventIdValue,
      });

      const validMenuItems = formValues.menuItems.filter((item) =>
        item.name.trim()
      );

      await Promise.all(
        validMenuItems.map((item) => {
          if (item.id) {
            return updateMenuMutation.mutateAsync({
              menuId: item.id,
              cateringId: cateringIdValue,
              payload: {
                name: item.name,
                description: item.description,
                type: item.type,
                menuType: item.menuType,
              },
              eventId: eventIdValue,
            });
          }

          return createMenuMutation.mutateAsync({
            cateringId: cateringIdValue,
            payload: {
              name: item.name,
              description: item.description,
              type: item.type,
              menuType: item.menuType,
            },
            eventId: eventIdValue,
          });
        })
      );

      router.back();
    } catch (error) {
      console.error("Failed to update catering", error);
    }
  });

  if (isLoading) {
    return (
      <SafeAreaView
        className="flex-1 bg-background-light"
        edges={["top", "bottom"]}
      >
        <StatusBar barStyle="dark-content" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#ee2b8c" />
          <Text className="text-on-surface mt-4">
            Loading catering details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
                  Update Catering
                </Text>
              </View>
            </View>

            <Text className="text-3xl font-black text-on-surface tracking-tighter mb-2">
              Edit Catering Plan
            </Text>
            <Text className="text-muted-light font-medium text-lg leading-6">
              Update details and menu items for this catering package.
            </Text>
          </LinearGradient>

          <View className="px-6 -mt-8">
            <FormSection title="Plan details" icon="restaurant-outline">
              <Controller
                control={control}
                name="title"
                render={({ field: { value, onChange } }) => (
                  <CustomInput
                    label="Package title"
                    placeholder="e.g. Signature Wedding Buffet"
                    value={value}
                    onChangeText={onChange}
                    icon="title"
                  />
                )}
              />
              <Controller
                control={control}
                name="pax"
                render={({ field: { value, onChange } }) => (
                  <CustomInput
                    label="Per plate price"
                    placeholder="2000"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="numeric"
                    icon="payments"
                  />
                )}
              />

              <View className="mb-5">
                <Text className="text-[11px] font-bold text-muted-light uppercase tracking-widest mb-2 ml-1">
                  Meal type
                </Text>
                <View className="rounded-md border border-outline-variant/50 bg-background-light p-2">
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 10 }}
                  >
                    {MEAL_OPTIONS.map((option) => {
                      const isSelected = selectedMeal === option;
                      return (
                        <Pressable
                          key={option}
                          onPress={() => setValue("selectedMeal", option)}
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
            </FormSection>

            <FormSection title="Schedule" icon="time-outline">
              <View className="mb-5">
                <Text className="text-[11px] font-bold text-muted-light uppercase tracking-widest mb-2 ml-1">
                  Start date
                </Text>
                <DatePicker
                  mode="date"
                  value={new Date(startDateTime)}
                  onChange={(_event: any, date?: Date) => {
                    if (date) {
                      const updated = new Date(startDateTime);
                      updated.setFullYear(
                        date.getFullYear(),
                        date.getMonth(),
                        date.getDate()
                      );
                      setValue("startDateTime", updated.toISOString());
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
                  value={new Date(startDateTime)}
                  onChange={(_event: any, date?: Date) => {
                    if (date) {
                      const updated = new Date(startDateTime);
                      updated.setHours(date.getHours(), date.getMinutes());
                      setValue("startDateTime", updated.toISOString());
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
                  value={new Date(endDateTime)}
                  onChange={(_event: any, date?: Date) => {
                    if (date) {
                      const updated = new Date(endDateTime);
                      updated.setFullYear(
                        date.getFullYear(),
                        date.getMonth(),
                        date.getDate()
                      );
                      setValue("endDateTime", updated.toISOString());
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
                  value={new Date(endDateTime)}
                  onChange={(_event: any, date?: Date) => {
                    if (date) {
                      const updated = new Date(endDateTime);
                      updated.setHours(date.getHours(), date.getMinutes());
                      setValue("endDateTime", updated.toISOString());
                    }
                  }}
                />
              </View>
            </FormSection>

            <FormSection title="Menu planner" icon="reader-outline">
              {fields.map((field, index) => (
                <MenuItemRow
                  key={field.id}
                  item={menuItems?.[index] ?? field}
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

            <FormSection title="Notes" icon="document-text-outline">
              <Controller
                control={control}
                name="notes"
                render={({ field: { value, onChange } }) => (
                  <>
                    <Text className="text-[11px] font-bold text-muted-light uppercase tracking-widest mb-2 ml-1">
                      Plan notes
                    </Text>
                    <TextInput
                      multiline
                      numberOfLines={4}
                      placeholder="Dietary restrictions, service notes, or special requests"
                      placeholderTextColor="#896175"
                      className="bg-background-light/50 border border-outline-variant/50 rounded-md px-4 py-4 min-h-[120px] text-[16px] font-medium text-on-surface"
                      style={{ textAlignVertical: "top" }}
                      value={value}
                      onChangeText={onChange}
                    />
                  </>
                )}
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
                  {isSaving ? "Saving..." : "Save Changes"}
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
