import RowComponent from "@/src/components/ui/RowComponent"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useMemo } from "react"
import { View } from "react-native"

const settingItems = [

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
    title: "Add Event organizer",
    description: "Assign a new event host",
    iconstring: "swap-horizontal-outline" as const,
    action: "transfer-ownership" as const,
  },
  {
    title: "Archive Event",
    description: "Hide event from dashboard",
    iconstring: "archive-outline" as const,
  },
]

export default function EventSettingsScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{ eventId?: string | string[] }>()

  const eventId = useMemo(() => {
    const raw = Array.isArray(params.eventId) ? params.eventId[0] : params.eventId
    return raw && raw !== "[eventId]" ? raw : ""
  }, [params.eventId])

  const handleTransferOwnershipPress = () => {
    if (!eventId) {
      return
    }

    router.push({
      pathname: "/(protected)/(client-stack)/events/[eventId]/(organizer)/settings/transfer-ownership",
      params: { eventId },
    })
  }

  return (
    <View className="p-4 gap-3">
      {settingItems.map((item) => (
        <RowComponent
          key={item.title}
          iconstring={item.iconstring}
          title={item.title}
          description={item.description}
          onPress={item.action === "transfer-ownership" ? handleTransferOwnershipPress : undefined}
        />
      ))}
    </View>
  )
}
