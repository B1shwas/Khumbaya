import Card from "@/src/components/ui/guest-profile/Card";
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";

interface Venue {
  id: string;
  name: string;
  address: string;
  imageUrl?: string;
}

interface VenuesSectionProps {
  venues?: Venue[];
  onGetDirections?: (venue: Venue) => void;
  onUber?: (venue: Venue) => void;
}

const VenuesSection = ({
  venues = [
    {
      id: "1",
      name: "Grand Hotel & Spa",
      address: "123 Market St, San Francisco, CA",
    },
  ],
  onGetDirections,
  onUber,
}: VenuesSectionProps) => {
  return (
    <View className="mx-4 mb-4">
      <Text className="text-lg font-bold text-gray-900 mb-3">Venues</Text>

      {venues.map((venue) => (
        <Card key={venue.id} className="mb-3">
          <View className="flex-row p-4 items-start">
            {/* Venue Image */}
            <View className="w-16 h-16 rounded-lg bg-gray-200 mr-4 overflow-hidden">
              {venue.imageUrl ? (
                <Image
                  source={{ uri: venue.imageUrl }}
                  className="w-full h-full"
                />
              ) : (
                <View className="w-full h-full items-center justify-center bg-gray-300">
                  <Ionicons name="map" size={24} color="#9CA3AF" />
                </View>
              )}
            </View>

            {/* Venue Info */}
            <View className="flex-1">
              <Text className="font-bold text-gray-900 text-base">
                {venue.name}
              </Text>
              <Text className="text-xs text-gray-500 mt-1 mb-2">
                {venue.address}
              </Text>

              {/* Action Buttons */}
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => onGetDirections?.(venue)}
                  className="bg-primary/10 px-2 py-1 rounded"
                >
                  <Text className="text-xs text-primary font-medium">
                    Get Directions
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => onUber?.(venue)}
                  className="bg-gray-100 px-2 py-1 rounded"
                >
                  <Text className="text-xs text-gray-600 font-medium">
                    Uber
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Card>
      ))}
    </View>
  );
};

export default VenuesSection;
