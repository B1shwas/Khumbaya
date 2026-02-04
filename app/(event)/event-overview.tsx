import { useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { events } from '@/src/data/events';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function EventOverview() {
  const { eventId } = useLocalSearchParams();
  const event = events.find(e => e.id === eventId);

  if (!event) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-gray-500 text-lg">Event not found</Text>
        <TouchableOpacity 
          className="mt-4 bg-primary px-6 py-3 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Calculate budget progress
  const getBudgetProgress = () => {
    if (!event.budget) return 0;
    const paidItems = event.budget.items.filter(item => item.paid);
    const totalPaid = paidItems.reduce((sum, item) => sum + (item.actual || item.estimated), 0);
    return Math.round((totalPaid / event.budget.total) * 100);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500';
      case 'present': return 'bg-green-500';
      case 'past': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  // Get phase color
  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'planning': return 'bg-yellow-500';
      case 'confirmed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'completed': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <TouchableOpacity
          className="absolute top-4 left-4 bg-white/90 p-2 rounded-full z-10"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        {/* Hero Image Section */}
        <View className="relative">
          <Image
            source={require('@/assets/images/home.png')}
            className="w-full h-64"
            resizeMode="cover"
          />
          
          {/* Overlay at Bottom of Image */}
          <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
            {/* Status & Phase Badges */}
            <View className="flex-row gap-2 mb-2">
              <View className={`px-3 py-1 rounded-full ${getStatusColor(event.status)}`}>
                <Text className="text-white text-xs font-semibold">{event.status.toUpperCase()}</Text>
              </View>
              <View className={`px-3 py-1 rounded-full ${getPhaseColor(event.phase)}`}>
                <Text className="text-white text-xs font-semibold">{event.phase.toUpperCase().replace('-', ' ')}</Text>
              </View>
            </View>
            
            {/* Title */}
            <Text className="text-white text-2xl font-bold mb-2">
              {event.title}
            </Text>
            
            {/* Time, Location, Attendees */}
            <View className="flex-row flex-wrap gap-4">
              <View className="flex-row items-center">
                <Ionicons name="calendar-outline" size={16} color="white" />
                <Text className="text-white text-sm ml-1">{event.date}</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="time" size={16} color="white" />
                <Text className="text-white text-sm ml-1">{event.time}</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="location-outline" size={16} color="white" />
                <Text className="text-white text-sm ml-1">{event.location}</Text>
              </View>
              {event.attendees && (
                <View className="flex-row items-center">
                  <Ionicons name="people-outline" size={16} color="white" />
                  <Text className="text-white text-sm ml-1">{event.attendees} attendees</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Content */}
        <View className="p-4">
          {/* Organizer */}
          {event.organizer && (
            <View className="flex-row items-center mb-4">
              <Text className="text-gray-500 text-sm mr-2">Organized by:</Text>
              <Text className="text-primary font-semibold text-sm">{event.organizer}</Text>
            </View>
          )}

          {/* Description */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-gray-900 font-semibold mb-2">About</Text>
            <Text className="text-gray-600 text-sm leading-5">
              {event.description}
            </Text>
          </View>

          {/* Bento Grid Layout - 2 Columns */}
          <View className="flex-row flex-wrap gap-3 mb-4">
            {/* Budget Card */}
            {event.budget && (
              <TouchableOpacity
                className="bg-white rounded-xl p-4 shadow-sm flex-1 min-w-[45%]"
                onPress={() => router.push({ pathname: '/(event)/event-budget' as any, params: { eventId: event.id } })}
                activeOpacity={0.8}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    <View className="bg-green-100 p-2 rounded-lg mr-2">
                      <Ionicons name="wallet-outline" size={18} color="#16a34a" />
                    </View>
                    <Text className="text-gray-900 font-semibold text-sm">Budget</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#666" />
                </View>
                <Text className="text-gray-500 text-xs mb-2">
                  ${event.budget.items.reduce((sum, i) => sum + i.estimated, 0).toLocaleString()}
                </Text>
                <View className="bg-gray-100 rounded-full h-1.5">
                  <View 
                    className="bg-green-500 h-1.5 rounded-full" 
                    style={{ width: `${getBudgetProgress()}%` }}
                  />
                </View>
                <Text className="text-xs text-gray-500 mt-1">{getBudgetProgress()}% paid</Text>
              </TouchableOpacity>
            )}

            {/* Vendors Card */}
            {event.vendors && event.vendors.length > 0 && (
              <TouchableOpacity
                className="bg-white rounded-xl p-4 shadow-sm flex-1 min-w-[45%]"
                onPress={() => router.push({ pathname: '/(event)/event-vendors' as any, params: { eventId: event.id } })}
                activeOpacity={0.8}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    <View className="bg-orange-100 p-2 rounded-lg mr-2">
                      <Ionicons name="business-outline" size={18} color="#ea580c" />
                    </View>
                    <Text className="text-gray-900 font-semibold text-sm">Vendors</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#666" />
                </View>
                <Text className="text-gray-500 text-xs">
                  {event.vendors.length} vendors
                </Text>
                <Text className="text-green-600 text-xs font-medium mt-1">
                  {event.vendors.filter(v => v.status === 'confirmed').length} confirmed
                </Text>
              </TouchableOpacity>
            )}

            {/* Timeline Card */}
            {event.subEvents && event.subEvents.length > 0 && (
              <TouchableOpacity
                className="bg-white rounded-xl p-4 shadow-sm flex-1 min-w-[45%]"
                onPress={() => router.push({ pathname: '/(event)/event-timeline' as any, params: { eventId: event.id } })}
                activeOpacity={0.8}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    <View className="bg-purple-100 p-2 rounded-lg mr-2">
                      <Ionicons name="list-outline" size={18} color="#9333ea" />
                    </View>
                    <Text className="text-gray-900 font-semibold text-sm">Timeline</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#666" />
                </View>
                <Text className="text-gray-500 text-xs">
                  {event.subEvents.length} sub-events
                </Text>
                <Text className="text-green-600 text-xs font-medium mt-1">
                  {event.subEvents.filter(s => s.completed).length} completed
                </Text>
              </TouchableOpacity>
            )}

            {/* Guests Card */}
            {event.guests && event.guests.length > 0 && (
              <TouchableOpacity
                className="bg-white rounded-xl p-4 shadow-sm flex-1 min-w-[45%]"
                onPress={() => router.push({ pathname: '/(event)/event-guests' as any, params: { eventId: event.id } })}
                activeOpacity={0.8}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    <View className="bg-blue-100 p-2 rounded-lg mr-2">
                      <Ionicons name="people-outline" size={18} color="#2563eb" />
                    </View>
                    <Text className="text-gray-900 font-semibold text-sm">Guests</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#666" />
                </View>
                <Text className="text-gray-500 text-xs">
                  {event.guests.length} guests
                </Text>
                <Text className="text-green-600 text-xs font-medium mt-1">
                  {event.guests.filter(g => g.rsvp === 'confirmed').length} confirmed
                </Text>
              </TouchableOpacity>
            )}

            {/* Photos & Videos Card */}
            {event.media && event.media.length > 0 && (
              <TouchableOpacity
                className="bg-white rounded-xl p-4 shadow-sm flex-1 min-w-[45%]"
                onPress={() => router.push({ pathname: '/(event)/event-photos' as any, params: { eventId: event.id } })}
                activeOpacity={0.8}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    <View className="bg-pink-100 p-2 rounded-lg mr-2">
                      <Ionicons name="image-outline" size={18} color="#ec4899" />
                    </View>
                    <Text className="text-gray-900 font-semibold text-sm">Photos & Videos</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#666" />
                </View>
                <Text className="text-gray-500 text-xs">
                  {event.media.length} items
                </Text>
                <Text className="text-pink-600 text-xs font-medium mt-1">
                  {event.media.filter(m => m.type === 'photo').length} photos
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Attendees Card */}
          {event.attendees && (
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="bg-green-100 p-3 rounded-lg mr-4">
                    <Text className="text-xl">👥</Text>
                  </View>
                  <View>
                    <Text className="text-gray-500 text-sm">Expected Attendees</Text>
                    <Text className="text-gray-900 font-semibold text-lg">
                      {event.attendees} people
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
