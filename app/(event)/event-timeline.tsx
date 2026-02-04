import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { events } from '@/src/data/events';
import { Ionicons } from '@expo/vector-icons';

export default function EventTimeline() {
  const { eventId } = useLocalSearchParams();
  const event = events.find((e: any) => e.id === eventId);

  if (!event) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-gray-500 text-lg">Event not found</Text>
      </SafeAreaView>
    );
  }

  if (!event.subEvents) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-gray-500 text-lg">No timeline data</Text>
      </SafeAreaView>
    );
  }

  const { subEvents } = event;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          {subEvents.map((item: any, index: number) => (
            <View key={item.id} className="flex-row mb-4">
              {/* Timeline connector */}
              <View className="items-center mr-4">
                <View className={`w-10 h-10 rounded-full items-center justify-center ${
                  item.completed ? 'bg-green-500' : item.current ? 'bg-blue-500' : 'bg-gray-300'
                }`}>
                  <Ionicons 
                    name={item.completed ? "checkmark" : "time"} 
                    size={20} 
                    color="white" 
                  />
                </View>
                {index < subEvents.length - 1 && (
                  <View className={`w-0.5 flex-1 my-1 ${item.completed ? 'bg-green-300' : 'bg-gray-200'}`} />
                )}
              </View>
              
              {/* Timeline content */}
              <View className="flex-1 bg-white rounded-xl p-4 shadow-sm">
                <Text className="text-gray-500 text-sm">{item.time}</Text>
                <Text className="text-gray-900 font-semibold text-lg">{item.title}</Text>
                {item.description && (
                  <Text className="text-gray-600 mt-1">{item.description}</Text>
                )}
                {item.location && (
                  <View className="flex-row items-center mt-2">
                    <Ionicons name="location-outline" size={14} color="#6B7280" />
                    <Text className="text-gray-500 text-sm ml-1">{item.location}</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
