import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { cn } from "../../utils/cn";
import { shadowStyle } from "../../utils/helper";
import { TimelineEvent } from "../../types/logistics";

interface VehicleTimelineCardProps {
  event: TimelineEvent;
}

export const VehicleTimelineCard: React.FC<VehicleTimelineCardProps> = ({ event }) => {
  const isActive = event.status === "On Route";
  const isCompleted = event.status === "Completed";

  return (
    <View
      className={cn(
        "bg-white rounded-2xl border border-outline-variant p-3.5 mb-3.5",
        isActive && "border-l-4 border-l-primary",
        isCompleted && "opacity-70"
      )}
      style={shadowStyle}
    >
      {isActive && (
        <View className="absolute inset-0 bg-primary/5 rounded-2xl pointer-events-none" />
      )}

      {/* Time and Status */}
      <View className="flex-row justify-between items-center mb-3">
        <View>
          <Text className={cn(
            "text-[13px] font-jakarta-bold", 
            isActive ? "text-primary" : "text-on-surface"
          )}>
            {event.time}
          </Text>
        </View>
        <View
          className={cn(
            "px-2 py-0.5 rounded-full",
            isCompleted ? "bg-surface-container-high" : isActive ? "bg-primary/10" : "bg-surface-container"
          )}
        >
          <Text
            className={cn(
              "text-[9px] uppercase font-jakarta-bold tracking-wider",
              isCompleted ? "text-on-surface-variant/60" : isActive ? "text-primary" : "text-on-surface-variant"
            )}
          >
            {event.status}
          </Text>
        </View>
      </View>

      {/* Pickup and Dropoff Timeline */}
      <View className="mb-4 ml-1">
        {/* Pickup Row */}
        <View className="flex-row items-start gap-4 mb-3">
          <View className="items-center mt-1">
            <View className={cn(
              "w-2 h-2 rounded-full z-10",
              isActive ? "bg-primary" : "bg-on-surface-variant/40"
            )} />
            <View className="w-[1px] h-8 bg-outline-variant absolute top-2" />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center gap-1.5 mb-0.5">
              <MaterialIcons name={event.pickupIcon} size={10} color={isActive ? "#ee2b8c" : "#594048"} />
              <Text className="text-[9px] font-jakarta-bold text-on-surface-variant uppercase tracking-wider">Pickup</Text>
            </View>
            <Text className="text-[13px] font-jakarta-semibold text-on-surface leading-none">{event.from}</Text>
          </View>
        </View>

        {/* Dropoff Row */}
        <View className="flex-row items-start gap-4">
          <View className="items-center mt-1">
            <View className={cn(
              "w-2 h-2 rounded-full border-2 z-10 bg-white",
              isActive ? "border-primary" : "border-on-surface-variant/40"
            )} />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center gap-1.5 mb-0.5">
              <MaterialIcons name={event.dropoffIcon} size={10} color={isActive ? "#ee2b8c" : "#594048"} />
              <Text className="text-[9px] font-jakarta-bold text-on-surface-variant uppercase tracking-wider">Drop-off</Text>
            </View>
            <Text className="text-[13px] font-jakarta-semibold text-on-surface leading-none">{event.to}</Text>
          </View>
        </View>
      </View>

      {/* Group and Guests */}
      <View className="bg-surface-container/50 rounded-xl p-2.5 flex-row justify-between items-center">
        <View className="flex-row items-center gap-2.5">
          <View className="flex-row-reverse">
            {event.guests.slice(0, 3).reverse().map((guest, idx) => (
              <View 
                key={idx} 
                className={cn(
                  "w-7 h-7 rounded-full border-2 border-white items-center justify-center -mr-2.5 shadow-sm", 
                  guest.color
                )}
              >
                <Text className={cn("font-jakarta-bold text-[9px]", guest.txColor)}>{guest.initials}</Text>
              </View>
            ))}
          </View>
          <View className="ml-2">
            <Text className="text-[13px] font-jakarta-bold text-on-surface" numberOfLines={1}>{event.groupName}</Text>
            <Text className="text-[9px] font-jakarta-medium text-on-surface-variant">{event.guestCount} Guests</Text>
          </View>
        </View>
        
        {event.guestCount > 3 && (
          <View className="bg-white px-2 py-0.5 rounded-lg border border-outline-variant">
            <Text className="text-[9px] font-jakarta-bold text-on-surface-variant">+{event.guestCount - 3} More</Text>
          </View>
        )}
      </View>
    </View>
  );
};
