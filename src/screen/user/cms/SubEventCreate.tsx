import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Modal, FlatList, Image } from 'react-native';
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
//    - POST /api/subevents/{id}/tasks/{taskId}/vendors - Add vendor to task
//    - DELETE /api/subevents/{id}/tasks/{taskId}/vendors/{vendorId} - Remove vendor
//
// 2. State Management:
//    - Store sub-event data (name, type, date)
//    - Store tasks array with time and vendor info
//    - Store selected vendors for each task
//    - Persist data for each sub-event
// ============================================

interface Task {
  id: string;
  title: string;
  time: string;
  vendors: Vendor[];
  isCompleted: boolean;
}

interface Vendor {
  id: string;
  name: string;
  category: string;
  image: string;
  rating: number;
  price: string;
}

interface SubEventType {
  id: string;
  name: string;
  icon: 'musical-notes' | 'color-filter' | 'water' | 'restaurant' | 'car-sport' | 'restaurant';
}

// Mock sub-event types
const SUB_EVENT_TYPES: SubEventType[] = [
  { id: 'sangeet', name: 'Sangeet', icon: 'musical-notes' },
  { id: 'mehendi', name: 'Mehendi', icon: 'color-filter' },
  { id: 'haldi', name: 'Haldi', icon: 'water' },
  { id: 'reception', name: 'Reception', icon: 'restaurant' },
  { id: 'baraat', name: 'Baraat', icon: 'car-sport' },
  { id: 'other', name: 'Other', icon: 'restaurant' },
];

// Mock vendors for selection
const MOCK_VENDORS: Vendor[] = [
  {
    id: 'v1',
    name: 'DJ Beats Pro',
    category: 'Music',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDBTMpF5OGVFMpt0SFd1YYHvT0dbWhsJ1OiXWYAZtZHva3uRWvfDLTe0o9wji8CCfff_spyNbGa1EqMQAzU8TSgsZHHZyZczilaJjXsgkwdrHYtnhNzzELEAqjVUidiCPT2fu982NW88FUu6OLV-YHywILAwdx8LLdR69ManJPsqTJW1tjKuLVKnk4MgCSOSRbFhMOSEYIzSWmW-zWQIRd6Gn2odEDu-GJKhVcxGiy5nXwWuauIW5Hx3EfnwvPUTBI8LDijYJeRSk',
    rating: 4.8,
    price: '$$$',
  },
  {
    id: 'v2',
    name: 'Flower Decor Studio',
    category: 'Decoration',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDBTMpF5OGVFMpt0SFd1YYHvT0dbWhsJ1OiXWYAZtZHva3uRWvfDLTe0o9wji8CCfff_spyNbGa1EqMQAzU8TSgsZHHZyZczilaJjXsgkwdrHYtnhNzzELEAqjVUidiCPT2fu982NW88FUu6OLV-YHywILAwdx8LLdR69ManJPsqTJW1tjKuLVKnk4MgCSOSRbFhMOSEYIzSWmW-zWQIRd6Gn2odEDu-GJKhVcxGiy5nXwWuauIW5Hx3EfnwvPUTBI8LDijYJeRSk',
    rating: 4.9,
    price: '$$',
  },
  {
    id: 'v3',
    name: 'Catering Kings',
    category: 'Food',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDBTMpF5OGVFMpt0SFd1YYHvT0dbWhsJ1OiXWYAZtZHva3uRWvfDLTe0o9wji8CCfff_spyNbGa1EqMQAzU8TSgsZHHZyZczilaJjXsgkwdrHYtnhNzzELEAqjVUidiCPT2fu982NW88FUu6OLV-YHywILAwdx8LLdR69ManJPsqTJW1tjKuLVKnk4MgCSOSRbFhMOSEYIzSWmW-zWQIRd6Gn2odEDu-GJKhVcxGiy5nXwWuauIW5Hx3EfnwvPUTBI8LDijYJeRSk',
    rating: 4.7,
    price: '$$$',
  },
  {
    id: 'v4',
    name: 'Photo Moments',
    category: 'Photography',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDBTMpF5OGVFMpt0SFd1YYHvT0dbWhsJ1OiXWYAZtZHva3uRWvfDLTe0o9wji8CCfff_spyNbGa1EqMQAzU8TSgsZHHZyZczilaJjXsgkwdrHYtnhNzzELEAqjVUidiCPT2fu982NW88FUu6OLV-YHywILAwdx8LLdR69ManJPsqTJW1tjKuLVKnk4MgCSOSRbFhMOSEYIzSWmW-zWQIRd6Gn2odEDu-GJKhVcxGiy5nXwWuauIW5Hx3EfnwvPUTBI8LDijYJeRSk',
    rating: 4.9,
    price: '$$',
  },
  {
    id: 'v5',
    name: 'Lighting Masters',
    category: 'Lighting',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDBTMpF5OGVFMpt0SFd1YYHvT0dbWhsJ1OiXWYAZtZHva3uRWvfDLTe0o9wji8CCfff_spyNbGa1EqMQAzU8TSgsZHHZyZczilaJjXsgkwdrHYtnhNzzELEAqjVUidiCPT2fu982NW88FUu6OLV-YHywILAwdx8LLdR69ManJPsqTJW1tjKuLVKnk4MgCSOSRbFhMOSEYIzSWmW-zWQIRd6Gn2odEDu-GJKhVcxGiy5nXwWuauIW5Hx3EfnwvPUTBI8LDijYJeRSk',
    rating: 4.6,
    price: '$$$',
  },
];

export default function SubEventCreate() {
  const router = useRouter();
  
  const [subEventType, setSubEventType] = useState<SubEventType | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedVendors, setSelectedVendors] = useState<Vendor[]>([]);

  // TODO: Backend Integration - Save sub-event
  const handleSaveSubEvent = async () => {
    // TODO: Backend Integration
    // 1. Validate sub-event type and tasks
    // 2. Save sub-event: POST /api/events/{id}/subevents
    // 3. Save tasks: POST /api/subevents/{id}/tasks
    // 4. Save vendors: POST /api/subevents/{id}/tasks/{taskId}/vendors
    // 5. Navigate back on success
    
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
        vendors: [],
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

  const handleOpenVendorModal = (taskId: string) => {
    setSelectedTaskId(taskId);
    const task = tasks.find(t => t.id === taskId);
    setSelectedVendors(task?.vendors || []);
    setShowVendorModal(true);
  };

  const handleCloseVendorModal = () => {
    setShowVendorModal(false);
    setSelectedTaskId(null);
    setSelectedVendors([]);
  };

  const handleToggleVendor = (vendor: Vendor) => {
    setSelectedVendors(prev => {
      const isSelected = prev.some(v => v.id === vendor.id);
      if (isSelected) {
        return prev.filter(v => v.id !== vendor.id);
      } else {
        return [...prev, vendor];
      }
    });
  };

  const handleSaveVendors = () => {
    if (selectedTaskId) {
      setTasks(prev => 
        prev.map(task => 
          task.id === selectedTaskId ? { ...task, vendors: selectedVendors } : task
        )
      );
    }
    handleCloseVendorModal();
  };

  const handleRemoveVendor = (taskId: string, vendorId: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, vendors: task.vendors.filter(v => v.id !== vendorId) } 
          : task
      )
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#181114" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Sub Event</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Sub Event Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Sub Event Type</Text>
          <View style={styles.typeGrid}>
            {SUB_EVENT_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                onPress={() => setSubEventType(type)}
                style={[
                  styles.typeCard,
                  subEventType?.id === type.id && styles.typeCardSelected
                ]}
              >
                <View style={[
                  styles.typeIcon,
                  subEventType?.id === type.id && styles.typeIconSelected
                ]}>
                  <Ionicons 
                    name={type.icon} 
                    size={24} 
                    color={subEventType?.id === type.id ? 'white' : '#6B7280'} 
                  />
                </View>
                <Text style={[
                  styles.typeName,
                  subEventType?.id === type.id && styles.typeNameSelected
                ]}>
                  {type.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tasks Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Timeline Tasks</Text>
            <Text style={styles.taskCount}>{tasks.length} tasks</Text>
          </View>

          {/* Add Task Button */}
          {!showAddTask ? (
            <TouchableOpacity
              style={styles.addTaskButton}
              onPress={() => setShowAddTask(true)}
            >
              <Ionicons name="add" size={24} color="#ee2b8c" />
              <Text style={styles.addTaskText}>Add Task</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.addTaskForm}>
              <TextInput
                style={styles.input}
                placeholder="What needs to be done?"
                placeholderTextColor="#9CA3AF"
                value={newTaskTitle}
                onChangeText={setNewTaskTitle}
              />
              <TextInput
                style={styles.input}
                placeholder="Time (e.g., 2:00 PM)"
                placeholderTextColor="#9CA3AF"
                value={newTaskTime}
                onChangeText={setNewTaskTime}
              />
              <View style={styles.formButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowAddTask(false);
                    setNewTaskTitle('');
                    setNewTaskTime('');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddTask}
                >
                  <Text style={styles.addButtonText}>Add Task</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Task List */}
          {tasks.map((task) => (
            <View key={task.id} style={styles.taskCard}>
              <TouchableOpacity onPress={() => handleToggleComplete(task.id)}>
                <View style={[
                  styles.checkbox,
                  task.isCompleted && styles.checkboxSelected
                ]}>
                  {task.isCompleted && (
                    <Ionicons name="checkmark" size={14} color="white" />
                  )}
                </View>
              </TouchableOpacity>
              
              <View style={styles.taskInfo}>
                <Text style={[
                  styles.taskTitle,
                  task.isCompleted && styles.taskTitleCompleted
                ]}>
                  {task.title}
                </Text>
                {task.time ? (
                  <View style={styles.taskTime}>
                    <Ionicons name="time" size={12} color="#6B7280" />
                    <Text style={styles.taskTimeText}>{task.time}</Text>
                  </View>
                ) : null}
                
                {/* Vendors */}
                {task.vendors.length > 0 && (
                  <View style={styles.taskVendors}>
                    {task.vendors.map(vendor => (
                      <View key={vendor.id} style={styles.vendorChip}>
                        <Text style={styles.vendorChipText}>{vendor.name}</Text>
                        <TouchableOpacity
                          onPress={() => handleRemoveVendor(task.id, vendor.id)}
                        >
                          <Ionicons name="close-circle" size={14} color="#9CA3AF" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={styles.vendorButton}
                onPress={() => handleOpenVendorModal(task.id)}
              >
                <Ionicons 
                  name={task.vendors.length > 0 ? "storefront" : "storefront-outline"} 
                  size={20} 
                  color={task.vendors.length > 0 ? "#ee2b8c" : "#6B7280"} 
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteTask(task.id)}
              >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}

          {tasks.length === 0 && !showAddTask && (
            <View style={styles.emptyTasks}>
              <Ionicons name="list-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyTasksTitle}>No tasks yet</Text>
              <Text style={styles.emptyTasksSubtitle}>Add tasks to build your timeline</Text>
            </View>
          )}
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Sticky Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveSubEvent}
        >
          <Text style={styles.saveButtonText}>Save Sub Event</Text>
          <Ionicons name="checkmark" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Vendor Selection Modal */}
      <Modal
        visible={showVendorModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseVendorModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Vendors</Text>
              <TouchableOpacity onPress={handleCloseVendorModal}>
                <Ionicons name="close" size={24} color="#181114" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              {selectedVendors.length > 0 
                ? `${selectedVendors.length} vendor${selectedVendors.length !== 1 ? 's' : ''} selected`
                : 'Select vendors for this task'}
            </Text>

            <FlatList
              data={MOCK_VENDORS}
              keyExtractor={item => item.id}
              renderItem={({ item }) => {
                const isSelected = selectedVendors.some(v => v.id === item.id);
                return (
                  <TouchableOpacity
                    style={styles.vendorCard}
                    onPress={() => handleToggleVendor(item)}
                  >
                    <Image source={{ uri: item.image }} style={styles.vendorImage} />
                    <View style={styles.vendorInfo}>
                      <Text style={styles.vendorName}>{item.name}</Text>
                      <Text style={styles.vendorCategory}>{item.category}</Text>
                      <View style={styles.vendorRating}>
                        <Ionicons name="star" size={12} color="#F59E0B" fill="#F59E0B" />
                        <Text style={styles.vendorRatingText}>{item.rating}</Text>
                        <Text style={styles.vendorPrice}>{item.price}</Text>
                      </View>
                    </View>
                    <View style={[
                      styles.vendorCheckbox,
                      isSelected && styles.vendorCheckboxSelected
                    ]}>
                      {isSelected && <Ionicons name="checkmark" size={16} color="white" />}
                    </View>
                  </TouchableOpacity>
                );
              }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.vendorList}
            />

            <TouchableOpacity
              style={styles.modalSaveButton}
              onPress={handleSaveVendors}
            >
              <Text style={styles.modalSaveButtonText}>
                Add {selectedVendors.length} Vendor{selectedVendors.length !== 1 ? 's' : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f6f7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 8,
    backgroundColor: 'white',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 18,
    color: '#181114',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: '#181114',
  },
  taskCount: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeCard: {
    width: '31%',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
    alignItems: 'center',
    gap: 8,
  },
  typeCardSelected: {
    backgroundColor: '#ee2b8c',
    borderColor: '#ee2b8c',
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeIconSelected: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  typeName: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  typeNameSelected: {
    color: 'white',
  },
  addTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: 'rgba(238,43,140,0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(238,43,140,0.2)',
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  addTaskText: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 16,
    color: '#ee2b8c',
  },
  addTaskForm: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#181114',
    marginBottom: 12,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 14,
    color: '#6B7280',
  },
  addButton: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#ee2b8c',
    alignItems: 'center',
  },
  addButtonText: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 14,
    color: 'white',
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#ee2b8c',
    borderColor: '#ee2b8c',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 16,
    color: '#181114',
  },
  taskTitleCompleted: {
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  taskTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  taskTimeText: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  taskVendors: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  vendorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  vendorChipText: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 12,
    color: '#6B7280',
  },
  vendorButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  emptyTasks: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTasksTitle: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
  },
  emptyTasksSubtitle: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  bottomSpacing: {
    height: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#f8f6f7',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    backgroundColor: '#ee2b8c',
    borderRadius: 12,
    shadowColor: '#ee2b8c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 20,
    color: '#181114',
  },
  modalSubtitle: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 14,
    color: '#6B7280',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  vendorList: {
    padding: 16,
  },
  vendorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 8,
  },
  vendorImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  vendorInfo: {
    flex: 1,
  },
  vendorName: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 16,
    color: '#181114',
  },
  vendorCategory: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  vendorRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  vendorRatingText: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 12,
    color: '#F59E0B',
  },
  vendorPrice: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  vendorCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vendorCheckboxSelected: {
    backgroundColor: '#ee2b8c',
    borderColor: '#ee2b8c',
  },
  modalSaveButton: {
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 16,
    backgroundColor: '#ee2b8c',
    borderRadius: 12,
    alignItems: 'center',
  },
  modalSaveButtonText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: 'white',
  },
});
