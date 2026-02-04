import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { events } from '@/src/data/events';

export default function EventBudget() {
  const { eventId } = useLocalSearchParams();
  const event = events.find((e: any) => e.id === eventId);

  if (!event) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-gray-500 text-lg">Event not found</Text>
      </SafeAreaView>
    );
  }

  if (!event.budget) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-gray-500 text-lg">No budget data</Text>
      </SafeAreaView>
    );
  }

  const { budget } = event;

  const getBudgetProgress = () => {
    const paidItems = budget.items.filter((item: any) => item.paid);
    const totalPaid = paidItems.reduce((sum: number, item: any) => sum + (item.actual || item.estimated), 0);
    return Math.round((totalPaid / budget.total) * 100);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          {/* Budget Summary */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-gray-500 text-sm mb-1">Total Budget</Text>
            <Text className="text-3xl font-bold text-gray-900 mb-4">
              ${budget.total.toLocaleString()}
            </Text>
            <View className="bg-gray-100 rounded-full h-3 mb-2">
              <View 
                className="bg-green-500 h-3 rounded-full" 
                style={{ width: `${getBudgetProgress()}%` }}
              />
            </View>
            <Text className="text-sm text-gray-500">{getBudgetProgress()}% paid</Text>
          </View>

          {/* Budget Items */}
          {budget.items.map((item: any) => (
            <View key={item.id} className="bg-white rounded-xl p-4 mb-3 shadow-sm flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-gray-900 font-semibold">{item.description}</Text>
                <Text className="text-gray-500 text-sm">{item.category}</Text>
              </View>
              <View className="items-end">
                <Text className="text-gray-900 font-semibold">
                  ${(item.actual || item.estimated).toLocaleString()}
                </Text>
                <Text className={`text-xs ${item.paid ? 'text-green-600' : 'text-orange-600'}`}>
                  {item.paid ? 'Paid' : 'Pending'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
