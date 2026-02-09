import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  FlatList,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SUB_EVENT_TEMPLATES, SubEventTemplate, TemplateActivity } from '@/src/data/subeventTemplates';
import SubEventTemplateCard from '@/src/components/event/SubEventTemplateCard';

// ============================================
// Types
// ============================================

interface Guest {
  id: string;
  name: string;
  initials: string;
  avatar?: string;
  relation?: string;
  phone?: string;
  status: 'Going' | 'Pending' | 'Not Going';
  category?: string;
}

interface SelectedActivity {
  activity: TemplateActivity;
  time: string;
}

interface SelectedSubEvent {
  template: SubEventTemplate;
  date: string;
  theme: string;
  budget: string;
  activities: SelectedActivity[];
  invitedGuests: Guest[];
}

interface Vendor {
  id: string;
  name: string;
  category: string;
  image: string;
  rating: number;
  price: string;
}

// Mock vendors
const MOCK_VENDORS: Vendor[] = [
  { id: 'v1', name: 'DJ Beats Pro', category: 'Music', image: '', rating: 4.8, price: '$$$' },
  { id: 'v2', name: 'Flower Decor Studio', category: 'Decoration', image: '', rating: 4.9, price: '$$' },
  { id: 'v3', name: 'Catering Kings', category: 'Food', image: '', rating: 4.7, price: '$$$' },
  { id: 'v4', name: 'Photo Moments', category: 'Photography', image: '', rating: 4.9, price: '$$' },
  { id: 'v5', name: 'Lighting Masters', category: 'Lighting', image: '', rating: 4.6, price: '$$$' },
];

// Mock guests data
const MOCK_GUESTS: Guest[] = [
  { id: '1', name: 'Priya Sharma', initials: 'PS', relation: 'Friend', phone: '+91 98765 43210', status: 'Going', category: 'Bride\'s Friend' },
  { id: '2', name: 'Rahul Kapoor', initials: 'RK', relation: 'Family', phone: '+91 98765 43211', status: 'Going', category: 'Groom\'s Family' },
  { id: '3', name: 'Sarah Jenkins', initials: 'SJ', relation: 'Friend', phone: '+1 555-123-4567', status: 'Pending', category: 'Groom\'s Friend' },
  { id: '4', name: 'Mike Ross', initials: 'MR', relation: 'Colleague', phone: '+1 555-234-5678', status: 'Pending', category: 'Bride\'s Colleague' },
  { id: '5', name: 'Amara Singh', initials: 'AS', relation: 'Family', phone: '+91 98765 43212', status: 'Going', category: 'Bride\'s Family' },
  { id: '6', name: 'John Doe', initials: 'JD', relation: 'Colleague', phone: '+1 555-345-6789', status: 'Going', category: 'Bride\'s Colleague' },
  { id: '7', name: 'Emily Chen', initials: 'EC', relation: 'Friend', phone: '+1 555-456-7890', status: 'Not Going', category: 'Groom\'s Friend' },
  { id: '8', name: 'David Kumar', initials: 'DK', relation: 'Family', phone: '+91 98765 43213', status: 'Going', category: 'Groom\'s Family' },
];

export default function SubEventCreate() {
  const router = useRouter();
  
  // Selected sub-events state
  const [selectedSubEvents, setSelectedSubEvents] = useState<SelectedSubEvent[]>([]);
  
  // Current template being edited
  const [editingTemplate, setEditingTemplate] = useState<SubEventTemplate | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editTheme, setEditTheme] = useState('');
  const [editBudget, setEditBudget] = useState('');
  const [editActivities, setEditActivities] = useState<SelectedActivity[]>([]);
  const [editInvitedGuests, setEditInvitedGuests] = useState<Guest[]>([]);
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [selectedSubEventId, setSelectedSubEventId] = useState<string | null>(null);
  const [selectedVendors, setSelectedVendors] = useState<Vendor[]>([]);

  // ============================================
  // Template Selection Handlers
  // ============================================

  const handleTemplateSelect = (template: SubEventTemplate) => {
    const existingIndex = selectedSubEvents.findIndex(s => s.template.id === template.id);
    
    if (existingIndex >= 0) {
      const existing = selectedSubEvents[existingIndex];
      setEditDate(existing.date);
      setEditTheme(existing.theme);
      setEditBudget(existing.budget);
      setEditActivities(existing.activities);
      setEditInvitedGuests(existing.invitedGuests);
      setEditingTemplate(template);
      setShowEditModal(true);
    } else {
      const newSubEvent: SelectedSubEvent = {
        template,
        date: '',
        theme: '',
        budget: '',
        activities: [],
        invitedGuests: [],
      };
      setSelectedSubEvents(prev => [...prev, newSubEvent]);
    }
  };

  const handleRemoveSubEvent = (templateId: string) => {
    setSelectedSubEvents(prev => prev.filter(s => s.template.id !== templateId));
  };

  // ============================================
  // Activity Selection Handlers
  // ============================================

  const handleActivityToggle = (activity: TemplateActivity) => {
    const existingIndex = editActivities.findIndex(a => a.activity.id === activity.id);
    
    if (existingIndex >= 0) {
      setEditActivities(prev => prev.filter(a => a.activity.id !== activity.id));
    } else {
      setEditActivities(prev => [...prev, { activity, time: '' }]);
    }
  };

  const handleActivityTimeChange = (activityId: string, time: string) => {
    setEditActivities(prev =>
      prev.map(a =>
        a.activity.id === activityId ? { ...a, time } : a
      )
    );
  };

  const isActivitySelected = (activityId: string): boolean => {
    return editActivities.some(a => a.activity.id === activityId);
  };

  const getSelectedActivity = (activityId: string): SelectedActivity | undefined => {
    return editActivities.find(a => a.activity.id === activityId);
  };

  // ============================================
  // Guest Selection Handlers
  // ============================================

  const handleToggleGuest = (guest: Guest) => {
    const existingIndex = editInvitedGuests.findIndex(g => g.id === guest.id);
    
    if (existingIndex >= 0) {
      setEditInvitedGuests(prev => prev.filter(g => g.id !== guest.id));
    } else {
      setEditInvitedGuests(prev => [...prev, guest]);
    }
  };

  const isGuestInvited = (guestId: string): boolean => {
    return editInvitedGuests.some(g => g.id === guestId);
  };

  // ============================================
  // Edit Modal Handlers
  // ============================================

  const handleSaveEdit = () => {
    if (editingTemplate) {
      setSelectedSubEvents(prev =>
        prev.map(s =>
          s.template.id === editingTemplate.id
            ? {
                ...s,
                date: editDate,
                theme: editTheme,
                budget: editBudget,
                activities: editActivities,
                invitedGuests: editInvitedGuests,
              }
            : s
        )
      );
      setShowEditModal(false);
      setEditingTemplate(null);
    }
  };

  const handleOpenEditModal = (subEvent: SelectedSubEvent) => {
    setEditDate(subEvent.date);
    setEditTheme(subEvent.theme);
    setEditBudget(subEvent.budget);
    setEditActivities(subEvent.activities);
    setEditInvitedGuests(subEvent.invitedGuests);
    setEditingTemplate(subEvent.template);
    setShowEditModal(true);
  };

  const handleOpenGuestModal = () => {
    setShowEditModal(false);
    setShowGuestModal(true);
  };

  // ============================================
  // Vendor Modal Handlers
  // ============================================

  const handleOpenVendorModal = (subEventId: string) => {
    setSelectedSubEventId(subEventId);
    setSelectedVendors([]);
    setShowVendorModal(true);
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
    setShowVendorModal(false);
  };

  // ============================================
  // Navigation Handlers
  // ============================================

  const handleNavigateToCardMaking = () => {
    router.push('/events/card-making' as any);
  };

  const handleSaveAll = () => {
    console.log('Saving sub-events:', selectedSubEvents);
    router.back();
  };

  const handleBack = () => {
    router.back();
  };

  const isTemplateSelected = (templateId: string): boolean => {
    return selectedSubEvents.some(s => s.template.id === templateId);
  };

  // ============================================
  // Render
  // ============================================

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#181114" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Sub Event</Text>
        <TouchableOpacity onPress={handleSaveAll} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Template Selection Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Sub Events</Text>
          <Text style={styles.sectionSubtitle}>
            Tap to select sub-events for your wedding
          </Text>
          
          {SUB_EVENT_TEMPLATES.map((template) => (
            <SubEventTemplateCard
              key={template.id}
              template={template}
              isSelected={isTemplateSelected(template.id)}
              onSelect={handleTemplateSelect}
            />
          ))}
        </View>

        {/* Card Making Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.cardMakingButton}
            onPress={handleNavigateToCardMaking}
          >
            <View style={styles.cardMakingIcon}>
              <Ionicons name="card-outline" size={28} color="#ee2b8c" />
            </View>
            <View style={styles.cardMakingInfo}>
              <Text style={styles.cardMakingTitle}>Cards & Invitations</Text>
              <Text style={styles.cardMakingSubtitle}>
                Create wedding invitations, thank you cards, and bridal books
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Selected Sub-Events List */}
        {selectedSubEvents.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selected Sub Events</Text>
            
            {selectedSubEvents.map((subEvent) => (
              <View key={subEvent.template.id} style={styles.selectedCard}>
                <View style={styles.selectedCardHeader}>
                  <View style={styles.selectedCardIcon}>
                    <Ionicons name={subEvent.template.icon as any} size={24} color="#ee2b8c" />
                  </View>
                  <View style={styles.selectedCardInfo}>
                    <Text style={styles.selectedCardTitle}>{subEvent.template.name}</Text>
                    <Text style={styles.selectedCardSubtitle}>
                      {subEvent.date || 'No date set'}
                    </Text>
                  </View>
                  <View style={styles.selectedCardActions}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => handleOpenEditModal(subEvent)}
                    >
                      <Ionicons name="create-outline" size={18} color="#3B82F6" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleRemoveSubEvent(subEvent.template.id)}
                    >
                      <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Quick Info */}
                <View style={styles.selectedCardDetails}>
                  {subEvent.theme && (
                    <View style={styles.detailItem}>
                      <Ionicons name="color-palette-outline" size={14} color="#6B7280" />
                      <Text style={styles.detailText}>{subEvent.theme}</Text>
                    </View>
                  )}
                  {subEvent.budget && (
                    <View style={styles.detailItem}>
                      <Ionicons name="wallet-outline" size={14} color="#6B7280" />
                      <Text style={styles.detailText}>{subEvent.budget}</Text>
                    </View>
                  )}
                  <View style={styles.detailItem}>
                    <Ionicons name="checkmark-circle-outline" size={14} color="#6B7280" />
                    <Text style={styles.detailText}>{subEvent.activities.length} activities</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="people-outline" size={14} color="#6B7280" />
                    <Text style={styles.detailText}>{subEvent.invitedGuests.length} guests</Text>
                  </View>
                </View>

                {/* Activities Preview */}
                <View style={styles.activitiesPreview}>
                  <TouchableOpacity
                    style={styles.viewActivitiesButton}
                    onPress={() => handleOpenEditModal(subEvent)}
                  >
                    <Text style={styles.viewActivitiesText}>View & Customize</Text>
                    <Ionicons name="arrow-forward" size={14} color="#ee2b8c" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingTemplate?.name || 'Edit Sub Event'}
              </Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={24} color="#181114" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {/* Date Input */}
              <Text style={styles.inputLabel}>Date</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                <TextInput
                  style={styles.textInput}
                  placeholder="Select date"
                  placeholderTextColor="#9CA3AF"
                  value={editDate}
                  onChangeText={setEditDate}
                />
              </View>

              {/* Theme Input */}
              <Text style={styles.inputLabel}>Theme</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="color-palette-outline" size={20} color="#6B7280" />
                <TextInput
                  style={styles.textInput}
                  placeholder="Theme (e.g., Royal, Traditional)"
                  placeholderTextColor="#9CA3AF"
                  value={editTheme}
                  onChangeText={setEditTheme}
                />
              </View>

              {/* Budget Input */}
              <Text style={styles.inputLabel}>Budget</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="wallet-outline" size={20} color="#6B7280" />
                <TextInput
                  style={styles.textInput}
                  placeholder="Budget (e.g., $5000)"
                  placeholderTextColor="#9CA3AF"
                  value={editBudget}
                  onChangeText={setEditBudget}
                  keyboardType="numeric"
                />
              </View>

              {/* Activities Section */}
              <Text style={styles.inputLabel}>
                Activities ({editActivities.length} selected)
              </Text>
              <Text style={styles.inputSubtitle}>
                Select activities and set time for each
              </Text>
              
              <View style={styles.activitiesList}>
                {editingTemplate?.activities.map((activity, index) => {
                  const selected = isActivitySelected(activity.id);
                  const selectedData = getSelectedActivity(activity.id);
                  
                  return (
                    <TouchableOpacity
                      key={activity.id}
                      style={[styles.activityItem, selected && styles.activityItemSelected]}
                      onPress={() => handleActivityToggle(activity)}
                    >
                      <View style={styles.activityHeader}>
                        <View style={[styles.activityCheckbox, selected && styles.activityCheckboxSelected]}>
                          {selected && (
                            <Ionicons name="checkmark" size={14} color="white" />
                          )}
                        </View>
                        <View style={styles.activityInfo}>
                          <Text style={[styles.activityTitle, selected && styles.activityTitleSelected]}>
                            {index + 1}. {activity.title}
                          </Text>
                          <Text style={styles.activityDescription}>{activity.description}</Text>
                        </View>
                      </View>
                      
                      {selected && (
                        <View style={styles.activityTimeInput}>
                          <Ionicons name="time-outline" size={16} color="#6B7280" />
                          <TextInput
                            style={styles.activityTimeInputField}
                            placeholder="Add time (e.g., 2:00 PM)"
                            placeholderTextColor="#9CA3AF"
                            value={selectedData?.time || ''}
                            onChangeText={(text) => handleActivityTimeChange(activity.id, text)}
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Guest List Button */}
              <TouchableOpacity style={styles.guestListButton} onPress={handleOpenGuestModal}>
                <Ionicons name="people-outline" size={20} color="#ee2b8c" />
                <Text style={styles.guestListButtonText}>Manage Guest List</Text>
                <View style={styles.guestCountBadge}>
                  <Text style={styles.guestCountText}>{editInvitedGuests.length}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
              </TouchableOpacity>

            </ScrollView>

            <TouchableOpacity style={styles.modalSaveButton} onPress={handleSaveEdit}>
              <Text style={styles.modalSaveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Guest Selection Modal */}
      <Modal
        visible={showGuestModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowGuestModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Guests</Text>
              <TouchableOpacity onPress={() => setShowGuestModal(false)}>
                <Ionicons name="close" size={24} color="#181114" />
              </TouchableOpacity>
            </View>

            <View style={styles.guestSummary}>
              <Text style={styles.guestSummaryText}>
                {editInvitedGuests.length} guests selected
              </Text>
            </View>

            <FlatList
              data={MOCK_GUESTS}
              keyExtractor={item => item.id}
              renderItem={({ item }) => {
                const isSelected = isGuestInvited(item.id);
                return (
                  <TouchableOpacity
                    style={[styles.guestItem, isSelected && styles.guestItemSelected]}
                    onPress={() => handleToggleGuest(item)}
                  >
                    <View style={styles.guestAvatar}>
                      {item.avatar ? (
                        <Image source={{ uri: item.avatar }} style={styles.guestAvatarImage} />
                      ) : (
                        <Text style={styles.guestAvatarText}>{item.initials}</Text>
                      )}
                    </View>
                    <View style={styles.guestInfo}>
                      <Text style={styles.guestName}>{item.name}</Text>
                      <Text style={styles.guestRelation}>{item.relation} • {item.category}</Text>
                    </View>
                    <View style={[styles.guestCheckbox, isSelected && styles.guestCheckboxSelected]}>
                      {isSelected && <Ionicons name="checkmark" size={14} color="white" />}
                    </View>
                  </TouchableOpacity>
                );
              }}
              contentContainerStyle={styles.guestList}
            />

            <TouchableOpacity
              style={styles.modalSaveButton}
              onPress={() => setShowGuestModal(false)}
            >
              <Text style={styles.modalSaveButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Vendor Modal */}
      <Modal
        visible={showVendorModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowVendorModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Vendors</Text>
              <TouchableOpacity onPress={() => setShowVendorModal(false)}>
                <Ionicons name="close" size={24} color="#181114" />
              </TouchableOpacity>
            </View>

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
                    <View style={styles.vendorAvatar}>
                      <Text style={styles.vendorAvatarText}>{item.name.charAt(0)}</Text>
                    </View>
                    <View style={styles.vendorInfo}>
                      <Text style={styles.vendorName}>{item.name}</Text>
                      <Text style={styles.vendorCategory}>{item.category}</Text>
                    </View>
                    <View style={[styles.vendorCheckbox, isSelected && styles.vendorCheckboxSelected]}>
                      {isSelected && <Ionicons name="checkmark" size={16} color="white" />}
                    </View>
                  </TouchableOpacity>
                );
              }}
              contentContainerStyle={styles.vendorList}
            />

            <TouchableOpacity style={styles.modalSaveButton} onPress={handleSaveVendors}>
              <Text style={styles.modalSaveButtonText}>Add Vendors</Text>
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
  saveButton: {
    backgroundColor: '#ee2b8c',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveButtonText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 18,
    color: '#181114',
  },
  sectionSubtitle: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 16,
  },
  cardMakingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#FDF2F8',
  },
  cardMakingIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#FDF2F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardMakingInfo: {
    flex: 1,
    marginLeft: 14,
  },
  cardMakingTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: '#181114',
  },
  cardMakingSubtitle: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  selectedCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#ee2b8c',
    overflow: 'hidden',
  },
  selectedCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FDF2F8',
  },
  selectedCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  selectedCardTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: '#181114',
  },
  selectedCardSubtitle: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  selectedCardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  selectedCardDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 13,
    color: '#6B7280',
  },
  activitiesPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 12,
  },
  viewActivitiesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewActivitiesText: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 13,
    color: '#ee2b8c',
  },
  bottomSpacing: {
    height: 100,
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
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 18,
    color: '#181114',
  },
  modalScroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputLabel: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  inputSubtitle: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 14,
    color: '#181114',
  },
  activitiesList: {
    marginBottom: 16,
  },
  activityItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activityItemSelected: {
    backgroundColor: '#FDF2F8',
    borderColor: '#F472B6',
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  activityCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  activityCheckboxSelected: {
    backgroundColor: '#ee2b8c',
    borderColor: '#ee2b8c',
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 14,
    color: '#181114',
  },
  activityTitleSelected: {
    color: '#ee2b8c',
  },
  activityDescription: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  activityTimeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 34,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activityTimeInputField: {
    flex: 1,
    marginLeft: 8,
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 14,
    color: '#181114',
  },
  guestListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF2F8',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F472B6',
  },
  guestListButtonText: {
    flex: 1,
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 14,
    color: '#ee2b8c',
    marginLeft: 10,
  },
  guestCountBadge: {
    backgroundColor: '#ee2b8c',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
    minWidth: 28,
    alignItems: 'center',
  },
  guestCountText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 12,
    color: 'white',
  },
  guestSummary: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  guestSummaryText: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  guestList: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  guestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  guestItemSelected: {
    backgroundColor: '#FDF2F8',
    borderColor: '#F472B6',
  },
  guestAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  guestAvatarImage: {
    width: '100%',
    height: '100%',
  },
  guestAvatarText: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#F472B6',
    color: 'white',
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
  },
  guestInfo: {
    flex: 1,
    marginLeft: 12,
  },
  guestName: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 15,
    color: '#181114',
  },
  guestRelation: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  guestCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestCheckboxSelected: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  vendorList: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  vendorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  vendorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ee2b8c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vendorAvatarText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 18,
    color: 'white',
  },
  vendorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  vendorName: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 15,
    color: '#181114',
  },
  vendorCategory: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 13,
    color: '#6B7280',
  },
  vendorCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vendorCheckboxSelected: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  modalSaveButton: {
    backgroundColor: '#ee2b8c',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  modalSaveButtonText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: 'white',
  },
});
