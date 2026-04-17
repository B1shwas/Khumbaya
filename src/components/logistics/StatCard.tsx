import React from 'react';
import { View, Text } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, color, bgColor }) => {
  return (
    <View className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex-1 mx-1">
      <View className={`w-10 h-10 rounded-full ${bgColor} items-center justify-center mb-3`}>
        <Icon size={20} color={color} />
      </View>
      <Text className="text-gray-500 text-xs font-jakarta-medium uppercase tracking-wider">{label}</Text>
      <Text className="text-2xl font-jakarta-bold text-gray-900 mt-1">{value}</Text>
    </View>
  );
};
