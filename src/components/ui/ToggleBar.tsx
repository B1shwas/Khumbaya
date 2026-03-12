import { Ionicons } from "@expo/vector-icons"
import { Text, TouchableOpacity, View } from "react-native"

type IoniconName = keyof typeof Ionicons.glyphMap

export default function ToggleBar({ title, description, onPress, iconstring, active = true }: {
    title: string,
    description: string,
    iconstring: IoniconName
    onPress?: () => void,
    active?: boolean

}) {
    return (
        <TouchableOpacity
            className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 active:scale-[0.98] transition-transform flex-row items-center gap-4"
            style={{ opacity: active ? 1 : 0.5 }}
            onPress={active ? onPress : undefined}
            disabled={!active}
        >
            <View className="p-2.5 rounded-full shrink-0" style={{ backgroundColor: active ? "rgba(238, 43, 140, 0.1)" : "rgba(200, 200, 200, 0.1)" }}>
                <Ionicons name={iconstring} size={20} color={active ? "#ee2b8c" : "#b8b8b8"} />

            </View>
            <View className="flex-1">
                <Text className="font-bold text-base" style={{ color: active ? "#1f2937" : "#9ca3af" }}>
                    {title}
                </Text>
                <Text className="text-xs" style={{ color: active ? "#6b7280" : "#d1d5db" }}>
                    {description}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={active ? "#D1D5DB" : "#e5e7eb"} />
        </TouchableOpacity>
    )
}