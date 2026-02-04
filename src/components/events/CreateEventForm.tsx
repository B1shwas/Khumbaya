import { useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CreateEventForm() {
  const { category, eventType, eventTypeIcon, eventTypeIconColor, date, startTime, endTime, isAllDay, isRepeat, repeatFrequency } = useLocalSearchParams();

  const [eventTitle, setEventTitle] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [attendees, setAttendees] = useState('');

  // Get category info for styling
  const getCategoryInfo = () => {
    switch (category) {
      case 'wedding':
        return { label: 'Wedding', color: '#ec4899', bgColor: '#fdf2f8', textColor: '#be185d' };
      case 'corporate':
        return { label: 'Corporate', color: '#6366f1', bgColor: '#eef2ff', textColor: '#4f46e5' };
      case 'birthday':
        return { label: 'Birthday', color: '#f59e0b', bgColor: '#fffbeb', textColor: '#d97706' };
      case 'workshop':
        return { label: 'Workshop', color: '#10b981', bgColor: '#ecfdf5', textColor: '#059669' };
      case 'music':
        return { label: 'Music', color: '#8b5cf6', bgColor: '#f5f3ff', textColor: '#7c3aed' };
      case 'personal-family':
        return { label: 'Personal / Family', color: '#ee2b8c', bgColor: '#fef2f2', textColor: '#be185d' };
      case 'social-community':
        return { label: 'Social / Community', color: '#3b82f6', bgColor: '#eff6ff', textColor: '#1d4ed8' };
      case 'professional':
        return { label: 'Professional', color: '#10b981', bgColor: '#f0fdf4', textColor: '#047857' };
      default:
        return { label: 'Event', color: '#6b7280', bgColor: '#f3f4f6', textColor: '#4b5563' };
    }
  };

  const categoryInfo = getCategoryInfo();

  // Use passed event type info or fallback to category
  const getEventTypeLabel = () => {
    if (eventType) return eventType as string;
    return categoryInfo.label;
  };

  const getEventTypeIcon = () => {
    if (eventTypeIcon) return eventTypeIcon as string;
    switch (category) {
      case 'wedding': return 'heart';
      case 'corporate': return 'briefcase';
      case 'birthday': return 'cake';
      case 'workshop': return 'school';
      case 'music': return 'musical-notes';
      default: return 'calendar';
    }
  };

  const getEventTypeIconColor = () => {
    if (eventTypeIconColor) return eventTypeIconColor as string;
    return categoryInfo.color;
  };

  // Format date and time for display
  const getFormattedDateTime = () => {
    if (date) {
      const start = startTime ? String(startTime) : '';
      const end = endTime ? String(endTime) : '';
      if (isAllDay === 'true') {
        return `${date} (All Day)`;
      }
      if (start && end) {
        return `${date} (${start} - ${end})`;
      }
      if (start) {
        return `${date} (${start})`;
      }
      return String(date);
    }
    return '';
  };

  const handleContinue = () => {
    router.push({
      pathname: "/Eventcrud/create-event-location",
      params: {
        category,
        eventType,
        eventTypeIcon,
        eventTypeIconColor,
        date,
        startTime,
        endTime,
        isAllDay,
        isRepeat,
        repeatFrequency,
        eventTitle,
        eventDescription,
        attendees,
      },
    } as any);
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-pink-50"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View className="bg-white px-4 py-4 border-b border-pink-100 flex-row items-center shadow-sm">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="mr-4 w-10 h-10 items-center justify-center rounded-full bg-pink-100"
        >
          <Ionicons name="close" size={20} color="#ec4899" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Event Details</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          {/* Category & Event Type Badge */}
          <View className="flex-row items-center mb-6">
            <View 
              className="px-4 py-2 rounded-full flex-row items-center"
              style={{ backgroundColor: categoryInfo.bgColor }}
            >
              <Ionicons name={getEventTypeIcon() as any} size={16} color={getEventTypeIconColor()} />
              <Text 
                className="text-sm font-semibold ml-2"
                style={{ color: categoryInfo.color }}
              >
                {getEventTypeLabel()}
              </Text>
            </View>
          </View>

          {/* Date & Time Display */}
          {getFormattedDateTime() && (
            <View 
              className={`rounded-xl p-4 mb-4 border bg-white border-pink-200 shadow-sm`}
            >
              <View className="flex-row items-center mb-2">
                <Ionicons name="calendar-outline" size={16} color={categoryInfo.color} />
                <Text 
                  className="text-sm ml-2 font-medium"
                  style={{ color: categoryInfo.color }}
                >
                  Date & Time
                </Text>
              </View>
              <Text className="text-gray-700 text-base">
                {getFormattedDateTime()}
              </Text>
              {isRepeat === 'true' && (
                <Text className="text-gray-500 text-sm mt-1">
                  Repeats: {repeatFrequency}
                </Text>
              )}
            </View>
          )}

          {/* Event Title */}
          <View 
            className={`rounded-xl p-4 mb-3 border ${
              eventTitle ? 'bg-white border-pink-300' : 'bg-white border-gray-100'
            }`}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
            }}
          >
            <View className="flex-row items-center mb-2">
              <Ionicons name="create" size={16} color={eventTitle ? categoryInfo.color : '#6B7280'} />
              <Text 
                className={`text-sm ml-2 ${eventTitle ? 'font-medium' : 'text-gray-500'}`}
                style={{ color: eventTitle ? categoryInfo.color : '#6B7280' }}
              >
                Event Title *
              </Text>
            </View>
            <TextInput
              className="text-gray-700 text-base"
              placeholder="Enter event title"
              placeholderTextColor="#9CA3AF"
              value={eventTitle}
              onChangeText={setEventTitle}
              multiline={false}
            />
          </View>

          {/* Location */}
          <View 
            className={`rounded-xl p-4 mb-3 border bg-white border-gray-100`}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
            }}
          >
            <View className="flex-row items-center mb-2">
              <Ionicons name="location-outline" size={16} color="#6B7280" />
              <Text className="text-sm ml-2 text-gray-500">
                Location
              </Text>
            </View>
            <TextInput
              className="text-gray-700 text-base"
              placeholder="Enter location or address"
              placeholderTextColor="#9CA3AF"
              value={eventLocation}
              onChangeText={setEventLocation}
            />
          </View>

          {/* Description */}
          <View 
            className={`rounded-xl p-4 mb-3 border bg-white border-gray-100`}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
            }}
          >
            <View className="flex-row items-center mb-2">
              <Ionicons name="document-text-outline" size={16} color="#6B7280" />
              <Text className="text-sm ml-2 text-gray-500">
                Description
              </Text>
            </View>
            <TextInput
              className="text-gray-700 text-base min-h-[80]"
              placeholder="Describe your event..."
              placeholderTextColor="#9CA3AF"
              value={eventDescription}
              onChangeText={setEventDescription}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Expected Attendees */}
          <View 
            className={`rounded-xl p-4 mb-3 border bg-white border-gray-100`}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
            }}
          >
            <View className="flex-row items-center mb-2">
              <Ionicons name="people-outline" size={16} color="#6B7280" />
              <Text className="text-sm ml-2 text-gray-500">
                Expected Attendees
              </Text>
            </View>
            <TextInput
              className="text-gray-700 text-base"
              placeholder="Number of expected attendees"
              placeholderTextColor="#9CA3AF"
              value={attendees}
              onChangeText={setAttendees}
              keyboardType="number-pad"
            />
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            className={`mt-6 py-4 rounded-xl items-center shadow-lg ${
              eventTitle ? '' : 'opacity-50'
            }`}
            style={{ 
              backgroundColor: eventTitle ? categoryInfo.color : '#d1d5db',
              shadowColor: eventTitle ? categoryInfo.color : '#9ca3af',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
            }}
            onPress={handleContinue}
            disabled={!eventTitle}
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-lg">
              Continue
            </Text>
          </TouchableOpacity>

          {/* Footer Note */}
          <Text className="text-center text-gray-400 text-sm mt-4">
            Fields marked with * are required
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
