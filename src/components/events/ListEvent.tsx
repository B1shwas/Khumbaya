import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, Image } from 'react-native';
import { events } from '@/src/data/events';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

type TabType = 'my-events' | 'invited';

export default function ListEvent() {
  const [activeTab, setActiveTab] = useState<TabType>('my-events');

  // Filter events based on tab
  const filteredEvents = activeTab === 'my-events'
    ? events.filter((e: any) => e.type === 'normal')
    : events.filter((e: any) => e.type === 'invited');

  // Group events by status
  const upcomingEvents = filteredEvents.filter((e: any) => e.status === 'upcoming' || e.phase === 'in-progress');
  const pastEvents = filteredEvents.filter((e: any) => e.status === 'past' || e.phase === 'completed');

  // Get formatted date
  const formatDate = (dateStr: string, time: string) => {
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} • ${time}`;
  };

  // Get status badge color
  const getStatusBadgeStyle = (phase: string) => {
    switch (phase) {
      case 'planning':
        return 'bg-pink-100 border-pink-200';
      case 'confirmed':
        return 'bg-green-100 border-green-200';
      case 'completed':
        return 'bg-gray-100 border-gray-200';
      case 'in-progress':
        return 'bg-blue-100 border-blue-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  // Get status badge text color
  const getStatusBadgeTextColor = (phase: string) => {
    switch (phase) {
      case 'planning':
        return 'text-pink-600';
      case 'confirmed':
        return 'text-green-700';
      case 'completed':
        return 'text-gray-600';
      case 'in-progress':
        return 'text-blue-700';
      default:
        return 'text-gray-600';
    }
  };

  // Get image source
  const getImageSource = (imageName: string) => {
    switch (imageName) {
      case 'home':
        return require('@/assets/images/home.png');
      case 'OIP':
        return require('@/assets/images/OIP.webp');
      case 'pexels-teddy-2263436':
        return require('@/assets/images/pexels-teddy-2263436.jpg');
      default:
        return require('@/assets/images/home.png');
    }
  };

  const handleEventPress = (eventId: string) => {
    router.push({
      pathname: '/(event)/event-overview' as any,
      params: { eventId }
    });
  };

  const renderEventCard = (event: typeof events[0], isPast: boolean = false) => (
    <TouchableOpacity
      key={event.id}
      className="flex-row gap-3 bg-white p-3 rounded-2xl mb-3 shadow-sm border border-gray-100 active:scale-[0.99] transition-transform"
      onPress={() => handleEventPress(event.id)}
      activeOpacity={0.8}
    >
      {/* Event Image */}
      <View className="shrink-0 h-20 w-20 rounded-xl overflow-hidden">
        <Image
          source={getImageSource(event.image)}
          className="h-full w-full"
          resizeMode="cover"
        />
      </View>

      {/* Event Details */}
      <View className="flex-1 justify-between py-0.5">
        <View className="flex-row justify-between items-start gap-2">
          <Text className="text-gray-900 text-base font-bold leading-tight flex-1" numberOfLines={2}>
            {event.title}
          </Text>
          <View className={`px-2 py-0.5 rounded-full border ${getStatusBadgeStyle(event.phase)} shrink-0`}>
            <Text className={`text-[10px] font-bold uppercase tracking-wide ${getStatusBadgeTextColor(event.phase)}`}>
              {event.phase.charAt(0).toUpperCase() + event.phase.slice(1)}
            </Text>
          </View>
        </View>

        <View>
          <View className="flex-row items-center gap-1.5 mb-1">
            <Ionicons name="location-outline" size={14} color="#6b7280" />
            <Text className="text-gray-500 text-xs font-medium" numberOfLines={1}>
              {event.location}
            </Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <Ionicons name="calendar-outline" size={14} color={isPast ? "#9ca3af" : "#ee2b8c"} />
            <Text className={`text-xs font-semibold ${isPast ? 'text-gray-400' : 'text-primary'}`}>
              {formatDate(event.date, event.time)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1">
      {/* Tabs */}
      <View className="mt-4 pb-1 px-4">
        <View className="flex-row bg-gray-100 p-1 rounded-xl">
          <TouchableOpacity
            className={`flex-1 py-2 px-4 rounded-lg ${activeTab === 'my-events' ? 'bg-white shadow-sm' : ''}`}
            onPress={() => setActiveTab('my-events')}
            activeOpacity={0.8}
          >
            <Text className={`text-center text-sm font-bold ${activeTab === 'my-events' ? 'text-primary' : 'text-gray-500'}`}>
              My Events
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-2 px-4 rounded-lg ${activeTab === 'invited' ? 'bg-white shadow-sm' : ''}`}
            onPress={() => setActiveTab('invited')}
            activeOpacity={0.8}
          >
            <Text className={`text-center text-sm font-medium ${activeTab === 'invited' ? 'text-primary' : 'text-gray-500'}`}>
              Invited
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Events List */}
      <ScrollView
        className="flex-1 px-4 pt-2 pb-24"
        showsVerticalScrollIndicator={false}
      >
        {/* Upcoming Events Section */}
        {upcomingEvents.length > 0 && (
          <View className="mb-2 mt-4">
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Upcoming
            </Text>
            {upcomingEvents.map((event: any) => renderEventCard(event, false))}
          </View>
        )}

        {/* Past Events Section */}
        {pastEvents.length > 0 && (
          <View className="mb-4 mt-6">
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Past Events
            </Text>
            {pastEvents.map((event: any) => renderEventCard(event, true))}
          </View>
        )}

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <View className="flex-1 justify-center items-center py-20">
            <Ionicons name="calendar-outline" size={64} color="#ccc" />
            <Text className="text-gray-500 text-lg mt-4">No events found</Text>
            <TouchableOpacity
              className="mt-4 bg-primary px-6 py-3 rounded-lg"
              onPress={() => router.push('/Eventcrud/create-event' as any)}
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold">Create Event</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
