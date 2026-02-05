import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';

interface PendingRequestCardProps {
  image: string;
  date: string;
  title: string;
  category: string;
  guests: string;
  onAccept: () => void;
  onDecline: () => void;
}

const PendingRequestCard: React.FC<PendingRequestCardProps> = ({
  image,
  date,
  title,
  category,
  guests,
  onAccept,
  onDecline,
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden`}>
      <View className="relative h-32 w-full">
        <Image source={{ uri: image }} className="w-full h-full" resizeMode="cover" />
        <View className="absolute top-2 left-2 bg-white/90 dark:bg-slate-900/90 px-2 py-1 rounded-md">
          <Text className="text-xs font-bold text-slate-900 dark:text-white">{date}</Text>
        </View>
      </View>
      <View className="p-4 gap-3">
        <View className="flex-row justify-between items-start">
          <Text className="text-base font-bold text-slate-900 dark:text-white flex-1 mr-2">{title}</Text>
          <Text className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">{category}</Text>
        </View>
        <Text className="text-sm text-slate-500 dark:text-slate-400 font-normal">{guests} Guests</Text>
        <View className="flex-row gap-2 mt-1">
          <TouchableOpacity className="flex-1 h-9 bg-primary rounded-lg items-center justify-center" onPress={onAccept}>
            <Text className="text-sm font-semibold text-white">Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 h-9 rounded-lg border border-slate-200 dark:border-slate-600 bg-transparent items-center justify-center" onPress={onDecline}>
            <Text className="text-sm font-semibold text-slate-700 dark:text-slate-200">Decline</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

interface EventItemProps {
  month: string;
  day: string;
  title: string;
  location: string;
  timeLabel: string;
  opacity?: number;
}

const EventItem: React.FC<EventItemProps> = ({
  month,
  day,
  title,
  location,
  timeLabel,
  opacity = 1,
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View 
      className={`flex-row items-center gap-4 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm`}
      style={{ opacity }}
    >
      <View className="w-14 h-14 rounded-lg bg-blue-50 dark:bg-blue-900/30 items-center justify-center">
        <Text className="text-xs font-bold text-primary dark:text-blue-400 uppercase">{month}</Text>
        <Text className="text-xl font-bold text-primary dark:text-blue-400 leading-none">{day}</Text>
      </View>
      <View className="flex-1 min-w-0">
        <Text className="text-base font-semibold text-slate-900 dark:text-white truncate">{title}</Text>
        <Text className="text-sm text-slate-500 dark:text-slate-400 truncate">{location}</Text>
      </View>
      {timeLabel ? (
        <View className="px-2.5 py-1 rounded-md bg-primary/10 dark:bg-primary/20">
          <Text className="text-xs font-bold text-primary dark:text-blue-400">{timeLabel}</Text>
        </View>
      ) : null}
    </View>
  );
};

interface StatsCardProps {
  icon: string;
  label: string;
  value: string;
  subValue: string;
  isPrimary?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  label,
  value,
  subValue,
  isPrimary = false,
}) => {
  return (
    <View className={`min-w-[160px] flex-1 rounded-xl p-5 ${isPrimary ? 'bg-primary shadow-lg shadow-primary/30' : 'bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700'}`}>
      <View className="flex-row items-center gap-2">
        <Text className={`text-xl ${isPrimary ? 'text-white' : 'text-slate-500'}`}>{icon}</Text>
        <Text className={`text-sm font-medium ${isPrimary ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>{label}</Text>
      </View>
      <View>
        <Text className={`text-3xl font-bold leading-tight ${isPrimary ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{value}</Text>
        <Text className={`text-xs font-medium mt-1 ${isPrimary ? 'text-white/90' : 'text-green-600 dark:text-green-400'}`}>{subValue}</Text>
      </View>
    </View>
  );
};

const VendorHomeScreen: React.FC = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 pb-2">
          <View className="flex-row items-center gap-3">
            <View className="relative">
              <Image
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAATjU_kQZjoZfq7eWB0ne6nC7b76Qgtzt04G3YTykDIhYR9-Dj4GvGli1Poeg057UncNIECqkKKgHIBfL5GeEV5EPPKZaUqr5zKsV9ZlAK7h9bigg8u-oKxxJ5BAs4ELKPygJOPsW8CAu5A8cqZG_bTZwdyec3-x5AzBsXCxn2tBJHXr-w6QWVWg1GsraHCU2KqVBJWltTZwIaX1lIIcUn8iilpVHQLmK8kggdMakYZCldCM7DXBbrLhe7EX_rdDTXywSDxee3Oio' }}
                className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-700 shadow-sm"
                resizeMode="cover"
              />
              <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800" />
            </View>
            <View className="flex-col">
              <Text className="text-xs text-slate-500 dark:text-slate-400 font-medium">Welcome back,</Text>
              <Text className="text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-white">Elite Catering</Text>
            </View>
          </View>
          <TouchableOpacity className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 items-center justify-center shadow-sm relative">
            <Text className="text-xl">🔔</Text>
            <View className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800" />
          </TouchableOpacity>
        </View>

        {/* Stats Carousel */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, gap: 16 }}
          snapToInterval={170}
          snapToAlignment="start"
          decelerationRate="fast"
        >
          <View className="snap-center">
            <StatsCard
              icon="📅"
              label="Active Events"
              value="12"
              subValue="+2 this week"
            />
          </View>
          <View className="snap-center">
            <StatsCard
              icon="💰"
              label="Revenue"
              value="$8,450"
              subValue="+12% vs last month"
              isPrimary
            />
          </View>
          <View className="snap-center">
            <StatsCard
              icon="✉️"
              label="Inquiries"
              value="5 New"
              subValue="Requires action"
            />
          </View>
        </ScrollView>

        {/* Pending Requests */}
        <View className="mt-2 px-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-white">Pending Requests</Text>
            <TouchableOpacity>
              <Text className="text-sm font-semibold text-primary">See All</Text>
            </TouchableOpacity>
          </View>
          
          <View className="flex-col gap-4">
            <PendingRequestCard
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuCE7V6I9c-CmaK-u-YanLsmMqqNFEEU1VB93chYw5z6Qg2kH1pULFyrty3fcKlZ-QJG2GMUX6Ub4arAIeegrnSA6YYwv7T6-_5wIPl4Y0Ojk6nWHJx-ZjIgQkAFT38iiM1WemUa6ljD5aZ7KKVcpXYtJfJzUzKS4dPQoFHP8XUgNVKUdNctHIIpCIZM8sGyiU0GelRcUcX1__rW507BZ9JdAAx3CmRH3J249f-kMAxkL14hEpRSHyZzymqcMFRtfgmZmL3Em5dxBsw"
              date="Oct 24th"
              title="Sarah & John's Wedding"
              category="Indian Wedding"
              guests="300"
              onAccept={() => {}}
              onDecline={() => {}}
            />
            
            <PendingRequestCard
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuAG324UUwHujV_a1X-DH201kThcOT3gWaGt6TUOMe97dA4tNov2LnFEE2QJ3kG0XdHV9ENdpg1HHm1wK-yeNboxFD8POzGlD8eCub4c2TvvEJMaddoiw5lDXXeDr32yKxCN7z4cKAdGnvwJl55YCrQX7lOJaqQZQp2ZWbNZ0Wwlc9Bl4G9CDyRu8RcSwY9G_PAc05GsiIV606XdrvFH273R0263yLW8pCoyMJwUj0Lf-QvtQYWXARkXiSWCM7e3r3LA78D0JJtcuGw"
              date="Nov 12th"
              title="Corporate Gala Dinner"
              category="Formal Dinner"
              guests="150"
              onAccept={() => {}}
              onDecline={() => {}}
            />
          </View>
        </View>

        {/* Upcoming Events */}
        <View className="mt-6 px-4 pb-24">
          <Text className="text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-white">Upcoming Events</Text>
          
          <View className="flex-col gap-3 mt-3">
            <EventItem
              month="Oct"
              day="25"
              title="Malhotra Sangeet"
              location="Grand Hyatt Ballroom"
              timeLabel="23h"
            />
            <EventItem
              month="Oct"
              day="28"
              title="Smith Reception"
              location="The Garden Estate"
              timeLabel="3 days"
            />
            <EventItem
              month="Nov"
              day="02"
              title="Tech Corp Conference"
              location="City Convention Ctr"
              timeLabel=""
              opacity={0.6}
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 pb-safe-bottom z-30 px-4 h-16 flex-row items-center justify-around">
        <TouchableOpacity className="flex-col items-center justify-center flex-1 h-full gap-1">
          <Text className="text-2xl">📊</Text>
          <Text className="text-[10px] font-medium text-primary">Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-col items-center justify-center flex-1 h-full gap-1">
          <Text className="text-2xl">📅</Text>
          <Text className="text-[10px] font-medium text-slate-400">Calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-col items-center justify-center flex-1 h-full gap-1 relative">
          <View className="relative">
            <Text className="text-2xl">💬</Text>
            <View className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full" />
          </View>
          <Text className="text-[10px] font-medium text-slate-400">Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-col items-center justify-center flex-1 h-full gap-1">
          <Text className="text-2xl">👤</Text>
          <Text className="text-[10px] font-medium text-slate-400">Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VendorHomeScreen;
