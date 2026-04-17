import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Truck, Plus, Bell } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface LogisticsHeaderProps {
  title: string;
  onAddPress?: () => void;
}

export const LogisticsHeader: React.FC<LogisticsHeaderProps> = ({ title, onAddPress }) => {
  const insets = useSafeAreaInsets();

  return (
    <View 
      className="bg-white/80 border-b border-gray-100 px-6 pb-4 flex-row justify-between items-end"
      style={{ paddingTop: insets.top + 10, height: insets.top + 70 }}
    >
      <View className="flex-row items-center">
        <View className="bg-primary/10 p-2 rounded-lg mr-3">
          <Truck size={22} color="#ee2b8c" />
        </View>
        <Text className="text-xl font-jakarta-bold text-gray-900">{title}</Text>
      </View>
      
      <View className="flex-row items-center gap-3">
        <TouchableOpacity className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100">
          <Bell size={20} color="#181114" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={onAddPress}
          className="bg-primary px-4 py-2 rounded-xl flex-row items-center shadow-lg shadow-pink-200"
        >
          <Plus size={18} color="white" />
          <Text className="text-white font-jakarta-bold text-sm ml-1">Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
