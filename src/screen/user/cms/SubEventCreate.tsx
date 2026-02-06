import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// ============================================
// BACKEND INTEGRATION NOTES:
// ============================================
// 1. API Endpoints:
//    - GET /api/subevent-types - Get sub-event types
//    - POST /api/events/{id}/subevents - Create sub-event
//    - GET /api/vendors - Get vendors for selection
//    - POST /api/subevents/{id}/tasks - Add task
//    - PUT /api/subevents/{id}/tasks/{taskId} - Update task
//    - DELETE /api/subevents/{id}/tasks/{taskId} - Delete task
//
// 2. State Management:
//    - Store sub-event data (name, type, date)
//    - Store tasks array with time and vendor info
//    - Persist data for each sub-event
// ============================================

interface Task {
  id: string;
  title: string;
  time: string;
  vendor: string | null;
  isCompleted: boolean;
}

interface SubEventType {
  id: string;
  name: string;
  icon: 'musical-notes' | 'color-filter' | 'water' | 'restaurant' | 'car-sport' | 'restaurant';
}

const SUB_EVENT_TYPES: SubEventType[] = [
  { id: 'sangeet', name: 'Sangeet', icon: 'musical-notes' },
  { id: 'mehendi', name: 'Mehendi', icon: 'color-filter' },
  { id: 'haldi', name: 'Haldi', icon: 'water' },
  { id: 'reception', name: 'Reception', icon: 'restaurant' },
  { id: 'baraat', name: 'Baraat', icon: 'car-sport' },
  { id: 'other', name: 'Other', icon: 'restaurant' },
];

export default function SubEventCreate() {
  const router = useRouter();
  
  const [subEventType, setSubEventType] = useState<SubEventType | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);

  // TODO: Backend Integration - Save sub-event
  const handleSaveSubEvent = async () => {
    // TODO: Backend Integration
    // 1. Validate sub-event type and tasks
    // 2. Save sub-event: POST /api/events/{id}/subevents
    // 3. Save tasks: POST /api/subevents/{id}/tasks
    // 4. Navigate back on success
    
    console.log('Sub-event data:', { subEventType, tasks });
    router.back();
  };

  const handleBack = () => {
    router.back();
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle.trim(),
        time: newTaskTime.trim(),
        vendor: null,
        isCompleted: false,
      };
      setTasks(prev => [...prev, newTask]);
      setNewTaskTitle('');
      setNewTaskTime('');
      setShowAddTask(false);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  const handleSelectVendor = (taskId: string) => {
    // TODO: Backend Integration - Open vendor selection modal
    console.log('Select vendor for task:', taskId);
  };

  return (
    <View className="flex-1 bg-[#f8f6f7]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-12 pb-2 bg-[#f8f6f7]">
        <TouchableOpacity onPress={handleBack} className="w-10 h-10 rounded-full bg-white items-center justify-center">
          <Ionicons name="arrow-back" size={20} color="#181114" />
        </TouchableOpacity>
        <Text className="flex-1 text-center font-bold text-lg text-[#181114]">Create Sub Event</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Sub Event Type Selection */}
        <View className="pt-4">
          <Text className="font-bold text-base text-[#181114] mb-3">Select Sub Event Type</Text>
          <View className="flex-row flex-wrap gap-3">
            {SUB_EVENT_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                onPress={() => setSubEventType(type)}
                className={`w-[31%] p-3 rounded-xl border items-center gap-2 ${
                  subEventType?.id === type.id 
                    ? 'bg-[#ee2b8c] border-[#ee2b8c]' 
                    : 'bg-white border-[#E5E7EB]'
                }`}
              >
                <View className={`w-12 h-12 rounded-full items-center justify-center ${
                  subEventType?.id === type.id ? 'bg-white/20' : 'bg-[#F3F4F6]'
                }`}>
                  <Ionicons 
                    name={type.icon} 
                    size={24} 
                    color={subEventType?.id === type.id ? 'white' : '#6B7280'} 
                  />
                </View>
                <Text className={`text-sm font-semibold ${
                  subEventType?.id === type.id ? 'text-white' : 'text-[#6B7280]'
                }`}>
                  {type.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tasks Section */}
        <View className="pt-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="font-bold text-base text-[#181114]">Timeline Tasks</Text>
            <Text className="text-sm text-[#6B7280]">{tasks.length} tasks</Text>
          </View>

          {/* Add Task Button */}
          {!showAddTask ? (
            <TouchableOpacity
              className="flex-row items-center justify-center gap-2 p-4 bg-[rgba(238,43,140,0.1)] rounded-xl border border-[rgba(238,43,140,0.2)] border-dashed mb-4"
              onPress={() => setShowAddTask(true)}
            >
              <Ionicons name="add" size={24} color="#ee2b8c" />
              <Text className="text-[#ee2b8c] font-semibold text-base">Add Task</Text>
            </TouchableOpacity>
          ) : (
            <View className="bg-white rounded-xl p-4 border border-[#E5E7EB] mb-4">
              <TextInput
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-base text-[#181114] mb-3"
                placeholder="What needs to be done?"
                placeholderTextColor="#9CA3AF"
                value={newTaskTitle}
                onChangeText={setNewTaskTitle}
              />
              <TextInput
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-base text-[#181114] mb-3"
                placeholder="Time (e.g., 2:00 PM)"
                placeholderTextColor="#9CA3AF"
                value={newTaskTime}
                onChangeText={setNewTaskTime}
              />
              <View className="flex-row gap-3">
                <TouchableOpacity
                  className="flex-1 p-3 rounded-xl bg-[#F3F4F6] items-center"
                  onPress={() => {
                    setShowAddTask(false);
                    setNewTaskTitle('');
                    setNewTaskTime('');
                  }}
                >
                  <Text className="text-[#6B7280] font-semibold text-sm">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-[2] p-3 rounded-xl bg-[#ee2b8c] items-center"
                  onPress={handleAddTask}
                >
                  <Text className="text-white font-semibold text-sm">Add Task</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Task List */}
          {tasks.map((task) => (
            <View key={task.id} className="flex-row items-center gap-3 p-4 bg-white rounded-xl border border-[#E5E7EB] mb-2">
              <TouchableOpacity onPress={() => handleToggleComplete(task.id)}>
                <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                  task.isCompleted ? 'bg-[#ee2b8c] border-[#ee2b8c]' : 'border-[#E5E7EB]'
                }`}>
                  {task.isCompleted && (
                    <Ionicons name="checkmark" size={14} color="white" />
                  )}
                </View>
              </TouchableOpacity>
              
              <View className="flex-1">
                <Text className={`font-semibold text-base ${
                  task.isCompleted ? 'text-[#9CA3AF] line-through' : 'text-[#181114]'
                }`}>
                  {task.title}
                </Text>
                {task.time ? (
                  <View className="flex-row items-center gap-1 mt-1">
                    <Ionicons name="time" size={12} color="#6B7280" />
                    <Text className="text-xs text-[#6B7280]">{task.time}</Text>
                  </View>
                ) : null}
              </View>

              <TouchableOpacity
                className="p-2"
                onPress={() => handleSelectVendor(task.id)}
              >
                <Ionicons name="storefront" size={20} color="#6B7280" />
              </TouchableOpacity>

              <TouchableOpacity
                className="p-2"
                onPress={() => handleDeleteTask(task.id)}
              >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}

          {tasks.length === 0 && !showAddTask && (
            <View className="items-center py-8">
              <Ionicons name="list-outline" size={48} color="#D1D5DB" />
              <Text className="text-[#6B7280] font-semibold text-base mt-3">No tasks yet</Text>
              <Text className="text-[#9CA3AF] text-sm mt-1">Add tasks to build your timeline</Text>
            </View>
          )}
        </View>

        {/* Bottom spacing */}
        <View className="h-24" />
      </ScrollView>

      {/* Sticky Footer */}
      <View className="absolute bottom-0 left-0 right-0 p-4 pb-8 bg-[#f8f6f7]">
        <TouchableOpacity
          className="w-full bg-[#ee2b8c] flex-row items-center justify-center gap-2 py-4 rounded-xl shadow-lg shadow-[#ee2b8c]/25"
          onPress={handleSaveSubEvent}
        >
          <Text className="text-white font-bold text-base">Save Sub Event</Text>
          <Ionicons name="checkmark" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
