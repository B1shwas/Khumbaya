import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

// ============================================
// BACKEND INTEGRATION NOTES:
// ============================================
// 1. API Endpoints to use:
//    - POST /api/events - Create new event
//    - GET /api/event-types - Fetch event types
//    - POST /api/events/{id}/cover - Upload cover image
//    - GET /api/events/{id} - Get event details for editing
//
// 2. State Management:
//    - Use context or state management library (Zustand/Redux) for event data
//    - Persist form data across wizard steps
//
// 3. Image Upload:
//    - Use react-native-image-picker or expo-image-picker
//    - Upload to cloud storage (AWS S3, Cloudinary, etc.)
//    - Store returned URL in event state
//
// 4. Form Validation:
//    - Add validation library (zod, yup, react-hook-form)
//    - Validate all fields before API call
// ============================================

interface EventFormData {
  name: string;
  eventType: string;
  date: Date | null;
  coverImage: string | null;
}

type EventType = 'Wedding' | 'Engagement' | 'Reception' | 'Nikkah' | 'Other';

const EVENT_TYPES: EventType[] = ['Wedding', 'Engagement', 'Reception', 'Nikkah', 'Other'];

// Calendar helper functions
const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function EventCreate() {
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState<EventFormData>({
    name: "Aisha & Omar's Wedding",
    eventType: 'Wedding' as EventType,
    date: new Date(2024, 5, 16), // June 16, 2024
    coverImage: null,
  });

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(5); // June 2024
  const [currentYear, setCurrentYear] = useState(2024);
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 5, 16));

  // Animation values
  const scale = useSharedValue(1);

  const handleNextStep = async () => {
    // TODO: Backend Integration
    // 1. Validate all form fields
    // 2. Create event via API: POST /api/events
    // 3. If cover image selected, upload: POST /api/events/{id}/cover
    // 4. Handle loading state during API call
    // 5. Navigate to next step on success
    
    console.log('Form data ready for API submission:', formData);
    
    // Navigate to location step
    router.push('/(protected)/(client-tabs)/eventCms/event-location' as any);
  };

  const handleBack = () => {
    router.back();
  };

  const handleEventNameChange = (text: string) => {
    setFormData(prev => ({ ...prev, name: text }));
  };

  const handleEventTypeSelect = (type: EventType) => {
    setFormData(prev => ({ ...prev, eventType: type }));
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(newDate);
    setFormData(prev => ({ ...prev, date: newDate }));
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(prev => prev - 1);
      } else {
        setCurrentMonth(prev => prev - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(prev => prev + 1);
      } else {
        setCurrentMonth(prev => prev + 1);
      }
    }
  };

  const handleCoverPress = () => {
    // TODO: Backend Integration - Image picker
    console.log('Open image picker for cover image');
  };

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(scale.value, { duration: 150 }) }],
    };
  });

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days: React.ReactNode[] = [];

    // Previous month padding
    const prevMonthDays = currentMonth === 0 
      ? getDaysInMonth(currentYear - 1, 11)
      : getDaysInMonth(currentYear, currentMonth - 1);
    
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(
        <Text key={`prev-${i}`} style={[styles.calendarDay, styles.calendarDayInactive]}>
          {prevMonthDays - i}
        </Text>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = 
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === currentMonth &&
        selectedDate.getFullYear() === currentYear;
      
      const isToday = 
        new Date().getDate() === day && 
        new Date().getMonth() === currentMonth &&
        new Date().getFullYear() === currentYear;

      days.push(
        <TouchableOpacity
          key={`current-${day}`}
          onPress={() => handleDateSelect(day)}
          style={[
            styles.calendarDayContainer,
            isSelected && styles.calendarDaySelected,
          ]}
        >
          <Text style={[
            styles.calendarDay,
            isSelected && styles.calendarDaySelectedText,
            isToday && !isSelected && styles.calendarDayToday,
          ]}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    // Next month padding
    const totalCells = firstDay + daysInMonth;
    const remainingCells = 42 - totalCells;
    for (let i = 1; i <= remainingCells; i++) {
      days.push(
        <Text key={`next-${i}`} style={[styles.calendarDay, styles.calendarDayInactive]}>
          {i}
        </Text>
      );
    }

    return days;
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={20} color="#181114" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create New Event</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>Basic Information</Text>
            <Text style={styles.progressStep}>1 of 4</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <Animated.View 
              style={[styles.progressBarFill, { width: '25%' }, animatedButtonStyle]} 
            />
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Cover Image Upload */}
          <View style={styles.section}>
            <TouchableOpacity 
              onPress={handleCoverPress}
              style={styles.coverUploadContainer}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4baplBpAzVE_Kbv7m5jmbgfKEsZdzJcLTblHvHyn_CNxgGJ-spHw_-lcr1J_eQJK_onSfJPDupULCeQLMZd-cLvKBMgzzViLvDItg2ng1UIiZVvbQ5CwFEo-lqmLVbH5gyK4fkgRNsiRz8-wcyZYDzkYCmyI3K2pgzYajYnxOThBEL1RbDkAhjz-hv9j9fNN8MKdGjJ7oqMlN1vqSDKRDlWWbxdNT1jniUPXUy5mcnJ7XsOCE2Qz6WO5pgIHRrOKlvu-5NrxRhU8' }}
                style={styles.coverImage}
                resizeMode="cover"
              />
              <View style={styles.coverOverlay}>
                <View style={styles.coverIconContainer}>
                  <Ionicons name="camera" size={24} color="white" />
                </View>
                <Text style={styles.coverTitle}>Add Event Cover</Text>
                <Text style={styles.coverSubtitle}>High quality JPG or PNG</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Event Name Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Event Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Aisha & Omar's Wedding"
              placeholderTextColor="#9CA3AF"
              value={formData.name}
              onChangeText={handleEventNameChange}
            />
          </View>

          {/* Event Type Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What type of event is it?</Text>
            <View style={styles.chipContainer}>
              {EVENT_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => handleEventTypeSelect(type)}
                  style={[
                    styles.chip,
                    formData.eventType === type && styles.chipSelected,
                  ]}
                >
                  <Text style={[
                    styles.chipText,
                    formData.eventType === type && styles.chipTextSelected,
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Date Picker */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>When is the big day?</Text>
            <View style={styles.calendarContainer}>
              {/* Calendar Header */}
              <View style={styles.calendarHeader}>
                <Text style={styles.calendarMonth}>
                  {MONTHS[currentMonth]} {currentYear}
                </Text>
                <View style={styles.calendarNavigation}>
                  <TouchableOpacity 
                    onPress={() => handleMonthChange('prev')}
                    style={styles.calendarNavButton}
                  >
                    <Ionicons name="chevron-back" size={24} color="#ee2b8c" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => handleMonthChange('next')}
                    style={styles.calendarNavButton}
                  >
                    <Ionicons name="chevron-forward" size={24} color="#ee2b8c" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Day of Week Headers */}
              <View style={styles.calendarWeekHeader}>
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                  <Text key={day} style={styles.calendarWeekDay}>
                    {day}
                  </Text>
                ))}
              </View>

              {/* Calendar Grid */}
              <View style={styles.calendarGrid}>
                {renderCalendarDays()}
              </View>
            </View>
          </View>

          {/* Bottom spacing for footer */}
          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Sticky Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleNextStep}
            style={styles.nextButton}
            activeOpacity={0.8}
            onPressIn={() => { scale.value = 0.98; }}
            onPressOut={() => { scale.value = 1; }}
          >
            <Text style={styles.nextButtonText}>Next Step</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f6f7',
  },
  keyboardAvoidingView: {
    flex: 1,
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
    backgroundColor: '#f8f6f7',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 18,
    color: '#181114',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 12,
    color: '#181114',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressStep: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 12,
    color: '#ee2b8c',
  },
  progressBarBackground: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(238, 43, 140, 0.1)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#ee2b8c',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  sectionTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: '#181114',
    marginBottom: 12,
  },
  coverUploadContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#E5E7EB',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  coverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  coverTitle: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 16,
    color: 'white',
  },
  coverSubtitle: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  textInput: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#181114',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 9999,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipSelected: {
    backgroundColor: '#ee2b8c',
    borderColor: '#ee2b8c',
  },
  chipText: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 14,
    color: '#6B7280',
  },
  chipTextSelected: {
    color: 'white',
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarMonth: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 18,
    color: '#181114',
  },
  calendarNavigation: {
    flexDirection: 'row',
    gap: 8,
  },
  calendarNavButton: {
    padding: 4,
  },
  calendarWeekHeader: {
    flexDirection: 'row',
    marginBottom: 8,
    justifyContent: 'space-around',
  },
  calendarWeekDay: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    width: 40,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  calendarDayContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  calendarDaySelected: {
    backgroundColor: '#ee2b8c',
    shadowColor: '#ee2b8c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  calendarDay: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 14,
    color: '#181114',
    textAlign: 'center',
    width: 40,
    lineHeight: 40,
  },
  calendarDayInactive: {
    color: '#D1D5DB',
  },
  calendarDaySelectedText: {
    color: 'white',
  },
  calendarDayToday: {
    color: '#ee2b8c',
  },
  bottomSpacing: {
    height: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 32,
    backgroundColor: '#f8f6f7',
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
  },
  nextButton: {
    width: '100%',
    backgroundColor: '#ee2b8c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#ee2b8c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: 'white',
  },
});
