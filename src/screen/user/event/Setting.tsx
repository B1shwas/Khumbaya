import ToggleBar from "@/src/components/ui/ToggleBar"
import { useRouter } from "expo-router"
import { View } from "react-native"

const settingItems = [
    {
        title: "Manage Guests",
        description: "RSVPs, Dietary Needs, Grouping",
        iconstring: "people-outline" as const,
    },
    {
        title: "Vendor Permissions",
        description: "Access for caterers & photographers",
        iconstring: "lock-closed-outline" as const,
    },
    {
        title: "Budget Settings",
        description: "Allocations, cost tracking",
        iconstring: "calculator-outline" as const,
    },
    {
        title: "Payment Methods",
        description: "Manage cards and banking info",
        iconstring: "card-outline" as const,
    },
    {
        title: "Transfer Ownership",
        description: "Assign a new event host",
        iconstring: "swap-horizontal-outline" as const,
        onPressPath: "./transfer" as const,
    },
    {
        title: "Archive Event",
        description: "Hide event from dashboard",
        iconstring: "archive-outline" as const,
    },
]

export default function EventSettingsScreen() {
    const router = useRouter()

    return (
        <View className="p-4 gap-3">
            {settingItems.map((item) => (
                <ToggleBar
                    key={item.title}
                    iconstring={item.iconstring}
                    title={item.title}
                    description={item.description}
                    onPress={item.onPressPath ? () => router.push(item.onPressPath) : undefined}
                />
            ))}
        </View>
    )
}