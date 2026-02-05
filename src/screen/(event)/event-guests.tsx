import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { events } from '@/src/data/events';
import { Ionicons } from '@expo/vector-icons';

export default function EventGuests() {
  const { eventId } = useLocalSearchParams();
  // const event = events.find((e: any) => e.id === eventId);

  const event  = [] as any;

  if (!event) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-gray-500 text-lg">Event not found</Text>
      </SafeAreaView>
    );
  }

  if (!event.guests) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-gray-500 text-lg">No guests data</Text>
      </SafeAreaView>
    );
  }

  const { guests } = event;

  const confirmed = guests.filter((g: any) => g.status === 'confirmed').length;
  const pending = guests.filter((g: any) => g.status === 'pending').length;
  const declined = guests.filter((g: any) => g.status === 'declined').length;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          {/* Stats */}
          <View className="flex-row mb-4">
            <View className="flex-1 bg-green-50 rounded-xl p-3 mr-2 items-center">
              <Text className="text-2xl font-bold text-green-600">{confirmed}</Text>
              <Text className="text-xs text-green-700">Confirmed</Text>
            </View>
            <View className="flex-1 bg-yellow-50 rounded-xl p-3 mx-2 items-center">
              <Text className="text-2xl font-bold text-yellow-600">{pending}</Text>
              <Text className="text-xs text-yellow-700">Pending</Text>
            </View>
            <View className="flex-1 bg-red-50 rounded-xl p-3 ml-2 items-center">
              <Text className="text-2xl font-bold text-red-600">{declined}</Text>
              <Text className="text-xs text-red-700">Declined</Text>
            </View>
          </View>

          {/* Guest List */}
          {guests.map((guest: any) => (
            <View key={guest.id} className="bg-white rounded-xl p-4 mb-3 shadow-sm flex-row items-center">
              <View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center mr-3">
                {guest.avatar ? (
                  <Image source={{ uri: guest.avatar }} className="w-12 h-12 rounded-full" />
                ) : (
                  <Ionicons name="person" size={24} color="#6B7280" />
                )}
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-semibold">{guest.name}</Text>
                <Text className="text-gray-500 text-sm">{guest.email}</Text>
              </View>
              <View className={`px-2 py-1 rounded-full ${
                guest.status === 'confirmed' ? 'bg-green-100' : 
                guest.status === 'pending' ? 'bg-yellow-100' : 
                guest.status === 'declined' ? 'bg-red-100' : 'bg-gray-100'
              }`}>
                <Text className={`text-xs font-medium ${
                  guest.status === 'confirmed' ? 'text-green-800' : 
                  guest.status === 'pending' ? 'text-yellow-800' : 
                  guest.status === 'declined' ? 'text-red-800' : 'text-gray-800'
                }`}>
                  {guest.status?.charAt(0).toUpperCase() + guest.status?.slice(1) || 'Unknown'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
