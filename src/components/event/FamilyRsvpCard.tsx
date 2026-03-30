import { FamilyMember } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "../ui/Text";

interface Props {
  familyName: string;
  members: FamilyMember[];
  confirmedCount: number;
  onEdit: () => void;
  onView: () => void;
}

const FamilyRsvpCard = React.memo(
  ({ familyName, members, confirmedCount, onEdit, onView }: Props) => {
    const total = members.length;
    const progress = total > 0 ? confirmedCount / total : 0;

    return (
      <View
        className="bg-blue-950/90 p-6 rounded-md shadow-md relative overflow-hidden"
        style={{
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Iridescent background decoration */}
        <View className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16" />
        <View className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -ml-12 -mb-12" />

        <View className="relative z-10">
          {/* Header */}
          <View className="flex-row justify-between items-start mb-5">
            <View>
              <View className="flex-row items-center gap-1.5 mb-1.5">
                <Ionicons name="people" size={14} color="#DB2777" />
                <Text className="text-primary font-bold text-[10px] uppercase tracking-[2px]">
                  Family Group
                </Text>
              </View>
              <Text className="text-white text-2xl font-bold tracking-tight">
                {familyName}
              </Text>
            </View>
            <View className="bg-primary/10 px-3 py-1.5 rounded-md border border-primary/20">
              <Text className="text-primary text-[10px] font-extrabold uppercase">
                {total} Members
              </Text>
            </View>
          </View>

          {/* Progress Section */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-2.5">
              <Text className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                Confirmed Status
              </Text>
              <Text className="text-white font-bold text-sm">
                {confirmedCount} <Text className="text-slate-500 font-medium">/ {total}</Text>
              </Text>
            </View>
            <View className="h-2 w-full bg-slate-900/50 rounded-md overflow-hidden border border-white/5">
              <View
                className="h-full bg-primary rounded-md"
                style={{
                  width: `${progress * 100}%`,
                  boxShadow: "0 0 15px rgba(219, 39, 119, 0.6)",
                }}
              />
            </View>
          </View>

          {/* Side-by-Side CTA Group */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 bg-primary rounded-md flex-row items-center justify-center py-3.5 gap-2 shadow-lg shadow-primary/20 active:scale-[0.97] transition-all"
              onPress={onEdit}
              activeOpacity={0.8}
            >
              <Text className="text-white font-extrabold text-sm uppercase tracking-wide">
                RSVP for Family
              </Text>
              <Ionicons name="people" size={16} color="#fff" />

            </TouchableOpacity>


          </View>
        </View>
      </View>
    );
  }
);

export default FamilyRsvpCard;
