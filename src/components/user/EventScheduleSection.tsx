import Card from "@/src/components/ui/guest-profile/Card";
import { Pressable, Text, View } from "react-native";

interface ScheduleItem {
  time: string;
  title: string;
  location: string;
  isActive?: boolean;
}

interface EventScheduleSectionProps {
  items?: ScheduleItem[];
  onViewFull?: () => void;
}

const EventScheduleSection = ({
  items = [
    {
      time: "4:00 PM",
      title: "Ceremony Begins",
      location: "Garden Area",
      isActive: true,
    },
    {
      time: "5:30 PM",
      title: "Cocktail Hour",
      location: "Main Terrace",
      isActive: false,
    },
    {
      time: "7:00 PM",
      title: "Dinner & Reception",
      location: "Grand Ballroom",
      isActive: false,
    },
  ],
  onViewFull,
}: EventScheduleSectionProps) => {
  return (
    <View className="mx-4 mb-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-bold text-gray-900">Event Schedule</Text>
        <Pressable onPress={onViewFull}>
          <Text className="text-sm font-semibold text-primary">View Full</Text>
        </Pressable>
      </View>

      {/* Timeline Card */}
      <Card>
        <View className="p-5">
          <View className="pl-4 border-l-2 border-gray-100">
            {items.map((item, index) => (
              <View
                key={index}
                className={index !== items.length - 1 ? "mb-6" : ""}
              >
                {/* Timeline Dot */}
                <View className="flex-row items-start">
                  <View
                    className={`absolute -left-[18px] top-1 w-4 h-4 rounded-full border-4 border-white ${
                      item.isActive ? "bg-accent" : "bg-gray-300"
                    }`}
                  />
                  <View className="flex-1">
                    <Text
                      className={`text-xs font-bold uppercase tracking-wider ${
                        item.isActive ? "text-accent" : "text-gray-500"
                      }`}
                    >
                      {item.time}
                    </Text>
                    <Text className="font-bold text-gray-900 mt-1">
                      {item.title}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-1">
                      {item.location}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </Card>
    </View>
  );
};

export default EventScheduleSection;
