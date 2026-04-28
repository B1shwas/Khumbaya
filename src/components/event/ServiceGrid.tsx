import { EventService } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "../ui/Text";

interface Props {
  services: EventService[];
  onServicePress?: (service: EventService) => void;
}

const ServiceChip = ({
  service,
  onPress,
}: {
  service: EventService;
  onPress?: () => void;
}) => {
  const Chip = (
    <View className="flex-1 items-center p-3 rounded-md bg-gray-200 border border-gray-100">
      <Ionicons name={service.icon as any} size={24} color="#ee2b8c" />
      <Text
        variant="h1"
        className="text-[11px] text-gray-800 uppercase tracking-wider text-center mt-2"
      >
        {service.label}
      </Text>
    </View>
  );

  if (!onPress) return Chip;

  return (
    <TouchableOpacity className="flex-1" onPress={onPress} activeOpacity={0.75}>
      {Chip}
    </TouchableOpacity>
  );
};

const ServiceGrid = React.memo(({ services, onServicePress }: Props) => (
  <View className="flex-row gap-3 my-4">
    {services.map((service) => (
      <ServiceChip
        key={service.id}
        service={service}
        onPress={() => onServicePress?.(service)}
      />
    ))}
  </View>
));

export default ServiceGrid;
