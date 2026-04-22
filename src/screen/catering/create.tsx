import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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
import { Text } from "../../components/ui/Text";
import { cn } from "../../utils/cn";
import { shadowStyle } from "../../utils/helper";

// ─── Types ────────────────────────────────────────────────────────────────────

type MealType = "Breakfast" | "Lunch" | "High Tea" | "Dinner" | "Late Night";

interface MealOption {
    type: MealType;
    icon: keyof typeof MaterialIcons.glyphMap;
    color: string;
}

const MEAL_OPTIONS: MealOption[] = [
    { type: "Breakfast", icon: "breakfast-dining", color: "#f59e0b" },
    { type: "Lunch", icon: "lunch-dining", color: "#10b981" },
    { type: "High Tea", icon: "local-cafe", color: "#8b5cf6" },
    { type: "Dinner", icon: "dinner-dining", color: "#ee2b8c" },
    { type: "Late Night", icon: "nightlife", color: "#6366f1" },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

const FormSection = ({ title, children, icon }: { title: string; children: React.ReactNode; icon: keyof typeof Ionicons.glyphMap }) => (
    <View className="mb-8">
        <View className="flex-row items-center mb-4 px-1">
            <View className="w-8 h-8 rounded-md bg-primary/10 items-center justify-center mr-3">
                <Ionicons name={icon} size={18} color="#ee2b8c" />
            </View>
            <Text className="text-lg font-bold text-on-surface tracking-tight">{title}</Text>
        </View>
        <View className="bg-white rounded-md p-5 border border-white/40" style={shadowStyle}>
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
    icon
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
            {icon && <MaterialIcons name={icon} size={20} color="#896175" className="mr-3" />}
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

// ─── Main Screen ───────────────────────────────────────────────────────────────

export default function CreateCateringScreen() {
    const router = useRouter();
    const [selectedMeal, setSelectedMeal] = useState<MealType>("Lunch");
    const [pax, setPax] = useState("");
    const [title, setTitle] = useState("");
    const [vendor, setVendor] = useState("");
    const [notes, setNotes] = useState("");

    const handleSave = () => {
        // Implement save logic here
        console.log("Saving catering plan...");
        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-background-light" edges={["top", "bottom"]}>
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
                    {/* Header */}
                    <LinearGradient
                        colors={["rgba(238,43,140,0.1)", "transparent"]}
                        className="px-6 pt-6 pb-12 rounded-b-[40px]"
                    >
                        <View className="flex-row items-center justify-between mb-8">
                            <Pressable
                                onPress={() => router.back()}
                                className="w-10 h-10 rounded-full bg-white items-center justify-center "
                            >
                                <MaterialIcons name="arrow-back-ios" size={18} color="#ee2b8c" style={{ marginLeft: 6 }} />
                            </Pressable>
                            <View className="bg-white/60 px-4 py-2 rounded-full border border-white/40">
                                <Text className="text-[12px] font-black text-primary uppercase tracking-widest">
                                    Setup Mode
                                </Text>
                            </View>
                        </View>

                        <View>
                            <Text className="text-3xl font-black text-on-surface tracking-tighter mb-2">
                                Add Catering
                            </Text>
                            <Text className="text-muted-light font-medium text-lg leading-6">
                                Design a premium culinary experience for your guests.
                            </Text>
                        </View>
                    </LinearGradient>

                    {/* Form Content */}
                    <View className="px-6 -mt-8">

                        {/* Meal Type Selection */}
                        <View className="mb-8">
                            <Text className="text-lg font-bold text-on-surface tracking-tight mb-4 px-1">
                                Meal Selection
                            </Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ gap: 12, paddingRight: 20 }}
                                className="py-1"
                            >
                                {MEAL_OPTIONS.map((option) => {
                                    const isSelected = selectedMeal === option.type;
                                    return (
                                        <Pressable
                                            key={option.type}
                                            onPress={() => setSelectedMeal(option.type)}
                                            className={cn(
                                                "items-center justify-center p-4 rounded-[24px] min-w-[90px] border bg-white",
                                                isSelected ? "bg-primary border-primary" : "bg-white border-outline-variant/30"
                                            )}
                                            style={isSelected ? { ...shadowStyle, shadowColor: "#ee2b8c", shadowOpacity: 0.3 } : shadowStyle}
                                        >
                                            <View
                                                className={cn(
                                                    "w-12 h-12 rounded-md items-center justify-center mb-2",
                                                    isSelected ? "bg-white/20" : "bg-background-light"
                                                )}
                                            >
                                                <MaterialIcons
                                                    name={option.icon}
                                                    size={24}
                                                    color={isSelected ? "white" : option.color}
                                                />
                                            </View>
                                            <Text
                                                className={cn(
                                                    "text-[12px] font-black uppercase tracking-tighter",
                                                    isSelected ? "text-white" : "text-on-surface-variant"
                                                )}
                                            >
                                                {option.type}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </ScrollView>
                        </View>

                        {/* Event Details */}
                        <FormSection title="Event Details" icon="calendar-outline">
                            <CustomInput
                                label="Plan Title"
                                placeholder="e.g. Wedding Reception Dinner"
                                value={title}
                                onChangeText={setTitle}
                                icon="title"
                            />
                            <CustomInput
                                label="Select Vendor"
                                placeholder="Search for catering vendors..."
                                value={vendor}
                                onChangeText={setVendor}
                                icon="restaurant"
                            />
                        </FormSection>

                        {/* Logistics */}
                        <FormSection title="Logistics" icon="people-outline">
                            <CustomInput
                                label="Guest Count (Pax)"
                                placeholder="Total number of guests"
                                value={pax}
                                onChangeText={setPax}
                                keyboardType="numeric"
                                icon="group"
                            />
                            <View className="mb-2">
                                <Text className="text-[11px] font-bold text-muted-light uppercase tracking-widest mb-2 ml-1">
                                    Timeline
                                </Text>
                                <Pressable
                                    className="flex-row items-center bg-background-light/50 border border-outline-variant/50 rounded-md px-4 py-3.5"
                                >
                                    <MaterialIcons name="schedule" size={20} color="#896175" className="mr-3" />
                                    <Text className="flex-1 text-[16px] font-medium text-muted-light">
                                        Select Start & End Time
                                    </Text>
                                    <MaterialIcons name="arrow-drop-down" size={24} color="#896175" />
                                </Pressable>
                            </View>
                        </FormSection>

                        {/* Menu & Notes */}
                        <FormSection title="Menu & Notes" icon="document-text-outline">
                            <View>
                                <Text className="text-[11px] font-bold text-muted-light uppercase tracking-widest mb-2 ml-1">
                                    Special Instructions
                                </Text>
                                <TextInput
                                    multiline
                                    numberOfLines={4}
                                    placeholder="Dieters, Allergies, or Menu details..."
                                    placeholderTextColor="#896175"
                                    className="bg-background-light/50 border border-outline-variant/50 rounded-md px-4 py-4 min-h-[120px] text-[16px] font-medium text-on-surface"
                                    style={{ textAlignVertical: "top" }}
                                    value={notes}
                                    onChangeText={setNotes}
                                />
                            </View>
                        </FormSection>

                        {/* Action Button */}
                        <TouchableOpacity
                            onPress={handleSave}
                            activeOpacity={0.8}
                            className="mt-4 mb-10 overflow-hidden rounded-md bg-white"
                            style={{ ...shadowStyle, shadowColor: "#ee2b8c", shadowOpacity: 0.4 }}
                        >
                            <LinearGradient
                                colors={["#ee2b8c", "#d11d73"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                className="py-5 items-center flex-row justify-center"
                            >
                                <Text className="text-white text-lg font-black tracking-tight mr-2">
                                    Create Catering Plan
                                </Text>
                                <MaterialIcons name="check-circle" size={20} color="white" />
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Footer Tag */}
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