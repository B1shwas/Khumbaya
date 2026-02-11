import { useAuth } from "@/src/store/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Pressable, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const PROFILE_IMAGE =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCdkO95jYAsgD-tHT0l8PitJku9U0PYgsN46dLAfx3PtcZADmhzG5DIJ9fwFE53zZ2lTuyjK_stwFjrqzykITWedJJLCu1GfaSL39aHXer3wr6a9bHVMEa6kZmmVfnpsc9Ha_3shT06wNP776rHOOQW5hIFHAmx_PCNBHt8Z5RBFm5nmL8Up_zXeGF3GB_QIKDQxQdIOKfyFJ_ABVdt-ANir7346Ra3fo1YNqAuly_YLt64FSMRTHSHRBM85iWyTBq6R8z60Hf6Aok";

type MenuItemProps = {
    label: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    badge?: string;
    onPress?: () => void;
};

const MenuItem = ({ label, icon, badge, onPress }: MenuItemProps) => {
    const labelColor = "#181114";
    const mutedColor = "#896175";

    return (
        <Pressable
            className="flex-row items-center gap-4 bg-white p-4 rounded-xl shadow-sm active:scale-[0.98] transition-transform"
            onPress={onPress}
        >
            <View className="flex items-center justify-center rounded-full bg-background-light shrink-0 h-10 w-10">
                <MaterialIcons name={icon} size={20} color={labelColor} />
            </View>
            <Text className="text-base font-medium flex-1 text-[#181114]">
                {label}
            </Text>
            {badge ? (
                <View className="bg-primary/10 px-2 py-0.5 rounded mr-2">
                    <Text className="text-primary text-xs font-bold">{badge}</Text>
                </View>
            ) : null}
            <MaterialIcons name="chevron-right" size={20} color={mutedColor} />
        </Pressable>
    );
};

export default function Profile() {
    const [isVendorMode, setIsVendorMode] = useState(false);
    const mutedColor = "#896175";
     const { logout } = useAuth();
    const pressedFunction = ()=>{
        logout(); 
        
    }

    return (
        <SafeAreaView className="flex-1 bg-background-light">
            <View className="flex-1">
                {/* Top App Bar */}
                <View className="flex-row items-center justify-between px-4 pt-6 pb-4 bg-white border-b border-[#f4f0f2]">
                    <View className="w-10" />
                    <Text className="text-lg font-bold text-[#181114]">
                        Profile
                    </Text>
                    <Pressable className="w-10 items-end">
                        <MaterialIcons name="edit" size={22} color="#ee2b8c" />
                    </Pressable>
                </View>

                <ScrollView className="flex-1" contentContainerClassName="pb-28">
                    {/* Profile Header */}
                    <View className="items-center pt-8 pb-6 px-4 bg-white rounded-b-[32px] shadow-sm mb-6">
                        <Pressable className="relative">
                            <Image
                                source={{ uri: PROFILE_IMAGE }}
                                className="h-32 w-32 rounded-full border-4 border-background-light"
                            />
                            <View className="absolute bottom-0 right-0 bg-primary rounded-full p-1.5 shadow-md border-2 border-white">
                                <MaterialIcons name="photo-camera" size={14} color="#ffffff" />
                            </View>
                        </Pressable>
                        <View className="mt-4 items-center">
                            <Text className="text-2xl font-bold text-[#181114]">
                                Sarah Jenkins
                            </Text>
                            <Text className="text-sm font-medium mt-1 text-[#896175]">
                                sarah.j@example.com
                            </Text>
                        </View>
                    </View>

                    {/* Action Panel: Vendor Mode */}
                    <View className="px-4 mb-6">
                        <View
                            className="flex-row items-center justify-between gap-4 rounded-2xl border border-[#e6dbe0] bg-white p-5 shadow-sm"
                        >
                            <View className="flex-row items-center gap-4">
                                <View className="bg-primary/10 rounded-full p-2.5">
                                    <MaterialIcons name="storefront" size={22} color="#ee2b8c" />
                                </View>
                                <View>
                                    <Text className="text-base font-bold text-[#181114]">
                                        Vendor Mode
                                    </Text>
                                    <Text className="text-sm mt-0.5 text-[#896175]">
                                        Manage services & bookings
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                value={isVendorMode}
                                onValueChange={setIsVendorMode}
                                trackColor={{ false: "#f4f0f2", true: "#ee2b8c" }}
                                thumbColor="#ffffff"
                            />
                        </View>
                    </View>

                    {/* Navigation List */}
                    <View className="px-4 gap-3">
                        <Text className="text-xs font-bold uppercase tracking-wider px-2 text-[#896175]">
                            Account
                        </Text>
                        <MenuItem label="My Information" icon="person" />
                        <MenuItem label="Payment Methods" icon="credit-card" />
                        <MenuItem label="Saved Vendors" icon="favorite" badge="12" />
                        <MenuItem label="App Settings" icon="settings" />
                    </View>

                    {/* Footer Actions */}
                    <View className="mt-8 px-6 pb-8 items-center gap-4 ">
                        <Pressable className="w-full rounded-lg py-2 bg-primary/10 items-center active:scale-[0.98] transition-transform"
                    onPress={pressedFunction}>
                            <Text className="text-center font-semibold text-base text-[#ef4444]">
                                Log Out
                            </Text>
                        </Pressable>
                        <Text className="text-xs text-[#896175]">
                            Version 1.2.0
                        </Text>
                    </View>
                </ScrollView>

                {/* Bottom Navigation Bar (Visual Only) */}
        
            </View>
        </SafeAreaView>
    );
}