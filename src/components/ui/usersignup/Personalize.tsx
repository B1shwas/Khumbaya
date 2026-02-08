import { Button } from "@/src/components/ui/Button";
import { Text } from "@/src/components/ui/Text";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

type PersonalizeProps = {
    onFinish: () => void;
};

export default function Personalize({ onFinish }: PersonalizeProps) {
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    return (
        <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24, flexGrow: 1 }}
        >
            <View className="pt-4 items-center">
                <Text className="text-3xl font-jakarta-bold text-text-light text-center">
                    Personalize Your Profile
                </Text>
                <Text className="text-base text-muted-light mt-2 text-center">
                    Add photos to make your event dashboard feel like home.
                </Text>
            </View>

            <View className="mt-6">
                <View className="relative">
                    <View className="h-48 rounded-2xl border-2 border-dashed border-border bg-gray-100 items-center justify-center">
                        <MaterialIcons name="add-a-photo" size={32} color="#9CA3AF" />
                        <Text className="text-xs font-jakarta-semibold uppercase tracking-tight text-gray-400 mt-2">
                            Add Cover Photo
                        </Text>
                        <Text className="text-[10px] text-gray-400 mt-1">Recommended: 16:9 ratio</Text>
                        <View className="absolute bottom-3 right-3 rounded-full bg-white p-2 shadow-sm">
                            <MaterialIcons name="edit" size={16} color="#ee2b8c" />
                        </View>
                    </View>

                    <View className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                        <View className="w-32 h-32 rounded-full bg-background-light p-1 shadow-lg">
                            <View className="flex-1 rounded-full border-2 border-dashed border-gray-300 bg-gray-200 items-center justify-center">
                                <MaterialIcons name="person" size={28} color="#9CA3AF" />
                                <Text className="text-[9px] font-jakarta-bold text-gray-400 uppercase mt-1">
                                    Photo
                                </Text>
                            </View>
                        </View>
                        <View className="absolute bottom-1 right-1 rounded-full bg-primary p-2">
                            <MaterialIcons name="add" size={14} color="#ffffff" />
                        </View>
                    </View>
                </View>
            </View>

            <View className="mt-20 gap-6">
                <View className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                    <View className="flex-row items-start gap-4">
                        <View className="rounded-lg bg-primary/10 p-3">
                            <MaterialIcons name="visibility" size={20} color="#ee2b8c" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-base font-jakarta-bold text-text-light mb-1">
                                Visual Identity Matters
                            </Text>
                            <Text className="text-sm text-muted-light">
                                Your profile and cover photos will be visible to your event planner and vendors on the shared dashboard.
                            </Text>
                        </View>
                    </View>
                </View>

                <Pressable
                    className="flex-row items-center gap-3"
                    onPress={() => setAcceptedTerms((prev) => !prev)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: acceptedTerms }}
                >
                    <View
                        className={`h-5 w-5 items-center justify-center rounded border ${
                            acceptedTerms ? "border-primary bg-primary" : "border-gray-300 bg-white"
                        }`}
                    >
                        {acceptedTerms ? (
                            <MaterialIcons name="check" size={14} color="#ffffff" />
                        ) : null}
                    </View>
                    <Text className="text-xs text-muted-light flex-1">
                        I agree to the Terms of Service and Privacy Policy regarding media usage.
                    </Text>
                </Pressable>
            </View>

            <View className="mt-auto pt-8">
                <Button
                    onPress={onFinish}
                    className="rounded-xl flex-row items-center justify-center"
                    disabled={!acceptedTerms}
                >
                    Finish & Create Dashboard
                </Button>
            </View>
        </ScrollView>
    );
}