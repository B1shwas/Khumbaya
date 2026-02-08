import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';

const DAYS_OF_WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasEvent: boolean;
}

interface EventCardProps {
  category: string;
  categoryColor: string;
  title: string;
  time: string;
  location?: string;
  attendees?: string[];
}

const EventCard: React.FC<EventCardProps> = ({
  category,
  categoryColor,
  title,
  time,
  location,
  attendees,
}) => {
  return (
    <TouchableOpacity className="flex-row items-stretch gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm active:opacity-90">
      <View className="w-1.5 rounded-full" style={{ backgroundColor: categoryColor }} />
      <View className="flex-1 flex-col gap-3">
        <View className="flex-col gap-1">
          <Text className="text-[10px] uppercase tracking-wider font-bold" style={{ color: categoryColor }}>{category}</Text>
          <Text className="text-base font-bold leading-tight text-slate-900 dark:text-white">{title}</Text>
          <View className="flex-row items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
            <Text>🕐</Text>
            <Text className="text-slate-500 dark:text-slate-400 text-sm">{time}</Text>
          </View>
        </View>
        <View className="flex-row items-center justify-between">
          {location ? (
            <View className="flex-row items-center gap-2 text-slate-500 text-xs italic">
              <Text>📍</Text>
              <Text className="text-slate-500 dark:text-slate-400 text-xs italic">{location}</Text>
            </View>
          ) : attendees ? (
            <View className="flex-row -space-x-2">
              <Image
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvSIUsCKFYMtY0QH6MRH6TWE6HO-q9Icy3jLBGq1CI1SlEq3csCQrYqiHl3jAgRDzTqrsP5-ZHeHDvK_YAi6oT8w0ItL-yRZYxd_lzaJJdUj1YMU5jLNtXKonzWWG4fChDv5WvkvrnMEvrcWVwWu50pKXKWn39qZL315cpP4p0fgQFYHb9_TG2P-PZ9EiwpfbGa32EWuQ35J9VPvRcEY6bnLIhuaFbP_f0RJvDRkEi_23E2GyjeO2qMoHSToFWCf-UnKCEp75Gjmc' }}
                className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900"
              />
              <Image
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsyub0wZrSqBfTSk42lcQLgZCpGOEQBx0Vf8MTRlxaSqcoMsH7pzzJkT-DlEhYP0vWWBjJ298dBrLHwXTO4J85T62CcTrAhfBLqUED0p2n9mcQkQLJ-mfQyBqORtvV72aSNzQcF99JIYbaQ7yO3DKoHyoXw7z1Ez4cPvRz4K_fPmjQe4WoZX5GcJN4reTRwd87fOKSPXPVRPRTuwHQsjCK0ZC86Q1DhETF4YiOzJM4cTwcxXLLvgtrAks-yKlbl5zvSLVEshueMs4' }}
                className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900"
              />
              <View className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700 items-center justify-center">
                <Text className="text-[8px] font-bold text-slate-600 dark:text-slate-300">+3</Text>
              </View>
            </View>
          ) : null}
          <Text className="text-primary font-semibold text-sm">Details</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const VendorCalendarScreen: React.FC = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [currentMonth, setCurrentMonth] = useState(9); // October (0-indexed)
  const [currentYear, setCurrentYear] = useState(2023);
  const [selectedDay, setSelectedDay] = useState(5);

  // Generate calendar days
  const generateCalendarDays = (): CalendarDay[] => {
    const days: CalendarDay[] = [];
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        isToday: false,
        hasEvent: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = i === 5; // Hardcoded for demo
      const hasEvent = [1, 4, 7, 10, 19].includes(i); // Days with events
      days.push({
        day: i,
        isCurrentMonth: true,
        isToday,
        hasEvent,
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        isToday: false,
        hasEvent: false,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const todayEvents = [
    {
      category: 'Work',
      categoryColor: '#135bec',
      title: 'Meeting with Design Team',
      time: '10:00 AM - 11:30 AM',
      attendees: ['1', '2'],
    },
    {
      category: 'Health',
      categoryColor: '#10b981',
      title: 'Gym Session',
      time: '5:00 PM - 6:00 PM',
      location: 'City Fitness Center',
    },
    {
      category: 'Social',
      categoryColor: '#f59e0b',
      title: 'Dinner with Friends',
      time: '8:00 PM - 10:00 PM',
      location: 'Downtown Italian',
    },
  ];

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <View className="px-4 pt-4 pb-4">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity 
              className="p-2 rounded-full active:opacity-70"
              onPress={goToPreviousMonth}
            >
              <Text className="text-2xl">←</Text>
            </TouchableOpacity>
            <Text className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              {MONTHS[currentMonth]} {currentYear}
            </Text>
            <TouchableOpacity 
              className="p-2 rounded-full active:opacity-70"
              onPress={goToNextMonth}
            >
              <Text className="text-2xl">→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Calendar Grid */}
        <View className="px-4 mb-6">
          <View className="bg-white dark:bg-slate-900/50 rounded-xl p-4 shadow-sm">
            {/* Day Headers */}
            <View className="flex-row mb-2">
              {DAYS_OF_WEEK.map((day, index) => (
                <View key={index} className="flex-1 items-center justify-center py-2">
                  <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest">{day}</Text>
                </View>
              ))}
            </View>

            {/* Calendar Days */}
            <View className="flex-row flex-wrap">
              {calendarDays.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  className={`w-[14.28%] h-12 items-center justify-center ${day.isToday ? 'relative' : ''}`}
                  onPress={() => setSelectedDay(day.day)}
                  activeOpacity={0.7}
                >
                  {day.isToday ? (
                    <View className="absolute inset-0 m-1.5 items-center justify-center">
                      <View className="w-full h-full bg-primary rounded-full -z-10" />
                      <Text className={`text-sm ${day.isCurrentMonth ? 'text-white' : 'text-slate-400'}`}>
                        {day.day}
                      </Text>
                    </View>
                  ) : (
                    <Text className={`text-sm ${day.isCurrentMonth ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                      {day.day}
                    </Text>
                  )}
                  {day.hasEvent && !day.isToday && (
                    <View className="absolute bottom-1 w-1 h-1 bg-primary rounded-full" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Events List */}
        <View className="px-4 pb-32">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-slate-900 dark:text-white">Today's Events</Text>
            <Text className="text-primary text-sm font-medium">{selectedDay} Oct</Text>
          </View>

          <View className="flex-col gap-4">
            {todayEvents.map((event, index) => (
              <EventCard
                key={index}
                category={event.category}
                categoryColor={event.categoryColor}
                title={event.title}
                time={event.time}
                location={event.location}
                attendees={event.attendees}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        className="absolute bottom-8 right-6 w-14 h-14 bg-primary rounded-full shadow-lg shadow-primary/40 items-center justify-center active:scale-95 z-30"
        style={{ elevation: 8 }}
      >
        <Text className="text-3xl text-white">+</Text>
      </TouchableOpacity>

      {/* Bottom Tab Bar */}
  
    </SafeAreaView>
  );
};

export default VendorCalendarScreen;
