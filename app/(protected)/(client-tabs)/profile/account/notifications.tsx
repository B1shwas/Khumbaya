import { useState } from "react";
import { Pressable, Switch, Text, View } from "react-native";

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    orderUpdates: true,
    marketingEmails: false,
    eventReminders: true,
  });

  const handleToggle = (field: string, value: boolean) => {
    setNotifications((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // TODO: Implement backend integration for saving notification preferences
    // await updateNotificationPreferences(notifications);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white p-6">
        <Text className="text-2xl font-bold text-gray-900 mb-6">
          Notifications
        </Text>

        {/* Email Notifications */}
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-base font-semibold text-gray-900">
              Email Notifications
            </Text>
            <Text className="text-sm text-gray-500">
              Receive updates via email
            </Text>
          </View>
          <Switch
            value={notifications.emailNotifications}
            onValueChange={(value) => handleToggle("emailNotifications", value)}
            trackColor={{ false: "#d1d5db", true: "#ec4899" }}
            thumbColor="#fff"
          />
        </View>

        {/* Push Notifications */}
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-base font-semibold text-gray-900">
              Push Notifications
            </Text>
            <Text className="text-sm text-gray-500">
              Receive updates on your device
            </Text>
          </View>
          <Switch
            value={notifications.pushNotifications}
            onValueChange={(value) => handleToggle("pushNotifications", value)}
            trackColor={{ false: "#d1d5db", true: "#ec4899" }}
            thumbColor="#fff"
          />
        </View>

        {/* Order Updates */}
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-base font-semibold text-gray-900">
              Order Updates
            </Text>
            <Text className="text-sm text-gray-500">
              Get updates on your orders
            </Text>
          </View>
          <Switch
            value={notifications.orderUpdates}
            onValueChange={(value) => handleToggle("orderUpdates", value)}
            trackColor={{ false: "#d1d5db", true: "#ec4899" }}
            thumbColor="#fff"
          />
        </View>

        {/* Marketing Emails */}
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-base font-semibold text-gray-900">
              Marketing Emails
            </Text>
            <Text className="text-sm text-gray-500">
              Receive promotional content
            </Text>
          </View>
          <Switch
            value={notifications.marketingEmails}
            onValueChange={(value) => handleToggle("marketingEmails", value)}
            trackColor={{ false: "#d1d5db", true: "#ec4899" }}
            thumbColor="#fff"
          />
        </View>

        {/* Event Reminders */}
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-base font-semibold text-gray-900">
              Event Reminders
            </Text>
            <Text className="text-sm text-gray-500">
              Get reminders for upcoming events
            </Text>
          </View>
          <Switch
            value={notifications.eventReminders}
            onValueChange={(value) => handleToggle("eventReminders", value)}
            trackColor={{ false: "#d1d5db", true: "#ec4899" }}
            thumbColor="#fff"
          />
        </View>

        {/* Save Button */}
        <Pressable
          className="bg-pink-500 rounded-lg py-4 items-center mt-4"
          onPress={handleSave}
        >
          <Text className="text-white font-semibold text-lg">
            Save Preferences
          </Text>
        </Pressable>
      </View>

      {/* Backend integration comments */}
      {/* 
        // Backend integration example
        import { updateNotificationPreferences } from '@/src/api/notifications';
        
        const handleSave = async () => {
          try {
            const response = await updateNotificationPreferences(notifications);
            if (response.success) {
              Alert.alert('Success', 'Notification preferences updated!');
            } else {
              Alert.alert('Error', response.message);
            }
          } catch (error) {
            Alert.alert('Error', 'Failed to update notification preferences');
          }
        };
      */}
    </View>
  );
}
