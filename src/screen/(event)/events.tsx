import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import ListEvent from '@/src/components/events/ListEvent';

export default function EventsPage() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1">
        {/* Header */}
        <View className="px-4 py-3 bg-white border-b border-gray-100">
          <View className="flex-row items-center justify-between h-12">
            <Text className="text-gray-900 text-2xl font-bold tracking-tight">
              Your Events
            </Text>
            <TouchableOpacity
              className="bg-primary p-2 rounded-lg"
              onPress={() => router.push('/create-event')}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Event List */}
        <ListEvent />
      </View>
    </SafeAreaView>
  );
}
