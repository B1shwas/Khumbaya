import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
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
// 1. API Endpoints:
//    - GET /api/venues - Search venues
//    - GET /api/cities - Get city suggestions
//    - POST /api/events/{id}/location - Update event location
//
// 2. Location Search:
//    - Implement debounced search API call
//    - Use geocoding API for address suggestions
//
// 3. Map Integration (future):
//    - react-native-maps for map preview
//    - Geolocation services for current location
// ============================================

interface LocationFormData {
  city: string;
  address: string;
  venueName: string;
  latitude: number | null;
  longitude: number | null;
}

export default function EventLocation() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<LocationFormData>({
    city: '',
    address: '',
    venueName: '',
    latitude: null,
    longitude: null,
  });
  
  const [isManualMode, setIsManualMode] = useState(false);

  const scale = useSharedValue(1);

  // TODO: Backend Integration - Venue search
  const handleSearchChange = (text: string) => {
    setFormData(prev => ({ ...prev, venueName: text }));
    // TODO: Debounced API call to /api/venues?q={text}
  };

  const handleCityChange = (text: string) => {
    setFormData(prev => ({ ...prev, city: text }));
    // TODO: City autocomplete API
  };

  const handleAddressChange = (text: string) => {
    setFormData(prev => ({ ...prev, address: text }));
    // TODO: Address geocoding API
  };

  const handleNextStep = () => {
    // TODO: Backend Integration
    // 1. Validate location fields
    // 2. Geocode address to get lat/lng
    // 3. Update event location: PUT /api/events/{id}/location
    // 4. Navigate to estimates step
    
    router.push('/(protected)/(client-tabs)/events/event-estimates' as any);
  };

  const handleBack = () => {
    router.back();
  };

  const toggleManualMode = () => {
    setIsManualMode(!isManualMode);
  };

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(scale.value, { duration: 150 }) }],
    };
  });

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
          <Text style={styles.headerTitle}>Create Event</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>Location & Venue</Text>
            <Text style={styles.progressStep}>Step 2 of 4</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <Animated.View 
              style={[styles.progressBarFill, { width: '50%' }, animatedButtonStyle]} 
            />
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Venue Search */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Search Venue</Text>
            <View style={styles.searchContainer}>
              <View style={styles.searchIcon}>
                <Ionicons name="search" size={20} color="#9CA3AF" />
              </View>
              <TextInput
                style={styles.searchInput}
                placeholder="Search for a hotel, hall, or landmark"
                placeholderTextColor="#9CA3AF"
                value={formData.venueName}
                onChangeText={handleSearchChange}
              />
            </View>
          </View>

          {/* Manual Toggle */}
          <TouchableOpacity 
            style={styles.manualToggle}
            onPress={toggleManualMode}
            activeOpacity={0.8}
          >
            <View style={styles.manualIcon}>
              <Ionicons name="location" size={20} color="#ee2b8c" />
            </View>
            <View style={styles.manualTextContainer}>
              <Text style={styles.manualTitle}>Not finding your venue?</Text>
              <Text style={styles.manualSubtitle}>Enter address manually below</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ee2b8c" />
          </TouchableOpacity>

          {/* Manual Input Fields */}
          <View style={styles.section}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>City</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Mumbai, India"
                placeholderTextColor="#9CA3AF"
                value={formData.city}
                onChangeText={handleCityChange}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Venue Address</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="House number, Street name, Area..."
                placeholderTextColor="#9CA3AF"
                value={formData.address}
                onChangeText={handleAddressChange}
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Location Preview (Map placeholder removed as requested) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location Preview</Text>
            <View style={styles.mapPlaceholder}>
              <View style={styles.mapIconContainer}>
                <Ionicons name="location" size={40} color="#ee2b8c" />
              </View>
              <Text style={styles.mapPlaceholderText}>
                {formData.address ? formData.address : 'Enter address to see preview'}
              </Text>
            </View>
          </View>

          {/* Bottom spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Sticky Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

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
    paddingRight: 40,
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
    fontSize: 14,
    color: '#181114',
  },
  progressStep: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 12,
    color: '#6B7280',
  },
  progressBarBackground: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
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
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    marginLeft: 4,
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  searchInput: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
    paddingHorizontal: 48,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#181114',
  },
  manualToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: 'rgba(238, 43, 140, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(238, 43, 140, 0.2)',
    marginHorizontal: 16,
    marginTop: 8,
  },
  manualIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(238, 43, 140, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  manualTextContainer: {
    flex: 1,
  },
  manualTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: '#ee2b8c',
  },
  manualSubtitle: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: 'rgba(238, 43, 140, 0.8)',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    marginLeft: 4,
  },
  textInput: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#181114',
  },
  textArea: {
    minHeight: 80,
  },
  mapPlaceholder: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapIconContainer: {
    padding: 16,
  },
  mapPlaceholderText: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 14,
    color: '#9CA3AF',
  },
  bottomSpacing: {
    height: 140,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#f8f6f7',
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: '#6B7280',
  },
  nextButton: {
    flex: 2,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#ee2b8c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
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
