import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Guest, Table } from "../../types/tableManagement";
import { styles } from "../styles/TableManagement.styles";
import { TableCard } from "./TableCard";

interface FloorPlanProps {
  tables: Table[];
  guests: Guest[];
  selectedTableId: string | null;
  onSelectTable: (tableId: string) => void;
  onCreatePanHandlers: (tableId: string) => any;
  seatedGuests: number;
  totalGuests: number;
  onAddTable: () => void;
}

export const FloorPlan: React.FC<FloorPlanProps> = ({
  tables,
  guests,
  selectedTableId,
  onSelectTable,
  onCreatePanHandlers,
  seatedGuests,
  totalGuests,
  onAddTable,
}) => {
  return (
    <View style={styles.canvasContainer}>
      <View style={styles.canvasGrid}>
        {tables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            guests={guests}
            isSelected={selectedTableId === table.id}
            onSelect={onSelectTable}
            panHandlers={onCreatePanHandlers(table.id)}
          />
        ))}
      </View>

      {/* Canvas Info Overlay */}
      <View style={styles.canvasInfo}>
        <View style={styles.guestAvatars}>
          <View style={styles.avatarDot}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <View style={styles.avatarDot}>
            <Text style={styles.avatarText}>EV</Text>
          </View>
          <View style={styles.avatarDot}>
            <Text style={styles.avatarText}>+12</Text>
          </View>
        </View>
        <Text style={styles.canvasInfoText}>
          {seatedGuests}/{totalGuests} seated
        </Text>
      </View>

      {/* Floating Controls */}
      <View style={styles.floatingControls}>
        <TouchableOpacity style={styles.fab}>
          <Ionicons name="expand" size={20} color="#6B7280" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.fab, styles.fabAdd]}
          onPress={onAddTable}
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
