import { FamilyMember } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "../ui/Text";

interface Props {
  familyName: string;
  members: FamilyMember[];
  confirmedCount: number;
  onManage: () => void;
}

const FamilyRsvpCard = React.memo(
  ({ familyName, members, confirmedCount, onManage }: Props) => {
    const total = members.length;
    const progress = total > 0 ? confirmedCount / total : 0;

    return (
      <View className="bg-blue-950 p-6 rounded-md">
        <View>
          {/* Header */}
          <View className="flex-row justify-between items-start mb-4">
            <View>
              <Text className="text-primary font-bold text-xs uppercase tracking-widest mb-1">
                Family RSVP
              </Text>
              <Text className="text-white text-xl font-bold">{familyName}</Text>
            </View>
            <View className="bg-primary px-3 py-1 rounded-full">
              <Text className="text-white text-[12px] font-bold">
                {total} Members
              </Text>
            </View>
          </View>

          {/* Progress */}
          <View className="gap-2">
            <View className="flex-row justify-between">
              <Text className="text-white font-bold text-sm">
                {confirmedCount} of {total} Confirmed
              </Text>
            </View>
          </View>

          {/* CTA */}
          <TouchableOpacity
            className="mt-6 bg-primary rounded-md flex-row items-center justify-center py-3 gap-2"
            onPress={onManage}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Manage Family RSVPs"
          >
            <Text className="text-white font-bold text-base">
              Manage Family RSVPs
            </Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

export default FamilyRsvpCard;
