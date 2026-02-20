import CustomHeader from "@/src/components/ui/profile/CustomHeader";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Reusable Toggle Item Component (DRY)
const ToggleItem = ({
  title,
  subtitle,
  value,
  onToggle,
  icon,
}: {
  title: string;
  subtitle?: string;
  value: boolean;
  onToggle: (value: boolean) => void;
  icon?: string;
}) => (
  <View className="flex-row items-center justify-between py-4 border-b border-gray-50 last:border-0">
    <View className="flex-row items-center flex-1 mr-4">
      {icon && (
        <View className="w-10 h-10 bg-pink-50 rounded-full items-center justify-center mr-3">
          <MaterialIcons name={icon as any} size={20} color="#ee2b8c" />
        </View>
      )}
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-900">{title}</Text>
        {subtitle && (
          <Text className="text-sm text-gray-500 mt-0.5">{subtitle}</Text>
        )}
      </View>
    </View>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: "#d1d5db", true: "#ec4899" }}
      thumbColor="#ffffff"
    />
  </View>
);

// Reusable Card Component (DRY)
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <View
    className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 ${className}`}
  >
    {children}
  </View>
);

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    orderUpdates: true,
    marketingEmails: false,
    eventReminders: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = (field: string, value: boolean) => {
    setNotifications((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Success", "Notification preferences saved!");
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <CustomHeader title="Notifications" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-4 pt-6 pb-10"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              Notification Settings
            </Text>
            <Text className="text-base text-gray-600 leading-relaxed">
              Choose how you want to receive updates and notifications.
            </Text>
          </View>

          {/* Push Notifications */}
          <Card className="mb-4">
            <Text className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
              Push Notifications
            </Text>
            <ToggleItem
              title="Push Notifications"
              subtitle="Receive notifications on your device"
              value={notifications.pushNotifications}
              onToggle={(value) => handleToggle("pushNotifications", value)}
              icon="notifications"
            />
            <ToggleItem
              title="Order Updates"
              subtitle="Get updates on your bookings and orders"
              value={notifications.orderUpdates}
              onToggle={(value) => handleToggle("orderUpdates", value)}
              icon="shopping-cart"
            />
            <ToggleItem
              title="Event Reminders"
              subtitle="Reminders for upcoming events"
              value={notifications.eventReminders}
              onToggle={(value) => handleToggle("eventReminders", value)}
              icon="event"
            />
          </Card>

          {/* Email Notifications */}
          <Card className="mb-4">
            <Text className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
              Email Notifications
            </Text>
            <ToggleItem
              title="Email Notifications"
              subtitle="Receive updates via email"
              value={notifications.emailNotifications}
              onToggle={(value) => handleToggle("emailNotifications", value)}
              icon="email"
            />
            <ToggleItem
              title="Marketing Emails"
              subtitle="Promotions, deals, and news"
              value={notifications.marketingEmails}
              onToggle={(value) => handleToggle("marketingEmails", value)}
              icon="campaign"
            />
          </Card>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={isLoading}
            className={`w-full h-14 bg-pink-500 rounded-xl flex-row items-center justify-center shadow-lg shadow-pink-200 
              ${isLoading ? "opacity-70" : ""}`}
            activeOpacity={0.9}
          >
            <MaterialIcons
              name="save"
              size={20}
              color="#ffffff"
              className="mr-2"
            />
            <Text className="text-white font-bold text-lg">
              {isLoading ? "Saving..." : "Save Preferences"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
