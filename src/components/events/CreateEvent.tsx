import { useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Event Category Types
type EventCategory = 'personal' | 'social' | 'professional';

interface SubEventType {
  id: string;
  label: string;
  icon: string;
}

interface EventCategoryOption {
  id: EventCategory;
  label: string;
  description: string;
  icon: string;
  color: string;
  subTypes: SubEventType[];
}

// Event Categories Configuration
export const EVENT_CATEGORIES: EventCategoryOption[] = [
  {
    id: 'personal',
    label: 'Personal / Family',
    description: 'Events affecting individual or family life',
    icon: 'home-outline',
    color: '#10B981', // green
    subTypes: [
      { id: 'birthday', label: 'Birthday', icon: 'cafe-outline' },
      { id: 'wedding', label: 'Wedding', icon: 'heart-outline' },
      { id: 'anniversary', label: 'Anniversary', icon: 'heart-outline' },
      { id: 'graduation', label: 'Graduation', icon: 'school-outline' },
      { id: 'baby-shower', label: 'Baby Shower', icon: 'happy-outline' },
      { id: 'funeral', label: 'Funeral/Memorial', icon: 'leaf-outline' },
      { id: 'health', label: 'Health Update', icon: 'medical-outline' },
      { id: 'moving', label: 'House Moving', icon: 'home-outline' },
      { id: 'other-personal', label: 'Other', icon: 'ellipsis-horizontal-outline' },
    ],
  },
  {
    id: 'social',
    label: 'Social / Community',
    description: 'Events affecting groups and communities',
    icon: 'people-outline',
    color: '#8B5CF6', // purple
    subTypes: [
      { id: 'festival', label: 'Festival/Celebration', icon: 'sparkles-outline' },
      { id: 'concert', label: 'Concert/Performance', icon: 'musical-notes-outline' },
      { id: 'sports', label: 'Sports Event', icon: 'football-outline' },
      { id: 'protest', label: 'Protest/March', icon: 'megaphone-outline' },
      { id: 'awareness', label: 'Awareness Campaign', icon: 'bulb-outline' },
      { id: 'community', label: 'Community Meetup', icon: 'people-circle-outline' },
      { id: 'religious', label: 'Religious Ceremony', icon: 'church-outline' },
      { id: 'other-social', label: 'Other', icon: 'ellipsis-horizontal-outline' },
    ],
  },
  {
    id: 'professional',
    label: 'Professional',
    description: 'Business, work, and system-level events',
    icon: 'briefcase-outline',
    color: '#3B82F6', // blue
    subTypes: [
      { id: 'meeting', label: 'Meeting/Conference', icon: 'people-outline' },
      { id: 'workshop', label: 'Workshop/Training', icon: 'hammer-outline' },
      { id: 'product-launch', label: 'Product Launch', icon: 'rocket-outline' },
      { id: 'networking', label: 'Networking Event', icon: 'link-outline' },
      { id: 'seminar', label: 'Seminar/Webinar', icon: 'school-outline' },
      { id: 'corporate', label: 'Corporate Party', icon: 'wine-outline' },
      { id: 'other-professional', label: 'Other', icon: 'ellipsis-horizontal-outline' },
    ],
  },
];

export default function CreateEvent() {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);
  const [selectedSubType, setSelectedSubType] = useState<string | null>(null);

  const currentCategory = EVENT_CATEGORIES.find((c) => c.id === selectedCategory);

  const handleCategorySelect = (categoryId: EventCategory) => {
    setSelectedCategory(categoryId);
    setSelectedSubType(null);
  };

  const handleSubTypeSelect = (subTypeId: string) => {
    setSelectedSubType(subTypeId);
    // Navigate to event form with selected category and type
    router.push({
      pathname: '/create-event-form',
      params: {
        category: selectedCategory,
        subType: subTypeId,
      },
    });
  };

  const handleBack = () => {
    if (selectedSubType) {
      setSelectedSubType(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    } else {
      router.back();
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-4 border-b border-gray-100 flex-row items-center">
        <TouchableOpacity onPress={handleBack} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">
          {selectedSubType
            ? 'Select Event Details'
            : selectedCategory
            ? currentCategory?.label
            : 'Create Event'}
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          {!selectedCategory ? (
            // Show 3 Main Categories
            <>
              <Text className="text-gray-500 text-sm mb-4">
                Choose a category to start creating your event
              </Text>
              {EVENT_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  className="bg-white rounded-xl p-4 mb-3 shadow-sm"
                  onPress={() => handleCategorySelect(category.id)}
                  activeOpacity={0.8}
                >
                  <View className="flex-row items-center">
                    <View
                      className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <Ionicons name={category.icon as any} size={28} color={category.color} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-900 font-semibold text-lg">
                        {category.label}
                      </Text>
                      <Text className="text-gray-500 text-sm">{category.description}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                  </View>
                </TouchableOpacity>
              ))}
            </>
          ) : !selectedSubType ? (
            // Show Sub-Options for Selected Category
            <>
              <View className="flex-row items-center mb-4">
                <TouchableOpacity
                  onPress={() => setSelectedCategory(null)}
                  className="flex-row items-center"
                >
                  <Ionicons name="arrow-back" size={16} color="#6B7280" />
                  <Text className="text-gray-500 text-sm ml-1">Back</Text>
                </TouchableOpacity>
              </View>
              <Text className="text-gray-500 text-sm mb-4">
                What type of {currentCategory?.label.toLowerCase()} event?
              </Text>
              <View className="flex-row flex-wrap">
                {currentCategory?.subTypes.map((subType) => (
                  <TouchableOpacity
                    key={subType.id}
                    className="w-[48%] bg-white rounded-xl p-4 mb-3 shadow-sm mr-3"
                    onPress={() => handleSubTypeSelect(subType.id)}
                    activeOpacity={0.8}
                    style={{ width: '48%' }}
                  >
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center mb-2"
                      style={{ backgroundColor: `${currentCategory.color}20` }}
                    >
                      <Ionicons name={subType.icon as any} size={20} color={currentCategory.color} />
                    </View>
                    <Text className="text-gray-900 font-medium">{subType.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}
