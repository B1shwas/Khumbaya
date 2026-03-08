import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import {
    SUB_EVENT_TEMPLATES,
    SubEventTemplate,
} from "@/src/constants/subeventTemplates";
import { SelectedActivity, SelectedSubEvent } from "@/src/types";

interface SubEventFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (subEvent: SelectedSubEvent) => void;
  parentEventId: number;
  initialData?: Partial<SelectedSubEvent>;
  title?: string;
}

export default function SubEventFormModal({
  visible,
  onClose,
  onSave,
  parentEventId,
  initialData,
  title = "Add Sub-Event",
}: SubEventFormModalProps) {
  // Selected template (like selecting property type in Airbnb)
  const [selectedTemplate, setSelectedTemplate] =
    useState<SubEventTemplate | null>(initialData?.template || null);

  // Form fields
  const [date, setDate] = useState(initialData?.date || "");
  const [theme, setTheme] = useState(initialData?.theme || "");
  const [budget, setBudget] = useState(initialData?.budget || "");

  // Activities with time and budget
  const [activities, setActivities] = useState<SelectedActivity[]>(
    initialData?.activities || []
  );

  const updateActivity = (
    activityId: string,
    field: "time" | "budget",
    value: string
  ) => {
    setActivities((prev) =>
      prev.map((act) =>
        act.activity.id === activityId ? { ...act, [field]: value } : act
      )
    );
  };

  const handleTemplateSelect = (template: SubEventTemplate) => {
    setSelectedTemplate(template);
    // Initialize activities from template
    const initialActivities: SelectedActivity[] = template.activities.map(
      (activity) => ({
        activity,
        time: "",
        budget: "",
      })
    );
    setActivities(initialActivities);
  };

  const handleSave = () => {
    if (!selectedTemplate) return;

    const subEvent: SelectedSubEvent = {
      template: selectedTemplate,
      date,
      theme,
      budget,
      activities,
    };

    onSave(subEvent);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl p-6 pb-8 max-h-[95%]">
          {/* Header */}
          <View className="w-16 h-1 rounded-full bg-gray-200 self-center mb-6" />
          <Text className="text-xl font-bold mb-1">{title}</Text>
          <Text className="text-sm text-gray-500 mb-4">
            Add a sub-event to your main event
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Step 1: Select Template (like selecting property type) */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-3">
                1. Choose Event Type
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {SUB_EVENT_TEMPLATES.map((template) => {
                  const isSelected = selectedTemplate?.id === template.id;
                  return (
                    <TouchableOpacity
                      key={template.id}
                      className={`flex-row items-center px-4 py-3 rounded-xl border ${
                        isSelected
                          ? "bg-pink-50 border-pink-600"
                          : "bg-white border-gray-200"
                      }`}
                      onPress={() => handleTemplateSelect(template)}
                    >
                      <View
                        className={`w-10 h-10 rounded-lg items-center justify-center mr-3 ${
                          isSelected ? "bg-pink-600" : "bg-gray-100"
                        }`}
                      >
                        <Ionicons
                          name={template.icon as any}
                          size={20}
                          color={isSelected ? "#fff" : "#6B7280"}
                        />
                      </View>
                      <View>
                        <Text
                          className={`font-medium ${
                            isSelected ? "text-pink-600" : "text-gray-900"
                          }`}
                        >
                          {template.name}
                        </Text>
                        <Text className="text-xs text-gray-500">
                          {template.activities.length} activities
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Step 2: Event Details */}
            {selectedTemplate && (
              <>
                <View className="mb-6">
                  <Text className="text-sm font-semibold text-gray-700 mb-3">
                    2. Event Details
                  </Text>

                  {/* Date */}
                  <View className="mb-4">
                    <Text className="text-xs text-gray-500 mb-1">Date</Text>
                    <TextInput
                      className="border border-gray-300 rounded-lg p-3"
                      placeholder="e.g., March 15, 2024"
                      value={date}
                      onChangeText={setDate}
                    />
                  </View>

                  {/* Theme */}
                  <View className="mb-4">
                    <Text className="text-xs text-gray-500 mb-1">
                      Theme (optional)
                    </Text>
                    <TextInput
                      className="border border-gray-300 rounded-lg p-3"
                      placeholder="e.g., Traditional, Modern, Royal"
                      value={theme}
                      onChangeText={setTheme}
                    />
                  </View>

                  {/* Budget */}
                  <View className="mb-4">
                    <Text className="text-xs text-gray-500 mb-1">Budget</Text>
                    <TextInput
                      className="border border-gray-300 rounded-lg p-3"
                      placeholder="e.g., $5,000"
                      value={budget}
                      onChangeText={setBudget}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                {/* Step 3: Activities (like amenities in Airbnb) */}
                <View className="mb-6">
                  <Text className="text-sm font-semibold text-gray-700 mb-3">
                    3. Schedule Activities
                  </Text>

                  {activities.map((selectedAct, index) => (
                    <View
                      key={selectedAct.activity.id}
                      className="bg-gray-50 rounded-xl p-4 mb-3"
                    >
                      <View className="flex-row items-center mb-3">
                        <View className="w-6 h-6 rounded-full bg-pink-100 items-center justify-center mr-2">
                          <Text className="text-xs font-bold text-pink-600">
                            {index + 1}
                          </Text>
                        </View>
                        <View className="flex-1">
                          <Text className="font-medium text-gray-900">
                            {selectedAct.activity.title}
                          </Text>
                          <Text className="text-xs text-gray-500">
                            {selectedAct.activity.description}
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row gap-3">
                        <View className="flex-1">
                          <Text className="text-xs text-gray-500 mb-1">
                            Time
                          </Text>
                          <TextInput
                            className="border border-gray-200 rounded-lg p-2 text-sm"
                            placeholder="e.g., 2:00 PM"
                            value={selectedAct.time}
                            onChangeText={(value) =>
                              updateActivity(
                                selectedAct.activity.id,
                                "time",
                                value
                              )
                            }
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="text-xs text-gray-500 mb-1">
                            Budget
                          </Text>
                          <TextInput
                            className="border border-gray-200 rounded-lg p-2 text-sm"
                            placeholder="e.g., $500"
                            value={selectedAct.budget}
                            onChangeText={(value) =>
                              updateActivity(
                                selectedAct.activity.id,
                                "budget",
                                value
                              )
                            }
                            keyboardType="numeric"
                          />
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* Action Buttons */}
            <View className="flex-row gap-3 pt-2">
              <TouchableOpacity
                className="flex-1 py-3 rounded-xl bg-gray-100 items-center"
                onPress={onClose}
              >
                <Text className="text-sm font-semibold text-gray-600">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-3 rounded-xl items-center ${
                  selectedTemplate ? "bg-pink-600" : "bg-gray-300"
                }`}
                onPress={handleSave}
                disabled={!selectedTemplate}
              >
                <Text
                  className={`text-sm font-semibold ${
                    selectedTemplate ? "text-white" : "text-gray-500"
                  }`}
                >
                  Add Sub-Event
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
