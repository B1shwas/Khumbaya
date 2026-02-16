import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { ImageBackground, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TimelineStatus = "completed" | "active" | "upcoming";

interface TimelineItem {
    id: string;
    title: string;
    time: string;
    subtitle: string;
    status: TimelineStatus;
    meta?: string;
    highlight?: string;
    actionLabel?: string;
}

const tabs = ["Timeline", "Tasks", "Info", "Chat"] as const;
type TabKey = (typeof tabs)[number];

const timelineItems: TimelineItem[] = [
    {
        id: "1",
        title: "Vendor Load-in",
        time: "14:00",
        subtitle: "Completed",
        status: "completed",
    },
    {
        id: "2",
        title: "Sound Check",
        time: "16:30",
        subtitle: "Completed",
        status: "completed",
    },
    {
        id: "3",
        title: "Guest Arrival & Welcome Drinks",
        time: "17:45",
        subtitle: "Main Foyer • Ensure champagne towers are ready.",
        status: "active",
        highlight: "Happening Now",
        actionLabel: "2 Staff Assigned",
    },
    {
        id: "4",
        title: "Bride & Groom Entrance",
        time: "18:30",
        subtitle: "Ballroom B • Lighting Cue #4",
        status: "upcoming",
    },
    {
        id: "5",
        title: "Dinner Service Starts",
        time: "20:00",
        subtitle: "Buffet Area • Plated service for Head Table",
        status: "upcoming",
    },
];

const heroImage =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDBXBDb632woZN4h7aUiNxH2oD5UWOn-vuMNtdf4PRgVzwKHgjGlluHp5GbJkEcK1hhgXEmPPMseuCKARMMWz-xsxvr7e9fsPVefIXfkS0K9WsF2jvy_Yq009fICBPLw_Onma-MUXbpm3t5n_CypcRCM-7ypNnGiZrYFX1x_vGx-Atn9ymvMl0SshJX6ElTqBwXMVhXKVkhYHmhnT9qASrw7PkCddzJ8uCOSHSzhK1C76bQwR4hB9EsNm7LQ67M63jH-rYZMQR1rfg";

export default function VendorEventDetailScreen() {
    const { eventId } = useLocalSearchParams<{ eventId?: string }>();
    const [activeTab, setActiveTab] = useState<TabKey>("Timeline");

    const visibleTimeline = useMemo(() => timelineItems, []);

    return (
        // NOTE: dark:bg-background-dark omitted.
        <SafeAreaView className="flex-1 bg-background-light">
            <View className="flex-1">
                {/* Top App Bar */}
                {/* NOTE: dark:bg-background-dark/95 and dark:border-white/10 omitted. */}
                <View className="flex-row items-center justify-between border-b border-gray-200 bg-background-light/95 px-4 py-3">
                    <TouchableOpacity
                        className="h-10 w-10 items-center justify-center rounded-full"
                        accessibilityRole="button"
                        accessibilityLabel="Go back"
                        onPress={() => router.back()}
                    >
                        <MaterialIcons name="arrow-back-ios-new" size={20} color="#1f2937" />
                    </TouchableOpacity>
                    <Text
                        className="flex-1 px-2 text-center text-lg font-bold tracking-tight text-slate-900"
                        numberOfLines={1}
                    >
                        Event Details
                    </Text>
                    <TouchableOpacity
                        className="h-10 w-10 items-center justify-center rounded-full"
                        accessibilityRole="button"
                        accessibilityLabel="More options"
                    >
                        <MaterialIcons name="more-horiz" size={22} color="#1f2937" />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerClassName="pb-10"
                    stickyHeaderIndices={[2]}
                >
                    {/* Event Summary Card */}
                    <View className="p-4">
                        {/* NOTE: dark:bg-white/5 and dark:border-white/5 omitted. */}
                        <View className="gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                            <View className="gap-4">
                                <View className="gap-2">
                                    <View className="flex-row items-center gap-2">
                                        <View className="flex-row items-center rounded-full bg-primary/10 px-2 py-0.5 ring-1 ring-inset ring-primary/20">
                                            <View className="mr-1.5 h-2 w-2 rounded-full bg-primary" />
                                            <Text className="text-xs font-bold text-primary">LIVE NOW</Text>
                                        </View>
                                        {/* NOTE: dark:text-gray-400 omitted. */}
                                        <Text className="text-xs text-gray-500">Ends 12:00 AM</Text>
                                    </View>
                                    {/* NOTE: dark:text-white omitted. */}
                                    <Text className="text-xl font-bold leading-tight text-slate-900">
                                        Priya & Raj&apos;s Wedding Reception
                                    </Text>
                                    {/* NOTE: dark:text-gray-400 omitted. */}
                                    <View className="flex-row items-start gap-1.5">
                                        <MaterialIcons name="location-on" size={18} color="#6b7280" />
                                        <Text className="text-sm font-medium leading-snug text-gray-500">
                                            The Grand Palace Hotel, Ballroom B
                                            {"\n"}
                                            <Text className="text-xs font-normal">Sat, Oct 24</Text>
                                        </Text>
                                    </View>
                                </View>
                                {/* NOTE: dark:bg-white/10 and dark:text-white omitted. */}
                                <TouchableOpacity
                                    className="w-fit flex-row items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2"
                                    accessibilityRole="button"
                                    accessibilityLabel="View map"
                                >
                                    <MaterialIcons name="map" size={18} color="#1f2937" />
                                    <Text className="text-sm font-semibold text-slate-900">View Map</Text>
                                </TouchableOpacity>
                            </View>

                            <ImageBackground
                                source={{ uri: heroImage }}
                                className="h-36 w-full overflow-hidden rounded-lg"
                                imageStyle={{ borderRadius: 12 }}
                            >
                                <View className="flex-1 bg-black/40" />
                            </ImageBackground>

                            {eventId ? (
                                <Text className="text-xs text-gray-400">Event ID: {eventId}</Text>
                            ) : null}
                        </View>
                    </View>

                    {/* Sticky Tabs */}
                    {/* NOTE: dark:bg-background-dark and dark:border-white/10 omitted. */}
                    <View className="border-b border-gray-200 bg-background-light shadow-sm">
                        <View className="flex-row px-4">
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab;
                                return (
                                    <TouchableOpacity
                                        key={tab}
                                        className={`flex-1 items-center justify-center border-b-2 pb-3 pt-4 ${isActive ? "border-primary" : "border-transparent"
                                            }`}
                                        accessibilityRole="button"
                                        accessibilityState={{ selected: isActive }}
                                        onPress={() => setActiveTab(tab)}
                                    >
                                        {/* NOTE: dark:text-gray-400 omitted. */}
                                        <Text
                                            className={`text-sm font-bold tracking-wide ${isActive ? "text-primary" : "text-gray-500"
                                                }`}
                                        >
                                            {tab}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Timeline Content */}
                    <View className="px-4 py-6">
                        <View className="gap-6">
                            {visibleTimeline.map((item, index) => {
                                const isCompleted = item.status === "completed";
                                const isActive = item.status === "active";
                                const isLast = index === visibleTimeline.length - 1;

                                return (
                                    <View key={item.id} className="flex-row gap-3">
                                        <View className="items-center">
                                            <View
                                                className={`h-8 w-8 items-center justify-center rounded-full ${isActive
                                                    ? "bg-primary"
                                                    : isCompleted
                                                        ? "bg-gray-100"
                                                        : "border-2 border-gray-300 bg-white"
                                                    }`}
                                            >
                                                <MaterialIcons
                                                    name={
                                                        isActive
                                                            ? "radio-button-checked"
                                                            : isCompleted
                                                                ? "check-circle"
                                                                : "schedule"
                                                    }
                                                    size={18}
                                                    color={isActive ? "#ffffff" : "#9ca3af"}
                                                />
                                            </View>
                                            {!isLast ? (
                                                // NOTE: dark:bg-white/10 omitted.
                                                <View className="h-10 w-0.5 bg-gray-200" />
                                            ) : null}
                                        </View>

                                        <View className="flex-1 pb-2">
                                            {isActive ? (
                                                // NOTE: dark:bg-white/5 omitted.
                                                <View className="rounded-xl border-l-4 border-primary bg-white p-4 shadow-sm">
                                                    <View className="mb-1 flex-row items-start justify-between">
                                                        <Text className="text-xs font-bold uppercase tracking-wider text-primary">
                                                            {item.highlight}
                                                        </Text>
                                                        {/* NOTE: dark:text-white omitted. */}
                                                        <Text className="text-sm font-bold text-slate-900">
                                                            {item.time}
                                                        </Text>
                                                    </View>
                                                    {/* NOTE: dark:text-white omitted. */}
                                                    <Text className="text-lg font-bold text-slate-900">
                                                        {item.title}
                                                    </Text>
                                                    {/* NOTE: dark:text-gray-400 omitted. */}
                                                    <Text className="mt-2 text-sm text-gray-500">
                                                        {item.subtitle}
                                                    </Text>
                                                    {item.actionLabel ? (
                                                        <View className="mt-4 flex-row">
                                                            {/* NOTE: dark:bg-white/10 and dark:text-gray-200 omitted. */}
                                                            <View className="flex-row items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5">
                                                                <MaterialIcons name="group" size={16} color="#374151" />
                                                                <Text className="text-xs font-semibold text-slate-700">
                                                                    {item.actionLabel}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    ) : null}
                                                </View>
                                            ) : (
                                                <View className={`${isCompleted ? "opacity-60" : ""}`}>
                                                    <View className="flex-row items-baseline justify-between">
                                                        {/* NOTE: dark:text-white omitted. */}
                                                        <Text
                                                            className={`text-lg ${isCompleted
                                                                ? "font-semibold line-through decoration-gray-400"
                                                                : "font-medium"
                                                                } text-slate-900`}
                                                        >
                                                            {item.title}
                                                        </Text>
                                                        {/* NOTE: dark:text-gray-400 omitted. */}
                                                        <Text className="text-sm font-medium text-gray-500">
                                                            {item.time}
                                                        </Text>
                                                    </View>
                                                    {/* NOTE: dark:text-gray-400 omitted. */}
                                                    <Text className="mt-1 text-sm text-gray-500">
                                                        {item.subtitle}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}