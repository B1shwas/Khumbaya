import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function CreateEventSuccess() {
  const { 
    eventType, 
    eventTypeIcon, 
    eventTypeIconColor, 
    date, 
    startTime, 
    endTime, 
    eventTitle,
    location,
    isPublic,
    description,
    attendees 
  } = useLocalSearchParams();

  const [showDetails, setShowDetails] = useState(true);

  // Get category info for styling
  const getCategoryInfo = () => {
    switch (eventType) {
      case 'Hindu Wedding':
        return { label: 'Hindu Wedding', color: '#ec4899', bgColor: '#fdf2f8' };
      case 'Buddhist Wedding':
        return { label: 'Buddhist Wedding', color: '#10b981', bgColor: '#ecfdf5' };
      case 'Christian Wedding':
        return { label: 'Christian Wedding', color: '#6366f1', bgColor: '#eef2ff' };
      case 'Muslim Wedding':
        return { label: 'Muslim Wedding', color: '#8b5cf6', bgColor: '#f5f3ff' };
      case 'Kids Party':
        return { label: 'Kids Party', color: '#f59e0b', bgColor: '#fffbeb' };
      case 'Surprise':
        return { label: 'Surprise', color: '#ec4899', bgColor: '#fdf2f8' };
      case 'Conference':
        return { label: 'Conference', color: '#6366f1', bgColor: '#eef2ff' };
      case 'Training':
        return { label: 'Training', color: '#10b981', bgColor: '#ecfdf5' };
      case 'Concert':
        return { label: 'Concert', color: '#8b5cf6', bgColor: '#f5f3ff' };
      default:
        return { label: String(eventType || 'Event'), color: '#6b7280', bgColor: '#f3f4f6' };
    }
  };

  const categoryInfo = getCategoryInfo();

  const getEventTypeIcon = () => {
    if (eventTypeIcon) return eventTypeIcon as string;
    return 'calendar';
  };

  const getEventTypeIconColor = () => {
    if (eventTypeIconColor) return eventTypeIconColor as string;
    return categoryInfo.color;
  };

  const handleSelectVendors = () => {
    router.push("/vendors/explore" as any);
  };

  const handleAddSubEvents = () => {
    router.push({ pathname: "/(event)/events" } as any);
  };

  const handleManageMyself = () => {
    router.replace({ pathname: "/(event)/events" } as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-pink-50">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 bg-white border-b border-pink-100">
          <View className="w-10 h-10 items-center justify-center rounded-full bg-green-100">
            <Ionicons name="checkmark-circle" size={24} color="#10b981" />
          </View>
          <Text className="flex-1 text-center text-lg font-bold text-gray-900 pr-12">
            Event Created!
          </Text>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="p-4">
            {/* Success Badge */}
            <View className="items-center text-center py-6">
              <View className="mb-2 px-3 py-1 rounded-full bg-green-100">
                <Text className="text-xs font-bold uppercase tracking-wider text-green-600">
                  Success
                </Text>
              </View>
              <Text className="text-2xl font-extrabold text-gray-900 text-center pb-2">
                Your Event is Ready!
              </Text>
            </View>

            {/* Event Details Card */}
            <View className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden mb-6">
              {/* Event Type Badge */}
              <View className="flex-row items-center px-4 py-3 border-b border-pink-100">
                <View 
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: categoryInfo.bgColor }}
                >
                  <Ionicons name={getEventTypeIcon() as any} size={20} color={getEventTypeIconColor()} />
                </View>
                <Text 
                  className="text-base font-bold"
                  style={{ color: getEventTypeIconColor() }}
                >
                  {categoryInfo.label}
                </Text>
              </View>

              {/* Event Title */}
              <View className="px-4 py-3 border-b border-pink-100">
                <Text className="text-gray-500 text-xs uppercase tracking-wide">Event Title</Text>
                <Text className="text-lg font-bold text-gray-900 mt-1">
                  {eventTitle || 'Untitled Event'}
                </Text>
              </View>

              {/* Date & Time */}
              <View className="px-4 py-3 border-b border-pink-100">
                <Text className="text-gray-500 text-xs uppercase tracking-wide">Date & Time</Text>
                <View className="flex-row items-center mt-1">
                  <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                  <Text className="text-gray-700 ml-2">{date}</Text>
                </View>
                {startTime && (
                  <View className="flex-row items-center mt-1">
                    <Ionicons name="time-outline" size={16} color="#6B7280" />
                    <Text className="text-gray-700 ml-2">{startTime} - {endTime}</Text>
                  </View>
                )}
              </View>

              {/* Location */}
              {location && (
                <View className="px-4 py-3 border-b border-pink-100">
                  <Text className="text-gray-500 text-xs uppercase tracking-wide">Location</Text>
                  <View className="flex-row items-center mt-1">
                    <Ionicons name="location-outline" size={16} color="#6B7280" />
                    <Text className="text-gray-700 ml-2">{location}</Text>
                  </View>
                </View>
              )}

              {/* Privacy */}
              <View className="px-4 py-3">
                <Text className="text-gray-500 text-xs uppercase tracking-wide">Privacy</Text>
                <View className="flex-row items-center mt-1">
                  <Ionicons 
                    name={isPublic === 'true' ? 'earth' : 'lock-closed'} 
                    size={16} 
                    color="#6B7280" 
                  />
                  <Text className="text-gray-700 ml-2">
                    {isPublic === 'true' ? 'Public' : 'Private'}
                  </Text>
                </View>
              </View>
            </View>

            {/* What's Next Section */}
            <Text className="text-lg font-bold text-gray-900 mb-4">
              What's Next?
            </Text>

            <View className="flex-1 gap-4 pb-12">
              {/* Action Card 1: Select Vendors */}
              <TouchableOpacity
                className="flex-row items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-sm border border-gray-100"
                onPress={handleSelectVendors}
                activeOpacity={0.8}
              >
                <View className="flex-1 justify-between gap-4">
                  <View className="gap-1">
                    <Text className="text-base font-bold text-gray-900">Select Vendors</Text>
                    <Text className="text-sm text-gray-500">
                      Find catering, photography, and venues
                    </Text>
                  </View>
                  <TouchableOpacity
                    className="flex-row items-center justify-center rounded-lg h-8 px-3 bg-primary"
                    onPress={handleSelectVendors}
                  >
                    <Text className="text-xs font-bold text-white mr-1">Browse</Text>
                    <Ionicons name="chevron-forward" size={14} color="white" />
                  </TouchableOpacity>
                </View>
                <View className="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200' }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
              </TouchableOpacity>

              {/* Action Card 2: Add Sub-Events */}
              <TouchableOpacity
                className="flex-row items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-sm border border-gray-100"
                onPress={handleAddSubEvents}
                activeOpacity={0.8}
              >
                <View className="flex-1 justify-between gap-4">
                  <View className="gap-1">
                    <Text className="text-base font-bold text-gray-900">Add Sub-Events</Text>
                    <Text className="text-sm text-gray-500">
                      Build your event schedule
                    </Text>
                  </View>
                  <TouchableOpacity
                    className="flex-row items-center justify-center rounded-lg h-8 px-3 bg-pink-100"
                    onPress={handleAddSubEvents}
                  >
                    <Ionicons name="add" size={14} color="#ec4899" />
                    <Text className="text-xs font-bold text-primary ml-1">Add</Text>
                  </TouchableOpacity>
                </View>
                <View className="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=200' }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
              </TouchableOpacity>

              {/* Action Card 3: Manage Myself */}
              <TouchableOpacity
                className="flex-row items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-sm border border-gray-100"
                onPress={handleManageMyself}
                activeOpacity={0.8}
              >
                <View className="flex-1 justify-between gap-4">
                  <View className="gap-1">
                    <Text className="text-base font-bold text-gray-900">Manage Myself</Text>
                    <Text className="text-sm text-gray-500">
                      View event dashboard
                    </Text>
                  </View>
                  <TouchableOpacity
                    className="flex-row items-center justify-center rounded-lg h-8 px-3 bg-pink-100"
                    onPress={handleManageMyself}
                  >
                    <Ionicons name="grid" size={14} color="#ec4899" />
                    <Text className="text-xs font-bold text-primary ml-1">Dashboard</Text>
                  </TouchableOpacity>
                </View>
                <View className="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200' }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
              </TouchableOpacity>

              {/* Maybe Later */}
              <View className="items-center gap-4 mt-4">
                <TouchableOpacity onPress={handleManageMyself}>
                  <Text className="text-primary font-bold text-sm">Maybe Later</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
