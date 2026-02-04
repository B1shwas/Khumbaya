import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { events } from '@/src/data/events';
import { Ionicons } from '@expo/vector-icons';

export default function EventVendors() {
  const { eventId } = useLocalSearchParams();
  const event = events.find((e: any) => e.id === eventId);

  if (!event) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-gray-500 text-lg">Event not found</Text>
      </SafeAreaView>
    );
  }

  if (!event.vendors) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-gray-500 text-lg">No vendors data</Text>
      </SafeAreaView>
    );
  }

  const { vendors } = event;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          {/* Vendors List */}
          {vendors.map((vendor: any) => (
            <View key={vendor.id} className="bg-white rounded-xl p-4 mb-3 shadow-sm">
              <View className="flex-row items-center mb-3">
                <View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center mr-3">
                  <Ionicons name="briefcase" size={24} color="#6B7280" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold text-lg">{vendor.name}</Text>
                  <Text className="text-gray-500 text-sm">{vendor.category}</Text>
                </View>
                <View className={`px-2 py-1 rounded-full ${
                  vendor.status === 'confirmed' ? 'bg-green-100' : 
                  vendor.status === 'pending' ? 'bg-yellow-100' : 
                  vendor.status === 'declined' ? 'bg-red-100' : 'bg-gray-100'
                }`}>
                  <Text className={`text-xs font-medium ${
                    vendor.status === 'confirmed' ? 'text-green-800' : 
                    vendor.status === 'pending' ? 'text-yellow-800' : 
                    vendor.status === 'declined' ? 'text-red-800' : 'text-gray-800'
                  }`}>
                    {vendor.status?.charAt(0).toUpperCase() + vendor.status?.slice(1) || 'Unknown'}
                  </Text>
                </View>
              </View>
              
              <View className="border-t border-gray-100 pt-3">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="call-outline" size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-2">{vendor.contact}</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="mail-outline" size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-2">{vendor.email}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
