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
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

// ============================================
// BACKEND INTEGRATION NOTES:
// ============================================
// 1. API Endpoints:
//    - PUT /api/events/{id}/estimates - Update guest count & budget
//    - GET /api/events/{id}/estimates - Get current estimates
//
// 2. Budget Management:
//    - Currency conversion API for multi-currency support
//    - Budget breakdown by categories (future feature)
//
// 3. Guest Management:
//    - Guest list integration
//    - RSVP tracking
// ============================================

interface EstimatesFormData {
  guestCount: string;
  budget: string;
  currency: string;
  isBudgetPrivate: boolean;
}

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR'];

export default function EventEstimates() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<EstimatesFormData>({
    guestCount: '',
    budget: '',
    currency: 'USD',
    isBudgetPrivate: true,
  });

  const scale = useSharedValue(1);

  const handleGuestCountChange = (text: string) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, '');
    setFormData(prev => ({ ...prev, guestCount: numericText }));
  };

  const handleBudgetChange = (text: string) => {
    // Only allow numbers and decimal
    const numericText = text.replace(/[^0-9.]/g, '');
    setFormData(prev => ({ ...prev, budget: numericText }));
  };

  const handleCurrencyChange = (currency: string) => {
    setFormData(prev => ({ ...prev, currency }));
  };

  const toggleBudgetPrivacy = () => {
    setFormData(prev => ({ ...prev, isBudgetPrivate: !prev.isBudgetPrivate }));
  };

  const handleNextStep = () => {
    // TODO: Backend Integration
    // 1. Validate numeric fields
    // 2. Update estimates: PUT /api/events/{id}/estimates
    // 3. Navigate to success page
    
    router.push('/(protected)/(client-tabs)/events/(eventCms)/success' as any);
  };

  const handleBack = () => {
    router.back();
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
            <Text style={styles.progressStep}>Step 3 of 4</Text>
            <Text style={styles.progressLabel}>Estimates</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <Animated.View 
              style={[styles.progressBarFill, { width: '75%' }, animatedButtonStyle]} 
            />
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Guest & Budget Estimates</Text>
            <Text style={styles.subtitle}>
              Set your initial targets. You can always adjust these later as your planning evolves.
            </Text>
          </View>

          {/* Guest Count Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Estimated Guest Count</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 150"
                placeholderTextColor="#9CA3AF"
                value={formData.guestCount}
                onChangeText={handleGuestCountChange}
                keyboardType="number-pad"
              />
              <View style={styles.inputIcon}>
                <Ionicons name="people" size={20} color="#9CA3AF" />
              </View>
            </View>
          </View>

          {/* Total Budget Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Total Budget</Text>
            <View style={styles.budgetRow}>
              <View style={[styles.inputContainer, styles.budgetInput]}>
                <View style={styles.currencyIcon}>
                  <Text style={styles.currencySymbol}>$</Text>
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="0.00"
                  placeholderTextColor="#9CA3AF"
                  value={formData.budget}
                  onChangeText={handleBudgetChange}
                  keyboardType="decimal-pad"
                />
              </View>
              
              {/* Currency Selector */}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.currencyScroll}
              >
                {CURRENCIES.map((currency) => (
                  <TouchableOpacity
                    key={currency}
                    onPress={() => handleCurrencyChange(currency)}
                    style={[
                      styles.currencyButton,
                      formData.currency === currency && styles.currencyButtonSelected,
                    ]}
                  >
                    <Text style={[
                      styles.currencyText,
                      formData.currency === currency && styles.currencyTextSelected,
                    ]}>
                      {currency}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Privacy Toggle */}
          <View style={styles.privacySection}>
            <View style={styles.privacyContainer}>
              <View style={styles.privacyTextContainer}>
                <Text style={styles.privacyTitle}>Keep Budget Private</Text>
                <Text style={styles.privacySubtitle}>
                  Only organizers will see the financial breakdown.
                </Text>
              </View>
              <Switch
                value={formData.isBudgetPrivate}
                onValueChange={toggleBudgetPrivacy}
                trackColor={{ false: '#E5E7EB', true: '#ee2b8c' }}
                thumbColor="white"
              />
            </View>
          </View>

          {/* Quick Tip */}
          <View style={styles.tipContainer}>
            <Ionicons name="bulb" size={20} color="#ee2b8c" />
            <Text style={styles.tipText}>
              Tip: For large cultural weddings, adding a 10% buffer to your guest count is recommended for unexpected RSVPs.
            </Text>
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
            <Ionicons name="chevron-back" size={20} color="#6B7280" />
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
            <Ionicons name="chevron-forward" size={20} color="white" />
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
  progressStep: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 12,
    color: '#6B7280',
  },
  progressLabel: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 12,
    color: '#ee2b8c',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  titleSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 24,
    color: '#181114',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 14,
    color: '#181114',
    marginBottom: 12,
  },
  inputContainer: {
    position: 'relative',
  },
  textInput: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingRight: 48,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#181114',
  },
  inputIcon: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  budgetRow: {
    flexDirection: 'row',
    gap: 12,
  },
  budgetInput: {
    flex: 2,
  },
  currencyIcon: {
    position: 'absolute',
    left: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  currencySymbol: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: '#6B7280',
  },
  currencyScroll: {
    flex: 1,
  },
  currencyButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
    marginRight: 8,
  },
  currencyButtonSelected: {
    backgroundColor: '#ee2b8c',
    borderColor: '#ee2b8c',
  },
  currencyText: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 14,
    color: '#6B7280',
  },
  currencyTextSelected: {
    color: 'white',
  },
  privacySection: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  privacyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(238, 43, 140, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(238, 43, 140, 0.2)',
  },
  privacyTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  privacyTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: '#181114',
    marginBottom: 4,
  },
  privacySubtitle: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  tipContainer: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    marginTop: 32,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tipText: {
    flex: 1,
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    lineHeight: 18,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
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
