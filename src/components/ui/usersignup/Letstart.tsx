import { Button } from "@/src/components/ui/Button";
import { Text } from "@/src/components/ui/Text";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";

type LetstartData = {
    fullName: string;
    email: string;
    phone: string;
    password: string;
};

type LetstartProps = {
    data: LetstartData;
    onChange: (updates: Partial<LetstartData>) => void;
    onNext: () => void;
};

export default function Letstart({ data, onChange, onNext }: LetstartProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24, flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
        >
            <View className="pt-4">
                <Text className="text-3xl font-jakarta-bold text-text-light">Let's get started</Text>
                <Text className="text-base text-muted-light mt-2">
                    Enter your details to begin planning your dream event.
                </Text>
            </View>

            <View className="gap-6 pt-6">
                <View className="gap-2">
                    <Text className="text-xs font-jakarta-semibold uppercase tracking-wider text-text-light">
                        Full Name
                    </Text>
                    <TextInput
                        value={data.fullName}
                        onChangeText={(value) => onChange({ fullName: value })}
                        placeholder="Jane Doe"
                        placeholderTextColor="#896175"
                        className="h-14 rounded-xl border border-border bg-white px-4 text-base text-text-light"
                    />
                </View>

                <View className="gap-2">
                    <Text className="text-xs font-jakarta-semibold uppercase tracking-wider text-text-light">
                        Email Address
                    </Text>
                    <TextInput
                        value={data.email}
                        onChangeText={(value) => onChange({ email: value })}
                        placeholder="jane@example.com"
                        placeholderTextColor="#896175"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        className="h-14 rounded-xl border border-border bg-white px-4 text-base text-text-light"
                    />
                </View>

                <View className="gap-2">
                    <Text className="text-xs font-jakarta-semibold uppercase tracking-wider text-text-light">
                        Phone Number
                    </Text>
                    <TextInput
                        value={data.phone}
                        onChangeText={(value) => onChange({ phone: value })}
                        placeholder="+1 (234) 567-890"
                        placeholderTextColor="#896175"
                        keyboardType="phone-pad"
                        className="h-14 rounded-xl border border-border bg-white px-4 text-base text-text-light"
                    />
                </View>

                <View className="gap-2">
                    <Text className="text-xs font-jakarta-semibold uppercase tracking-wider text-text-light">
                        Password
                    </Text>
                    <View className="flex-row items-center rounded-xl border border-border bg-white px-4">
                        <TextInput
                            value={data.password}
                            onChangeText={(value) => onChange({ password: value })}
                            placeholder="At least 8 characters"
                            placeholderTextColor="#896175"
                            secureTextEntry={!showPassword}
                            className="flex-1 py-4 text-base text-text-light"
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword((prev) => !prev)}
                            accessibilityRole="button"
                        >
                            <MaterialIcons
                                name={showPassword ? "visibility" : "visibility-off"}
                                size={22}
                                color="#896175"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View className="mt-auto gap-4 pt-8">
                <Button onPress={onNext} className="rounded-xl">
                    Next
                </Button>
                <TouchableOpacity accessibilityRole="button" className="items-center">
                    <Text className="text-sm text-muted-light">
                        Already have an account? <Text className="text-primary">Log in</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}