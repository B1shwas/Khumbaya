import { Text, TouchableOpacity, View } from "react-native";

const STAFF = [
  {
    id: "1",
    initials: "MC",
    name: "M. Chen",
    role: "Head Chef",
    status: "AVAILABLE",
    statusColor: "text-green-600",
    ringColor: "border-green-500",
  },
  {
    id: "2",
    initials: "JS",
    name: "J. Smith",
    role: "Pastry Lead",
    status: "BUSY",
    statusColor: "text-pink-500",
    ringColor: "border-pink-500",
  },
  {
    id: "3",
    initials: "DR",
    name: "D. Rossi",
    role: "Floor Supervisor",
    status: "OFF-SHIFT",
    statusColor: "text-zinc-300",
    ringColor: "border-zinc-200",
  },
] as const;

export default function StaffStatusCard() {
  return (
    <View className="bg-white rounded-2xl p-5 border border-zinc-100">
      <Text className="font-bold text-[15px] text-zinc-900 mb-5">Staff Status</Text>

      <View className="gap-4">
        {STAFF.map((s) => (
          <View key={s.id} className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-3">
              <View className={`w-9 h-9 rounded-full border-2 items-center justify-center ${s.ringColor}`}>
                <Text className="text-[12px] font-bold text-zinc-600">{s.initials}</Text>
              </View>
              <View>
                <Text className="text-[13px] font-bold text-zinc-900 leading-tight">{s.name}</Text>
                <Text className="text-[11px] text-zinc-400">{s.role}</Text>
              </View>
            </View>
            <Text className={`text-[11px] font-bold ${s.statusColor}`}>{s.status}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        className="mt-6 py-2.5 rounded-xl border border-pink-200 items-center"
      >
        <Text className="text-pink-500 font-bold text-[13px]">Manage Schedule</Text>
      </TouchableOpacity>
    </View>
  );
}
