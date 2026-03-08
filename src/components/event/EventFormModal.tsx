import { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type EventType = "Wedding" | "Engagement" | "Reception" | "Nikkah" | "Other";

const EVENT_TYPES: EventType[] = [
  "Wedding",
  "Engagement",
  "Reception",
  "Nikkah",
  "Other",
];

// Full event form data
interface EventFormData {
  name: string;
  eventType: EventType;
  startDate: string;
  endDate: string;
  venue: string;
  description: string;
  contactNumber: string;
  contactEmail: string;
  budget: string;
  locationPreference: string;
  theme: string;
  hashtag: string;
}

// Timeline/Activity form data
interface TimelineFormData {
  title: string;
  time: string;
  duration: string;
  location: string;
  description: string;
  notes: string;
  category: string;
}

interface EventFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: EventFormData | TimelineFormData) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
  title?: string;
  mode?: "event" | "timeline";
}

export default function EventFormModal({
  visible,
  onClose,
  onSave,
  initialData,
  title = "Add Event",
  mode = "event",
}: EventFormModalProps) {
  const isTimeline = mode === "timeline";

  // Event form state
  const [eventData, setEventData] = useState<EventFormData>({
    name: initialData?.name || "",
    eventType: (initialData?.eventType as EventType) || "Wedding",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    venue: initialData?.venue || "",
    description: initialData?.description || "",
    contactNumber: initialData?.contactNumber || "",
    contactEmail: initialData?.contactEmail || "",
    budget: initialData?.budget || "",
    locationPreference: initialData?.locationPreference || "",
    theme: initialData?.theme || "",
    hashtag: initialData?.hashtag || "",
  });

  // Timeline form state
  const [timelineData, setTimelineData] = useState<TimelineFormData>({
    title: (initialData?.title as string) || "",
    time: (initialData?.time as string) || "",
    duration: (initialData?.duration as string) || "",
    location: (initialData?.location as string) || "",
    description: (initialData?.description as string) || "",
    notes: (initialData?.notes as string) || "",
    category: (initialData?.category as string) || "",
  });

  const updateEventField = (field: keyof EventFormData, value: string) => {
    setEventData((prev) => ({ ...prev, [field]: value }));
  };

  const updateTimelineField = (
    field: keyof TimelineFormData,
    value: string
  ) => {
    setTimelineData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (isTimeline) {
      onSave(timelineData);
    } else {
      onSave(eventData);
    }
    onClose();
  };

  // Timeline/Activity Form (minimal)
  if (isTimeline) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 pb-8 max-h-[90%]">
            {/* Header */}
            <View className="w-16 h-1 rounded-full bg-gray-200 self-center mb-6" />
            <Text className="text-xl font-bold mb-4">{title}</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Activity Title */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  Activity Name *
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3"
                  placeholder="e.g., Wedding Ceremony, Dinner, Photos"
                  value={timelineData.title}
                  onChangeText={(value) => updateTimelineField("title", value)}
                />
              </View>

              {/* Time & Duration */}
              <View className="flex-row gap-4 mb-4">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Time *
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3"
                    placeholder="e.g., 2:00 PM"
                    value={timelineData.time}
                    onChangeText={(value) => updateTimelineField("time", value)}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3"
                    placeholder="e.g., 1h, 2h 30m"
                    value={timelineData.duration}
                    onChangeText={(value) =>
                      updateTimelineField("duration", value)
                    }
                  />
                </View>
              </View>

              {/* Location */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  Location
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3"
                  placeholder="e.g., Grand Ballroom"
                  value={timelineData.location}
                  onChangeText={(value) =>
                    updateTimelineField("location", value)
                  }
                />
              </View>

              {/* Category */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  Category
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3"
                  placeholder="e.g., Ceremony, Setup, Entertainment"
                  value={timelineData.category}
                  onChangeText={(value) =>
                    updateTimelineField("category", value)
                  }
                />
              </View>

              {/* Description */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  Description
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 h-20"
                  placeholder="Brief description of the activity"
                  value={timelineData.description}
                  onChangeText={(value) =>
                    updateTimelineField("description", value)
                  }
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Notes */}
              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  Notes
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 h-16"
                  placeholder="Any special notes or instructions"
                  value={timelineData.notes}
                  onChangeText={(value) => updateTimelineField("notes", value)}
                  multiline
                  numberOfLines={2}
                />
              </View>

              {/* Action Buttons */}
              <View className="flex-row gap-3">
                <TouchableOpacity
                  className="flex-1 py-3 rounded-xl bg-gray-100 items-center"
                  onPress={onClose}
                >
                  <Text className="text-sm font-semibold text-gray-600">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 py-3 rounded-xl bg-pink-600 items-center"
                  onPress={handleSave}
                >
                  <Text className="text-sm font-semibold text-white">
                    Add to Timeline
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }

  // Full Event Form
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl p-6 pb-8 max-h-[90%]">
          {/* Header */}
          <View className="w-16 h-1 rounded-full bg-gray-200 self-center mb-6" />
          <Text className="text-xl font-bold mb-4">{title}</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Event Name */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Event Name *
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3"
                placeholder="Enter event name"
                value={eventData.name}
                onChangeText={(value) => updateEventField("name", value)}
              />
            </View>

            {/* Event Type */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Event Type
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {EVENT_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type}
                    className={`px-4 py-2 rounded-lg border ${
                      eventData.eventType === type
                        ? "bg-pink-600 border-pink-600"
                        : "border-gray-300"
                    }`}
                    onPress={() => updateEventField("eventType", type)}
                  >
                    <Text
                      className={`text-sm ${
                        eventData.eventType === type
                          ? "text-white"
                          : "text-gray-700"
                      }`}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Date - Start & End */}
            <View className="flex-row gap-4 mb-4">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3"
                  placeholder="Select start date"
                  value={eventData.startDate}
                  onChangeText={(value) => updateEventField("startDate", value)}
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  End Date
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3"
                  placeholder="Select end date"
                  value={eventData.endDate}
                  onChangeText={(value) => updateEventField("endDate", value)}
                />
              </View>
            </View>

            {/* Venue */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Venue
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3"
                placeholder="Enter venue name"
                value={eventData.venue}
                onChangeText={(value) => updateEventField("venue", value)}
              />
            </View>

            {/* Location Preference */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Location Preference
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3"
                placeholder="e.g., Indoor, Outdoor, Beach"
                value={eventData.locationPreference}
                onChangeText={(value) =>
                  updateEventField("locationPreference", value)
                }
              />
            </View>

            {/* Description */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Brief Description
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 h-24"
                placeholder="Describe your event"
                value={eventData.description}
                onChangeText={(value) => updateEventField("description", value)}
                multiline
                numberOfLines={4}
              />
            </View>

            {/* Point of Contact */}
            <View className="flex-row gap-4 mb-4">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3"
                  placeholder="Enter phone number"
                  value={eventData.contactNumber}
                  onChangeText={(value) =>
                    updateEventField("contactNumber", value)
                  }
                  keyboardType="phone-pad"
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  Email
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3"
                  placeholder="Enter email"
                  value={eventData.contactEmail}
                  onChangeText={(value) =>
                    updateEventField("contactEmail", value)
                  }
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Budget */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Budget
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3"
                placeholder="Enter budget amount"
                value={eventData.budget}
                onChangeText={(value) => updateEventField("budget", value)}
                keyboardType="numeric"
              />
            </View>

            {/* Theme */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Theme
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3"
                placeholder="e.g., Traditional, Modern, Royal"
                value={eventData.theme}
                onChangeText={(value) => updateEventField("theme", value)}
              />
            </View>

            {/* Event Hash Tag */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Event Hash Tag
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3"
                placeholder="e.g., #JohnAndJane2024"
                value={eventData.hashtag}
                onChangeText={(value) => updateEventField("hashtag", value)}
              />
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 py-3 rounded-xl bg-gray-100 items-center"
                onPress={onClose}
              >
                <Text className="text-sm font-semibold text-gray-600">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 py-3 rounded-xl bg-pink-600 items-center"
                onPress={handleSave}
              >
                <Text className="text-sm font-semibold text-white">
                  Create Event
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
