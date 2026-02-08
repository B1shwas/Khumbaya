import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// ============================================
// BACKEND INTEGRATION NOTES:
// ============================================
// 1. API Endpoints:
//    - GET /api/events - Get all events
//    - POST /api/events/{id}/subevents - Create sub-event
//    - GET /api/events/{id}/vendors - Get vendors for event
//    - POST /api/events/{id}/vendors - Book vendor
//    - GET /api/events/{id} - Get event details
//
// 2. Sub Events:
//    - Define sub-event types (Sangeet, Mehendi, Reception, etc.)
//    - Each sub-event can have its own timeline
//    - Each sub-event can have multiple vendors
//
// 3. Vendor Selection:
//    - Browse vendors by category
//    - Book vendors for the event/sub-event
// ============================================

// Mock data for events
const MOCK_EVENTS = [
  {
    id: '1',
    name: 'Emma & James Wedding',
    date: '2024-12-15',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDBTMpF5OGVFMpt0SFd1YYHvT0dbWhsJ1OiXWYAZtZHva3uRWvfDLTe0o9wji8CCfff_spyNbGa1EqMQAzU8TSgsZHHZyZczilaJjXsgkwdrHYtnhNzzELEAqjVUidiCPT2fu982NW88FUu6OLV-YHywILAwdx8LLdR69ManJPsqTJW1tjKuLVKnk4MgCSOSRbFhMOSEYIzSWmW-zWQIRd6Gn2odEDu-GJKhVcxGiy5nXwWuauIW5Hx3EfnwvPUTBI8LDijYJeRSk',
    subEvents: [
      {
        id: 's1',
        name: 'Sangeet Ceremony',
        vendors: [
          { id: 'v1', name: 'DJ Beats', category: 'Music', status: 'Booked' },
          { id: 'v2', name: 'Flower Decor', category: 'Decoration', status: 'Pending' },
        ],
      },
      {
        id: 's2',
        name: 'Mehendi Ceremony',
        vendors: [],
      },
    ],
  },
  {
    id: '2',
    name: 'Sarah & John Reception',
    date: '2025-01-20',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDBTMpF5OGVFMpt0SFd1YYHvT0dbWhsJ1OiXWYAZtZHva3uRWvfDLTe0o9wji8CCfff_spyNbGa1EqMQAzU8TSgsZHHZyZczilaJjXsgkwdrHYtnhNzzELEAqjVUidiCPT2fu982NW88FUu6OLV-YHywILAwdx8LLdR69ManJPsqTJW1tjKuLVKnk4MgCSOSRbFhMOSEYIzSWmW-zWQIRd6Gn2odEDu-GJKhVcxGiy5nXwWuauIW5Hx3EfnwvPUTBI8LDijYJeRSk',
    subEvents: [],
  },
];

type ViewMode = 'success' | 'events' | 'subevent';

export default function EventSuccess() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('success');
  const [selectedEvent, setSelectedEvent] = useState<typeof MOCK_EVENTS[0] | null>(null);
  const [expandedSubEvents, setExpandedSubEvents] = useState<string[]>([]);

  const handleClose = () => {
    router.replace('/(protected)/(client-tabs)/events' as any);
  };

  const handleCreateSubEvent = () => {
    router.push('/(protected)/(client-tabs)/events/(eventCms)/subevent-create' as any);
  };

  const handleViewMyEvents = () => {
    setViewMode('events');
  };

  const handleEventPress = (event: typeof MOCK_EVENTS[0]) => {
    setSelectedEvent(event);
    setViewMode('subevent');
  };

  const handleBackToEvents = () => {
    setViewMode('events');
    setSelectedEvent(null);
  };

  const handleBackToSuccess = () => {
    setViewMode('success');
    setSelectedEvent(null);
    setExpandedSubEvents([]);
  };

  const toggleSubEvent = (subEventId: string) => {
    setExpandedSubEvents(prev => 
      prev.includes(subEventId) 
        ? prev.filter(id => id !== subEventId)
        : [...prev, subEventId]
    );
  };

  const handleAddVendor = (subEventId: string) => {
    // TODO: Navigate to vendor selection for this sub-event
    console.log('Add vendor for sub-event:', subEventId);
    router.push('/(protected)/(client-tabs)/explore' as any);
  };

  const handleCopyLink = async (event: typeof MOCK_EVENTS[0]) => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    console.log('Link copied:', `wedding.app/events/${event.name.toLowerCase().replace(/ /g, '-')}`);
  };

  const renderSuccessView = () => (
    <View style={styles.content}>
      {/* Hero Illustration */}
      <View style={styles.heroContainer}>
        <View style={styles.heroCircle}>
          <View style={styles.heroInner}>
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDBTMpF5OGVFMpt0SFd1YYHvT0dbWhsJ1OiXWYAZtZHva3uRWvfDLTe0o9wji8CCfff_spyNbGa1EqMQAzU8TSgsZHHZyZczilaJjXsgkwdrHYtnhNzzELEAqjVUidiCPT2fu982NW88FUu6OLV-YHywILAwdx8LLdR69ManJPsqTJW1tjKuLVKnk4MgCSOSRbFhMOSEYIzSWmW-zWQIRd6Gn2odEDu-GJKhVcxGiy5nXwWuauIW5Hx3EfnwvPUTBI8LDijYJeRSk' }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          </View>
          
          {/* Floating decorative icons */}
          <View style={[styles.floatIcon, styles.floatIcon1]}>
            <Ionicons name="heart" size={24} color="#ee2b8c" fill="#ee2b8c" />
          </View>
          <View style={[styles.floatIcon, styles.floatIcon2]}>
            <Ionicons name="star" size={20} color="#ee2b8c" />
          </View>
          <View style={[styles.floatIcon, styles.floatIcon3]}>
            <Ionicons name="sparkles" size={18} color="#ee2b8c" />
          </View>
        </View>
      </View>

      {/* Text Content */}
      <View style={styles.textContent}>
        <Text style={styles.title}>Congratulations!</Text>
        <Text style={styles.title}>Your event is live.</Text>
        
        <Text style={styles.subtitle}>
          Your dream wedding is now set up. What's next?
        </Text>
      </View>

      {/* Option Buttons */}
      <View style={styles.optionButtons}>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={handleCreateSubEvent}
          activeOpacity={0.8}
        >
          <View style={styles.optionIconContainer}>
            <Ionicons name="sparkles" size={28} color="#9333EA" />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Create Sub Event</Text>
            <Text style={styles.optionSubtitle}>Sangeet, Mehendi, Reception</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#D1D5DB" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={handleViewMyEvents}
          activeOpacity={0.8}
        >
          <View style={[styles.optionIconContainer, { backgroundColor: '#EE2B8C20' }]}>
            <Ionicons name="calendar" size={28} color="#ee2b8c" />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>View My Events</Text>
            <Text style={styles.optionSubtitle}>See all your events</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#D1D5DB" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEventsView = () => (
    <View style={styles.content}>
      <Text style={styles.sectionTitle}>My Events</Text>
      <FlatList
        data={MOCK_EVENTS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.eventCard}
            onPress={() => handleEventPress(item)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: item.image }} style={styles.eventImage} />
            <View style={styles.eventInfo}>
              <Text style={styles.eventName}>{item.name}</Text>
              <Text style={styles.eventDate}>{item.date}</Text>
              <View style={styles.eventSubEvents}>
                <Ionicons name="layers" size={14} color="#9CA3AF" />
                <Text style={styles.eventSubEventsText}>
                  {item.subEvents.length} sub-events
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.eventsList}
      />
    </View>
  );

  const renderSubEventView = () => (
    <View style={styles.content}>
      {/* Event Header */}
      <View style={styles.subEventHeader}>
        <TouchableOpacity onPress={handleBackToEvents} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#181114" />
        </TouchableOpacity>
        <Text style={styles.subEventTitle} numberOfLines={1}>
          {selectedEvent?.name}
        </Text>
      </View>

      {/* Add Sub Event Button */}
      <TouchableOpacity
        style={styles.addSubEventButton}
        onPress={handleCreateSubEvent}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color="#ee2b8c" />
        <Text style={styles.addSubEventText}>Add Sub Event</Text>
      </TouchableOpacity>

      {/* Sub Events List */}
      <ScrollView style={styles.subEventsList} showsVerticalScrollIndicator={false}>
        {selectedEvent?.subEvents.map(subEvent => (
          <View key={subEvent.id} style={styles.subEventCard}>
            <TouchableOpacity
              style={styles.subEventHeader}
              onPress={() => toggleSubEvent(subEvent.id)}
              activeOpacity={0.8}
            >
              <View style={styles.subEventInfo}>
                <Text style={styles.subEventName}>{subEvent.name}</Text>
                <Text style={styles.subEventVendorCount}>
                  {subEvent.vendors.length} vendor{subEvent.vendors.length !== 1 ? 's' : ''}
                </Text>
              </View>
              <Ionicons
                name={expandedSubEvents.includes(subEvent.id) ? "chevron-up" : "chevron-down"}
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>

            {expandedSubEvents.includes(subEvent.id) && (
              <View style={styles.subEventDetails}>
                {/* Vendors List */}
                {subEvent.vendors.length > 0 ? (
                  subEvent.vendors.map(vendor => (
                    <View key={vendor.id} style={styles.vendorItem}>
                      <View style={styles.vendorInfo}>
                        <Ionicons name="person" size={16} color="#6B7280" />
                        <Text style={styles.vendorName}>{vendor.name}</Text>
                      </View>
                      <View style={[
                        styles.vendorStatus,
                        vendor.status === 'Booked' ? styles.statusBooked : styles.statusPending
                      ]}>
                        <Text style={[
                          styles.vendorStatusText,
                          vendor.status === 'Booked' ? styles.statusBookedText : styles.statusPendingText
                        ]}>
                          {vendor.status}
                        </Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noVendorsText}>No vendors added yet</Text>
                )}

                {/* Add Vendor Button */}
                <TouchableOpacity
                  style={styles.addVendorButton}
                  onPress={() => handleAddVendor(subEvent.id)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="add-circle-outline" size={20} color="#ee2b8c" />
                  <Text style={styles.addVendorText}>Add Vendor</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {selectedEvent?.subEvents.length === 0 && (
          <View style={styles.emptySubEvents}>
            <Ionicons name="layers-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptySubEventsText}>No sub-events yet</Text>
            <Text style={styles.emptySubEventsSubText}>
              Tap "Add Sub Event" to get started
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header / Close Button */}
      <View style={styles.header}>
        {viewMode !== 'success' ? (
          <TouchableOpacity onPress={handleBackToSuccess} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#181114" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#181114" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>
          {viewMode === 'success' ? 'Success' : viewMode === 'events' ? 'My Events' : 'Sub Events'}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {viewMode === 'success' && renderSuccessView()}
        {viewMode === 'events' && renderEventsView()}
        {viewMode === 'subevent' && selectedEvent && renderSubEventView()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f6f7',
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
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
  closeButton: {
    width: 48,
    height: 48,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 18,
    color: '#181114',
    flex: 1,
    textAlign: 'center',
    paddingRight: 48,
  },
  headerSpacer: {
    width: 48,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  heroContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  heroCircle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(238, 43, 140, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  heroInner: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 4,
    borderColor: 'white',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  floatIcon: {
    position: 'absolute',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  floatIcon1: {
    top: 20,
    left: 20,
  },
  floatIcon2: {
    bottom: 30,
    right: 20,
  },
  floatIcon3: {
    top: 40,
    right: 15,
  },
  textContent: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontFamily: 'PlusJakartaSans-Extrabold',
    fontSize: 28,
    color: '#181114',
    textAlign: 'center',
    lineHeight: 36,
  },
  subtitle: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 16,
    color: '#635c60',
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  optionButtons: {
    width: '100%',
    gap: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  optionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#FAF5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: '#181114',
  },
  optionSubtitle: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  sectionTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 20,
    color: '#181114',
    marginBottom: 16,
  },
  eventsList: {
    gap: 12,
    paddingBottom: 24,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  eventImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventName: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: '#181114',
  },
  eventDate: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  eventSubEvents: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  eventSubEventsText: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: '#9CA3AF',
  },
  subEventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subEventTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 18,
    color: '#181114',
    flex: 1,
  },
  addSubEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: 'rgba(238, 43, 140, 0.1)',
    borderRadius: 16,
    marginBottom: 16,
  },
  addSubEventText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: '#ee2b8c',
  },
  subEventsList: {
    flex: 1,
  },
  subEventCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
    overflow: 'hidden',
  },
  subEventInfo: {
    padding: 16,
  },
  subEventName: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: '#181114',
  },
  subEventVendorCount: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  subEventDetails: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 16,
  },
  vendorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  vendorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  vendorName: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 14,
    color: '#181114',
  },
  vendorStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBooked: {
    backgroundColor: '#DCFCE7',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  vendorStatusText: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 12,
  },
  statusBookedText: {
    color: '#15803D',
  },
  statusPendingText: {
    color: '#D97706',
  },
  noVendorsText: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 8,
  },
  addVendorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#EE2B8C',
    borderRadius: 12,
    borderStyle: 'dashed',
  },
  addVendorText: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 14,
    color: '#ee2b8c',
  },
  emptySubEvents: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptySubEventsText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 18,
    color: '#181114',
    marginTop: 16,
  },
  emptySubEventsSubText: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
});
