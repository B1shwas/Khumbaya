import { FamilyMember } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "../ui/Text";

interface Props {
  familyName: string;
  members: FamilyMember[];
  confirmedCount: number;
  onManage: () => void;
}

const MAX_VISIBLE_AVATARS = 2;

const Avatar = ({
  member,
  offset,
}: {
  member: FamilyMember;
  offset: number;
}) => (
  <View style={[styles.avatar, offset > 0 && { marginLeft: -8 }]}>
    {member.avatarUrl ? (
      <Image source={{ uri: member.avatarUrl }} style={styles.avatarImage} />
    ) : (
      <View style={[styles.avatarImage, styles.avatarFallback]} />
    )}
  </View>
);

const FamilyRsvpCard = React.memo(
  ({ familyName, members, confirmedCount, onManage }: Props) => {
    const total = members.length;
    const progress = total > 0 ? confirmedCount / total : 0;
    const visible = members.slice(0, MAX_VISIBLE_AVATARS);
    const overflow = total - MAX_VISIBLE_AVATARS;

    return (
      <View style={styles.card}>
        {/* Decorative glow blob */}
        <View style={styles.blob} />

        <View style={styles.inner}>
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
              <Text className="text-gray-400 text-sm">
                Confirmation Progress
              </Text>
              <Text className="text-white font-bold text-sm">
                {confirmedCount} of {total} Confirmed
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${progress * 100}%` }]}
              />
            </View>
          </View>

          {/* Avatar stack */}
          <View className="flex-row mt-4">
            {visible.map((m, i) => (
              <Avatar key={m.id} member={m} offset={i} />
            ))}
            {overflow > 0 && (
              <View
                style={[
                  styles.avatar,
                  styles.avatarOverflow,
                  { marginLeft: -8 },
                ]}
              >
                <Text className="text-white text-[10px] font-bold">
                  +{overflow}
                </Text>
              </View>
            )}
          </View>

          {/* CTA */}
          <TouchableOpacity
            className="mt-6 bg-primary rounded-xl flex-row items-center justify-center py-3 gap-2"
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 24,
    overflow: "hidden",
    position: "relative",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 6 },
    }),
  },
  inner: {
    position: "relative",
    zIndex: 10,
  },
  blob: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: "rgba(238, 43, 140, 0.20)",
  },
  progressTrack: {
    width: "100%",
    height: 8,
    backgroundColor: "#374151",
    borderRadius: 9999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#ee2b8c",
    borderRadius: 9999,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#1e293b",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarFallback: {
    backgroundColor: "#64748b",
  },
  avatarOverflow: {
    backgroundColor: "#475569",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default FamilyRsvpCard;
