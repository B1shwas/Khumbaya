import { StyleSheet, Text, View } from "react-native";
import type { Guest } from "../hooks/useGuests";

interface ImportedGuestRowProps {
  guest: Guest;
}

export default function ImportedGuestRow({ guest }: ImportedGuestRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.avatar}>
        <Text style={styles.initials}>{guest.initials}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{guest.name}</Text>
        <Text style={styles.details}>
          {guest.phone} • {guest.relation}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EE2B8C",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  initials: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  details: {
    fontSize: 12,
    color: "#6B7280",
  },
});
