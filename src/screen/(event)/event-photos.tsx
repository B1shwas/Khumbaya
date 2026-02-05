import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { events } from '@/src/data/events';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - 48) / 2;

export default function EventPhotos() {
  const { eventId } = useLocalSearchParams();
  const event = events.find((e: any) => e.id === eventId);

  if (!event) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-gray-500 text-lg">Event not found</Text>
      </SafeAreaView>
    );
  }

  if (!event.media || event.media.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Ionicons name="images-outline" size={48} color="#9CA3AF" />
        <Text className="text-gray-500 text-lg mt-2">No photos or videos</Text>
      </SafeAreaView>
    );
  }

  const { media } = event;

  const photos = media.filter((m: any) => m.type === 'photo');
  const videos = media.filter((m: any) => m.type === 'video');

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          {/* Videos Section */}
          {videos.length > 0 && (
            <>
              <Text className="text-gray-900 font-semibold text-lg mb-3">Videos</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                {videos.map((item: any) => (
                  <View key={item.id} className="mr-3">
                    <View className="w-64 h-36 bg-gray-900 rounded-xl overflow-hidden">
                      <Image 
                        source={{ uri: item.thumbnail || item.url }} 
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                      <View className="absolute inset-0 bg-black/30 items-center justify-center">
                        <View className="w-12 h-12 bg-white/90 rounded-full items-center justify-center">
                          <Ionicons name="play" size={24} color="#374151" />
                        </View>
                      </View>
                    </View>
                    <Text className="text-gray-600 text-sm mt-1" numberOfLines={1}>{item.caption}</Text>
                  </View>
                ))}
              </ScrollView>
            </>
          )}

          {/* Photos Section */}
          {photos.length > 0 && (
            <>
              <Text className="text-gray-900 font-semibold text-lg mb-3">Photos</Text>
              <View className="flex-row flex-wrap">
                {photos.map((item: any) => (
                  <View key={item.id} className="mb-3" style={{ width: IMAGE_SIZE, marginRight: item.id % 2 === 0 ? 0 : 12 }}>
                    <Image 
                      source={{ uri: item.url }} 
                      className="w-full h-32 rounded-xl"
                      resizeMode="cover"
                    />
                    {item.caption && (
                      <Text className="text-gray-600 text-xs mt-1" numberOfLines={2}>{item.caption}</Text>
                    )}
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
