import { useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CreateEventForm() {
  const { category, subType } = useLocalSearchParams();

  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [attendees, setAttendees] = useState('');

  const getCategoryLabel = () => {
    switch (category) {
      case 'personal':
        return 'Personal / Family';
      case 'social':
        return 'Social / Community';
      case 'professional':
        return 'Professional';
      default:
        return 'Event';
    }
  };

  const getSubTypeLabel = () => {
    const typeStr = subType?.toString() || '';
    return typeStr.charAt(0).toUpperCase() + typeStr.slice(1).replace(/-/g, ' ');
  };

  const handleCreate = () => {
    // TODO: Save event to data store
    console.log('Creating event:', {
      category,
      subType,
      title: eventTitle,
      date: eventDate,
      time: eventTime,
      location: eventLocation,
      description: eventDescription,
      attendees: parseInt(attendees) || 0,
    });
    router.replace('/events');
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View className="bg-white px-4 py-4 border-b border-gray-100 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="close" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Create Event</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          {/* Category Badge */}
          <View className="flex-row items-center mb-4">
            <View className="bg-blue-100 px-3 py-1 rounded-full">
              <Text className="text-blue-700 text-sm font-medium">
                {getCategoryLabel()} / {getSubTypeLabel()}
              </Text>
            </View>
          </View>

          {/* Event Title */}
          <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
            <Text className="text-gray-900 font-semibold mb-2">Event Title *</Text>
            <TextInput
              className="text-gray-700 text-base"
              placeholder="Enter event title"
              value={eventTitle}
              onChangeText={setEventTitle}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Date & Time */}
          <View className="flex-row mb-3">
            <View className="flex-1 bg-white rounded-xl p-4 mr-2 shadow-sm">
              <View className="flex-row items-center mb-2">
                <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                <Text className="text-gray-500 text-sm ml-2">Date *</Text>
              </View>
              <TextInput
                className="text-gray-700 text-base"
                placeholder="Select date"
                value={eventDate}
                onChangeText={setEventDate}
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View className="flex-1 bg-white rounded-xl p-4 ml-2 shadow-sm">
              <View className="flex-row items-center mb-2">
                <Ionicons name="time-outline" size={16} color="#6B7280" />
                <Text className="text-gray-500 text-sm ml-2">Time *</Text>
              </View>
              <TextInput
                className="text-gray-700 text-base"
                placeholder="Select time"
                value={eventTime}
                onChangeText={setEventTime}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Location */}
          <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
            <View className="flex-row items-center mb-2">
              <Ionicons name="location-outline" size={16} color="#6B7280" />
              <Text className="text-gray-500 text-sm ml-2">Location</Text>
            </View>
            <TextInput
              className="text-gray-700 text-base"
              placeholder="Enter location or address"
              value={eventLocation}
              onChangeText={setEventLocation}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Description */}
          <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
            <View className="flex-row items-center mb-2">
              <Ionicons name="document-text-outline" size={16} color="#6B7280" />
              <Text className="text-gray-500 text-sm ml-2">Description</Text>
            </View>
            <TextInput
              className="text-gray-700 text-base min-h-[100]"
              placeholder="Describe your event..."
              value={eventDescription}
              onChangeText={setEventDescription}
              multiline
              textAlignVertical="top"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Expected Attendees */}
          <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
            <View className="flex-row items-center mb-2">
              <Ionicons name="people-outline" size={16} color="#6B7280" />
              <Text className="text-gray-500 text-sm ml-2">Expected Attendees</Text>
            </View>
            <TextInput
              className="text-gray-700 text-base"
              placeholder="Number of expected attendees"
              value={attendees}
              onChangeText={setAttendees}
              keyboardType="number-pad"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Create Button */}
          <TouchableOpacity
            className={`mt-4 py-4 rounded-xl items-center ${
              eventTitle ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            onPress={handleCreate}
            disabled={!eventTitle}
            activeOpacity={0.8}
          >
            <Text className={`text-white font-semibold text-lg ${
              !eventTitle && 'opacity-50'
            }`}>
              Create Event
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
