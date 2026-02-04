import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Event } from '@/types/event';
import { router } from 'expo-router';

// Helper function to get image source based on image name
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

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const handlePress = () => {
    router.push({
      pathname: '/event-overview',
      params: { eventId: event.id }
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'present': return 'bg-green-100 text-green-800';
      case 'past': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get phase color
  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format status label
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Format phase label
  const formatPhase = (phase: string) => {
    return phase.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-xl shadow-md mb-3"
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {/* Image Container - Left Side */}
      <View className="h-32 overflow-hidden rounded-t-xl">
        <Image
          source={getImageSource(event.image)}
          className="w-full h-full"
          resizeMode="cover"
        />
        {/* Event Type Badge */}
        <View className={`absolute top-2 left-2 px-2 py-0.5 rounded-full ${
          event.type === 'invited' ? 'bg-primary' : 'bg-gray-700'
        }`}>
          <Text className="text-white text-[10px] font-semibold">
            {event.type === 'invited' ? 'Invited' : 'Public'}
          </Text>
        </View>
      </View>

      {/* Text Container - Right Side (below image) */}
      <View className="p-3">
        <Text className="text-base font-bold text-gray-900 mb-1" numberOfLines={2}>
          {event.title}
        </Text>
        
        {/* Status and Phase Badges */}
        <View className="flex-row gap-1 mb-2">
          <View className={`px-2 py-0.5 rounded-full ${getStatusColor(event.status)}`}>
            <Text className="text-[10px] font-medium">{formatStatus(event.status)}</Text>
          </View>
          <View className={`px-2 py-0.5 rounded-full ${getPhaseColor(event.phase)}`}>
            <Text className="text-[10px] font-medium">{formatPhase(event.phase)}</Text>
          </View>
        </View>
        
        <Text className="text-gray-500 text-xs mb-1" numberOfLines={1}>
          📅 {event.date} at {event.time}
        </Text>
        
        <Text className="text-gray-500 text-xs" numberOfLines={1}>
          📍 {event.location}
        </Text>
        
        {/* Attendees Count */}
        {event.attendees && (
          <Text className="text-gray-400 text-xs mt-2">
            👥 {event.attendees} attendees
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
