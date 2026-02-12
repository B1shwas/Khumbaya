import { Ionicons } from "@expo/vector-icons";
<<<<<<< HEAD
import { router } from "expo-router";
=======
import { RelativePathString, router } from "expo-router";
>>>>>>> update/stack
import { Text, TouchableOpacity, View } from "react-native";

interface QuickServiceButtonProps {
    id: string;
    name: string;
    icon?: string;
    color: string;
    route: string;
}
export default function NavigateComponent({
    id,
    name,
    icon,
    color,
    route,
}: QuickServiceButtonProps) {
    return (
        <TouchableOpacity
            className="flex-row items-center gap-2 px-4 py-3 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100"
<<<<<<< HEAD
            onPress={() => router.push(route)}
=======
            onPress={() => router.push(route as RelativePathString)}
>>>>>>> update/stack
            activeOpacity={0.8}
            style={{ width: "47%" }}
        >
            <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: color }}
            >
                {icon && <Ionicons name={icon as any} size={20} color="white" />}
            </View>
            <Text className="font-semibold text-sm text-gray-900">{name}</Text>
        </TouchableOpacity>
    );
}