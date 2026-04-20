import React from 'react';
import { View, ScrollView, Text, StatusBar, TouchableOpacity } from 'react-native';
import { LogisticsHeader } from '../../components/logistics/LogisticsHeader';
import { StatCard } from '../../components/logistics/StatCard';
import { LogisticsCard } from '../../components/logistics/LogisticsCard';
import { Truck, Navigation, Settings, Package, Clock, CalendarDays } from 'lucide-react-native';

const BUS_DATA = [
  { id: 'Bus-204', type: 'Mercedes Sprinter', status: 'En Route', origin: 'Central Terminal', destination: 'Oakridge Plaza' },
  { id: 'Bus-312', type: 'Volvo 9700', status: 'Active', origin: 'East Dock', destination: 'Main Station' },
  { id: 'Bus-108', type: 'Ford Transit', status: 'In Service', origin: 'Maintenance Bay', destination: '--' },
  { id: 'Bus-215', type: 'Setra S 415', status: 'En Route', origin: 'Airport T1', destination: 'Grand Hotel' },
  { id: 'Bus-402', type: 'Mercedes Tourismo', status: 'Idle', origin: 'South Park', destination: 'Depot' },
];

const RECENT_DELIVERIES = [
  { id: 'DEL-8821', item: 'AV Equipment', time: '2h ago', status: 'Delivered' },
  { id: 'DEL-8820', item: 'Catering Supplies', time: '4h ago', status: 'Delivered' },
];

const LogisticsHomepage = () => {
  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <LogisticsHeader title="Logistics" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        className="bg-gray-50/50"
      >
        {/* Statistics Section */}
        <View className="px-6 py-6">
          <View className="flex-row justify-between mb-4 items-center">
            <Text className="text-gray-900 font-jakarta-bold text-lg">Operational Overview</Text>
          </View>

          <View className="flex-row mb-3">
            <StatCard
              label="Active Fleet"
              value="24"
              icon={Truck}
              color="#ee2b8c"
              bgColor="bg-pink-50"
            />
            <StatCard
              label="In Transit"
              value="18"
              icon={Navigation}
              color="#059669"
              bgColor="bg-emerald-50"
            />
          </View>

        </View>

        {/* Fleet Status Section */}
        <View className="px-6 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-900 font-jakarta-bold text-lg">Fleet Status</Text>
            <TouchableOpacity>
              <Text className="text-primary font-jakarta-semibold text-sm">View All</Text>
            </TouchableOpacity>
          </View>

          {BUS_DATA.slice(0, 3).map((bus, index) => (
            <LogisticsCard
              key={index}
              id={bus.id}
              type={bus.type}
              status={bus.status as any}
              origin={bus.origin}
              destination={bus.destination}
            />
          ))}
        </View>

        {/* Recent Activity */}
        <View className="px-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-900 font-jakarta-bold text-lg">Recent Deliveries</Text>
            <CalendarDays size={18} color="#9ca3af" />
          </View>

          <View className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            {RECENT_DELIVERIES.map((delivery, index) => (
              <View
                key={index}
                className={`flex-row justify-between items-center py-3 ${index !== RECENT_DELIVERIES.length - 1 ? 'border-b border-gray-50' : ''}`}
              >
                <View className="flex-row items-center">
                  <View className="w-8 h-8 bg-gray-50 rounded-lg items-center justify-center mr-3">
                    <Package size={16} color="#4b5563" />
                  </View>
                  <View>
                    <Text className="text-gray-900 font-jakarta-semibold text-sm">{delivery.item}</Text>
                    <Text className="text-gray-400 font-jakarta-medium text-xs">{delivery.id}</Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-green-600 font-jakarta-bold text-xs">{delivery.status}</Text>
                  <Text className="text-gray-400 font-jakarta text-[10px]">{delivery.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Quick Action FAB */}
      <TouchableOpacity
        className="absolute bottom-8 right-6 w-16 h-16 bg-primary rounded-full items-center justify-center shadow-xl shadow-pink-300 z-50"
        activeOpacity={0.8}
      >
        <Navigation size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default LogisticsHomepage;
