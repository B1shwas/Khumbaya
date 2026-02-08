import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// ============================================
// BACKEND INTEGRATION NOTES:
// ============================================
// 1. API Endpoints:
//    - POST /api/events - Create main event
//    - POST /api/events/{id}/subevents - Create sub-event
//    - GET /api/events/{id}/vendors - Get vendors for event
//    - POST /api/events/{id}/vendors - Book vendor
//    - GET /api/events/{id} - Get event details
//
// 2. Sub Events:
//    - Define sub-event types (Sangeet, Mehendi, Reception, etc.)
//    - Each sub-event can have its own timeline
//
// 3. Vendor Selection:
//    - Browse vendors by category
//    - Book vendors for the event
// ============================================

export default function EventSuccess() {
  const router = useRouter();
  
  // TODO: Backend Integration - Get event details and share link
  const eventSlug = 'emma-james-2024';
  const shareLink = `wedding.app/events/${eventSlug}`;

  const handleClose = () => {
    // Navigate to the created event
    router.replace('/(protected)/(client-tabs)/events' as any);
  };

  const handleStartTimeline = () => {
    // Navigate to sub-event creation with todo-like timeline
    router.push('/(protected)/(client-tabs)/events/(eventCms)/subevent-create' as any);
  };

  const handleInviteGuests = () => {
    // Navigate to guest invitation
    router.push('/(protected)/(client-tabs)/events/guests' as any);
  };

  const handleCreateSubEvent = () => {
    // Navigate to sub-event creation
    router.push('/(protected)/(client-tabs)/events/(eventCms)/subevent-create' as any);
  };

  const handleSelectVendors = () => {
    // TODO: Backend Integration - Navigate to vendor selection
    // This would open the vendor marketplace
    console.log('Select vendors');
    router.push('/(protected)/(client-tabs)/explore' as any);
  };

  const handleCopyLink = async () => {
    // TODO: Backend Integration
    // Get actual share link from API
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    console.log('Link copied:', shareLink);
  };

  const handleGoToDashboard = () => {
    router.replace('/(protected)/(client-tabs)/home' as any);
  };

  return (
    <View style={styles.container}>
      {/* Header / Close Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Ionicons name="close" size={28} color="#181114" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Success</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Content Area */}
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
              Your dream wedding is now set up. Let's start planning the details or bring your guests on board.
            </Text>
          </View>

          {/* Primary Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleStartTimeline}
              activeOpacity={0.8}
            >
              <Ionicons name="calendar" size={20} color="white" />
              <Text style={styles.primaryButtonText}>Start Building Timeline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleInviteGuests}
              activeOpacity={0.8}
            >
              <Ionicons name="person-add" size={20} color="#ee2b8c" />
              <Text style={styles.secondaryButtonText}>Invite Guests</Text>
            </TouchableOpacity>
          </View>

          {/* Additional Actions */}
          <View style={styles.additionalActions}>
            <TouchableOpacity
              style={styles.additionalButton}
              onPress={handleCreateSubEvent}
              activeOpacity={0.8}
            >
              <View style={styles.additionalIconContainer}>
                <Ionicons name="sparkles" size={20} color="#9333EA" />
              </View>
              <View style={styles.additionalTextContainer}>
                <Text style={styles.additionalButtonTitle}>Create Sub Event</Text>
                <Text style={styles.additionalButtonSubtitle}>Sangeet, Mehendi, Reception</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.additionalButton}
              onPress={handleSelectVendors}
              activeOpacity={0.8}
            >
              <View style={[styles.additionalIconContainer, styles.vendorIconBg]}>
                <Ionicons name="storefront" size={20} color="#E11D48" />
              </View>
              <View style={styles.additionalTextContainer}>
                <Text style={styles.additionalButtonTitle}>Select Vendors</Text>
                <Text style={styles.additionalButtonSubtitle}>Photographers, Catering, Decor</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
            </TouchableOpacity>
          </View>

          {/* Link Copy Section */}
          <View style={styles.linkContainer}>
            <View style={styles.linkBox}>
              <Ionicons name="link" size={18} color="#9CA3AF" />
              <Text style={styles.linkText} numberOfLines={1}>
                {shareLink}
              </Text>
              <TouchableOpacity onPress={handleCopyLink}>
                <Text style={styles.copyButton}>Copy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.footerButton}
            onPress={handleGoToDashboard}
          >
            <Text style={styles.footerButtonText}>Go to Dashboard</Text>
            <Ionicons name="arrow-up" size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* iOS Home Indicator Spacer */}
        <View style={styles.iosSpacer} />
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
    alignItems: 'center',
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
    marginBottom: 24,
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
  actionButtons: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
    maxWidth: 280,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#ee2b8c',
    shadowColor: '#ee2b8c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: 'white',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(238, 43, 140, 0.1)',
  },
  secondaryButtonText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: '#ee2b8c',
  },
  additionalActions: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
    maxWidth: 320,
  },
  additionalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  additionalIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FAF5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vendorIconBg: {
    backgroundColor: '#FFF1F2',
  },
  additionalTextContainer: {
    flex: 1,
  },
  additionalButtonTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: '#181114',
  },
  additionalButtonSubtitle: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  linkContainer: {
    width: '100%',
    marginTop: 8,
    maxWidth: 280,
  },
  linkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  linkText: {
    flex: 1,
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  copyButton: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: '#ee2b8c',
  },
  footer: {
    padding: 24,
    paddingBottom: 0,
    alignItems: 'center',
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerButtonText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: '#635c60',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  iosSpacer: {
    height: 20,
  },
});
