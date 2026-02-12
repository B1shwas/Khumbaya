// SegmentedControl Component
// ============================================

import { Text, TouchableOpacity, View } from "react-native";
import { RSVP_TABS } from "../constants";
import type { RSVPStatus } from "../types";

interface SegmentedControlProps {
  activeTab: RSVPStatus;
  onTabChange: (tab: RSVPStatus) => void;
}

const SegmentedControl = ({
  activeTab,
  onTabChange,
}: SegmentedControlProps) => {
  return (
    <View className="px-4 py-2" accessibilityLabel="RSVP status filter">
      <View className="flex-row h-10 w-full rounded-lg bg-gray-100 p-1">
        {RSVP_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            className={`flex-1 items-center justify-center rounded-md ${
              activeTab === tab ? "bg-white shadow-sm" : ""
            }`}
            onPress={() => onTabChange(tab)}
            accessibilityLabel={tab}
            accessibilityRole="button"
            accessibilityState={{ selected: activeTab === tab }}
          >
            <Text
              className={`text-xs font-semibold ${
                activeTab === tab ? "text-primary" : "text-gray-500"
              }`}
            >
              {tab === "Not Invited" ? "Not Invited" : tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default SegmentedControl;
