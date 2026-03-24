import { MaterialIcons } from "@expo/vector-icons";
import { ImageBackground, Text, View } from "react-native";

interface AdviceCardProps {
  imageUri?: string;
}

export function AdviceCard({ imageUri }: AdviceCardProps) {
  return (
    <ImageBackground
      source={{
        uri:
          imageUri ||
          "https://lh3.googleusercontent.com/aida-public/AB6AXuB-x1hbLzoLHeN0S7C5hgIkweIDs_fsb279IiERIwlmP5DR0foMg2zE71GUo6t4vWys5Zrh54jbAY69NS2PK0yhuOOBbGsa2LSm8t4UJ1jPMr46f15U30x7lUC3SFISVvYVpU5cVPFXatQV6wIbZJItdpCL4btQMfIdqO7gDw1f_Js-Ydh4UeLxu_t43MRCAXoJzmFK-hY8Ky70GyMVnwMPbz2LQiC32teP2aVvRJV94vocWjHZ468C_oIrb-M63y8bXqOPzC6JzFk",
      }}
      className="rounded-[32px] overflow-hidden h-64 mb-8"
      imageStyle={{ borderRadius: 32 }}
    >
      {/* gradient overlay */}
      <View className="absolute inset-0 bg-black/60 rounded-[32px]" />
      <View className="absolute bottom-0 left-0 p-7">
        <View className="flex-row items-center gap-1 mb-2">
          <MaterialIcons name="lightbulb" size={14} color="#ee2b8c" />
          <Text className="text-[10px] font-bold uppercase tracking-widest text-[#ee2b8c]">
            Expert Advice
          </Text>
        </View>
        <Text className="text-white text-2xl font-extrabold leading-tight max-w-xs">
          Focus on key moments that matter most.
        </Text>
        <Text className="text-white/70 text-sm mt-2 max-w-xs">
          Prioritize high-impact items like lighting and catering to create a
          lasting impression.
        </Text>
      </View>
    </ImageBackground>
  );
}
