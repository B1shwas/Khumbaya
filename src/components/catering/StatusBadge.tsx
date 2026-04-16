import { Text, View } from "react-native";

type ServiceStatus = "Served" | "Ready" | "Preparing" | "Queued";

const STATUS_STYLES: Record<
  ServiceStatus,
  { container: string; text: string }
> = {
  Served: {
    container: "bg-green-100 border border-green-200",
    text: "text-green-700",
  },
  Ready: {
    container: "bg-pink-100 border border-pink-200",
    text: "text-pink-700",
  },
  Preparing: {
    container: "bg-fuchsia-50 border border-pink-300",
    text: "text-pink-500",
  },
  Queued: {
    container: "bg-zinc-100",
    text: "text-zinc-400",
  },
};

interface StatusBadgeProps {
  status: ServiceStatus | string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const normalized =
    status in STATUS_STYLES ? (status as ServiceStatus) : "Queued";
  const styles = STATUS_STYLES[normalized];

  return (
    <View className={`px-2 py-0.5 rounded-md self-start ${styles.container}`}>
      <Text className={`text-[11px] font-bold ${styles.text}`}>{status}</Text>
    </View>
  );
}
