import { Text, View } from "react-native";

const BARS = [
  { h: 40, type: "hot" },
  { h: 55, type: "hot" },
  { h: 80, type: "hot" },
  { h: 95, type: "hot" },
  { h: 30, type: "pastry" },
  { h: 50, type: "pastry" },
  { h: 70, type: "pastry" },
  { h: 45, type: "hot" },
  { h: 85, type: "hot" },
  { h: 40, type: "pastry" },
  { h: 60, type: "pastry" },
  { h: 30, type: "hot" },
] as const;

const CHART_HEIGHT = 120;

export default function PrepIntensityChart() {
  return (
    <View className="bg-white rounded-md p-5 border border-zinc-100">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="font-bold text-[15px] text-zinc-900">Prep Intensity</Text>
        <View className="flex-row gap-4">
          <View className="flex-row items-center gap-1.5">
            <View className="w-2 h-2 rounded-full bg-pink-500" />
            <Text className="text-[10px] font-bold text-zinc-400 uppercase">Hot Kitchen</Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <View className="w-2 h-2 rounded-full bg-green-500" />
            <Text className="text-[10px] font-bold text-zinc-400 uppercase">Pastry</Text>
          </View>
        </View>
      </View>

      <View style={{ height: CHART_HEIGHT }} className="flex-row items-end gap-1">
        {BARS.map((bar, i) => (
          <View
            key={i}
            style={{ flex: 1, height: `${bar.h}%` }}
            className={`rounded-t-sm ${bar.type === "hot" ? "bg-pink-400" : "bg-green-400"}`}
          />
        ))}
      </View>

      <View className="flex-row justify-between mt-3">
        {["06:00", "10:00", "14:00", "18:00", "22:00"].map((t) => (
          <Text
            key={t}
            className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest"
          >
            {t}
          </Text>
        ))}
      </View>
    </View>
  );
}
