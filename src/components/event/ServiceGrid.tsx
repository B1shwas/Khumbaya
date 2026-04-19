import { EventService } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "../ui/Text";
import { useRouter } from "expo-router";

interface Props {
  services: EventService[];
  eventId: string;
}

const ServiceChip = ({
  service,
  eventId,
}: {
  service: EventService;
  eventId: string;
}) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(
      `/(protected)/(client-stack)/events/${eventId}/(guest)/services/${service.id}`
    );
  };

  return (
    <View className="flex-1 items-center p-3 rounded-md bg-gray-200 border border-gray-100">
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        <Ionicons name={service.icon as any} size={24} color="#ee2b8c" />
        <Text
          variant="h1"
          className="text-[11px] text-gray-800 uppercase tracking-wider text-center mt-2"
        >
          {service.label}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const ServiceGrid = React.memo(({ services, eventId }: Props) => (
  <View className="flex-row gap-3 my-4">
    {services.map((s) => (
      <ServiceChip key={s.id} service={s} eventId={eventId} />
    ))}
  </View>
));

export default ServiceGrid;
