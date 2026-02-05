import VendorCard from '@/src/components/ui/VendorCard';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import React, { useState } from 'react';
import {
    Dimensions,
    Platform,
    Pressable,
    SectionList,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Sample data structure (replace with actual API data)
const VENDOR_SECTIONS = [
    {
        title: 'Venue & Catering',
        data: [
            {
                id: '1',
                name: 'Grand Plaza Hotel',
                type: 'Venue',
                price: '$5,000',
                status: 'contracted' as const,
                imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=200&h=200&auto=format&fit=crop',
                icon: 'venue' as const,
                action: 'chat' as const,
            },
            {
                id: '2',
                name: 'Tasty Bites Co.',
                type: 'Catering',
                price: '$3,200',
                status: 'deposit' as const,
                imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=200&h=200&auto=format&fit=crop',
                icon: 'catering' as const,
                action: 'call' as const,
            },
        ],
    },
    {
        title: 'Photography & Video',
        data: [
            {
                id: '3',
                name: 'Focus Studios',
                type: 'Main Photographer',
                price: '$1,800',
                status: 'pending' as const,
                imageUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=200&h=200&auto=format&fit=crop',
                icon: 'photo' as const,
                action: 'email' as const,
            },
        ],
    },
    {
        title: 'Entertainment',
        data: [
            {
                id: '4',
                name: 'DJ Khaled (Local)',
                type: 'Music',
                price: '$800',
                status: 'paid' as const,
                imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=200&h=200&auto=format&fit=crop',
                icon: 'music' as const,
                action: 'chat' as const,
            },
        ],
    },
];

const EventVendorsScreen = () => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [activeTab, setActiveTab] = useState('vendors');

    // Optimized section header component
    const renderSectionHeader = ({ section: { title } }: any) => (
        <View className="bg-background-light/95 dark:bg-background-dark/95 py-3 px-4 sticky top-0 z-10">
            <Text className="text-slate-900 dark:text-white text-lg font-bold">
                {title}
            </Text>
        </View>
    );

    // Optimized vendor item renderer
    const renderVendorItem = ({ item }: any) => (
        <View className="px-4">
            <VendorCard
                {...item}
                onPressAction={() => console.log(`Action: ${item.action} for ${item.name}`)}
            />
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
            <StatusBar style={isDark ? 'light' : 'dark'} />

            {/* Top App Bar */}
            <View className="flex-row items-center bg-white/80 dark:bg-gray-900/80 border-b border-gray-100 dark:border-gray-800 p-4 pb-4">
                <Pressable
                    className="w-10 h-10 rounded-full flex items-center justify-center active:bg-gray-100 dark:active:bg-gray-800"
                    onPress={() => console.log('Back pressed')}
                    accessibilityLabel="Go back"
                    accessibilityRole="button"
                >
                    <MaterialIcons
                        name="arrow-back-ios"
                        size={20}
                        color={isDark ? 'white' : '#1e293b'}
                        style={{ marginLeft: 6 }}
                    />
                </Pressable>

                <Text className="text-slate-900 dark:text-white text-xl font-bold flex-1 text-center">
                    Event Vendors
                </Text>

                <Pressable
                    className="w-10 h-10 rounded-full flex items-center justify-center active:bg-gray-100 dark:active:bg-gray-800"
                    onPress={() => console.log('Search pressed')}
                    accessibilityLabel="Search vendors"
                    accessibilityRole="button"
                >
                    <MaterialIcons
                        name="search"
                        size={24}
                        color={isDark ? 'white' : '#1e293b'}
                    />
                </Pressable>
            </View>

            {/* Vendor List */}
            <SectionList
                sections={VENDOR_SECTIONS as any}
                keyExtractor={(item) => item.id}
                renderSectionHeader={renderSectionHeader}
                renderItem={renderVendorItem}
                contentContainerStyle={{ paddingBottom: 160 }}
                stickySectionHeadersEnabled
                showsVerticalScrollIndicator={false}
                className="flex-1"
            />

            {/* Floating Action Button */}
            <Pressable
                className="absolute right-6 rounded-full bg-primary flex items-center justify-center active:scale-95"
                style={{
                    bottom: Platform.OS === 'ios' ? 120 : 100,
                    width: 60,
                    height: 60,
                    shadowColor: '#ee2b8c',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.4,
                    shadowRadius: 10,
                    elevation: 10,
                }}
                onPress={() => console.log('Add vendor pressed')}
                accessibilityLabel="Add new vendor"
                accessibilityRole="button"
            >
                <MaterialIcons name="add" size={32} color="white" />
            </Pressable>

            {/* Bottom Navigation */}
          
        </SafeAreaView>
    );
};

export default EventVendorsScreen;