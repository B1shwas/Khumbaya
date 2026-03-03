import { EventService } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import { Text } from "../ui/Text";

interface Props {
  services: EventService[];
}

const ServiceChip = ({ service }: { service: EventService }) => (
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

const ServiceGrid = React.memo(({ services }: Props) => (
  <View className="flex-row gap-3">
    {services.map((s) => (
      <ServiceChip key={s.id} service={s} />
    ))}
  </View>
));

export default ServiceGrid;
